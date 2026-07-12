import subprocess
import time
import sys

# The IDs of the 18 issues we just created
issue_ids = range(10477, 10495)  # 10477 to 10494 inclusive
comment_body = "I want to work on this under GSSoC 2026, please assign me."

def comment_issue(issue_id):
    cmd = ["gh", "issue", "comment", str(issue_id), "--body", comment_body]
    try:
        subprocess.run(cmd, check=True, capture_output=True, text=True)
        print(f"Successfully commented on issue #{issue_id}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Failed to comment on issue #{issue_id}")
        print(f"Error: {e.stderr.strip()}")
        return False

def main():
    print(f"Preparing to comment on {len(issue_ids)} issues using gh CLI...")
    success_count = 0
    
    for i, issue_id in enumerate(issue_ids, 1):
        print(f"[{i}/{len(issue_ids)}] Commenting on issue #{issue_id}...")
        if comment_issue(issue_id):
            success_count += 1
            # Sleep to avoid hitting GitHub API rate limits
            time.sleep(3)
        else:
            print("Stopping due to error.")
            sys.exit(1)
                
    print(f"\\nFinished! Commented on {success_count} issues.")

if __name__ == "__main__":
    main()
