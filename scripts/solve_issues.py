import os
import subprocess
import time
import re

def run_cmd(cmd):
    print(f"Running: {' '.join(cmd)}")
    # Use shell=True for Windows compatibility with some commands, but list format is safer
    subprocess.run(cmd, check=True)

def fix_fallback_image():
    path = "index.js"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replacement for onerror
    old_str = "onerror=\"this.parentNode.style.display='none';\""
    new_str = "onerror=\"this.onerror=null; this.src='./public/placeholder.png';\""
    if old_str in content:
        content = content.replace(old_str, new_str)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        return True
    return False

def fix_404_page():
    path = "404.html"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    old_str = '<a href="/" class="btn btn-primary">'
    new_str = '<a href="/index.html" class="btn btn-primary">'
    if old_str in content:
        content = content.replace(old_str, new_str)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        return True
    return False

def fix_contributing():
    path = "CONTRIBUTING.md"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    if "### Adding to projects.json" not in content:
        append_str = """
### Adding to projects.json
Ensure your entry matches this format exactly:
```json
{
  "projectNo": 101,
  "projectName": "Your Awesome App",
  "projectType": "Tool",
  "projectDesc": "A brief 2 sentence description.",
  "techStack": ["javascript", "css"],
  "difficulty": "beginner",
  "projectPath": "./public/your-app/index.html"
}
```
"""
        with open(path, "a", encoding="utf-8") as f:
            f.write(append_str)
        return True
    return False

def fix_a11y_social_links():
    path = "index.html"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    if 'aria-label="Follow on Instagram (opens in a new tab)"' in content:
        print("A11y social links already have aria-labels in index.html.")
        return True
    return False

tasks = [
    {"id": "10494", "title": "bug: Fallback image not showing when project preview fails to load", "func": fix_fallback_image},
    {"id": "10492", "title": "chore: Update CONTRIBUTING.md template for new projects", "func": fix_contributing},
    {"id": "10490", "title": "bug: 404 page does not contain a link back to home", "func": fix_404_page},
    {"id": "10488", "title": "a11y: Add aria-labels to social media links in the footer", "func": fix_a11y_social_links},
]

def main():
    for task in tasks:
        print(f"\\n--- Processing Issue #{task['id']} ---")
        run_cmd(["git", "checkout", "Main"])
        branch = f"fix-issue-{task['id']}"
        
        try:
            run_cmd(["git", "branch", "-D", branch])
        except:
            pass
            
        run_cmd(["git", "checkout", "-b", branch])
        
        success = task["func"]()
        if success:
            print("Changes applied. Committing...")
            run_cmd(["git", "add", "."])
            status = subprocess.run(["git", "status", "--porcelain"], capture_output=True, text=True)
            if status.stdout.strip():
                run_cmd(["git", "commit", "-m", f"Fix: {task['title']}"])
                # Note: Not pushing right away for safety.
                print(f"Successfully processed #{task['id']}")
            else:
                print("No changes needed (already fixed?).")
        else:
            print("Failed to apply changes.")
            
if __name__ == "__main__":
    main()
