const searchform = document.getElementById("searchform");
const searchBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const showMoreButton = document.getElementById("show-more-button");
const resetButton = document.getElementById("reset-button");

let keyword = "";
let page = 1;

async function searchImages() {
    keyword = searchBox.value.trim().toLowerCase();
    if (!keyword) {
        alert("Please enter a keyword to search!");
        return;
    }

    showMoreButton.innerText = "Loading...";
    showMoreButton.style.display = "block";
    
    try {
        if (page === 1) {
            searchResult.innerHTML = "";
        }

        const itemsPerPage = 12;
        
        for (let i = 0; i < itemsPerPage; i++) {
            // Uses a zero-key open API that strictly matches the keyword entered
            const accurateImageUrl = `https://loremflickr.com/500/400/${encodeURIComponent(keyword)}?random=${i + (page * itemsPerPage)}`;

            const image = document.createElement("img");
            image.src = accurateImageUrl;
            image.alt = `${keyword} search result`;
            image.loading = "lazy"; 
            image.style.background = "#1e293b"; 

            const imageLink = document.createElement("a");
            imageLink.href = accurateImageUrl;
            imageLink.target = "_blank";
            imageLink.rel = "noopener noreferrer"; 
            
            imageLink.appendChild(image);
            searchResult.appendChild(imageLink);
        }

        if (page < 5) {
            showMoreButton.style.display = "block";
        } else {
            showMoreButton.style.display = "none";
        }
        
    } catch (error) {
        console.error("Search failed:", error);
        if (page === 1) {
            searchResult.innerHTML = `<p class="error-msg">Something went wrong. Please try again.</p>`;
        }
        showMoreButton.style.display = "none";
    } finally {
        showMoreButton.innerText = "Show more";
    }
}

searchform.addEventListener("submit", (e) => {
    e.preventDefault();
    page = 1;
    searchImages();
});

showMoreButton.addEventListener("click", () => {
    page++;
    searchImages();
});

resetButton.addEventListener("click", () => {
    searchBox.value = "";
    searchResult.innerHTML = "";
    page = 1;
    keyword = "";
    showMoreButton.style.display = "none";
    searchBox.focus();
});
