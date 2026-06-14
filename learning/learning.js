document.addEventListener('DOMContentLoaded', async () => {
  // Global states
  let registryData = null;
  let activeTopic = null;
  let allTopics = [];
  let quizData = {};
  const STORAGE_KEY = 'learningProgress';
  const BOOKMARKS_KEY = 'learningBookmarks';
  const STREAK_KEY = 'learningStreak';

  let bookmarks = [];

  function loadBookmarks() {
  const saved =
    localStorage.getItem(
      BOOKMARKS_KEY
    );

  bookmarks = saved
    ? JSON.parse(saved)
    : [];
}

function saveBookmarks() {
  localStorage.setItem(
    BOOKMARKS_KEY,
    JSON.stringify(bookmarks)
  );
}

function renderBookmarks() {

  const list =
    document.getElementById(
      'bookmarksList'
    );

  if (!list) return;

  if (!bookmarks.length) {

    list.innerHTML = `
      <li class="empty-bookmark">
        No bookmarks yet
      </li>
    `;

    return;
  }

  list.innerHTML = bookmarks
    .map(
      topic => `
        <li>
          <a href="#${topic.categoryId}/${topic.id}">
            ⭐ ${topic.title}
          </a>
        </li>
      `
    )
    .join('');
}

function toggleBookmark(topic) {

  const key =
    `${topic.categoryId}-${topic.id}`;

  const index =
    bookmarks.findIndex(
      item =>
        `${item.categoryId}-${item.id}`
        === key
    );

  if (index > -1) {
    bookmarks.splice(index, 1);
  } else {
    bookmarks.push({
      id: topic.id,
      categoryId: topic.categoryId,
      title: topic.title
    });
  }

  saveBookmarks();

  renderBookmarks();
}

  let learningProgress = {
    lastTopic: null,
    completedTopics: [],
  };
  const sidebarTree = document.getElementById('sidebarTree');
  const contentViewport = document.getElementById('contentViewport');
  const prevTopicBtn = document.getElementById('prevTopic');
  const nextTopicBtn = document.getElementById('nextTopic');
  const prevTopicTitle = document.getElementById('prevTopicTitle');
  const nextTopicTitle = document.getElementById('nextTopicTitle');
  const topicSearch = document.getElementById('topicSearch');
  const clearSearch = document.getElementById('clearSearch');
  const searchResultsInfo = document.getElementById('searchResultsInfo');
  const menuToggle = document.getElementById('menuToggle');
  const navButtons = document.getElementById('navButtons');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const learningSidebar = document.getElementById('learningSidebar');

  /* ============================================================
     THEME STORAGE & SYNC
     ============================================================ */
  function initTheme() {
    window.ThemeManager?.init?.();
  }

  /* ============================================================
     MOBILE NAV MENU & SIDEBAR DRAWER TOGGLES
     ============================================================ */
  function initMobileMenu() {
    if (menuToggle && navButtons) {
      if (menuToggle.dataset.mobileNavBound !== 'true') {
        menuToggle.dataset.mobileNavBound = 'true';

        const closeMenu = () => {
          menuToggle.classList.remove('active');
          navButtons.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        };

        const openMenu = () => {
          menuToggle.classList.add('active');
          navButtons.classList.add('active');
          menuToggle.setAttribute('aria-expanded', 'true');
          const firstLink = navButtons.querySelector('a, button');
          firstLink?.focus({ preventScroll: true });
        };

        menuToggle.addEventListener('click', (e) => {
          e.stopPropagation();
          if (navButtons.classList.contains('active')) {
            closeMenu();
          } else {
            openMenu();
          }
        });

        document.addEventListener('click', (e) => {
          if (
            !navButtons.contains(e.target) &&
            !menuToggle.contains(e.target)
          ) {
            closeMenu();
          }
        });

        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && navButtons.classList.contains('active')) {
            closeMenu();
            menuToggle.focus({ preventScroll: true });
          }
        });

        navButtons.addEventListener('click', (e) => {
          if (
            e.target.closest('.btn') ||
            e.target.closest('a') ||
            e.target.closest('button')
          ) {
            closeMenu();
          }
        });
      }
    }

    if (sidebarToggle && learningSidebar) {
      sidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        learningSidebar.classList.toggle('active');
        const icon = sidebarToggle.querySelector('i');
        if (icon) {
          if (learningSidebar.classList.contains('active')) {
            icon.className = 'fas fa-chevron-left';
            sidebarToggle.style.left = '260px';
          } else {
            icon.className = 'fas fa-chevron-right';
            sidebarToggle.style.left = '1.5rem';
          }
        }
      });

      document.addEventListener('click', (e) => {
        if (
          window.innerWidth <= 992 &&
          !learningSidebar.contains(e.target) &&
          !sidebarToggle.contains(e.target)
        ) {
          learningSidebar.classList.remove('active');
          const icon = sidebarToggle.querySelector('i');
          if (icon) icon.className = 'fas fa-chevron-right';
        }
      });
    }
  }

  /* ============================================================
     CURRICULUM INDEX / REGISTRY LOADER
     ============================================================ */
  async function loadQuizData() {
    try {
      const response = await fetch('quizzes.json');
      if (!response.ok) {
        throw new Error('Quiz data not found');
      }
      quizData = await response.json();
    } catch (error) {
      console.error('Failed to load quiz data:', error);
    }
  }

  function loadProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      learningProgress = JSON.parse(saved);
    }
  }

  function saveProgress() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(learningProgress));
  }
  function updateLearningStreak() {

  const today =
    new Date()
      .toISOString()
      .split('T')[0];

  let streak =
    JSON.parse(
      localStorage.getItem(
        STREAK_KEY
      )
    ) || {
      current: 0,
      best: 0,
      lastVisit: null
    };

  if (streak.lastVisit === today) {
    return streak;
  }

  const yesterday =
    new Date(
      Date.now() -
      86400000
    )
      .toISOString()
      .split('T')[0];

  if (
    streak.lastVisit === yesterday
  ) {
    streak.current++;
  } else {
    streak.current = 1;
  }

  streak.best = Math.max(
    streak.best,
    streak.current
  );

  streak.lastVisit = today;

  localStorage.setItem(
    STREAK_KEY,
    JSON.stringify(streak)
  );

  return streak;
}

function renderStreak() {

  const streak =
    updateLearningStreak();

  const current =
    document.getElementById(
      'currentStreakCount'
    );

  if (current) {
    current.textContent =
      streak.current;
  }
}

  function markTopicCompleted(topicId) {
    if (!learningProgress.completedTopics.includes(topicId)) {
      learningProgress.completedTopics.push(topicId);
      saveProgress();
    }
    updateProgressUI();
  }

  function updateProgressUI() {
    const total = allTopics.filter((t) => t.id !== 'quiz').length;
    const completed = learningProgress.completedTopics.length;
    const percentage = total ? Math.round((completed / total) * 100) : 0;

    const completedTopicsCount =
  document.getElementById(
    'completedTopicsCount'
  );

const totalTopicsCount =
  document.getElementById(
    'totalTopicsCount'
  );

const progressPercentageCard =
  document.getElementById(
    'progressPercentageCard'
  );

if (completedTopicsCount) {
  completedTopicsCount.textContent =
    completed;
}

if (totalTopicsCount) {
  totalTopicsCount.textContent =
    total;
}

if (progressPercentageCard) {
  progressPercentageCard.textContent =
    percentage + '%';
}

    const fill = document.getElementById('overallProgressFill');
    const text = document.getElementById('overallProgressText');

    if (fill) fill.style.width = percentage + '%';
    if (text) text.textContent = percentage + '%';

    updateRecommendedTopic();

    document.querySelectorAll('.topic-item').forEach((item) => {
      const id = item.id.replace('item-', '');
      if (learningProgress.completedTopics.includes(id)) {
        item.classList.add('completed');
      }
    });
  }

  function updateRecommendedTopic() {

  const title =
    document.getElementById(
      'recommendedTopicTitle'
    );

  const desc =
    document.getElementById(
      'recommendedTopicDescription'
    );

  const btn =
    document.getElementById(
      'recommendedTopicBtn'
    );

  if (
    !title ||
    !desc ||
    !btn
  ) {
    return;
  }

  const nextTopic =
    allTopics.find(
      topic =>
        !learningProgress.completedTopics.includes(
          `${topic.categoryId}-${topic.id}`
        ) &&
        topic.id !== 'quiz'
    );

  if (!nextTopic) {

    title.textContent =
      'Course Completed 🎉';

    desc.textContent =
      'You have completed all available topics.';

    btn.style.display =
      'none';

    return;
  }

  title.textContent =
    nextTopic.title;

  desc.textContent =
    `Next lesson in ${nextTopic.categoryTitle}`;

  btn.href =
    `#${nextTopic.categoryId}/${nextTopic.id}`;
}

  async function loadRegistry() {
    try {
      const response = await fetch('registry.json');
      if (!response.ok) throw new Error('Failed to load curriculum registry');
      registryData = await response.json();

      allTopics = [];
      registryData.categories.forEach((cat) => {
        cat.topics.forEach((topic) => {
          allTopics.push({
            ...topic,
            categoryId: cat.id,
            categoryTitle: cat.title,
          });
        });
      });

      renderSidebar();
updateRecommendedTopic();
handleRouting();
    } catch (err) {
      console.error(err);
    }
  }

  /* ============================================================
     SIDEBAR RENDERER
     ============================================================ */
  function renderSidebar() {
    if (!sidebarTree || !registryData) return;

    sidebarTree.innerHTML = '';
    const fragment = document.createDocumentFragment();

    registryData.categories.forEach((cat) => {
      const catGroup = document.createElement('div');
      catGroup.className = 'category-group';
      catGroup.id = `cat-${cat.id}`;

      const header = document.createElement('button');
      header.className = 'category-header';
      header.setAttribute('aria-expanded', 'true');
      header.innerHTML = `
        <span class="category-title">
          <i class="${cat.icon || 'fa-solid fa-folder'}"></i>
          <span>${cat.title}</span>
        </span>
        <i class="fas fa-chevron-down category-arrow"></i>
      `;

      const list = document.createElement('ul');
      list.className = 'topic-list';

      cat.topics.forEach((topic) => {
        const item = document.createElement('li');
        item.className = 'topic-item';
        item.id = `item-${cat.id}-${topic.id}`;

const row =
  document.createElement('div');

row.className =
  'topic-row';

const link =
  document.createElement('a');

link.href =
  `#${cat.id}/${topic.id}`;

link.textContent =
  topic.title;

const star =
  document.createElement('button');

star.className =
  'sidebar-bookmark-btn';

const bookmarked =
  bookmarks.some(
    b =>
      b.id === topic.id &&
      b.categoryId === cat.id
  );

star.innerHTML = bookmarked
  ? '⭐'
  : '☆';

star.addEventListener(
  'click',
  (e) => {

    e.preventDefault();

    e.stopPropagation();

    toggleBookmark({
      id: topic.id,
      title: topic.title,
      categoryId: cat.id
    });

    star.innerHTML =
      bookmarks.some(
        b =>
          b.id === topic.id &&
          b.categoryId === cat.id
      )
        ? '⭐'
        : '☆';

    renderBookmarks();
  }
);

row.appendChild(link);
row.appendChild(star);

item.appendChild(row);
list.appendChild(item);
      });

      header.addEventListener('click', () => {
        catGroup.classList.toggle('collapsed');
        const isCollapsed = catGroup.classList.contains('collapsed');
        header.setAttribute('aria-expanded', !isCollapsed);
      });

      catGroup.appendChild(header);
      catGroup.appendChild(list);
      fragment.appendChild(catGroup);
    });

    sidebarTree.appendChild(fragment);
  }

  /* ============================================================
     REAL-TIME TOPICS FILTER / SEARCH
     ============================================================ */
  if (topicSearch) {
    topicSearch.addEventListener('input', () => {
      const query = topicSearch.value.trim().toLowerCase();
      if (clearSearch) {
        clearSearch.style.display = query ? 'block' : 'none';
      }

      const categories = document.querySelectorAll('.category-group');
      let totalMatches = 0;

      categories.forEach((catGroup) => {
        const topics = catGroup.querySelectorAll('.topic-item');
        let visibleCount = 0;

        topics.forEach((item) => {
          const title = item.querySelector('a').textContent.toLowerCase();
          if (title.includes(query)) {
            item.style.display = '';
            visibleCount++;
            totalMatches++;
          } else {
            item.style.display = 'none';
          }
        });

        if (query) {
          if (visibleCount > 0) {
            catGroup.classList.remove('collapsed');
            catGroup.style.display = '';
          } else {
            catGroup.classList.add('collapsed');
            catGroup.style.display = 'none';
          }
        } else {
          catGroup.classList.remove('collapsed');
          catGroup.style.display = '';
        }
      });
      if (!query) {
          searchResultsInfo.textContent = 'Browse all topics';
        } else if (totalMatches === 0) {
           searchResultsInfo.textContent = 'No topics found';
         } else {
           searchResultsInfo.textContent =
    `${totalMatches} topic${totalMatches > 1 ? 's' : ''} found`;
          }
    });
  }

  if (clearSearch) {
    clearSearch.addEventListener('click', () => {
      topicSearch.value = '';
      topicSearch.dispatchEvent(new Event('input'));
      topicSearch.focus();
      searchResultsInfo.textContent =
      'Browse all topics';
    });
  }

  /* ============================================================
     ROUTING & DEEP LINK HASH HANDLER
     ============================================================ */
  function handleRouting() {
    const hash = window.location.hash.substring(1);
    if (!hash && allTopics.length > 0) {
      window.location.hash = `#${allTopics[0].categoryId}/${allTopics[0].id}`;
      return;
    }

    const [catId, topicId] = hash.split('/');
    const topic = allTopics.find(
      (t) => t.categoryId === catId && t.id === topicId
    );

    if (topic) {
      loadTopic(topic);
    } else if (allTopics.length > 0) {
      window.location.hash = `#${allTopics[0].categoryId}/${allTopics[0].id}`;
    }
  }

  window.addEventListener('hashchange', handleRouting);

  function getSkeletonMarkup() {
  return `
    <div class="skeleton-loader">

      <div class="skeleton-title"></div>

      <div class="skeleton-meta"></div>

      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line medium"></div>

      <br>

      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>

      <br>

      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line medium"></div>

      <br>

      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>

    </div>
  `;
}

  /* ============================================================
     MARKDOWN PARSING & POST-PROCESSING
     ============================================================ */
  async function loadTopic(topic) {
    activeTopic = topic;
    learningProgress.lastTopic = `${topic.categoryId}/${topic.id}`;
    saveProgress();

    // Highlight selected item in sidebar list immediately for both articles and quizzes
    document
      .querySelectorAll('.topic-item')
      .forEach((item) => item.classList.remove('active'));

    const activeItem = document.getElementById(
      `item-${topic.categoryId}-${topic.id}`
    );
    if (activeItem) {
      activeItem.classList.add('active');
      const parentGroup = activeItem.closest('.category-group');
      if (parentGroup) parentGroup.classList.remove('collapsed');
      activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Launch quiz view directly if selected
    if (topic.id === 'quiz') {
      launchQuiz(topic.categoryId, topic.title);
      return;
    }
   if (contentViewport) {
  contentViewport.innerHTML =
    getSkeletonMarkup();
   }

    try {
      const response = await fetch(topic.file);
      if (!response.ok) throw new Error('Markdown file not found');
      const markdownText = await response.text();

      marked.setOptions({
        gfm: true,
        breaks: true,
      });

      let htmlContent = marked.parse(markdownText);

      const parsedContainer = document.createElement('div');
      parsedContainer.className = 'rendered-markdown';
      parsedContainer.innerHTML = htmlContent;

      // Fix Bug 1: Track dynamic read-time calculations based on word content limits
      const firstH1 = parsedContainer.querySelector('h1');

      
      if (firstH1) {
        const wordCount = markdownText.trim().split(/\s+/).length;
        const readTime = Math.ceil(wordCount / 200);
        const metaDiv = document.createElement('div');
        metaDiv.className = 'topic-meta';
        metaDiv.innerHTML = `
          <span class="meta-badge">${topic.categoryTitle}</span>
          <span><i class="far fa-clock"></i> ${readTime} min read</span>
          <span><i class="fas fa-graduation-cap"></i> Beginner Friendly</span>
        `;
        firstH1.insertAdjacentElement('afterend', metaDiv);
      }
      

      const preElements = parsedContainer.querySelectorAll('pre');
      preElements.forEach((pre) => {
        const codeElement = pre.querySelector('code');
        if (!codeElement) return;

        const langClass = Array.from(codeElement.classList).find((c) =>
          c.startsWith('language-')
        );
        const langName = langClass ? langClass.replace('language-', '') : 'code';

        const wrapper = document.createElement('div');
        wrapper.className = 'code-block-wrapper';

        const header = document.createElement('div');
        header.className = 'code-block-header';
        header.innerHTML = `
          <span class="code-lang-label">${langName}</span>
          <button class="copy-code-btn" aria-label="Copy code block">
            <i class="far fa-copy"></i> Copy
          </button>
        `;

        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(header);
        wrapper.appendChild(pre);

        const copyBtn = header.querySelector('.copy-code-btn');
        copyBtn.addEventListener('click', async () => {
          const rawCode = codeElement.textContent;
          try {
            await navigator.clipboard.writeText(rawCode);
            copyBtn.innerHTML = `<i class="fas fa-check" style="color: #10b981;"></i> Copied!`;
            setTimeout(() => {
              copyBtn.innerHTML = `<i class="far fa-copy"></i> Copy`;
            }, 2000);
          } catch (err) {
            console.error('Failed to copy code', err);
          }
        });
      });

      if (firstH1) {

  const titleRow =
    document.createElement('div');

  titleRow.className =
    'topic-title-row';

  firstH1.parentNode.insertBefore(
    titleRow,
    firstH1
  );

  titleRow.appendChild(firstH1);

  const bookmarkBtn =
    document.createElement('button');

  bookmarkBtn.className =
    'bookmark-icon-btn';

  const exists =
    bookmarks.some(
      b =>
        b.id === topic.id &&
        b.categoryId === topic.categoryId
    );

  bookmarkBtn.innerHTML = exists
    ? '<i class="fas fa-star"></i>'
    : '<i class="far fa-star"></i>';

  if (exists) {
    bookmarkBtn.classList.add('active');
  }

  bookmarkBtn.addEventListener(
    'click',
    () => {

      toggleBookmark(topic);

      const bookmarked =
        bookmarks.some(
          b =>
            b.id === topic.id &&
            b.categoryId === topic.categoryId
        );

      bookmarkBtn.innerHTML =
        bookmarked
          ? '<i class="fas fa-star"></i>'
          : '<i class="far fa-star"></i>';

      bookmarkBtn.classList.toggle(
        'active',
        bookmarked
      );
    }
  );

  titleRow.appendChild(bookmarkBtn);
}

      const blockquotes = parsedContainer.querySelectorAll('blockquote');
      blockquotes.forEach((bq) => {
        const firstP = bq.querySelector('p');
        if (!firstP) return;

        const contentHTML = bq.innerHTML;
        const noteMatch = contentHTML.match(
          /^\[!(NOTE|TIP|WARNING|CAUTION|MISTAKE)\]\s*(<br>)?/i
        );

        if (noteMatch) {
          const type = noteMatch[1].toUpperCase();
          const cleanHTML = contentHTML.replace(
            /^\[!(NOTE|TIP|WARNING|CAUTION|MISTAKE)\]\s*(<br>)?/i,
            ''
          );

          let iconClass = 'fa-info-circle';
          let customTypeClass = 'callout-note';

          if (type === 'TIP') {
            iconClass = 'fa-lightbulb';
            customTypeClass = 'callout-tip';
          } else if (type === 'WARNING' || type === 'CAUTION') {
            iconClass = 'fa-exclamation-triangle';
            customTypeClass = 'callout-warning';
          } else if (type === 'MISTAKE') {
            iconClass = 'fa-times-circle';
            customTypeClass = 'callout-mistake';
          }

          const callout = document.createElement('div');
          callout.className = `callout ${customTypeClass}`;
          callout.innerHTML = `
            <div class="callout-icon"><i class="fas ${iconClass}"></i></div>
            <div class="callout-content">
              <strong>${type === 'MISTAKE' ? 'Common Mistake' : type}</strong>
              <div style="margin-top: 0.25rem;">${cleanHTML}</div>
            </div>
          `;
          bq.parentNode.replaceChild(callout, bq);
        }
      });

      const solutionHeaders = parsedContainer.querySelectorAll('h5');
      solutionHeaders.forEach((h5) => {
        if (
          h5.textContent.toLowerCase().includes('solution') ||
          h5.textContent.toLowerCase().includes('answer')
        ) {
          const accordion = document.createElement('div');
          accordion.className = 'collapsible-solution';

          const trigger = document.createElement('button');
          trigger.className = 'solution-trigger';
          trigger.innerHTML = `
            <span><i class="fas fa-key"></i> View Solution & Explanation</span>
            <i class="fas fa-chevron-down"></i>
          `;

          const content = document.createElement('div');
          content.className = 'solution-content';

          let sibling = h5.nextElementSibling;
          const siblingsToMove = [];
          while (
            sibling &&
            sibling.tagName !== 'H2' &&
            sibling.tagName !== 'H3' &&
            sibling.tagName !== 'H4' &&
            sibling.tagName !== 'H5'
          ) {
            siblingsToMove.push(sibling);
            sibling = sibling.nextElementSibling;
          }

          siblingsToMove.forEach((sib) => content.appendChild(sib));
          accordion.appendChild(trigger);
          accordion.appendChild(content);

          trigger.addEventListener('click', () => {
            accordion.classList.toggle('open');
          });

          h5.parentNode.replaceChild(accordion, h5);
        }
      });

      contentViewport.innerHTML = '';
      contentViewport.appendChild(parsedContainer);
      Prism.highlightAllUnder(parsedContainer);
      window.scrollTo({ top: 0, behavior: 'instant' });

      updateNavigationFooter();
      markTopicCompleted(`${topic.categoryId}-${topic.id}`);
    } catch (err) {
      console.error(err);
    }
  }

  /* ============================================================
     PREVIOUS / NEXT DYNAMIC NAVIGATOR
     ============================================================ */
  function updateNavigationFooter() {
    if (!activeTopic || !prevTopicBtn || !nextTopicBtn) return;

    const currentIndex = allTopics.findIndex(
      (t) => t.categoryId === activeTopic.categoryId && t.id === activeTopic.id
    );

    if (currentIndex > 0) {
      const prevTopic = allTopics[currentIndex - 1];
      prevTopicBtn.href = `#${prevTopic.categoryId}/${prevTopic.id}`;
      prevTopicBtn.classList.remove('disabled');
      if (prevTopicTitle) prevTopicTitle.textContent = prevTopic.title;
    } else {
      prevTopicBtn.classList.add('disabled');
      if (prevTopicTitle) prevTopicTitle.textContent = 'None';
    }

    if (currentIndex < allTopics.length - 1) {
      const nextTopic = allTopics[currentIndex + 1];
      nextTopicBtn.href = `#${nextTopic.categoryId}/${nextTopic.id}`;
      nextTopicBtn.classList.remove('disabled');
      if (nextTopicTitle) nextTopicTitle.textContent = nextTopic.title;
    } else {
      nextTopicBtn.classList.add('disabled');
      if (nextTopicTitle) nextTopicTitle.textContent = 'End of Course';
    }
  }

  /* ============================================================
     READING PROGRESS BAR SCROLL MONITOR
     ============================================================ */
  function initReadingProgress() {
    const readingProgress = document.getElementById('readingProgress');
    if (!readingProgress) return;

    window.addEventListener(
      'scroll',
      () => {
        const scrollTop = window.scrollY;
        const scrollHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        readingProgress.style.width = `${progress}%`;
      },
      { passive: true }
    );
  }

  /* ============================================================
     SCROLL TO TOP BUTTON SYSTEM
     ============================================================ */
  function initScrollBtn() {
    const btn = document.getElementById('scrollBtn');
    const ring = document.getElementById('ringFill');
    if (!btn) return;

    const circumference = 2 * Math.PI * 22;
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;

      btn.classList.toggle('show', scrollTop > 400);
      if (ring) {
        ring.style.strokeDashoffset = circumference * (1 - progress);
      }
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     PARTICLE CANVAS BACKGROUND
     ============================================================ */
  function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coarsePointer = window.matchMedia('(pointer: coarse)');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const palette = [220, 250, 280];

    let W = window.innerWidth;
    let H = window.innerHeight;
    let particles = [];
    let particleCount = 30;
    let maxDistance = 110;
    let maxDistanceSq = maxDistance * maxDistance;

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      particleCount = Math.min(60, Math.max(15, Math.round((W * H) / 35000)));
      if (coarsePointer.matches || reducedMotion.matches) {
        particleCount = 10;
      }
    }

    function createParticles() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 2 + 1,
          hue: palette[Math.floor(Math.random() * palette.length)],
          alpha: Math.random() * 0.35 + 0.15,
        });
      }
    }

    function update() {
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = W;
        else if (p.x > W) p.x = 0;

        if (p.y < 0) p.y = H;
        else if (p.y > H) p.y = 0;
      });
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      update();

      if (!coarsePointer.matches && !reducedMotion.matches) {
        for (let i = 0; i < particleCount; i++) {
          for (let j = i + 1; j < particleCount; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distSq = dx * dx + dy * dy;

            if (distSq < maxDistanceSq) {
              const dist = Math.sqrt(distSq);
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(59, 130, 246, ${(1 - dist / maxDistance) * 0.18})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
      }

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 72%, ${p.alpha})`;
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => {
      resize();
      createParticles();
    });

    resize();
    createParticles();
    draw();
  }

  // Start initialization sequence
  initTheme();
  initMobileMenu();
  initReadingProgress();
  initScrollBtn();
  initParticles();

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /* ============================================================
     QUIZ ENGINE — Strict Flexbox Alignment Row Layout
     ============================================================ */
  let persistentResultsLog = []; 

  function launchQuiz(categoryId, quizTitle, subQuestionsArray) {
    document.getElementById('topicNavigation').style.display = 'none';
    
    const activeQuizPool = quizData[categoryId];
    const sequenceList = subQuestionsArray || activeQuizPool;

    if (!sequenceList || sequenceList.length === 0) {
      contentViewport.innerHTML = `
        <div class="quiz-result-card">
          <h2>No Quiz Available</h2>
        </div>
      `;
      return;
    }

    if (!subQuestionsArray) {
      persistentResultsLog = activeQuizPool.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.answer,
        explanation: q.explanation || '',
        userAnswer: null,
        isCorrect: false,
        wasTestedThisRun: false
      }));
    } else {
      persistentResultsLog.forEach(item => {
        if (sequenceList.some(sq => sq.question === item.question)) {
          item.wasTestedThisRun = true;
        } else {
          item.wasTestedThisRun = false;
        }
      });
    }

    let currentQuestion = 0;
    renderQuestion();

    function renderQuestion() {
      const q = sequenceList[currentQuestion];

      contentViewport.innerHTML = `
        <div class="quiz-card">
          <h2>${quizTitle}</h2>
          <p>Question ${currentQuestion + 1} of ${sequenceList.length}</p>
          <div class="quiz-question">${q.question}</div>
          <div class="quiz-options">
            ${q.options
              .map(
                (option, index) => `
                  <label class="quiz-option">
                    <input type="radio" name="answer" value="${index}" />
                    <span>${escapeHtml(option)}</span>
                  </label>
                `
              )
              .join('')}
          </div>
          <button class="submit-answer-btn">Submit Answer</button>
          <div id="quizFeedback"></div>
        </div>
      `;

      document
        .querySelector('.submit-answer-btn')
        .addEventListener('click', submitAnswer);
    }

    function submitAnswer() {
      const selected = document.querySelector('input[name="answer"]:checked');
      if (!selected) {
        alert('Select an answer');
        return;
      }

      const selectedAnswer = Number(selected.value);
      const currentQ = sequenceList[currentQuestion];
      const isCorrect = selectedAnswer === currentQ.answer;
      const feedback = document.getElementById('quizFeedback');

      const matchingLogItem = persistentResultsLog.find(item => item.question === currentQ.question);
      if (matchingLogItem) {
        matchingLogItem.userAnswer = selectedAnswer;
        matchingLogItem.isCorrect = isCorrect;
      }

      if (isCorrect) {
        feedback.innerHTML = `<p class="quiz-correct">✅ Correct Answer</p>`;
      } else {
        feedback.innerHTML = `<p class="quiz-wrong">❌ Wrong Answer</p>`;
      }

      setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < sequenceList.length) {
          renderQuestion();
        } else {
          showResult();
        }
      }, 1200);
    }

    function showResult() {
      document.getElementById('topicNavigation').style.display = 'flex';
      
      const totalQuestions = persistentResultsLog.length;
      const correctAnswersCount = persistentResultsLog.filter(r => r.isCorrect).length;
      const wrongAnswersCount = totalQuestions - correctAnswersCount;
      const percentage = Math.round((correctAnswersCount / totalQuestions) * 100);

      let badge = '';
      if (percentage === 100) badge = '🏆 Perfect Score';
      else if (percentage >= 80) badge = '⭐ Excellent';
      else if (percentage >= 60) badge = '👍 Good Job';
      else if (percentage >= 40) badge = '📚 Keep Practicing';
      else badge = '💪 Try Again';

      const btnStyleBase = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        flex: 1 1 0px;
        min-width: 140px;
        height: 44px;
        margin: 0;
        padding: 0 12px;
        border: none;
        border-radius: 8px;
        color: #ffffff;
        font-weight: 600;
        font-size: 0.92rem;
        cursor: pointer;
        box-sizing: border-box;
        vertical-align: middle;
        transition: filter 0.15s ease;
      `;

      contentViewport.innerHTML = `
        <div class="quiz-result-card" style="text-align: center; padding: 2.5rem 2rem; width: 100%; max-width: 620px; margin: 0 auto; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.2);">
          <div class="quiz-badge" style="font-size: 1.35rem; font-weight: bold; margin-bottom: 1rem; color: #3b82f6; display: flex; align-items: center; justify-content: center; gap: 6px;">${badge}</div>
          <p style="color: rgba(255, 255, 255, 0.6); font-size: 0.95rem; margin-bottom: 0.5rem;">Quiz Completed 📑</p>
          <div class="quiz-score" style="font-size: 3rem; font-weight: 800; margin: 0.5rem 0 1.5rem 0; color: #fff; letter-spacing: -1px;">${correctAnswersCount}/${totalQuestions}</div>
          
          <div style="background: rgba(255,255,255,0.02); border-radius: 8px; padding: 1rem; margin-bottom: 2rem; display: inline-block; text-align: left; min-width: 220px; border: 1px solid rgba(255,255,255,0.04);">
            <p style="margin: 0.4rem 0; display: flex; justify-content: space-between; gap: 2rem;"><span>✅ Correct:</span> <strong style="color: #10b981;">${correctAnswersCount}</strong></p>
            <p style="margin: 0.4rem 0; display: flex; justify-content: space-between; gap: 2rem;"><span>❌ Wrong:</span> <strong style="color: #ef4444;">${wrongAnswersCount}</strong></p>
            <p style="margin: 0.4rem 0; display: flex; justify-content: space-between; gap: 2rem; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 0.4rem; margin-top: 0.4rem;"><span>📊 Score:</span> <strong style="color: #3b82f6;">${percentage}%</strong></p>
          </div>
          
          <div class="quiz-result-actions" style="display: flex; flex-direction: row; flex-wrap: nowrap; gap: 10px; justify-content: center; align-items: center; width: 100%; max-width: 560px; margin: 0 auto; box-sizing: border-box;">
            <button class="retake-btn" id="retakeQuiz" style="${btnStyleBase} background-color: #3b82f6;" onmouseover="this.style.filter='brightness(1.15)'" onmouseout="this.style.filter='none'"><i class="fas fa-sync-alt"></i> Retake Full</button>
            ${wrongAnswersCount > 0 ? `<button class="retake-wrong-btn" id="retakeWrong" style="${btnStyleBase} background-color: #ef4444;" onmouseover="this.style.filter='brightness(1.15)'" onmouseout="this.style.filter='none'"><i class="fas fa-times-circle"></i> Retake Wrong</button>` : ''}
            <button class="review-btn" id="reviewAnswers" style="${btnStyleBase} background-color: #10b981;" onmouseover="this.style.filter='brightness(1.15)'" onmouseout="this.style.filter='none'"><i class="fas fa-clipboard-list"></i> Review Answers</button>
          </div>
        </div>
      `;

      document
        .getElementById('retakeQuiz')
        .addEventListener('click', () => launchQuiz(categoryId, quizTitle));

      if (wrongAnswersCount > 0) {
        document.getElementById('retakeWrong').addEventListener('click', () => {
          const targetedWrongPool = activeQuizPool.filter(q => {
            const logged = persistentResultsLog.find(item => item.question === q.question);
            return logged ? !logged.isCorrect : true;
          });
          launchQuiz(categoryId, quizTitle, targetedWrongPool);
        });
      }

      document
        .getElementById('reviewAnswers')
        .addEventListener('click', () => showReview('all'));
    }

    function showReview(filter) {
      document.getElementById('topicNavigation').style.display = 'flex';

      const filtered =
        filter === 'correct'
          ? persistentResultsLog.filter((r) => r.isCorrect)
          : filter === 'wrong'
          ? persistentResultsLog.filter((r) => !r.isCorrect)
          : persistentResultsLog;

      const reviewCards = filtered
        .map((r, i) => {
          const optionsHtml = r.options
            .map((opt, idx) => {
              let style = 'padding: 0.75rem 1rem; margin: 0.5rem 0; border-radius: 6px; background: rgba(255,255,255,0.04); font-size: 0.95rem; border: 1px solid transparent;';
              if (idx === r.correctAnswer) {
                style = 'padding: 0.75rem 1rem; margin: 0.5rem 0; border-radius: 6px; background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; color: #10b981; font-weight: 600;';
              } else if (idx === r.userAnswer && !r.isCorrect) {
                style = 'padding: 0.75rem 1rem; margin: 0.5rem 0; border-radius: 6px; background: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444; color: #ef4444;';
              }
              return `<div class="review-option" style="${style}">${escapeHtml(opt)}</div>`;
            })
            .join('');

          return `
            <div class="review-card" style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 1.5rem; margin-bottom: 1.25rem; text-align: left;">
              <div class="review-card-header" style="display: flex; justify-content: space-between; margin-bottom: 0.75rem; font-size: 0.85rem; font-weight: bold; color: ${r.isCorrect ? '#10b981' : '#ef4444'}; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 0.5rem;">
                <span>Question #${i + 1}</span>
                <span>${r.isCorrect ? '✅ Correct' : '❌ Wrong'}</span>
              </div>
              <p class="review-question" style="font-weight: 600; margin-bottom: 1.25rem; font-size: 1.05rem; line-height: 1.4; color: #fff;">${r.question}</p>
              <div class="review-options">${optionsHtml}</div>
              ${
                r.explanation
                  ? `<div class="review-explanation" style="margin-top: 1.25rem; padding: 0.85rem 1rem; background: rgba(59, 130, 246, 0.08); border-left: 3px solid #3b82f6; border-radius: 0 6px 6px 0; font-size: 0.92rem; color: #93c5fd; line-height: 1.4;">
                      <i class="fas fa-lightbulb" style="margin-right: 0.5rem; color: #60a5fa;"></i><strong>Explanation:</strong> ${r.explanation}
                    </div>`
                  : ''
              }
            </div>
          `;
        })
        .join('');

      contentViewport.innerHTML = `
        <div class="review-screen" style="width: 100%; max-width: 700px; margin: 0 auto; padding: 1rem;">
          <div class="review-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 0.75rem;">
            <h2 style="margin: 0; font-size: 1.5rem;">📋 Answer Review</h2>
            <button class="back-to-result-btn" id="backToResult" style="padding: 0.5rem 1rem; border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; background: transparent; color: white; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">← Summary Result</button>
          </div>
          <div class="review-tabs" style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.75rem; justify-content: flex-start;">
            <button class="review-tab" data-filter="all" style="padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; background: ${filter === 'all' ? '#3b82f6' : 'rgba(255,255,255,0.05)'}; color: white; font-size: 0.9rem;">All (${persistentResultsLog.length})</button>
            <button class="review-tab" data-filter="correct" style="padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; background: ${filter === 'correct' ? '#10b981' : 'rgba(255,255,255,0.05)'}; color: white; font-size: 0.9rem;">Correct (${persistentResultsLog.filter((r) => r.isCorrect).length})</button>
            <button class="review-tab" data-filter="wrong" style="padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; font-weight: 600; background: ${filter === 'wrong' ? '#ef4444' : 'rgba(255,255,255,0.05)'}; color: white; font-size: 0.9rem;">Wrong (${persistentResultsLog.filter((r) => !r.isCorrect).length})</button>
          </div>
          <div class="review-cards">
            ${filtered.length > 0 ? reviewCards : '<p class="review-empty" style="text-align: center; color: rgba(255,255,255,0.4); margin: 3rem 0; font-size: 0.95rem;">No questions found in this view filter.</p>'}
          </div>
        </div>
      `;

      document.querySelectorAll('.review-tab').forEach((tab) => {
        tab.addEventListener('click', () => {
          showReview(tab.dataset.filter);
        });
      });

      document
        .getElementById('backToResult')
        .addEventListener('click', showResult);
    }
  }

loadProgress();
renderStreak();

loadBookmarks();

renderBookmarks();  

document
  .getElementById('continueLearningBtn')
  ?.addEventListener('click', () => {

    if (!learningProgress.lastTopic) {

      showToast?.(
        'Start a lesson to track progress'
      );

      return;
    }

    window.location.hash =
      '#' + learningProgress.lastTopic;
  });

  await loadQuizData();
  await loadRegistry();
  updateProgressUI();

  if (learningProgress.lastTopic && !window.location.hash) {
    window.location.hash = '#' + learningProgress.lastTopic;
  }
});