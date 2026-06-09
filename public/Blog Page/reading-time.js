document.addEventListener("DOMContentLoaded", () => {
    const readingTimeElement = document.getElementById("reading-time");

    if (!readingTimeElement) return;

    let contentContainer =
        document.querySelector("#article-content") ||
        document.querySelector(".blog-content") ||
        document.querySelector(".blog-page");

    if (!contentContainer) return;

    const text = contentContainer.innerText || contentContainer.textContent;

    const wordCount = text
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0).length;

    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    readingTimeElement.textContent = `📖 ${readingTime} min read`;
});