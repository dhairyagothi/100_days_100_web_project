let allBooks = [];
let savedIds = JSON.parse(localStorage.getItem('savedBookIds')) || [];
let currentMood = null;

fetch('books.json')
  .then(response => response.json())
  .then(data => {
    allBooks = data;
    console.log('Books loaded:', allBooks.length);
    renderShelf();
  })
  .catch(error => console.error('Failed to load books:', error));

function renderBooks(books) {
  const resultsGrid = document.getElementById('results-grid');

  if (books.length === 0) {
    resultsGrid.innerHTML = `<p class="text-slate-400 col-span-full">No books match yet — pick a mood or adjust your search.</p>`;
    return;
  }

  resultsGrid.innerHTML = books.map(book => `
    <div class="bg-white rounded-lg shadow p-4 flex flex-col">
      <img src="${book.cover}" alt="${book.title} cover" 
           onload="if(this.naturalWidth < 50){ this.src='https://placehold.co/300x450/e2e8f0/64748b?text=No+Cover'; }" 
           onerror="this.onerror=null; this.src='https://placehold.co/300x450/e2e8f0/64748b?text=No+Cover';" 
           class="w-full h-56 object-cover rounded mb-3" />
      <h3 class="font-semibold text-lg">${book.title}</h3>
      <p class="text-sm text-slate-500 mb-2">${book.author}</p>
      <p class="text-sm text-slate-700 mb-2">${book.description}</p>
      <p class="text-sm italic text-indigo-600 mt-auto mb-3">"${book.whyThisBook}"</p>
      <button class="save-btn bg-indigo-600 text-white text-sm py-2 rounded hover:bg-indigo-700 transition-colors" data-id="${book.id}">
        Save to Shelf
      </button>
    </div>
  `).join('');
}

function renderShelf() {
  const shelfGrid = document.getElementById('shelf-grid');
  const savedBooks = allBooks.filter(book => savedIds.includes(book.id));

  if (savedBooks.length === 0) {
    shelfGrid.innerHTML = `<p class="text-slate-400 col-span-full">Your shelf is empty. Save a book to see it here.</p>`;
    return;
  }

  shelfGrid.innerHTML = savedBooks.map(book => `
    <div class="bg-white rounded-lg shadow p-4 flex flex-col">
      <img src="${book.cover}" alt="${book.title} cover" 
           onload="if(this.naturalWidth < 50){ this.src='https://placehold.co/300x450/e2e8f0/64748b?text=No+Cover'; }" 
           onerror="this.onerror=null; this.src='https://placehold.co/300x450/e2e8f0/64748b?text=No+Cover';" 
           class="w-full h-56 object-cover rounded mb-3" />
      <h3 class="font-semibold text-lg">${book.title}</h3>
      <p class="text-sm text-slate-500 mb-3">${book.author}</p>
      <button class="remove-btn bg-slate-200 text-slate-700 text-sm py-2 rounded hover:bg-slate-300 transition-colors" data-id="${book.id}">
        Remove
      </button>
    </div>
  `).join('');
}

function updateResults() {
  const searchText = document.getElementById('search-input').value.toLowerCase().trim();

  let filtered = currentMood
    ? allBooks.filter(book => book.mood.includes(currentMood))
    : [];

  if (searchText) {
    filtered = filtered.filter(book =>
      book.title.toLowerCase().includes(searchText) ||
      book.author.toLowerCase().includes(searchText)
    );
  }

  renderBooks(filtered);
}

const moodButtonsContainer = document.getElementById('mood-buttons');

moodButtonsContainer.addEventListener('click', (event) => {
  if (!event.target.classList.contains('mood-btn')) return;

  // remove active styling from all buttons
  document.querySelectorAll('.mood-btn').forEach(btn => {
    btn.classList.remove('bg-indigo-600', 'text-white', 'border-indigo-600');
  });

  // add active styling to the clicked button
  event.target.classList.add('bg-indigo-600', 'text-white', 'border-indigo-600');

  currentMood = event.target.dataset.mood;
  updateResults();
});

document.getElementById('search-input').addEventListener('input', updateResults);

const resultsGrid = document.getElementById('results-grid');

resultsGrid.addEventListener('click', (event) => {
  if (!event.target.classList.contains('save-btn')) return;

  const bookId = Number(event.target.dataset.id);

  if (!savedIds.includes(bookId)) {
    savedIds.push(bookId);
    localStorage.setItem('savedBookIds', JSON.stringify(savedIds));
    renderShelf();
  }
});

const shelfGrid = document.getElementById('shelf-grid');

shelfGrid.addEventListener('click', (event) => {
  if (!event.target.classList.contains('remove-btn')) return;

  const bookId = Number(event.target.dataset.id);
  savedIds = savedIds.filter(id => id !== bookId);
  localStorage.setItem('savedBookIds', JSON.stringify(savedIds));
  renderShelf();
});