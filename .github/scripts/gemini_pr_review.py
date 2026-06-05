import os
import sys
import json
import urllib.request
import urllib.error

# Load environment variables
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
GITHUB_TOKEN = os.environ.get("GITHUB_TOKEN")
EVENT_PATH = os.environ.get("GITHUB_EVENT_PATH")

if not GEMINI_API_KEY:


    print("Notice: GEMINI_API_KEY environment variable is not set. Skipping AI review (this is expected for PRs from forks).")

    sys.exit(0)

if not GITHUB_TOKEN:
    print("Error: GITHUB_TOKEN environment variable is not set.")
    sys.exit(1)

if not EVENT_PATH or not os.path.exists(EVENT_PATH):
    print("Error: GITHUB_EVENT_PATH is not set or file does not exist.")
    sys.exit(1)

# Read GITHUB_EVENT_PATH JSON
with open(EVENT_PATH, "r", encoding="utf-8") as f:
    event_data = json.load(f)

pr_number = event_data.get("pull_request", {}).get("number")
repo_name = event_data.get("repository", {}).get("full_name")

if not pr_number or not repo_name:
    print("Error: Could not extract PR number or repository name from event JSON.")
    sys.exit(1)

# Function to perform GitHub API calls
def github_request(url, method="GET", headers=None, body=None):
    req = urllib.request.Request(url, method=method)
    req.add_header("Authorization", f"token {GITHUB_TOKEN}")
    req.add_header("User-Agent", "gemini-ci-bot")
    
    if headers:
        for k, v in headers.items():
            req.add_header(k, v)
            
    try:
        with urllib.request.urlopen(req, data=body) as response:
            return response.read()
    except urllib.error.HTTPError as e:
        print(f"GitHub API Error ({e.code}): {e.read().decode('utf-8', errors='ignore')}")
        raise
    except Exception as e:
        print(f"Error calling {url}: {e}")
        raise

# 1. Fetch PR Diff using GitHub API
print(f"Fetching diff for PR #{pr_number} in {repo_name}...")
pr_diff_url = f"https://api.github.com/repos/{repo_name}/pulls/{pr_number}"
try:
    diff_data = github_request(pr_diff_url, headers={"Accept": "application/vnd.github.v3.diff"})
    diff_text = diff_data.decode("utf-8", errors="ignore")
except Exception as e:
    print(f"Failed to fetch diff: {e}")
    sys.exit(1)

if not diff_text.strip():
    print("No code changes found in this PR.")
    sys.exit(0)

# 2. Read CLAUDE.md and AGENTS.md rules if they exist
def read_project_file(filename):
    if os.path.exists(filename):
        with open(filename, "r", encoding="utf-8") as f:
            return f.read()
    return ""

claude_rules = read_project_file("CLAUDE.md")
agents_rules = read_project_file("AGENTS.md")

# 3. Construct Gemini system prompt and request payload
system_prompt = f"""You are a strict, expert AI Code Reviewer.
Analyze the provided code diff. Perform a rigorous line-by-line review of the changes.
Identify any bugs, issues, or violations of common style guidelines.

If the repository has custom guidelines, adhere to them:
CLAUDE.md:
{claude_rules}

AGENTS.md:
{agents_rules}

=== REVIEW INSTRUCTIONS ===
Format your output in clean Markdown.
- If there are violations or bugs, list them clearly with file names, line references, explanation, and a recommended fix.
- If the PR is clean, start with "✅ **LGTM**: All changes look great." and provide a brief summary of the changes.

=== AUTO-FIX FEATURE ===
If you find code violations that can be fixed automatically (such as removing forbidden function calls like unwrap(), println!, changing float assertions, adding missing SAFETY comments, or removing AI comments), you MUST also provide the exact text replacements inside a JSON array inside the `<auto_fixes> ... </auto_fixes>` tags.
Each replacement must be a JSON object with:
- "file": The file path (e.g. "crates/mohu-core/src/lib.rs").
- "find": The exact multi-line string block to find.
- "replace": The replacement string block.

Example:
<auto_fixes>
[
  {{
    "file": "crates/mohu-core/src/lib.rs",
    "find": "let y = x.unwrap();",
    "replace": "let y = x.ok_or(MohuError::InvalidOperation)?;"
  }}
]
</auto_fixes>

DO NOT mention "AI assistant", "Gemini", "Claude" or any other AI tools in your review summary. Act as a senior core maintainer.
"""

payload = {
    "contents": [
        {
            "parts": [
                {
                    "text": f"Here is the PR diff to review:\n\n```diff\n{diff_text}\n```"
                }
            ]
        }
    ],
    "systemInstruction": {
        "parts": [
            {
                "text": system_prompt
            }
        ]
    },
    "generationConfig": {
        "temperature": 0.2
    }
}

# 4. Call Gemini API
print("Calling Gemini API...")
gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"
headers = {"Content-Type": "application/json"}
body = json.dumps(payload).encode("utf-8")

req = urllib.request.Request(gemini_url, data=body, method="POST")
for k, v in headers.items():
    req.add_header(k, v)

try:
    with urllib.request.urlopen(req) as res:
        res_data = json.loads(res.read().decode("utf-8"))
        gemini_response = res_data["candidates"][0]["content"]["parts"][0]["text"]
except urllib.error.HTTPError as e:
    print(f"Gemini API Error ({e.code}): {e.read().decode('utf-8', errors='ignore')}")
    sys.exit(1)
except Exception as e:
    print(f"Failed to call Gemini: {e}")
    sys.exit(1)

# 5. Extract and apply auto-fixes if present
comment_body_text = gemini_response
if "<auto_fixes>" in gemini_response and "</auto_fixes>" in gemini_response:
    print("Auto-fixes found! Applying replacements...")
    parts = gemini_response.split("<auto_fixes>")
    comment_body_text = parts[0]
    if "</auto_fixes>" in parts[1]:
        comment_body_text += parts[1].split("</auto_fixes>")[1]
    
    json_str = parts[1].split("</auto_fixes>")[0].strip()
    try:
        fixes = json.loads(json_str)
        for fix in fixes:
            file_path = fix.get("file")
            find_str = fix.get("find")
            replace_str = fix.get("replace")
            
            if file_path and os.path.exists(file_path):
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                
                # Normalize line endings
                find_str_norm = find_str.replace("\r\n", "\n")
                replace_str_norm = replace_str.replace("\r\n", "\n")
                content_norm = content.replace("\r\n", "\n")
                
                if find_str_norm in content_norm:
                    new_content = content_norm.replace(find_str_norm, replace_str_norm)
                    with open(file_path, "w", encoding="utf-8") as f:
                        f.write(new_content)
                    print(f"Successfully applied auto-fix to {file_path}")
                else:
                    # Also try matching without strict whitespace differences
                    print(f"Warning: Find block not found in {file_path}")
    except Exception as e:
        print(f"Failed to apply auto-fixes: {e}")

# 6. Post Gemini response as a comment on the PR
comment_url = f"https://api.github.com/repos/{repo_name}/issues/{pr_number}/comments"
comment_body = {
    "body": f"## 🤖 Code Review Feedback\n\n{comment_body_text.strip()}"
}
encoded_comment = json.dumps(comment_body).encode("utf-8")

print(f"Posting code review comment on PR #{pr_number}...")
try:
    github_request(
        comment_url,
        method="POST",
        headers={"Content-Type": "application/json"},
        body=encoded_comment
    )
    print("Successfully posted review comment!")
except Exception as e:
    print(f"Failed to post comment: {e}")
    sys.exit(1)
