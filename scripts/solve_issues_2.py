import os
import subprocess

def run_cmd(cmd):
    print(f"Running: {' '.join(cmd)}")
    subprocess.run(cmd, check=True)

def fix_keyboard_nav():
    path = "index.js"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    if "ArrowRight" not in content:
        append_str = """
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') {
    const nextBtn = document.querySelector('.next-btn');
    if (nextBtn && !nextBtn.disabled) nextBtn.click();
  } else if (e.key === 'ArrowLeft') {
    const prevBtn = document.querySelector('.prev-btn');
    if (prevBtn && !prevBtn.disabled) prevBtn.click();
  }
});
"""
        with open(path, "a", encoding="utf-8") as f:
            f.write(append_str)
        return True
    return False

def fix_scroll_top():
    path_js = "index.js"
    with open(path_js, "r", encoding="utf-8") as f:
        content_js = f.read()
    if "scroll-top" not in content_js:
        append_str_js = """
window.addEventListener('scroll', () => {
  const scrollTopBtn = document.getElementById('scroll-top');
  if(scrollTopBtn) {
    scrollTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
  }
});
document.addEventListener('click', (e) => {
  if(e.target.id === 'scroll-top' || e.target.closest('#scroll-top')) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});
"""
        with open(path_js, "a", encoding="utf-8") as f:
            f.write(append_str_js)
            
    path_html = "index.html"
    with open(path_html, "r", encoding="utf-8") as f:
        content_html = f.read()
    if "scroll-top" not in content_html:
        new_html = content_html.replace("</body>", '<button id="scroll-top" style="display:none; position:fixed; bottom:20px; right:20px; z-index:99; background:#7c3aed; color:white; border:none; padding:15px; border-radius:50%; cursor:pointer;"><i class="fas fa-arrow-up"></i></button>\\n</body>')
        with open(path_html, "w", encoding="utf-8") as f:
            f.write(new_html)
    return True

tasks = [
    {"id": "10493", "title": "feat: Add Keyboard Navigation (Arrows) support to projects grid", "func": fix_keyboard_nav},
    {"id": "10489", "title": "feat: Add a \"Scroll to Top\" button on the main project grid", "func": fix_scroll_top},
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
                # Using subprocess.run for gh pr create so it doesn't crash the script if it fails
                subprocess.run(["gh", "pr", "create", "-R", "dhairyagothi/100_days_100_web_project", "--base", "Main", "--head", f"sahare-mayur-0071:{branch}", "--title", task["title"], "--body", f"Closes #{task['id']}"])
                print(f"Successfully processed #{task['id']}")
            else:
                print("No changes needed (already fixed?).")
        else:
            print("Failed to apply changes.")
            
if __name__ == "__main__":
    main()
