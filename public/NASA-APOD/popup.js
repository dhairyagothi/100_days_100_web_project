const NASA_API_KEY = "DEMO_KEY"; //add your api key. Get it from NASA APOD API(Its free!)
const NASA_API_KEY =
  window.NASA_API_KEY ||
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_NASA_API_KEY) ||
  'DEMO_KEY';
const NASA_APOD_URL = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;

let currentApodDate = "";
let currentApodTitle = "";

async function fetchAPOD(date = null) {
  const loader = document.getElementById("loader");
  const image = document.getElementById("image");
  const contentContainer = document.querySelector(".content-container");

  loader.classList.add("visible");
  image.classList.add("loading");
  contentContainer.classList.add("loading");

  try {
    const url = date ? `${NASA_APOD_URL}&date=${date}` : NASA_APOD_URL;

    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("Access Forbidden (403): Invalid or missing NASA API key. If using the default key, the rate limit might have been exceeded, or the key might be blocked.");
      } else if (response.status === 429) {
        throw new Error("Rate Limit Exceeded (429): You have exceeded the hourly limit for the DEMO_KEY. Please sign up for a free NASA API key to continue.");
      } else if (response.status === 503) {
        throw new Error("Service Unavailable (503): NASA's APOD API is currently down or overloaded. Please try again later.");
      } else {
        throw new Error(`NASA API Error: ${response.status}`);
      }
    }

    const data = await response.json();

    if (!data.url) {
      throw new Error("Invalid APOD response");
    }

    currentApodDate = data.date;

    currentApodTitle = data.title;

    document.getElementById("title").textContent = data.title;
    document.getElementById("description").textContent = data.explanation;

    if (data.media_type === "image") {
      const img = new Image();

      await new Promise((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          img.onload = null;
          img.onerror = null;
          reject(new Error("Image load timed out"));
        }, 15000);

        img.onload = () => {
          clearTimeout(timeoutId);
          resolve();
        };
        img.onerror = () => {
          clearTimeout(timeoutId);
          reject(new Error("Failed to load image"));
        };
        img.src = data.url;
      });

      image.src = data.url;
    } else if (data.media_type === "video") {
      image.src = "https://placehold.co/400x250/1e293b/94a3b8?text=Video+Content";

      document.getElementById("description").textContent =
        `${data.explanation}\n\nVideo URL: ${data.url}`;
    } else {
      throw new Error(`Unsupported media type: ${data.media_type}`);
    }

    const bookmarks = await getBookmarks();
    updateBookmarkButton(
      bookmarks.some((bookmark) => bookmark.date === currentApodDate),
    );

    await new Promise((resolve) => setTimeout(resolve, 50));

  } catch (error) {
    console.error("Error fetching APOD:", error);
    document.getElementById("title").textContent = "Error Loading Content";
    document.getElementById("image").src = "https://placehold.co/400x250/1e293b/94a3b8?text=Image+Unavailable";
    
    let errorMsg = "Unable to load APOD data. Please try again later.";
    if (error.message.includes("403") || error.message.includes("429") || error.message.includes("503")) {
      errorMsg = error.message;
    } else if (error.message.includes("Failed to fetch")) {
      errorMsg = "Network Error: Please check your internet connection.";
    } else {
      errorMsg = error.message || "An unexpected error occurred.";
    }
    document.getElementById("description").textContent = errorMsg;
  } finally {
    image.classList.remove("loading");
    contentContainer.classList.remove("loading");
    setTimeout(() => {
      loader.classList.remove("visible");
    }, 0);
  }
}

document.getElementById("image").addEventListener("load", function () {
  this.classList.remove("loading");
});

async function getBookmarks() {
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    try {
      return await new Promise((resolve) => {
        chrome.storage.local.get("apodBookmarks", (result) => {
          if (chrome.runtime.lastError) {
            resolve([]);
          } else {
            resolve(result.apodBookmarks || []);
          }
        });
      });
    } catch (error) {
      console.warn("Failed to get bookmarks from chrome.storage.local:", error);
    }
  }
  try {
    const result = localStorage.getItem("apodBookmarks");
    return result ? JSON.parse(result) : [];
  } catch (e) {
    console.error("Failed to read from localStorage:", e);
    return [];
  }
}

async function saveBookmarks(bookmarks) {
  if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
    try {
      return await new Promise((resolve) => {
        chrome.storage.local.set({ apodBookmarks: bookmarks }, () => {
          resolve();
        });
      });
    } catch (error) {
      console.warn("Failed to set bookmarks in chrome.storage.local:", error);
    }
  }
  try {
    localStorage.setItem("apodBookmarks", JSON.stringify(bookmarks));
  } catch (e) {
    console.error("Failed to write to localStorage:", e);
  }
}

async function toggleBookmark() {
  const bookmarks = await getBookmarks();
  const index = bookmarks.findIndex(
    (bookmark) => bookmark.date === currentApodDate,
  );

  if (index === -1) {
    bookmarks.push({
      date: currentApodDate,
      title: currentApodTitle,
      description: document.getElementById("description").textContent,
    });
  } else {
    bookmarks.splice(index, 1);
  }

  await saveBookmarks(bookmarks);
  updateBookmarkButton(index === -1);

  if (document.getElementById("bookmarks-view").classList.contains("active")) {
    renderBookmarksList();
  }
}

function updateBookmarkButton(isBookmarked) {
  const btn = document.getElementById("bookmark-btn");
  const icon = btn.querySelector("i");

  if (isBookmarked) {
    icon.className = "fas fa-star";
    btn.classList.add("active");
  } else {
    icon.className = "far fa-star";
    btn.classList.remove("active");
  }
}

async function renderBookmarksList() {
  const bookmarksList = document.getElementById("bookmarks-list");
  const bookmarks = await getBookmarks();

  bookmarksList.innerHTML =
    bookmarks.length === 0
      ? '<p class="description-container">No bookmarks yet</p>'
      : bookmarks
          .map(
            (bookmark) => `
      <div class="bookmark-item" data-date="${bookmark.date}">
        <div class="bookmark-date">${formatDate(bookmark.date)}</div>
        <div class="bookmark-title">${bookmark.title}</div>
        <div class="bookmark-description">${bookmark.description}</div>
      </div>
    `,
          )
          .join("");

  document.querySelectorAll(".bookmark-item").forEach((item) => {
    item.addEventListener("click", () => {
      fetchAPOD(item.dataset.date);
      toggleView("main-view");
    });
  });
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function toggleView(viewId) {
  const mainView = document.getElementById("main-view");
  const bookmarksView = document.getElementById("bookmarks-view");
  const bookmarksBtn = document.getElementById("bookmarks-list-btn");

  if (viewId === "bookmarks-view") {
    mainView.classList.add("hidden");
    bookmarksView.classList.remove("hidden");
    bookmarksView.classList.add("active");
    bookmarksBtn.classList.add("active");
    renderBookmarksList();
  } else {
    mainView.classList.remove("hidden");
    bookmarksView.classList.add("hidden");
    bookmarksView.classList.remove("active");
    bookmarksBtn.classList.remove("active");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date-search");
  const today = new Date().toISOString().split("T")[0];
  dateInput.max = today;

  const urlParams = new URLSearchParams(window.location.search);
  const date = urlParams.get("date");

  if (date) {
    dateInput.value = date;
  }

  fetchAPOD(date);

  document
    .getElementById("bookmark-btn")
    .addEventListener("click", toggleBookmark);
  document
    .getElementById("bookmarks-list-btn")
    .addEventListener("click", () => {
      toggleView("bookmarks-view");
    });
  document.getElementById("search-btn").addEventListener("click", () => {
    const searchDate = dateInput.value;
    if (searchDate) {
      fetchAPOD(searchDate);
      toggleView("main-view");
    }
  });
});
