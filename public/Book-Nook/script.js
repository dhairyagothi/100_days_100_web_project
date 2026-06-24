// --- INITIAL STATES AND DATA CORNER ---
const DEFAULT_BOOKS = [
  {
    id: 'book-1',
    title: 'The Night Circus',
    author: 'Erin Morgenstern',
    genre: 'Fantasy',
    status: 'completed',
    rating: 5,
    favorite: true,
    dateStarted: '2026-01-05',
    dateFinished: '2026-01-18',
    review:
      'Absolutely magical. The descriptions of the circus tents made me feel like I was walking through it myself under the midnight sky. The romance was subtle but lovely.',
    coverType: 'generate',
    coverColors: '#4f2e5a,#27142d', // Deep purple
  },
  {
    id: 'book-2',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    genre: 'Fantasy', // Fantasy & Sci-Fi dropdown maps to Fantasy
    status: 'completed',
    rating: 4,
    favorite: false,
    dateStarted: '2026-02-10',
    dateFinished: '2026-03-01',
    review:
      'Incredible science fiction. The relationship between Ryland Grace and Rocky was the absolute highlight. Science-heavy but so accessible and thrilling!',
    coverType: 'generate',
    coverColors: '#1f3a52,#0f1c24', // Dark navy blue
  },
  {
    id: 'book-3',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genre: 'Fiction',
    status: 'reading',
    rating: 0,
    favorite: false,
    dateStarted: '2026-05-20',
    dateFinished: '',
    review:
      'A thought-provoking concept about regret and the infinite parallel lives we could live. Really enjoying the cozy librarian character, Mrs. Elm.',
    coverType: 'generate',
    coverColors: '#2b4c3f,#14241d', // Forest green
  },
  {
    id: 'book-4',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help',
    status: 'want',
    rating: 0,
    favorite: false,
    dateStarted: '',
    dateFinished: '',
    review:
      'Heard amazing things from Archana and Ananya K. Planning to start this to build a better reading habit this summer!',
    coverType: 'generate',
    coverColors: '#a37b3f,#5b421a', // Golden amber
  },
];

const DEFAULT_FRIENDS = [
  { id: 'friend-1', name: 'Sanjana', initials: 'S', color: '#be7570' },
  { id: 'friend-2', name: 'Archana', initials: 'A', color: '#e89524' },
  { id: 'friend-3', name: 'Ananya k', initials: 'Ak', color: '#5785a0' },
];

const DEFAULT_FEED = [
  {
    id: 'feed-1',
    friendId: 'friend-1',
    sender: 'Sanjana',
    action: 'recommended',
    bookTitle: 'Better Than The Movies',
    bookAuthor: 'Lynn Painter',
    message:
      'It is a sweet, Young Adult (YA) contemporary romance that focuses heavily on rom-com tropes, witty banter, and emotional tension!',
    timestamp: '2 hours ago',
    coverColors: '#4f2e5a,#27142d',
  },
  {
    id: 'feed-2',
    friendId: 'friend-2',
    sender: 'Archana',
    action: 'finished reading',
    bookTitle: 'Dune',
    bookAuthor: 'Frank Herbert',
    message:
      'A massive sci-fi classic. The worldbuilding is mind-blowing. Took me a while, but it was worth every page!',
    timestamp: '1 day ago',
    coverColors: '#a37b3f,#5b421a',
  },
  {
    id: 'feed-3',
    friendId: 'friend-3',
    sender: 'Ananya K',
    action: 'shelved',
    bookTitle: 'Pride and Prejudice',
    bookAuthor: 'Jane Austen',
    message:
      'Re-reading my comfort book for the 5th time. Darcy is still unmatched.',
    timestamp: '3 days ago',
    coverColors: '#be7570,#7c3a2b',
  },
];

// App State Cache
let state = {
  books: [],
  friends: [],
  feed: [],
  readingGoal: 12,
  soundEnabled: true,
  currentShelf: 'all',
  searchQuery: '',
  genreFilter: 'all',
  activeRatingInput: 0,
  coverMode: 'generate', // generate, url, upload
};

// --- WEB AUDIO API SYNTHESIZER ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  if (!state.soundEnabled) return;

  // Resume context if suspended (browser security autoplays check)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  try {
    switch (type) {
      case 'flip':
        playPageFlipSound();
        break;
      case 'write':
        playPenWriteSound();
        break;
      case 'chime':
        playCozyChime();
        break;
      case 'delete':
        playDeleteSound();
        break;
    }
  } catch (e) {
    console.warn('Audio Context error:', e);
  }
}

// Page Flip sound synthesizer: Noise + Lowpass ramp down
function playPageFlipSound() {
  const bufferSize = audioCtx.sampleRate * 0.35; // 350ms duration
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  // Fill buffer with white noise
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = buffer;

  // Set up lowpass filter to sweep down
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.Q.setValueAtTime(4, audioCtx.currentTime);
  filter.frequency.setValueAtTime(900, audioCtx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(
    120,
    audioCtx.currentTime + 0.3
  );

  // Set up volume envelope
  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioCtx.currentTime + 0.35
  );

  noiseSource.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  noiseSource.start();
}

// Pen Scribble / Write sound: High pass filtered short noise burst
function playPenWriteSound() {
  const bufferSize = audioCtx.sampleRate * 0.08; // 80ms duration
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(2500, audioCtx.currentTime);

  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioCtx.currentTime + 0.08
  );

  noiseSource.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  noiseSource.start();
}

// Cozy Chime: Pentatonic warm chord E5 -> G5 -> C6
function playCozyChime() {
  const notes = [659.25, 783.99, 1046.5]; // E5, G5, C6 frequencies
  const now = audioCtx.currentTime;

  notes.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + idx * 0.07);

    gainNode.gain.setValueAtTime(0, now + idx * 0.07);
    gainNode.gain.linearRampToValueAtTime(0.08, now + idx * 0.07 + 0.03);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.6);

    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(now + idx * 0.07);
    osc.stop(now + idx * 0.07 + 0.6);
  });
}

// Soft low frequency sweep for deletes
function playDeleteSound() {
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  osc.type = 'triangle';
  osc.frequency.setValueAtTime(220, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);

  gainNode.gain.setValueAtTime(0.12, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  osc.start(now);
  osc.stop(now + 0.25);
}

// --- APP INITIALIZER ---
window.addEventListener('DOMContentLoaded', () => {
  loadLocalStorage();
  registerEvents();
  renderApp();

  // Set up mock replies polling or event checking
  setupMockInteractionListener();
});

// Load storage elements or fill defaults
function loadLocalStorage() {
  const storedBooks = localStorage.getItem('cozy_nook_books');
  const storedFriends = localStorage.getItem('cozy_nook_friends');
  const storedFeed = localStorage.getItem('cozy_nook_feed');
  const storedGoal = localStorage.getItem('cozy_nook_goal');
  const storedSound = localStorage.getItem('cozy_nook_sound');
  const storedTheme = localStorage.getItem('cozy_nook_theme');

  // Load books
  if (storedBooks) {
    state.books = JSON.parse(storedBooks);
  } else {
    state.books = DEFAULT_BOOKS;
    saveBooks();
  }

  // Load friends
  if (storedFriends) {
    state.friends = JSON.parse(storedFriends);
    // Migration check: if old friends or misspelled names are found in localstorage, overwrite with new defaults
    if (
      state.friends.some(
        (f) =>
          f.name === 'Sarah Miller' ||
          f.name === 'Leo McCaffrey' ||
          f.name === 'Emily Chen' ||
          f.name === 'Ananaya k'
      )
    ) {
      state.friends = DEFAULT_FRIENDS;
      saveFriends();
    }
  } else {
    state.friends = DEFAULT_FRIENDS;
    saveFriends();
  }

  // Load social feed
  if (storedFeed) {
    state.feed = JSON.parse(storedFeed);
    // Migration check: if old feed senders or misspelled names are found in localstorage, overwrite with new defaults
    if (
      state.feed.some(
        (item) =>
          item.sender === 'Sarah Miller' ||
          item.sender === 'Leo McCaffrey' ||
          item.sender === 'Emily Chen' ||
          item.sender === 'Ananaya K'
      )
    ) {
      state.feed = DEFAULT_FEED;
      saveFeed();
    }
  } else {
    state.feed = DEFAULT_FEED;
    saveFeed();
  }

  // Load reading goal
  if (storedGoal) {
    state.readingGoal = parseInt(storedGoal);
  } else {
    state.readingGoal = 12;
  }

  // Load sound state
  if (storedSound !== null) {
    state.soundEnabled = storedSound === 'true';
  } else {
    state.soundEnabled = true;
  }

  // Apply Theme
  if (storedTheme) {
    if (storedTheme === 'theme-cozy-library') {
      document.body.className = 'theme-berry-much';
      localStorage.setItem('cozy_nook_theme', 'theme-berry-much');
    } else {
      document.body.className = storedTheme;
    }
  } else {
    document.body.className = 'theme-berry-much';
  }
}

// --- STORAGE SAVE HELPERS ---
function saveBooks() {
  localStorage.setItem('cozy_nook_books', JSON.stringify(state.books));
}
function saveFriends() {
  localStorage.setItem('cozy_nook_friends', JSON.stringify(state.friends));
}
function saveFeed() {
  localStorage.setItem('cozy_nook_feed', JSON.stringify(state.feed));
}
function saveGoal() {
  localStorage.setItem('cozy_nook_goal', state.readingGoal.toString());
}

// --- DOM ELEMENT REFERENCES ---
const DOM = {
  // Theme & sound controls
  btnThemeToggle: document.getElementById('btnThemeToggle'),
  themeIconSun: document.getElementById('themeIconSun'),
  themeIconMoon: document.getElementById('themeIconMoon'),
  themeIconBerry: document.getElementById('themeIconBerry'),
  btnSoundToggle: document.getElementById('btnSoundToggle'),
  soundIconOn: document.getElementById('soundIconOn'),
  soundIconOff: document.getElementById('soundIconOff'),
  btnDimmer: document.getElementById('btnDimmer'),
  dimOverlay: document.getElementById('dimOverlay'),

  // Dashboard & stats
  statTotalBooks: document
    .getElementById('statTotalBooks')
    .querySelector('.stat-value'),
  statCompleted: document
    .getElementById('statCompleted')
    .querySelector('.stat-value'),
  statAvgRating: document
    .getElementById('statAvgRating')
    .querySelector('.stat-value'),
  statReadingGoal: document
    .getElementById('statReadingGoal')
    .querySelector('.stat-value'),

  // Sidebar Left
  inputSearch: document.getElementById('inputSearch'),
  shelfButtons: document.querySelectorAll('.shelf-btn'),
  selectGenreFilter: document.getElementById('selectGenreFilter'),

  // Goal Widget
  btnSetGoal: document.getElementById('btnSetGoal'),
  goalProgressBar: document.getElementById('goalProgressBar'),
  goalTextValue: document.getElementById('goalTextValue'),
  goalPercentValue: document.getElementById('goalPercentValue'),

  // Chart Widget
  genreChart: document.getElementById('genreChart'),
  chartCenterCount: document.getElementById('chartCenterCount'),
  chartLegend: document.getElementById('chartLegend'),

  // Main Grid Workspace
  currentShelfTitle: document.getElementById('currentShelfTitle'),
  shelfBookCount: document.getElementById('shelfBookCount'),
  btnAddNewBook: document.getElementById('btnAddNewBook'),
  bookGrid: document.getElementById('bookGrid'),

  // Friends sidebar
  friendsAvatarsList: document.getElementById('friendsAvatarsList'),
  recommendationFeed: document.getElementById('recommendationFeed'),
  btnAddFriend: document.getElementById('btnAddFriend'),
  btnQuickRecommend: document.getElementById('btnQuickRecommend'),

  // Book Modal
  bookModal: document.getElementById('bookModal'),
  bookModalTitle: document.getElementById('bookModalTitle'),
  bookForm: document.getElementById('bookForm'),
  editBookId: document.getElementById('editBookId'),
  bookTitle: document.getElementById('bookTitle'),
  bookAuthor: document.getElementById('bookAuthor'),
  bookGenre: document.getElementById('bookGenre'),
  bookStatus: document.getElementById('bookStatus'),
  bookRating: document.getElementById('bookRating'),
  bookFavorite: document.getElementById('bookFavorite'),
  bookCoverUrl: document.getElementById('bookCoverUrl'),
  bookCoverFile: document.getElementById('bookCoverFile'),
  bookDateStarted: document.getElementById('bookDateStarted'),
  bookDateFinished: document.getElementById('bookDateFinished'),
  bookReview: document.getElementById('bookReview'),
  starRatingInput: document.getElementById('starRatingInput'),
  btnDeleteBook: document.getElementById('btnDeleteBook'),
  btnCancelBook: document.getElementById('btnCancelBook'),
  btnBookModalClose: document.getElementById('btnBookModalClose'),
  coverModeTabs: document.querySelectorAll('[data-cover-mode]'),
  coverPanelGenerate: document.getElementById('coverPanelGenerate'),
  coverPanelUrl: document.getElementById('coverPanelUrl'),
  coverPanelUpload: document.getElementById('coverPanelUpload'),
  generativeCoverColors: document.getElementById('generativeCoverColors'),
  paletteSwatches: document.querySelectorAll('.palette-swatch'),

  // Share Modal
  shareModal: document.getElementById('shareModal'),
  shareForm: document.getElementById('shareForm'),
  shareSelectBook: document.getElementById('shareSelectBook'),
  shareSelectFriend: document.getElementById('shareSelectFriend'),
  shareMessage: document.getElementById('shareMessage'),
  recommendationCardPreview: document.getElementById(
    'recommendationCardPreview'
  ),
  btnShareModalClose: document.getElementById('btnShareModalClose'),
  btnCancelShare: document.getElementById('btnCancelShare'),

  // Friend Modal
  friendModal: document.getElementById('friendModal'),
  friendForm: document.getElementById('friendForm'),
  friendName: document.getElementById('friendName'),
  friendAvatarColor: document.getElementById('friendAvatarColor'),
  friendColorSelector: document.getElementById('friendColorSelector'),
  btnFriendModalClose: document.getElementById('btnFriendModalClose'),
  btnCancelFriend: document.getElementById('btnCancelFriend'),

  // Goal Modal
  goalModal: document.getElementById('goalModal'),
  goalForm: document.getElementById('goalForm'),
  inputGoalCount: document.getElementById('inputGoalCount'),
  btnGoalModalClose: document.getElementById('btnGoalModalClose'),
  btnCancelGoal: document.getElementById('btnCancelGoal'),

  // Toasts
  toastContainer: document.getElementById('toastContainer'),
};

// --- EVENT ROUTING & TRIGGERS ---
function registerEvents() {
  // Theme toggle
  DOM.btnThemeToggle.addEventListener('click', () => {
    playSound('flip');
    if (document.body.classList.contains('theme-cozy-library')) {
      document.body.className = 'theme-midnight-study';
    } else if (document.body.classList.contains('theme-midnight-study')) {
      document.body.className = 'theme-berry-much';
    } else {
      document.body.className = 'theme-cozy-library';
    }
    localStorage.setItem('cozy_nook_theme', document.body.className);
    updateThemeToggleIcons();
  });
  updateThemeToggleIcons(); // Call initially

  // Sound toggle
  DOM.btnSoundToggle.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    localStorage.setItem('cozy_nook_sound', state.soundEnabled.toString());
    updateSoundIcons();
    playSound('chime');
  });
  updateSoundIcons(); // Call initially

  // Dimmer Toggle
  DOM.btnDimmer.addEventListener('click', () => {
    playSound('flip');
    DOM.dimOverlay.classList.toggle('dimmed');
    DOM.btnDimmer.classList.toggle('active');
  });

  // Search & Filtering
  DOM.inputSearch.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.toLowerCase().trim();
    renderBooksGrid();
  });

  DOM.selectGenreFilter.addEventListener('change', (e) => {
    playSound('write');
    state.genreFilter = e.target.value;
    renderBooksGrid();
  });

  DOM.shelfButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      playSound('flip');
      DOM.shelfButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.currentShelf = btn.dataset.shelf;

      // Update Grid Title
      const shelfNames = {
        all: 'All Books',
        reading: 'Currently Reading',
        completed: 'Completed Books',
        want: 'Want to Read',
        favorites: 'My Favorites ❤️',
      };
      DOM.currentShelfTitle.textContent =
        shelfNames[state.currentShelf] || 'My Shelf';

      renderBooksGrid();
    });
  });

  // Goal Modals
  DOM.btnSetGoal.addEventListener('click', () => {
    playSound('flip');
    DOM.inputGoalCount.value = state.readingGoal;
    openModal(DOM.goalModal);
  });

  DOM.goalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newGoal = parseInt(DOM.inputGoalCount.value);
    if (newGoal > 0) {
      state.readingGoal = newGoal;
      saveGoal();
      closeModal(DOM.goalModal);
      playSound('chime');
      showToast('🎯 Reading goal updated successfully!');
      renderGoalProgress();
      renderStatsSummary();
    }
  });

  DOM.btnGoalModalClose.addEventListener('click', () =>
    closeModal(DOM.goalModal)
  );
  DOM.btnCancelGoal.addEventListener('click', () => closeModal(DOM.goalModal));

  // Add Book Modal Open
  DOM.btnAddNewBook.addEventListener('click', () => {
    playSound('flip');
    resetBookForm();
    DOM.bookModalTitle.textContent = 'Log a New Book';
    DOM.btnDeleteBook.classList.add('hidden');
    openModal(DOM.bookModal);
  });

  DOM.btnBookModalClose.addEventListener('click', () =>
    closeModal(DOM.bookModal)
  );
  DOM.btnCancelBook.addEventListener('click', () => closeModal(DOM.bookModal));

  // Modal Stars ratings input
  DOM.starRatingInput.querySelectorAll('.modal-star').forEach((star) => {
    star.addEventListener('mouseover', () => {
      const val = parseInt(star.dataset.value);
      highlightStars(val);
    });

    star.addEventListener('mouseout', () => {
      highlightStars(state.activeRatingInput);
    });

    star.addEventListener('click', () => {
      playSound('write');
      state.activeRatingInput = parseInt(star.dataset.value);
      DOM.bookRating.value = state.activeRatingInput;
      highlightStars(state.activeRatingInput);
    });
  });

  // Cover image mode tabs
  DOM.coverModeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      playSound('flip');
      DOM.coverModeTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      state.coverMode = tab.dataset.coverMode;

      // Show hide sections
      DOM.coverPanelGenerate.classList.add('hidden');
      DOM.coverPanelUrl.classList.add('hidden');
      DOM.coverPanelUpload.classList.add('hidden');

      if (state.coverMode === 'generate')
        DOM.coverPanelGenerate.classList.remove('hidden');
      if (state.coverMode === 'url')
        DOM.coverPanelUrl.classList.remove('hidden');
      if (state.coverMode === 'upload')
        DOM.coverPanelUpload.classList.remove('hidden');
    });
  });

  // Palette color swatches selector
  DOM.paletteSwatches.forEach((swatch) => {
    swatch.addEventListener('click', () => {
      playSound('write');
      DOM.paletteSwatches.forEach((s) => s.classList.remove('active'));
      swatch.classList.add('active');
      DOM.generativeCoverColors.value = swatch.dataset.color;
    });
  });

  // Modal date logic depending on status
  DOM.bookStatus.addEventListener('change', (e) => {
    const val = e.target.value;
    const todayStr = new Date().toISOString().split('T')[0];
    if (val === 'reading') {
      DOM.bookDateStarted.value = todayStr;
      DOM.bookDateFinished.value = '';
    } else if (val === 'completed') {
      if (!DOM.bookDateStarted.value) DOM.bookDateStarted.value = todayStr;
      DOM.bookDateFinished.value = todayStr;
    } else {
      DOM.bookDateStarted.value = '';
      DOM.bookDateFinished.value = '';
    }
  });

  // Form submit (Add or Edit)
  DOM.bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    saveBookFormHandler();
  });

  // Delete Book
  DOM.btnDeleteBook.addEventListener('click', () => {
    const editId = DOM.editBookId.value;

    if (editId) {
      if (
        confirm(
          'Are you sure you want to remove this book from your Nook shelf?'
        )
      ) {
        const deletedBook = state.books.find((b) => b.id === editId);

        state.books = state.books.filter((b) => b.id !== editId);

        if (deletedBook) {
          state.feed = state.feed.filter(
            (feedItem) =>
              !(
                feedItem.bookTitle === deletedBook.title &&
                feedItem.bookAuthor === deletedBook.author
              )
          );

          saveFeed();
        }

        saveBooks();

        closeModal(DOM.bookModal);
        playSound('delete');

        showToast('Book removed and feed synchronized.');

        renderApp();
      }
    }
  });

  // Share Modal triggering
  DOM.btnQuickRecommend.addEventListener('click', () => {
    playSound('flip');
    openShareModal();
  });

  DOM.btnShareModalClose.addEventListener('click', () =>
    closeModal(DOM.shareModal)
  );
  DOM.btnCancelShare.addEventListener('click', () =>
    closeModal(DOM.shareModal)
  );

  DOM.shareForm.addEventListener('submit', (e) => {
    e.preventDefault();
    submitRecommendationLetter();
  });

  DOM.shareSelectBook.addEventListener('change', updateLetterPreview);
  DOM.shareSelectFriend.addEventListener('change', updateLetterPreview);
  DOM.shareMessage.addEventListener('input', updateLetterPreview);

  // Invite Friend Modal
  DOM.btnAddFriend.addEventListener('click', () => {
    playSound('flip');
    DOM.friendName.value = '';
    openModal(DOM.friendModal);
  });

  DOM.btnFriendModalClose.addEventListener('click', () =>
    closeModal(DOM.friendModal)
  );
  DOM.btnCancelFriend.addEventListener('click', () =>
    closeModal(DOM.friendModal)
  );

  // Swatch color selection for new friend
  DOM.friendColorSelector
    .querySelectorAll('.swatch-friend')
    .forEach((swatch) => {
      swatch.addEventListener('click', () => {
        playSound('write');
        DOM.friendColorSelector
          .querySelectorAll('.swatch-friend')
          .forEach((s) => s.classList.remove('active'));
        swatch.classList.add('active');
        DOM.friendAvatarColor.value = swatch.dataset.color;
      });
    });

  DOM.friendForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameStr = DOM.friendName.value.trim();
    if (!nameStr) return;

    // Check duplication
    if (
      state.friends.some((f) => f.name.toLowerCase() === nameStr.toLowerCase())
    ) {
      showToast('⚠️ Friend is already in your Reading Circle!');
      return;
    }

    const initials = nameStr
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
    const newFriend = {
      id: `friend-${Date.now()}`,
      name: nameStr,
      initials: initials || nameStr[0],
      color: DOM.friendAvatarColor.value,
    };

    state.friends.push(newFriend);
    saveFriends();
    closeModal(DOM.friendModal);
    playSound('chime');
    showToast(`💌 ${nameStr} joined your Nook Circle!`);
    renderFriendsPanel();
  });
}

// --- RENDER ROUTING MANAGER ---
function renderApp() {
  renderStatsSummary();
  renderGoalProgress();
  renderGenreAnalytics();
  renderBooksGrid();
  renderFriendsPanel();
  renderSocialFeed();
}

// Toggle Theme Icons
function updateThemeToggleIcons() {
  if (document.body.classList.contains('theme-cozy-library')) {
    DOM.themeIconSun.classList.add('hidden');
    DOM.themeIconMoon.classList.remove('hidden');
    DOM.themeIconBerry.classList.add('hidden');
  } else if (document.body.classList.contains('theme-midnight-study')) {
    DOM.themeIconSun.classList.add('hidden');
    DOM.themeIconMoon.classList.add('hidden');
    DOM.themeIconBerry.classList.remove('hidden');
  } else {
    DOM.themeIconSun.classList.remove('hidden');
    DOM.themeIconMoon.classList.add('hidden');
    DOM.themeIconBerry.classList.add('hidden');
  }
}

// Toggle Sound Icons
function updateSoundIcons() {
  if (state.soundEnabled) {
    DOM.soundIconOn.classList.remove('hidden');
    DOM.soundIconOff.classList.add('hidden');
  } else {
    DOM.soundIconOn.classList.add('hidden');
    DOM.soundIconOff.classList.remove('hidden');
  }
}

// --- STATS AND GOALS COMPUTATION ---
function renderStatsSummary() {
  const total = state.books.length;
  const completed = state.books.filter((b) => b.status === 'completed').length;

  // Calculate average rating
  const ratedBooks = state.books.filter((b) => b.rating > 0);
  const avg =
    ratedBooks.length > 0
      ? (
          ratedBooks.reduce((acc, curr) => acc + curr.rating, 0) /
          ratedBooks.length
        ).toFixed(1)
      : '0.0';

  // Reading goal percentage
  const goalPercent = Math.min(
    Math.round((completed / state.readingGoal) * 100),
    100
  );

  // Animate text injection
  animateNumberChange(
    DOM.statTotalBooks,
    parseInt(DOM.statTotalBooks.textContent) || 0,
    total
  );
  animateNumberChange(
    DOM.statCompleted,
    parseInt(DOM.statCompleted.textContent) || 0,
    completed
  );

  DOM.statAvgRating.textContent = avg;
  DOM.statReadingGoal.textContent = `${goalPercent}%`;
}

// Animate numbers for stats updates
function animateNumberChange(element, start, end) {
  if (start === end) {
    element.textContent = end;
    return;
  }
  let current = start;
  const increment = end > start ? 1 : -1;
  const stepTime = Math.abs(Math.floor(400 / (end - start || 1)));

  const timer = setInterval(
    () => {
      current += increment;
      element.textContent = current;
      if (current === end) {
        clearInterval(timer);
      }
    },
    Math.max(stepTime, 20)
  );
}

function renderGoalProgress() {
  const completedCount = state.books.filter(
    (b) => b.status === 'completed'
  ).length;
  const percent = Math.min(
    Math.round((completedCount / state.readingGoal) * 100),
    100
  );

  DOM.goalProgressBar.style.width = `${percent}%`;
  DOM.goalTextValue.textContent = `${completedCount} of ${state.readingGoal} books read`;
  DOM.goalPercentValue.textContent = `${percent}%`;
}

// --- CUSTOM SVG CHART & ANALYTICS CORNER ---
function renderGenreAnalytics() {
  const genresCount = {};
  let totalValid = 0;

  // Tally book genres
  state.books.forEach((b) => {
    genresCount[b.genre] = (genresCount[b.genre] || 0) + 1;
    totalValid++;
  });

  // Wipe chart
  DOM.genreChart.innerHTML = '';
  DOM.chartLegend.innerHTML = '';

  const genreKeys = Object.keys(genresCount);
  DOM.chartCenterCount.textContent = genreKeys.length;

  if (totalValid === 0) {
    // Render default placeholder circle
    DOM.genreChart.innerHTML = `<circle cx="50" cy="50" r="35" fill="transparent" stroke="var(--border-color)" stroke-width="12"></circle>`;
    DOM.chartLegend.innerHTML = `<p class="legend-empty-text">No data to display. Start shelving books!</p>`;
    return;
  }

  // Genre Color Theme palette map
  const genreColors = {
    Fiction: 'var(--pink-rose)',
    'Non-Fiction': 'var(--blue-sky)',
    Mystery: 'var(--amber-glow)',
    Fantasy: 'var(--primary-accent)',
    Biography: 'var(--green-success)',
    Poetry: 'var(--gold-accent)',
    'Self-Help': '#8b5cf6',
  };

  const defaultColors = [
    '#f43f5e',
    '#10b981',
    '#3b82f6',
    '#f59e0b',
    '#8b5cf6',
    '#ec4899',
  ];
  let colorIdx = 0;

  // Circumference of a circle with R=35 is 2 * pi * 35 = ~219.9
  const circumference = 219.9;
  let cumulativeOffset = 0;

  genreKeys.forEach((genre) => {
    const count = genresCount[genre];
    const percentage = count / totalValid;
    const strokeDash = percentage * circumference;
    const strokeOffset = circumference - cumulativeOffset;
    cumulativeOffset += strokeDash;

    const color =
      genreColors[genre] || defaultColors[colorIdx++ % defaultColors.length];

    // Create SVG Circle Segment
    const circle = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'circle'
    );
    circle.setAttribute('cx', '50');
    circle.setAttribute('cy', '50');
    circle.setAttribute('r', '35');
    circle.setAttribute('class', 'chart-segment');
    circle.setAttribute('fill', 'transparent');
    circle.setAttribute('stroke', color);
    circle.setAttribute('stroke-width', '12');
    circle.setAttribute('stroke-dasharray', `${strokeDash} ${circumference}`);
    circle.setAttribute('stroke-dashoffset', strokeOffset);

    // Add tooltip details
    const title = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'title'
    );
    title.textContent = `${genre}: ${count} (${Math.round(percentage * 100)}%)`;
    circle.appendChild(title);

    DOM.genreChart.appendChild(circle);

    // Create Legend Item
    const legendItem = document.createElement('div');
    legendItem.className = 'legend-item';
    legendItem.innerHTML = `
      <span class="legend-dot" style="background-color: ${color};"></span>
      <span>${genre} (${count})</span>
    `;
    DOM.chartLegend.appendChild(legendItem);
  });
}

// --- BOOK GRID RENDERER CORNER ---
function renderBooksGrid() {
  const filtered = state.books.filter((book) => {
    // 1. Search Query filter (title & author)
    const matchesSearch =
      book.title.toLowerCase().includes(state.searchQuery) ||
      book.author.toLowerCase().includes(state.searchQuery);

    // 2. Shelf tab filter
    let matchesShelf = true;
    if (state.currentShelf === 'reading')
      matchesShelf = book.status === 'reading';
    if (state.currentShelf === 'completed')
      matchesShelf = book.status === 'completed';
    if (state.currentShelf === 'want') matchesShelf = book.status === 'want';
    if (state.currentShelf === 'favorites') matchesShelf = book.favorite;

    // 3. Genre Filter dropdown
    let matchesGenre = true;
    if (state.genreFilter !== 'all')
      matchesGenre = book.genre === state.genreFilter;

    return matchesSearch && matchesShelf && matchesGenre;
  });

  DOM.shelfBookCount.textContent = `${filtered.length} book${filtered.length === 1 ? '' : 's'}`;
  DOM.bookGrid.innerHTML = '';

  if (filtered.length === 0) {
    renderEmptyStatePlaceholder();
    return;
  }

  filtered.forEach((book) => {
    // Container
    const cardContainer = document.createElement('div');
    cardContainer.className = 'book-card-container';
    cardContainer.dataset.bookId = book.id;

    // Inner 3D card
    const cardInner = document.createElement('div');
    cardInner.className = 'book-card';

    // Front: Cover Art & Simple details
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';

    // Favorite indicator badge
    if (book.favorite) {
      cardFront.innerHTML += `<div class="favorite-indicator-badge" title="Favorite">❤️</div>`;
    }

    // Status Indicator
    const statusLabels = {
      completed: 'Completed',
      reading: 'Reading',
      want: 'To Read',
    };
    const statusClasses = {
      completed: 'completed',
      reading: 'reading',
      want: 'want',
    };
    cardFront.innerHTML += `<div class="status-indicator-badge status-badge-${statusClasses[book.status]}">${statusLabels[book.status]}</div>`;

    // Cover Graphics wrapper
    const coverWrapper = document.createElement('div');
    coverWrapper.className = 'cover-image-wrapper';

    if (book.coverType === 'generate') {
      const colors = (book.coverColors || '#7c3a2b,#4a1d13').split(',');
      coverWrapper.innerHTML = `
        <div class="generative-cover" style="background: linear-gradient(135deg, ${colors[0]}, ${colors[1]});">
          <div class="cover-binding-spine"></div>
          <div class="cover-accent-line"></div>
          <div class="gen-cover-header">${book.genre}</div>
          <div class="gen-cover-body">
            <h3 class="gen-cover-title">${book.title}</h3>
            <p class="gen-cover-author">by ${book.author}</p>
          </div>
          <div class="gen-cover-footer">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" opacity="0.3">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        </div>
      `;
    } else {
      const coverUrl =
        book.coverType === 'url' ? book.coverUrl : book.coverBase64;
      const fallbackUrl =
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="150" viewBox="0 0 100 150"><rect width="100" height="150" fill="%232c1e1a"/><text x="50" y="75" font-family="Gaegu, cursive" font-size="10" fill="white" text-anchor="middle">No Cover</text></svg>';
      coverWrapper.innerHTML = `<img src="${coverUrl || fallbackUrl}" class="cover-image" alt="Cover for ${book.title}" onerror="this.src='${fallbackUrl}'">`;
    }

    cardFront.appendChild(coverWrapper);

    // Front details footer
    const infoStrip = document.createElement('div');
    infoStrip.className = 'card-info-strip';

    // Draw rating stars
    let starsHtml = '';
    if (book.status === 'completed') {
      starsHtml = '<span class="rating-stars">';
      for (let i = 1; i <= 5; i++) {
        starsHtml += i <= book.rating ? '★' : '☆';
      }
      starsHtml += '</span>';
    }

    infoStrip.innerHTML = `
      <h3 class="card-title-text" title="${book.title}">${book.title}</h3>
      <p class="card-author-text">${book.author}</p>
      <div class="card-meta-row">
        <span class="genre-tag-pill">${book.genre}</span>
        ${starsHtml}
      </div>
    `;
    cardFront.appendChild(infoStrip);
    cardInner.appendChild(cardFront);

    // --- Back: Detailed Reviews and notes ---
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';

    let dateBlock = '';
    if (book.dateStarted || book.dateFinished) {
      dateBlock = `
        <div class="back-meta-list">
          ${book.dateStarted ? `<div class="back-meta-item"><span class="back-meta-label">Started:</span> <span>${formatDate(book.dateStarted)}</span></div>` : ''}
          ${book.dateFinished ? `<div class="back-meta-item"><span class="back-meta-label">Finished:</span> <span>${formatDate(book.dateFinished)}</span></div>` : ''}
        </div>
      `;
    }

    // Build Back HTML structure
    cardBack.innerHTML = `
      <div class="back-header">
        <h3 title="${book.title}">${book.title}</h3>
        <p class="back-author">by ${book.author}</p>
      </div>
      
      ${dateBlock}

      <div class="back-review-notes">
        ${book.review ? book.review : 'No review notes written yet. Click edit to pour your thoughts! ✍️'}
      </div>

      <div class="back-actions">
        <button class="btn-card-action btn-card-edit" data-action="edit">Edit Details</button>
        <button class="btn-card-action btn-card-share" data-action="share">Share 💌</button>
      </div>
    `;
    cardInner.appendChild(cardBack);
    cardContainer.appendChild(cardInner);

    // Card Flipping Trigger logic
    cardContainer.addEventListener('click', (e) => {
      // Prevent flipping if click originates from action buttons
      if (e.target.closest('.btn-card-action')) {
        const action = e.target.dataset.action;
        if (action === 'edit') triggerEditBook(book.id);
        if (action === 'share') triggerShareBook(book.id);
        return;
      }

      // Play page turn synthesizer sound
      playSound('flip');
      cardContainer.classList.toggle('flipped');
    });

    DOM.bookGrid.appendChild(cardContainer);
  });
}

function renderEmptyStatePlaceholder() {
  DOM.bookGrid.innerHTML = `
    <div class="empty-state">
      <svg class="empty-book-art" viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5">
        <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
        <circle cx="12" cy="10" r="3" />
        <path d="M12 13v4" />
      </svg>
      <h3>No books found here</h3>
      <p>Log a new book, try searching for something else, or switch shelves.</p>
    </div>
  `;
}

// Format date helper
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// --- BOOK EDIT / LOG FORM TRIGGERS ---
function resetBookForm() {
  DOM.bookForm.reset();
  DOM.editBookId.value = '';
  state.activeRatingInput = 0;
  DOM.bookRating.value = '0';
  highlightStars(0);

  // Set default tabs
  state.coverMode = 'generate';
  DOM.coverModeTabs.forEach((t) => t.classList.remove('active'));
  DOM.coverModeTabs[0].classList.add('active');

  DOM.coverPanelGenerate.classList.remove('hidden');
  DOM.coverPanelUrl.classList.add('hidden');
  DOM.coverPanelUpload.classList.add('hidden');

  DOM.paletteSwatches.forEach((s) => s.classList.remove('active'));
  DOM.paletteSwatches[0].classList.add('active');
  DOM.generativeCoverColors.value = DOM.paletteSwatches[0].dataset.color;
}

function highlightStars(count) {
  DOM.starRatingInput.querySelectorAll('.modal-star').forEach((star) => {
    const val = parseInt(star.dataset.value);
    if (val <= count) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
}

function triggerEditBook(bookId) {
  const book = state.books.find((b) => b.id === bookId);
  if (!book) return;

  playSound('flip');
  resetBookForm();

  DOM.bookModalTitle.textContent = 'Edit Book Details';
  DOM.btnDeleteBook.classList.remove('hidden');
  DOM.editBookId.value = book.id;

  DOM.bookTitle.value = book.title;
  DOM.bookAuthor.value = book.author;
  DOM.bookGenre.value = book.genre;
  DOM.bookStatus.value = book.status;

  state.activeRatingInput = book.rating;
  DOM.bookRating.value = book.rating;
  highlightStars(book.rating);

  DOM.bookFavorite.checked = !!book.favorite;
  DOM.bookDateStarted.value = book.dateStarted || '';
  DOM.bookDateFinished.value = book.dateFinished || '';
  DOM.bookReview.value = book.review || '';

  // Setup Cover art fields
  state.coverMode = book.coverType || 'generate';
  DOM.coverModeTabs.forEach((t) => {
    t.classList.remove('active');
    if (t.dataset.coverMode === state.coverMode) t.classList.add('active');
  });

  DOM.coverPanelGenerate.classList.add('hidden');
  DOM.coverPanelUrl.classList.add('hidden');
  DOM.coverPanelUpload.classList.add('hidden');

  if (state.coverMode === 'generate') {
    DOM.coverPanelGenerate.classList.remove('hidden');
    DOM.generativeCoverColors.value = book.coverColors || '#7c3a2b,#4a1d13';

    DOM.paletteSwatches.forEach((s) => {
      s.classList.remove('active');
      if (s.dataset.color === book.coverColors) s.classList.add('active');
    });
  } else if (state.coverMode === 'url') {
    DOM.coverPanelUrl.classList.remove('hidden');
    DOM.bookCoverUrl.value = book.coverUrl || '';
  } else if (state.coverMode === 'upload') {
    DOM.coverPanelUpload.classList.remove('hidden');
    // Cannot fill file input due to browser security, but cache base64
  }

  openModal(DOM.bookModal);
}

// Submit log save
function saveBookFormHandler() {
  const title = DOM.bookTitle.value.trim();
  const author = DOM.bookAuthor.value.trim();
  const genre = DOM.bookGenre.value;
  const status = DOM.bookStatus.value;
  const rating = parseInt(DOM.bookRating.value) || 0;
  const favorite = DOM.bookFavorite.checked;
  const dateStarted = DOM.bookDateStarted.value;
  const dateFinished = DOM.bookDateFinished.value;
  const review = DOM.bookReview.value.trim();
  const editId = DOM.editBookId.value;

  const saveAction = () => {
    const isNew = !editId;
    const bookId = editId || `book-${Date.now()}`;

    const newBook = {
      id: bookId,
      title,
      author,
      genre,
      status,
      rating: status === 'completed' ? rating : 0, // Wipe rating if not completed
      favorite,
      dateStarted,
      dateFinished,
      review,
      coverType: state.coverMode,
      coverColors: DOM.generativeCoverColors.value,
    };

    if (state.coverMode === 'url') {
      newBook.coverUrl = DOM.bookCoverUrl.value.trim();
    }

    const commitAndClose = (base64Data = null) => {
      if (base64Data) {
        newBook.coverBase64 = base64Data;
      } else if (!isNew && state.coverMode === 'upload') {
        // Retain existing base64 image if editing and no new file was chosen
        const oldBook = state.books.find((b) => b.id === editId);
        if (oldBook) newBook.coverBase64 = oldBook.coverBase64;
      }

      if (isNew) {
        state.books.push(newBook);
      } else {
        const idx = state.books.findIndex((b) => b.id === editId);
        if (idx !== -1) state.books[idx] = newBook;
      }

      saveBooks();
      closeModal(DOM.bookModal);
      playSound('chime');
      showToast(
        isNew
          ? `📚 "${title}" added to shelf!`
          : `✏️ "${title}" updated successfully!`
      );
      renderApp();
    };

    // If uploading cover, read file to base64
    if (state.coverMode === 'upload' && DOM.bookCoverFile.files.length > 0) {
      const file = DOM.bookCoverFile.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        commitAndClose(e.target.result);
      };
      reader.onerror = () => {
        showToast('⚠️ Failed to parse uploaded cover image.');
        commitAndClose();
      };
      reader.readAsDataURL(file);
    } else {
      commitAndClose();
    }
  };

  saveAction();
}

// --- MOCK FRIENDS PANEL CORNER ---
function renderFriendsPanel() {
  DOM.friendsAvatarsList.innerHTML = '';

  state.friends.forEach((friend) => {
    const avatar = document.createElement('div');
    avatar.className = 'friend-avatar';
    avatar.style.backgroundColor = friend.color;
    avatar.textContent = friend.initials;
    avatar.title = friend.name;

    avatar.addEventListener('click', () => {
      playSound('flip');
      // Set share filter helper
      openShareModal(friend.id);
    });

    DOM.friendsAvatarsList.appendChild(avatar);
  });
}

// --- SOCIAL FEED TIMELINE CORNER ---
function renderSocialFeed() {
  DOM.recommendationFeed.innerHTML = '';

  state.feed.forEach((item) => {
    const feedItem = document.createElement('div');
    feedItem.className = 'feed-item';

    // Find friend profile
    const friend = state.friends.find((f) => f.id === item.friendId);
    const initials = friend ? friend.initials : 'ME';
    const avatarColor = friend ? friend.color : 'var(--primary-accent)';

    // Cover art preview styling
    let coverSnippetHtml = '';
    if (item.bookTitle) {
      const colors = (item.coverColors || '#7c3a2b,#4a1d13').split(',');
      coverSnippetHtml = `
        <div class="feed-book-card-snippet">
          <div class="feed-snippet-cover" style="background: linear-gradient(135deg, ${colors[0]}, ${colors[1]}); border-left: 2px solid rgba(0,0,0,0.2);"></div>
          <div class="feed-snippet-details">
            <span class="feed-snippet-title">${item.bookTitle}</span>
            <span class="feed-snippet-author">by ${item.bookAuthor}</span>
          </div>
        </div>
      `;
    }

    feedItem.innerHTML = `
      <div class="feed-avatar" style="background-color: ${avatarColor};">${initials}</div>
      <div class="feed-content">
        <div class="feed-sender">${item.sender} <span>${item.action}</span></div>
        <div class="feed-message">"${item.message}"</div>
        ${coverSnippetHtml}
        <div class="feed-timestamp">${item.timestamp}</div>
      </div>
    `;

    DOM.recommendationFeed.appendChild(feedItem);
  });

  // Autoscroll feed to top
  DOM.recommendationFeed.scrollTop = 0;
}

// --- WRITE RECOMMENDATION LETTER MODAL CORNER ---
function openShareModal(preselectFriendId = null) {
  // Pre-fill books dropdown
  DOM.shareSelectBook.innerHTML = '';
  if (state.books.length === 0) {
    showToast(
      '⚠️ Log some books on your shelves before sharing recommendations!'
    );
    return;
  }

  state.books.forEach((b) => {
    const opt = document.createElement('option');
    opt.value = b.id;
    opt.textContent = `${b.title} by ${b.author}`;
    DOM.shareSelectBook.appendChild(opt);
  });

  // Pre-fill friends dropdown
  DOM.shareSelectFriend.innerHTML = '';
  state.friends.forEach((f) => {
    const opt = document.createElement('option');
    opt.value = f.id;
    opt.textContent = f.name;
    if (preselectFriendId === f.id) opt.selected = true;
    DOM.shareSelectFriend.appendChild(opt);
  });

  DOM.shareMessage.value =
    'Hey! I was just reading this and immediately thought of you. I think you will love the narrative depth and characters!';
  updateLetterPreview();

  openModal(DOM.shareModal);
}

function triggerShareBook(bookId) {
  openShareModal();
  DOM.shareSelectBook.value = bookId;
  updateLetterPreview();
}

function updateLetterPreview() {
  const bookId = DOM.shareSelectBook.value;
  const friendId = DOM.shareSelectFriend.value;
  const msg = DOM.shareMessage.value.trim();

  const book = state.books.find((b) => b.id === bookId);
  const friend = state.friends.find((f) => f.id === friendId);

  if (!book || !friend) {
    DOM.recommendationCardPreview.textContent = 'Drafting details...';
    return;
  }

  const colors = (book.coverColors || '#7c3a2b,#4a1d13').split(',');

  // Clear existing preview safely
  DOM.recommendationCardPreview.replaceChildren();

  // Main box
  const previewBox = document.createElement('div');
  previewBox.className = 'preview-letter-box';

  // Stamp
  const stamp = document.createElement('div');
  stamp.className = 'preview-stamp';
  stamp.textContent = '📖';

  // Header
  const header = document.createElement('div');
  header.className = 'preview-letter-header';
  header.textContent = `Dearest ${friend.name.split(' ')[0]},`;

  // Body
  const body = document.createElement('div');
  body.className = 'preview-letter-body';
  body.textContent = `"${msg || '...'}"`;

  // Book section
  const bookSection = document.createElement('div');
  bookSection.className = 'preview-letter-book';

  // Cover
  const cover = document.createElement('div');
  cover.className = 'preview-book-cover';
  cover.style.background = `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`;
  cover.style.borderLeft = '3px solid rgba(0,0,0,0.3)';

  // Details
  const details = document.createElement('div');
  details.className = 'preview-book-details';

  const title = document.createElement('h4');
  title.textContent = book.title;

  const author = document.createElement('p');
  author.textContent = `by ${book.author}`;

  details.appendChild(title);
  details.appendChild(author);

  bookSection.appendChild(cover);
  bookSection.appendChild(details);

  previewBox.appendChild(stamp);
  previewBox.appendChild(header);
  previewBox.appendChild(body);
  previewBox.appendChild(bookSection);

  DOM.recommendationCardPreview.appendChild(previewBox);
}

// Submit recommendation letter
function submitRecommendationLetter() {
  const bookId = DOM.shareSelectBook.value;
  const friendId = DOM.shareSelectFriend.value;
  const message = DOM.shareMessage.value.trim();

  const book = state.books.find((b) => b.id === bookId);
  const friend = state.friends.find((f) => f.id === friendId);

  if (!book || !friend) return;

  // Add to feed as "You recommended"
  const newActivity = {
    id: `feed-${Date.now()}`,
    friendId: '', // Empty represents user
    sender: 'You',
    action: `recommended to ${friend.name}`,
    bookTitle: book.title,
    bookAuthor: book.author,
    message: message || 'You should check this book out!',
    timestamp: 'Just now',
    coverColors: book.coverColors,
  };

  state.feed.unshift(newActivity);
  saveFeed();
  closeModal(DOM.shareModal);
  playSound('chime');
  showToast(`💌 Recommendation sent to ${friend.name.split(' ')[0]}!`);
  renderSocialFeed();

  // Queue an interactive reply response!
  queueFriendSocialReply(friend, book);
}

// --- DELAYED FRIEND REPLY SYSTEM CORNER ---
function queueFriendSocialReply(friend, book) {
  // Select a cute mock response template depending on book details
  const replies = [
    `Thanks for recommending "${book.title}", I just added it to my want-to-read list! Let's discuss it next week!⭐️`,
    `Oh, I have actually been wanting to read "${book.title}"! Your note totally convinced me to order a copy. 📚❤️`,
    `Wow! "${book.title}" looks right up my alley. I am ordering it on my kindle right away! Thanks a bunch.`,
    `Aha, I read "${book.title}" last year! So glad you liked it too. Mrs. Elm's library has so many layers! 🌟`,
  ];

  const randomReply = replies[Math.floor(Math.random() * replies.length)];

  setTimeout(() => {
    // Generate new feed activity from friend
    const replyActivity = {
      id: `feed-reply-${Date.now()}`,
      friendId: friend.id,
      sender: friend.name,
      action: 'replied',
      bookTitle: '', // Friend reply is plain text
      bookAuthor: '',
      message: randomReply,
      timestamp: 'Just now',
      coverColors: '',
    };

    state.feed.unshift(replyActivity);
    saveFeed();
    renderSocialFeed();

    // Play social incoming audio chimes
    playSound('chime');
    showToast(
      `💬 Message from ${friend.name.split(' ')[0]}: "${randomReply.substring(0, 40)}..."`
    );
  }, 6000); // 6 seconds delay
}

// Handle clicking avatar to get status text
function setupMockInteractionListener() {
  // Just standard listener handles
}

// --- MODAL AND TOAST SYSTEM HELPERS ---
function openModal(modalEl) {
  modalEl.classList.add('active');
}

function closeModal(modalEl) {
  modalEl.classList.remove('active');
}

// Toast notification injector
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';

  // Decide icon
  let icon = '✨';

  if (message.includes('🎯')) icon = '🎯';
  if (message.includes('📚')) icon = '📚';
  if (message.includes('✏️')) icon = '✏️';
  if (message.includes('🗑️')) icon = '🗑️';
  if (message.includes('💌')) icon = '💌';
  if (message.includes('💬')) icon = '💬';
  if (message.includes('⚠️')) icon = '⚠️';

  // Clear safely
  toast.replaceChildren();

  const iconSpan = document.createElement('span');
  iconSpan.className = 'toast-icon';
  iconSpan.textContent = icon;

  const messageSpan = document.createElement('span');
  messageSpan.className = 'toast-message';
  messageSpan.textContent = message.replace(/[🎯📚✏️🗑️💌💬⚠️]/g, '').trim();

  toast.appendChild(iconSpan);
  toast.appendChild(messageSpan);

  DOM.toastContainer.appendChild(toast);

  // Animate
  setTimeout(() => {
    toast.classList.add('show');
  }, 50);

  // Remove
  setTimeout(() => {
    toast.classList.remove('show');

    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4000);
}
