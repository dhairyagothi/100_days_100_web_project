const NASA_API_KEY = ""; //add your api key. Get it from NASA APOD API(Its free!)
const NASA_APOD_URL = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;

let currentApodDate = '';
let currentApodTitle = '';


async function fetchAPOD(date = null) {
    const loader = document.getElementById('loader');
    const image = document.getElementById('image');
    const contentContainer = document.querySelector('.content-container');
    
    loader.classList.add('visible');
    image.classList.add('loading');
    contentContainer.classList.add('loading');
    
    try {
      const url = date 
        ? `${NASA_APOD_URL}&date=${date}`
        : NASA_APOD_URL;
      
      const response = await fetch(url);
      const data = await response.json();
  
      currentApodDate = data.date;
      currentApodTitle = data.title;
      

      const img = new Image();
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = data.url;

        setTimeout(reject, 10000);
      });

      document.getElementById("title").textContent = data.title;
      document.getElementById("description").textContent = data.explanation;
      image.src = data.url;

      const bookmarks = await getBookmarks();
      updateBookmarkButton(bookmarks.some(bookmark => bookmark.date === currentApodDate));

      await new Promise(resolve => setTimeout(resolve, 50));

      image.classList.remove('loading');
      contentContainer.classList.remove('loading');
      
    } catch (error) {
      console.error("Error fetching APOD:", error);
      document.getElementById("title").textContent = "Error Loading Content";
      document.getElementById("image").src = "/api/placeholder/400/250";
      document.getElementById("description").textContent = 
        "Unable to load APOD data. Please try again later.";
    } finally {
      setTimeout(() => {
        loader.classList.remove('visible');
      }, 0);
    }
  }

  document.getElementById('image').addEventListener('load', function() {
    this.classList.remove('loading');
  });

async function getBookmarks() {
  const result = await chrome.storage.local.get('apodBookmarks');
  return result.apodBookmarks || [];
}

async function toggleBookmark() {
  const bookmarks = await getBookmarks();
  const index = bookmarks.findIndex(bookmark => bookmark.date === currentApodDate);
  
  if (index === -1) {
    bookmarks.push({
      date: currentApodDate,
      title: currentApodTitle,
      description: document.getElementById("description").textContent
    });
  } else {
    bookmarks.splice(index, 1);
  }

  await chrome.storage.local.set({ apodBookmarks: bookmarks });
  updateBookmarkButton(index === -1);
  
  if (document.getElementById('bookmarks-view').classList.contains('active')) {
    renderBookmarksList();
  }
}

function updateBookmarkButton(isBookmarked) {
  const btn = document.getElementById('bookmark-btn');
  const icon = btn.querySelector('i');
  
  if (isBookmarked) {
    icon.className = 'fas fa-star';
    btn.classList.add('active');
  } else {
    icon.className = 'far fa-star';
    btn.classList.remove('active');
  }
}

async function renderBookmarksList() {
  const bookmarksList = document.getElementById('bookmarks-list');
  const bookmarks = await getBookmarks();
  
  bookmarksList.innerHTML = bookmarks.length === 0 
    ? '<p class="description-container">No bookmarks yet</p>'
    : bookmarks.map(bookmark => `
      <div class="bookmark-item" data-date="${bookmark.date}">
        <div class="bookmark-date">${formatDate(bookmark.date)}</div>
        <div class="bookmark-title">${bookmark.title}</div>
        <div class="bookmark-description">${bookmark.description}</div>
      </div>
    `).join('');

  document.querySelectorAll('.bookmark-item').forEach(item => {
    item.addEventListener('click', () => {
      fetchAPOD(item.dataset.date);
      toggleView('main-view');
    });
  });
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function toggleView(viewId) {
  const mainView = document.getElementById('main-view');
  const bookmarksView = document.getElementById('bookmarks-view');
  const bookmarksBtn = document.getElementById('bookmarks-list-btn');
  
  if (viewId === 'bookmarks-view') {
    mainView.classList.add('hidden');
    bookmarksView.classList.remove('hidden');
    bookmarksView.classList.add('active');
    bookmarksBtn.classList.add('active');
    renderBookmarksList();
  } else {
    mainView.classList.remove('hidden');
    bookmarksView.classList.add('hidden');
    bookmarksView.classList.remove('active');
    bookmarksBtn.classList.remove('active');
  }
}

document.addEventListener("DOMContentLoaded", () => {

  const dateInput = document.getElementById('date-search');
  const today = new Date().toISOString().split('T')[0];
  dateInput.max = today;
  
  const urlParams = new URLSearchParams(window.location.search);
  const date = urlParams.get('date');
  
  if (date) {
    dateInput.value = date;
  }
  
  fetchAPOD(date);


  document.getElementById('bookmark-btn').addEventListener('click', toggleBookmark);
  document.getElementById('bookmarks-list-btn').addEventListener('click', () => {
    toggleView('bookmarks-view');
  });
  document.getElementById('search-btn').addEventListener('click', () => {
    const searchDate = dateInput.value;
    if (searchDate) {
      fetchAPOD(searchDate);
      toggleView('main-view');
    }
  });
});