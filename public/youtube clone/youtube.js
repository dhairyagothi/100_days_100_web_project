document.addEventListener('DOMContentLoaded', () => {

  /* ── Sidebar toggle ─────────────────────────────────────────── */
  const hamburgerMenu  = document.querySelector('.hamburger-menu');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-expanded');
    });
  }
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
      document.body.classList.remove('sidebar-expanded');
    });
  }

  /* ── Search suggestions dropdown ───────────────────────────── */
  const searchBar   = document.querySelector('.search-bar');
  const suggestions = document.querySelector('.search-suggestions');

  const allSuggestions = [
    'DSA', 'Data Structures', 'Algorithms', 'System Design',
    'JavaScript Projects', 'React Tutorial', 'Public Speaking',
    'Podcast Ideas', 'Math Basics', 'Coding Interviews',
  ];

  function renderSuggestions(query) {
    const q = query.trim().toLowerCase();
    const filtered = q === ''
      ? allSuggestions
      : allSuggestions.filter(s => s.toLowerCase().includes(q));

    suggestions.innerHTML = filtered.map(text => {
      let display = text;
      if (q) {
        const idx = text.toLowerCase().indexOf(q);
        if (idx !== -1) {
          display =
            text.slice(0, idx) +
            `<span class="suggestion-match">${text.slice(idx, idx + q.length)}</span>` +
            text.slice(idx + q.length);
        }
      }
      return `<div data-query="${text}">
        <img class="suggestion-icon" src="icons/search.svg" alt="">
        <span>${display}</span>
      </div>`;
    }).join('');

    suggestions.querySelectorAll('div').forEach(item => {
      item.addEventListener('mousedown', (e) => {
        e.preventDefault();
        searchBar.value = item.dataset.query;
        hideDropdown();
        searchBar.focus();
      });
    });
  }

  function showDropdown() {
    if (!searchBar || !suggestions) return;
    renderSuggestions(searchBar.value);
    suggestions.style.display = 'block';
  }
  function hideDropdown() {
    if (suggestions) suggestions.style.display = 'none';
  }

  if (searchBar && suggestions) {
    searchBar.addEventListener('focus', showDropdown);
    searchBar.addEventListener('input', () => {
      renderSuggestions(searchBar.value);
      suggestions.style.display = 'block';
    });
    searchBar.addEventListener('blur', () => setTimeout(hideDropdown, 150));
    searchBar.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { hideDropdown(); searchBar.blur(); }
      if (e.key === 'Enter')  { hideDropdown(); }
    });
  }

  /* ── Filter chips ───────────────────────────────────────────── */
  const filterBar   = document.getElementById('filterBar');
  const filterArrow = document.getElementById('filterArrow');

  document.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  if (filterArrow && filterBar) {
    filterArrow.addEventListener('click', () => {
      filterBar.scrollBy({ left: 200, behavior: 'smooth' });
    });
  }

  /* ── Video grid padding ────────────────────────────────────── */
  const videoGrid = document.querySelector('.video-grid');

  function syncVideoGridFillers() {
    if (!videoGrid) return;

    videoGrid.querySelectorAll('.video-grid-filler').forEach(filler => filler.remove());

    const visibleCards = Array.from(videoGrid.querySelectorAll('.video-preview:not(.video-grid-filler)'));
    if (visibleCards.length === 0) return;

    const columnCount = getComputedStyle(videoGrid)
      .gridTemplateColumns
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    if (columnCount <= 1) return;

    const remainder = visibleCards.length % columnCount;
    const fillerCount = remainder === 0 ? 0 : columnCount - remainder;

    for (let i = 0; i < fillerCount; i += 1) {
      const filler = visibleCards[0].cloneNode(true);
      filler.classList.add('video-grid-filler');
      filler.setAttribute('aria-hidden', 'true');
      filler.setAttribute('tabindex', '-1');

      const title = filler.querySelector('.video-title');
      const author = filler.querySelector('.video-author');
      const stats = filler.querySelector('.video-stats');
      if (title) title.textContent = 'More videos coming soon';
      if (author) author.textContent = ' ';
      if (stats) stats.textContent = ' ';

      videoGrid.appendChild(filler);
    }
  }

  let fillerFrame = null;
  function scheduleGridFillers() {
    if (fillerFrame) cancelAnimationFrame(fillerFrame);
    fillerFrame = requestAnimationFrame(() => {
      fillerFrame = null;
      syncVideoGridFillers();
    });
  }

  scheduleGridFillers();
  window.addEventListener('resize', scheduleGridFillers);
  window.addEventListener('load', scheduleGridFillers);
/* ── Sidebar navigation ─────────────────────────────────────── */
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('is-active'));
      link.classList.add('is-active');
    });
  });
});
