document.addEventListener('DOMContentLoaded', async () => {
  // Global states
  let registryData = null;
  let activeTopic = null;
  let allTopics = [];
  let quizData = {};
  const STORAGE_KEY = 'learningProgress';

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

      // Close sidebar drawer when clicking outside it on mobile
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

    const fill = document.getElementById('overallProgressFill');

    const text = document.getElementById('overallProgressText');

    if (fill) fill.style.width = percentage + '%';
    if (text) text.textContent = percentage + '%';

    document.querySelectorAll('.topic-item').forEach((item) => {
      const id = item.id.replace('item-', '');

      if (learningProgress.completedTopics.includes(id)) {
        item.classList.add('completed');
      }
    });
  }

  async function loadRegistry() {
    try {
      const response = await fetch('registry.json');
      if (!response.ok) throw new Error('Failed to load curriculum registry');
      registryData = await response.json();

      // Flatten topics list for simple sequential traversal
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
      handleRouting();
    } catch (err) {
      console.error(err);
      if (sidebarTree) {
        sidebarTree.innerHTML = `<div class="sidebar-loading" style="color: #ef4444;">Failed to load curriculum index.</div>`;
      }
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

        const link = document.createElement('a');
        link.href = `#${cat.id}/${topic.id}`;
        link.textContent = topic.title;

        // Mobile layout: dismiss sidebar drawer upon clicking a link
        link.addEventListener('click', () => {
          if (window.innerWidth <= 992 && learningSidebar) {
            learningSidebar.classList.remove('active');
            const icon = sidebarToggle.querySelector('i');
            if (icon) icon.className = 'fas fa-chevron-right';
          }
        });

        item.appendChild(link);
        list.appendChild(item);
      });

      // Sidebar category accordion toggle collapse state
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

      categories.forEach((catGroup) => {
        const topics = catGroup.querySelectorAll('.topic-item');
        let visibleCount = 0;

        topics.forEach((item) => {
          const title = item.querySelector('a').textContent.toLowerCase();
          if (title.includes(query)) {
            item.style.display = '';
            visibleCount++;
          } else {
            item.style.display = 'none';
          }
        });

        // Expand categories containing matching items automatically, collapse otherwise
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
    });
  }

  if (clearSearch) {
    clearSearch.addEventListener('click', () => {
      topicSearch.value = '';
      topicSearch.dispatchEvent(new Event('input'));
      topicSearch.focus();
    });
  }

  /* ============================================================
     ROUTING & DEEP LINK HASH HANDLER
     ============================================================ */
  function handleRouting() {
    const hash = window.location.hash.substring(1);
    if (!hash && allTopics.length > 0) {
      // Default route
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
      // Fallback
      window.location.hash = `#${allTopics[0].categoryId}/${allTopics[0].id}`;
    }
  }

  window.addEventListener('hashchange', handleRouting);

  /* ============================================================
     MARKDOWN PARSING & POST-PROCESSING
     ============================================================ */
  async function loadTopic(topic) {
    activeTopic = topic;
    learningProgress.lastTopic = `${topic.categoryId}/${topic.id}`;

    saveProgress();
    if (topic.id === 'quiz') {
      launchQuiz(topic.categoryId, topic.title);
      return;
    }
    // Highlight selected item in sidebar list
    document
      .querySelectorAll('.topic-item')
      .forEach((item) => item.classList.remove('active'));
    const activeItem = document.getElementById(
      `item-${topic.categoryId}-${topic.id}`
    );
    if (activeItem) {
      activeItem.classList.add('active');
      // Ensure category parent is expanded
      const parentGroup = activeItem.closest('.category-group');
      if (parentGroup) parentGroup.classList.remove('collapsed');
    }

    if (contentViewport) {
      contentViewport.innerHTML = `
        <div class="loading-article">
          <i class="fas fa-circle-notch fa-spin"></i>
          <p>Loading "${topic.title}"...</p>
        </div>
      `;
    }

    try {
      const response = await fetch(topic.file);
      if (!response.ok) throw new Error('Markdown file not found');
      const markdownText = await response.text();

      // Configure marked parser option (gfm enabled)
      marked.setOptions({
        gfm: true,
        breaks: true,
      });

      let htmlContent = marked.parse(markdownText);

      // Post-process HTML for custom styles (Alerts, Code Wrappers, Copy buttons, solution collapsible details)
      const parsedContainer = document.createElement('div');
      parsedContainer.className = 'rendered-markdown';
      parsedContainer.innerHTML = htmlContent;

      // 1. Add Category Meta Badge & Title layout
      const firstH1 = parsedContainer.querySelector('h1');
      if (firstH1) {
        const metaDiv = document.createElement('div');
        metaDiv.className = 'topic-meta';
        metaDiv.innerHTML = `
          <span class="meta-badge">${topic.categoryTitle}</span>
          <span><i class="far fa-clock"></i> 5 min read</span>
          <span><i class="fas fa-graduation-cap"></i> Beginner Friendly</span>
        `;
        firstH1.insertAdjacentElement('afterend', metaDiv);
      }

      // 2. Pre-code highlighting wrappers & Copy to clipboard buttons
      const preElements = parsedContainer.querySelectorAll('pre');
      preElements.forEach((pre) => {
        const codeElement = pre.querySelector('code');
        if (!codeElement) return;

        // Get language class
        const langClass = Array.from(codeElement.classList).find((c) =>
          c.startsWith('language-')
        );
        const langName = langClass
          ? langClass.replace('language-', '')
          : 'code';

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

        // Wrap pre
        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(header);
        wrapper.appendChild(pre);

        // Wire copy button functionality
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

      // 3. GitHub Alert box callouts parsing [!NOTE], [!TIP], [!WARNING], [!CAUTION], [!MISTAKE]
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

      // 4. solution collapsible block parsing
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

          // Gather all siblings until next major heading/block is found
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

      // Inject beautifully parsed content
      contentViewport.innerHTML = '';
      contentViewport.appendChild(parsedContainer);

      // Perform Prism.js highlighting
      Prism.highlightAllUnder(parsedContainer);

      // Reset viewport scroll to top snappily
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Update next/prev footer cards
      updateNavigationFooter();
      markTopicCompleted(`${topic.categoryId}-${topic.id}`);
    } catch (err) {
      console.error(err);
      if (contentViewport) {
        contentViewport.innerHTML = `
          <div class="loading-article" style="color: #ef4444;">
            <i class="fas fa-exclamation-triangle"></i>
            <p>Failed to load this topic. Please make sure the markdown file exists.</p>
          </div>
        `;
      }
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

    // Set Previous button state
    if (currentIndex > 0) {
      const prevTopic = allTopics[currentIndex - 1];
      prevTopicBtn.href = `#${prevTopic.categoryId}/${prevTopic.id}`;
      prevTopicBtn.classList.remove('disabled');
      if (prevTopicTitle) prevTopicTitle.textContent = prevTopic.title;
    } else {
      prevTopicBtn.classList.add('disabled');
      if (prevTopicTitle) prevTopicTitle.textContent = 'None';
    }

    // Set Next button state
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
        // Scroll limit
        const scrollHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const progress =
          scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
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
    const palette = [220, 250, 280]; // Hue values (Blues & Cyans)

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

      // Draw links
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

      // Draw particles
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
  function launchQuiz(categoryId, quizTitle) {
    document.getElementById('topicNavigation').style.display = 'none';
    const questions = quizData[categoryId];

    if (!questions || questions.length === 0) {
      contentViewport.innerHTML = `
      <div class="quiz-result-card">
        <h2>No Quiz Available</h2>
      </div>
    `;
      return;
    }

    let currentQuestion = 0;
    let score = 0;
    let correct = 0;
    let wrong = 0;

    renderQuestion();

    function renderQuestion() {
      const q = questions[currentQuestion];

      contentViewport.innerHTML = `
      <div class="quiz-card">

        <h2>${quizTitle}</h2>

        <p>
          Question ${currentQuestion + 1}
          of
          ${questions.length}
        </p>

        <div class="quiz-question">
          ${q.question}
        </div>

        <div class="quiz-options">

          ${q.options
            .map(
              (option, index) => `
               <label class="quiz-option">
  <input
    type="radio"
    name="answer"
    value="${index}"
  />
 <span>${escapeHtml(option)}</span>
</label>
              `
            )
            .join('')}

        </div>

        <button class="submit-answer-btn">
          Submit Answer
        </button>

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

      const feedback = document.getElementById('quizFeedback');

      if (selectedAnswer === questions[currentQuestion].answer) {
        score++;
        correct++;

        feedback.innerHTML = `
        <p class="quiz-correct">
          ✅ Correct Answer
        </p>
      `;
      } else {
        wrong++;

        feedback.innerHTML = `
        <p class="quiz-wrong">
          ❌ Wrong Answer
        </p>
      `;
      }

      setTimeout(() => {
        currentQuestion++;

        if (currentQuestion < questions.length) {
          renderQuestion();
        } else {
          showResult();
        }
      }, 1200);
    }

    function showResult() {
      document.getElementById('topicNavigation').style.display = 'flex';
      const percentage = Math.round((score / questions.length) * 100);

      contentViewport.innerHTML = `
      <div class="quiz-result-card">

        <h2>Quiz Completed 🎉</h2>

        <div class="quiz-score">
          ${score}/${questions.length}
        </div>

        <p>
          ✅ Correct Answers:
          ${correct}
        </p>

        <p>
          ❌ Wrong Answers:
          ${wrong}
        </p>

        <p>
          📊 Percentage:
          ${percentage}%
        </p>

        <button
          class="retake-btn"
          id="retakeQuiz"
        >
          Retake Quiz
        </button>

      </div>
    `;

      document
        .getElementById('retakeQuiz')
        .addEventListener('click', () => launchQuiz(categoryId, quizTitle));
    }
  }

  loadProgress();

  document
    .getElementById('continueLearningBtn')
    ?.addEventListener('click', () => {
      if (learningProgress.lastTopic) {
        window.location.hash = '#' + learningProgress.lastTopic;
      }
    });

  await loadQuizData();
  await loadRegistry();

  updateProgressUI();

  if (learningProgress.lastTopic && !window.location.hash) {
    window.location.hash = '#' + learningProgress.lastTopic;
  }
  
});
