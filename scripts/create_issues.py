import subprocess
import time
import sys

issues = [
    {
        "title": "feat: Add Dark Mode toggle for the main homepage",
        "body": """**Description**
Users currently view the main dashboard in a single theme. Adding a dark mode toggle will improve user experience and accessibility for night-time viewing. We need a toggle switch in the navbar that saves the preference to `localStorage`.

**Steps to Reproduce**
1. Open `index.html`.
2. Notice the lack of a theme switcher in the navigation bar.

**Expected Behavior**
- **Frontend**: Add a sun/moon icon toggle in the navbar.
- **JavaScript**: Create a function in `theme.js` or `index.js` that toggles a `.dark-theme` class on the `<body>` and saves the state in `localStorage`.

**Implementation Hints**
```javascript
// index.js or theme.js
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme');

if (currentTheme === 'dark') {
  document.body.classList.add('dark-theme');
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  let theme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
  localStorage.setItem('theme', theme);
});
```"""
    },
    {
        "title": "bug: Search filter is case-sensitive for tech stack",
        "body": """**Description**
When users type "JAVASCRIPT" or "React" into the search bar, projects that are tagged with lowercase "javascript" or "react" are not showing up correctly if the matching is strictly case-sensitive in certain functions.

**Steps to Reproduce**
1. Go to the project dashboard.
2. Type "REACT" in the tech stack filter.
3. Observe that no projects are returned, despite React projects existing.

**Expected Behavior**
The search input should be converted to lowercase before comparing it with the tags in `projects.json`.

**Implementation Hints**
```javascript
// index.js
const handleSearch = (query) => {
  const normalizedQuery = query.toLowerCase().trim();
  filteredProjectData = projectData.filter(project => 
    project.techStack.some(tech => tech.toLowerCase().includes(normalizedQuery))
  );
  renderProjects(filteredProjectData);
};
```"""
    },
    {
        "title": "feat: Implement 'Random Project' button to discover new projects",
        "body": """**Description**
With over 100 projects, it can be overwhelming to pick one. A "Surprise Me" or "Random Project" button would redirect the user directly to a randomly selected project from the list.

**Steps to Reproduce**
1. Load the homepage.
2. Observe that there is no quick way to navigate to a random project.

**Expected Behavior**
- Add a button labeled "Random Project" near the search bar.
- When clicked, pick a random index from `projectData` and redirect using `window.location.href = randomProject.projectPath`.

**Implementation Hints**
```javascript
// index.js
document.getElementById('btn-random').addEventListener('click', () => {
  if (projectData.length > 0) {
    const randomIndex = Math.floor(Math.random() * projectData.length);
    window.location.href = projectData[randomIndex].projectPath;
  }
});
```"""
    },
    {
        "title": "bug: Pagination 'Previous' button does not disable on page 1",
        "body": """**Description**
When the user is on the first page of the project grid, the "Previous" pagination button remains clickable or doesn't have a visually disabled state, causing potential confusion.

**Steps to Reproduce**
1. Load the homepage (Page 1).
2. Scroll down to the pagination controls.
3. Notice the "Previous" button is active.

**Expected Behavior**
The "Previous" button should have a `.disabled` CSS class applied and pointer events disabled when `currentPage === 1`. 

**Implementation Hints**
```javascript
// index.js - Pagination Logic
const updatePaginationControls = () => {
  const prevBtn = document.getElementById('prev-page');
  if (currentPage === 1) {
    prevBtn.classList.add('disabled');
    prevBtn.disabled = true;
  } else {
    prevBtn.classList.remove('disabled');
    prevBtn.disabled = false;
  }
};
```"""
    },
    {
        "title": "feat: Add \"Copy to Clipboard\" for individual project links",
        "body": """**Description**
Users might want to share a specific project with others. Adding a small "share" or "copy link" icon on each project card will copy the direct path to the user's clipboard.

**Steps to Reproduce**
1. Look at a project card on the homepage.
2. Observe there's no native share button on the card.

**Expected Behavior**
Clicking the share icon on a project card triggers the Clipboard API to copy `window.location.origin + project.projectPath`.

**Implementation Hints**
```javascript
// inside renderProjects mapping
const copyLink = async (path) => {
  const url = `${window.location.origin}/${path}`;
  await navigator.clipboard.writeText(url);
  alert("Link copied to clipboard!");
};
```"""
    },
    {
        "title": "chore: Extract configuration constants to a separate file",
        "body": """**Description**
`index.js` contains global configurations like `REPO_OWNER`, `REPO_NAME`, and alias maps at the top. Moving these to a `config.js` will keep the main logic cleaner and more modular.

**Steps to Reproduce**
1. Open `index.js`.
2. Notice the `CONFIGURATION` block spanning multiple lines.

**Expected Behavior**
- Create `scripts/config.js`.
- Export/declare configuration variables there.
- Import them or include the script before `index.js` in `index.html`.

**Implementation Hints**
```javascript
// scripts/config.js
export const CONFIG = {
  REPO_OWNER: "dhairyagothi",
  REPO_NAME: "100_days_100_web_project",
  ITEMS_PER_PAGE: 9
};
```"""
    },
    {
        "title": "feat: Show skeleton loader while fetching projects.json",
        "body": """**Description**
On slow networks, there is a delay between page load and `projects.json` being fetched. During this time, the project grid is empty, which can look like a bug to the user.

**Steps to Reproduce**
1. Throttle network to "Slow 3G" in DevTools.
2. Refresh the page.
3. Observe the blank space where projects should be.

**Expected Behavior**
Display a CSS skeleton animation of 9 cards (since `itemsPerPage = 9`) while the `fetch()` request is pending.

**Implementation Hints**
```css
/* style.css */
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
```"""
    },
    {
        "title": "bug: Responsive navbar overflow on extra small screens (<320px)",
        "body": """**Description**
On very small devices (like older iPhones or small androids), the navbar items squish together and overflow their container, creating a horizontal scrollbar.

**Steps to Reproduce**
1. Open `index.html` in Chrome DevTools.
2. Set responsive width to 300px.
3. Observe the header layout breaking.

**Expected Behavior**
The navbar should switch to a hamburger menu earlier, or adjust font sizing/padding so it doesn't overflow.

**Implementation Hints**
```css
/* style.css */
@media (max-width: 320px) {
  .navbar-container {
    flex-direction: column;
    padding: 10px;
  }
  .nav-links {
    gap: 0.5rem;
  }
}
```"""
    },
    {
        "title": "feat: Filter projects by Difficulty Level",
        "body": """**Description**
`projects.json` contains a `difficulty` field (e.g., "beginner", "intermediate"). However, there is no UI filter for this on the homepage. Beginners want to find easy projects quickly.

**Steps to Reproduce**
1. View the filter chips on `index.html`.
2. Notice they only filter by category/tech stack, not difficulty.

**Expected Behavior**
Add a `<select>` dropdown next to the search bar for "Difficulty: All, Beginner, Intermediate, Advanced". Update the filter logic to include this dropdown's value.

**Implementation Hints**
```javascript
// index.js
const difficultyFilter = document.getElementById('difficulty-select').value;
filteredProjectData = projectData.filter(p => 
  (difficultyFilter === 'all' || p.difficulty === difficultyFilter)
);
```"""
    },
    {
        "title": "feat: Persistent local storage for Expense Tracker",
        "body": """**Description**
In the `expense-tracker` project, data is lost when the page is refreshed. Users need their expenses to persist across sessions using the browser's `localStorage`.

**Steps to Reproduce**
1. Navigate to `/public/expense-tracker/index.html` (or equivalent).
2. Add a new expense.
3. Refresh the page.
4. Notice the expense is gone.

**Expected Behavior**
Save the expenses array to `localStorage` every time a new expense is added or deleted. Load from `localStorage` on `DOMContentLoaded`.

**Implementation Hints**
```javascript
// expense-tracker/script.js
function saveExpenses(expenses) {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}
function loadExpenses() {
  return JSON.parse(localStorage.getItem('expenses')) || [];
}
```"""
    },
    {
        "title": "bug: Custom video player speed control slider does not update label",
        "body": """**Description**
In the `custom-video-player` project, moving the playback speed slider changes the video speed, but the text label displaying the current speed (e.g., "1.0x") doesn't update dynamically.

**Steps to Reproduce**
1. Open the custom video player project.
2. Move the playback rate slider.
3. Look at the label next to the slider.

**Expected Behavior**
The text label should accurately reflect the `video.playbackRate`.

**Implementation Hints**
```javascript
// custom-video-player/script.js
speedSlider.addEventListener('input', (e) => {
  video.playbackRate = e.target.value;
  speedLabel.textContent = `${parseFloat(e.target.value).toFixed(1)}x`;
});
```"""
    },
    {
        "title": "a11y: Add aria-labels to social media links in the footer",
        "body": """**Description**
The social media icons (GitHub, Twitter/X, Discord) in the footer use SVGs or font icons without descriptive text. This hurts accessibility for screen readers.

**Steps to Reproduce**
1. Run a Lighthouse Accessibility audit on `index.html`.
2. See the warning about missing accessible names on `<a>` tags.

**Expected Behavior**
Add `aria-label` attributes to all icon-only anchor tags.

**Implementation Hints**
```html
<!-- index.html -->
<a href="https://github.com/..." target="_blank" aria-label="Visit our GitHub Repository">
  <i class="fab fa-github"></i>
</a>
```"""
    },
    {
        "title": "feat: Add a \"Scroll to Top\" button on the main project grid",
        "body": """**Description**
Since there are many projects and pagination spans several pages, a floating "Scroll to Top" button that appears after scrolling down would improve navigation.

**Steps to Reproduce**
1. Scroll down to the bottom of the project grid.
2. Notice you have to manually scroll all the way back up to search.

**Expected Behavior**
A small, circular, fixed button should appear in the bottom-right corner when `window.scrollY > 300`. Clicking it smoothly scrolls the page to the top.

**Implementation Hints**
```javascript
// index.js
window.addEventListener('scroll', () => {
  const scrollTopBtn = document.getElementById('scroll-top');
  scrollTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
});

document.getElementById('scroll-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
```"""
    },
    {
        "title": "bug: 404 page does not contain a link back to home",
        "body": """**Description**
If a user visits a broken URL and lands on `404.html`, there is no clear call-to-action to return to the project dashboard.

**Steps to Reproduce**
1. Open `404.html` in the browser.
2. Notice it just says "Page not found" with no navigation.

**Expected Behavior**
Add a prominent "Go Back to Dashboard" button on the 404 page.

**Implementation Hints**
```html
<!-- 404.html -->
<div class="error-container">
  <h1>404 - Project Not Found</h1>
  <p>The project you are looking for does not exist.</p>
  <a href="/index.html" class="btn btn-primary">Return to Home</a>
</div>
```"""
    },
    {
        "title": "feat: Implement sort by \"Most Recent\" / \"Project No\" for grid",
        "body": """**Description**
Currently, projects are displayed in the order they appear in `projects.json`. Adding a dropdown to sort by Project Number (Ascending/Descending) will help users track their progression through the 100 days.

**Steps to Reproduce**
1. Look at the project dashboard.
2. Notice the lack of sorting functionality.

**Expected Behavior**
Add a sorting dropdown that reorganizes `filteredProjectData` based on `project.projectNo` before calling `renderProjects()`.

**Implementation Hints**
```javascript
// index.js
const sortProjects = (order) => {
  filteredProjectData.sort((a, b) => {
    return order === 'asc' ? a.projectNo - b.projectNo : b.projectNo - a.projectNo;
  });
  renderProjects(filteredProjectData);
};
```"""
    },
    {
        "title": "chore: Update CONTRIBUTING.md template for new projects",
        "body": """**Description**
`CONTRIBUTING.md` is very large. We need a clear, copy-pasteable JSON block template inside the docs showing exactly how to append a new project to `projects.json`.

**Steps to Reproduce**
1. Open `CONTRIBUTING.md`.
2. Notice there is no exact JSON schema template provided for new developers.

**Expected Behavior**
Add a markdown code block under the "Adding a New Project" section that shows the exact keys required.

**Implementation Hints**
```markdown
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
    },
    {
        "title": "feat: Add Keyboard Navigation (Arrows) support to projects grid",
        "body": """**Description**
Power users and keyboard navigators would benefit from being able to use `ArrowRight` and `ArrowLeft` keys to switch between pagination pages.

**Steps to Reproduce**
1. Go to the project dashboard.
2. Press Left or Right arrow keys.
3. Observe nothing happens regarding pagination.

**Expected Behavior**
Listen for `keydown` events. If the user presses right/left arrow, trigger the "Next Page" / "Prev Page" functions respectively.

**Implementation Hints**
```javascript
// index.js
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' && currentPage < maxPages) {
    nextPage();
  } else if (e.key === 'ArrowLeft' && currentPage > 1) {
    prevPage();
  }
});
```"""
    },
    {
        "title": "bug: Fallback image not showing when project preview fails to load",
        "body": """**Description**
If a project's preview thumbnail image fails to load (e.g., deleted file or incorrect path), the browser shows a broken image icon instead of a nice fallback image.

**Steps to Reproduce**
1. Open DevTools and manually alter the `src` of a project card image to a broken link.
2. Observe the broken image icon.

**Expected Behavior**
Use the `<img onerror="...">` attribute to swap the `src` to a default placeholder image.

**Implementation Hints**
```html
<!-- inside the JavaScript string literal generating the HTML -->
<img src="${project.imagePath}" 
     alt="${project.projectName}" 
     onerror="this.onerror=null; this.src='./public/placeholder.png';">
```"""
    }
]

def create_issue(issue):
    cmd = ["gh", "issue", "create", "--title", issue["title"], "--body", issue["body"]]
    try:
        result = subprocess.run(cmd, check=True, capture_output=True, text=True)
        print(f"Successfully created issue: {issue['title']}")
        print(f"Link: {result.stdout.strip()}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Failed to create issue: {issue['title']}")
        print(f"Error: {e.stderr.strip()}")
        return False

def main():
    print(f"Preparing to create {len(issues)} issues using gh CLI...")
    success_count = 0
    
    for i, issue in enumerate(issues, 1):
        print(f"[{i}/{len(issues)}] Creating issue...")
        if create_issue(issue):
            success_count += 1
            # Sleep to avoid hitting GitHub API rate limits
            time.sleep(4)
        else:
            print("Stopping due to error.")
            sys.exit(1)
                
    print(f"\\nFinished! Created {success_count} out of {len(issues)} issues.")

if __name__ == "__main__":
    main()
