import os
import subprocess

def run_cmd(cmd):
    print(f"Running: {' '.join(cmd)}")
    subprocess.run(cmd, check=True)

def fix_navbar_overflow():
    path = "style.css"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    if "@media (max-width: 320px)" not in content:
        append_str = """
@media (max-width: 320px) {
  .navbar-container {
    flex-direction: column;
    padding: 10px;
  }
  .nav-links {
    gap: 0.5rem;
  }
}
"""
        with open(path, "a", encoding="utf-8") as f:
            f.write(append_str)
        return True
    return False

def fix_skeleton_loader():
    path = "style.css"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    if ".skeleton-card" not in content:
        append_str = """
.skeleton-card {
  animation: pulse 1.5s infinite ease-in-out;
  background-color: #e0e0e0;
  height: 250px;
  border-radius: 8px;
}
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}
"""
        with open(path, "a", encoding="utf-8") as f:
            f.write(append_str)
        return True
    return False

tasks = [
    {"id": "10484", "title": "bug: Responsive navbar overflow on extra small screens (<320px)", "func": fix_navbar_overflow},
    {"id": "10483", "title": "feat: Show skeleton loader while fetching projects.json", "func": fix_skeleton_loader},
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
                run_cmd(["git", "push", "-u", "origin", branch])
                subprocess.run(["gh", "pr", "create", "-R", "dhairyagothi/100_days_100_web_project", "--base", "Main", "--head", f"sahare-mayur-0071:{branch}", "--title", task["title"], "--body", f"Closes #{task['id']}"])
                print(f"Successfully processed #{task['id']}")
            else:
                print("No changes needed (already fixed?).")
        else:
            print("Failed to apply changes.")
            
if __name__ == "__main__":
    main()
