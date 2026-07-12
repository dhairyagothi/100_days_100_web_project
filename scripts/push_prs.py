import subprocess

branches = ["10494", "10492", "10490"]

for issue in branches:
    branch = f"fix-issue-{issue}"
    subprocess.run(["git", "checkout", branch], check=True)
    subprocess.run(["git", "push", "-u", "origin", branch], check=True)
    
    # create PR
    cmd = ["gh", "pr", "create", "--head", branch, "--title", f"Fix issue {issue}", "--body", f"Closes #{issue}"]
    subprocess.run(cmd)

print("Done")
