# Reading Progress Indicator & Highlighter

An advanced web application featuring a smooth, scroll-linked progress bar, persistent text highlighting, and dynamic content loading using the browser's `localStorage` API. Designed with expressive, minimal, and card-based layout principles for a superior reading experience.

## Technologies Used

*   **HTML5:** Semantic structure with inputs for dynamic text.
*   **CSS3:** Modern card-based UI, expressive typography, micro-animations, and fully responsive design.
*   **Vanilla JavaScript:** DOM manipulation, event delegation, scroll tracking, and Selection API handling.

## Features

*   **Custom Text Importer:** Paste your own text into the input area to dynamically generate readable paragraphs that replace the default article.
*   **Dynamic Progress Bar:** A fixed indicator at the top of the viewport tracks your reading progress in real-time.
*   **Interactive Highlighting:** Select text with your cursor to instantly apply a custom highlight style. 
*   **Remove Highlights:** Simply click on any existing highlighted text to instantly remove the highlight.
*   **Data Persistence:** Your text and all highlights are automatically saved to `localStorage`, ensuring they remain intact even after refreshing the page or closing the browser.

## Setup Instructions

1.  Clone or download this repository to your local machine.
2.  Ensure `index.html`, `style.css`, and `script.js` are located in the same root directory.
3.  Open `index.html` in any modern web browser to view the project.

## Usage

*   Paste your own text into the text area at the top and click "Load Text" to start reading.
*   Scroll down the article to see the progress bar dynamically update based on your scroll position.
*   Highlight text by clicking and dragging your cursor over any paragraph within the article card.
*   Click directly on any yellow highlighted text to remove the styling.
*   Refresh the page to confirm that your text and highlights have been persistently saved.