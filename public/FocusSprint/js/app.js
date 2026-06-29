/* ════════════════════════════════════════════════════════════════════
   FocusSprint — App Controller
   Connects Timer + Storage + XP + Streaks + Achievements + Garden
   to existing DOM. Creates timer display elements dynamically.
   ════════════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ── DOM REFERENCES ────────────────────────────────────────────── */
  const sessionCard     = document.querySelector('.bento-session');
  const sessionNameIn   = document.getElementById('session-name');
  const durationPills   = document.querySelector('.duration-pills');
  const btnStartSession = document.getElementById('btn-start-session');
  const btnHeroStart    = document.getElementById('btn-start');
  const timelineWrap    = document.querySelector('.session-timeline');

  // Verify critical elements exist
  if (!sessionCard || !sessionNameIn || !btnStartSession || !timelineWrap) {
    console.error('[App] Missing critical DOM elements — aborting init.');
    return;
  }

  /* ── TIMER INSTANCE ────────────────────────────────────────────── */
  const timer = new FocusTimer();

  /* ── STATE ─────────────────────────────────────────────────────── */
  let cardState = 'idle';

  /* ══════════════════════════════════════════════════════════════════
     TIMER DISPLAY — created via DOM API (avoids touching HTML file)
     ══════════════════════════════════════════════════════════════════ */

  const timerDisplay = document.createElement('div');
  timerDisplay.id = 'timer-display';
  timerDisplay.style.display = 'none';

  timerDisplay.innerHTML = `
    <div id="timer-session-name"></div>
    <div id="timer-countdown">00:00</div>
    <div id="timer-progress-track">
      <div id="timer-progress-fill"></div>
    </div>
    <div id="timer-controls">
      <button id="btn-pause-resume" class="btn-primary btn-full"></button>
      <button id="btn-reset"></button>
    </div>
    <div id="timer-complete-msg" style="display:none;">
      <div id="complete-emoji">✅</div>
      <div id="complete-text">Session Complete!</div>
      <div id="complete-xp"></div>
    </div>
  `;

  const cardHeader = sessionCard.querySelector('.card-header');
  cardHeader.insertAdjacentElement('afterend', timerDisplay);

  const elTimerName      = document.getElementById('timer-session-name');
  const elCountdown      = document.getElementById('timer-countdown');
  const elProgressTrack  = document.getElementById('timer-progress-track');
  const elProgressFill   = document.getElementById('timer-progress-fill');
  const elControls       = document.getElementById('timer-controls');
  const btnPauseResume   = document.getElementById('btn-pause-resume');
  const btnReset         = document.getElementById('btn-reset');
  const elCompleteMsg    = document.getElementById('timer-complete-msg');
  const elCompleteXP     = document.getElementById('complete-xp');
  const elCompleteEmoji  = document.getElementById('complete-emoji');
  const elCompleteText   = document.getElementById('complete-text');

  const dom = {
    rankText: document.querySelector('.rank-text'),
    levelNumber: document.querySelector('.level-number'),
    ringFill: document.querySelector('.ring-fill'),
    heroXPCounter: document.querySelector('.xp-big-number .counter'),
    heroXPBar: document.querySelector('.xp-bar-fill'),
    xpToNext: document.querySelector('.xp-to-next'),
    nextRankName: document.querySelector('.next-rank-name'),
    xpLevelBig: document.querySelector('.xp-level-big .accent'),
    xpEarned: document.querySelector('.xp-earned'),
    xpNeeded: document.querySelector('.xp-needed'),
    xpProgressFill: document.querySelector('.xp-progress-fill'),
    xpGlow: document.querySelector('.xp-progress-glow'),
    milestoneWrap: document.querySelector('.xp-milestones'),
    analyticNumbers: document.querySelectorAll('.analytic-number'),
    analyticLabels: document.querySelectorAll('.analytic-label'),
    analyticsCard: document.querySelector('.bento-analytics'),
    analyticsRow: document.querySelector('.analytics-row'),
    streakCounter: document.querySelector('.streak-big-number .counter'),
    streakMeta: document.querySelector('.streak-meta span'),
    streakDays: document.querySelectorAll('.streak-bar .day'),
    heroStats: document.querySelectorAll('.char-stat-value'),
    achievementCount: document.querySelector('.bento-achievements .card-count'),
    achievementGrid: document.querySelector('.achievement-grid'),
    growthTimeline: document.querySelector('.growth-timeline'),
    gardenStatValues: document.querySelectorAll('.garden-stat-value'),
    gardenCurrentStage: document.querySelector('.garden-current-stage'),
    gardenSessionsLeft: document.querySelector('.garden-sessions-left'),
    gardenGrowthPoints: document.querySelector('.garden-growth-points'),
    gardenIllustration: document.querySelector('.garden-illustration'),
    gardenStageTitle: document.querySelector('.garden-stage-title'),
    gardenStageDescription: document.querySelector('.garden-stage-description'),
    gardenProgressPercent: document.querySelector('.garden-progress-percent'),
    gardenNextStage: document.querySelector('.garden-next-stage'),
    gardenProgressFill: document.querySelector('.garden-progress-fill'),
    gardenTip: document.querySelector('.garden-tip'),
    questProgressFill: document.querySelector('.quest-progress-fill'),
    questStatus: document.querySelector('.quest-status'),
    quickLevel: document.querySelector('.quick-level'),
    quickXP: document.querySelector('.quick-xp'),
    quickStreak: document.querySelector('.quick-streak'),
  };

  const idleEls = [sessionNameIn, durationPills, btnStartSession];

  applyTimerStyles();

  /* ══════════════════════════════════════════════════════════════════
     UI STATE MACHINE
     ══════════════════════════════════════════════════════════════════ */

  function setCardState(state) {
    cardState = state;

    switch (state) {
      case 'idle':
        timerDisplay.style.display = 'none';
        elCompleteMsg.style.display = 'none';
        elControls.style.display = '';
        idleEls.forEach((el) => (el.style.display = ''));
        btnStartSession.disabled = false;
        break;

      case 'running':
        idleEls.forEach((el) => (el.style.display = 'none'));
        timerDisplay.style.display = '';
        elCompleteMsg.style.display = 'none';
        elControls.style.display = '';
        btnPauseResume.textContent = 'Pause';
        btnPauseResume.setAttribute('aria-label', 'Pause focus session');
        btnPauseResume.style.background =
          'linear-gradient(135deg, var(--clr-accent-dim), var(--clr-accent))';
        break;

      case 'paused':
        btnPauseResume.textContent = 'Resume';
        btnPauseResume.setAttribute('aria-label', 'Resume focus session');
        btnPauseResume.style.background =
          'linear-gradient(135deg, var(--clr-green-dim), var(--clr-green))';
        break;

      case 'completed':
        elControls.style.display = 'none';
        elCompleteMsg.style.display = '';
        break;
    }
  }

  /* ══════════════════════════════════════════════════════════════════
     EVENT HANDLERS
     ══════════════════════════════════════════════════════════════════ */

  function getSelectedDuration() {
    const selected = durationPills.querySelector('.pill.selected');
    return selected ? parseInt(selected.dataset.min, 10) : 25;
  }

  /* ── Start Session ─────────────────────────────────────────────── */
  btnStartSession.addEventListener('click', () => {
    if (timer.state.isRunning) return;

    const name     = sessionNameIn.value.trim();
    const duration = getSelectedDuration();

    timer.configure(name, duration);
    timer.start();

    elTimerName.textContent = timer.state.sessionName;
    elCountdown.textContent = timer.getFormattedTime();

    setCardState('running');

    // Request notification permission on first interaction (lazy/just-in-time)
    if (typeof AudioManager !== 'undefined') {
      AudioManager.requestNotificationPermission();
    }
  });

  /* ── Hero CTA scrolls to session card ──────────────────────────── */
  if (btnHeroStart) {
    btnHeroStart.addEventListener('click', () => {
      sessionCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => sessionNameIn.focus(), 600);
    });
  }

  /* ── Pause / Resume toggle ─────────────────────────────────────── */
  btnPauseResume.addEventListener('click', () => {
    if (cardState === 'running') {
      timer.pause();
      setCardState('paused');
    } else if (cardState === 'paused') {
      timer.resume();
      setCardState('running');
    }
  });

  /* ── Reset ─────────────────────────────────────────────────────── */
  btnReset.addEventListener('click', () => {
    timer.reset();
    sessionNameIn.value = '';
    setCardState('idle');
  });

  /* ══════════════════════════════════════════════════════════════════
     TIMER CALLBACKS
     ══════════════════════════════════════════════════════════════════ */

  timer.on('tick', () => {
    elCountdown.textContent = timer.getFormattedTime();
    const pct = timer.getProgress();
    elProgressFill.style.width = `${pct}%`;
  });

  /* ── Complete: Sound → Notification → XP → Streak → Session → Garden → Achievements → UI */
  timer.on('complete', (data) => {
    // 0a. Play completion sound (before everything else for immediate feedback)
    if (typeof AudioManager !== 'undefined') {
      AudioManager.playCompletionSound();
    }

    // 0b. Show browser notification
    if (typeof AudioManager !== 'undefined') {
      AudioManager.showCompletionNotification();
    }

    // Record starting level to check for level-ups after all XP (session, garden, achievements) is awarded
    const startingXP = XPStorage.getTotalXP();
    const startingLevel = XPEngine.getLevel(startingXP);

    // 1. Calculate XP using the engine
    const earnedXP = XPEngine.calculateXP(data.duration);

    // 2. Award session XP
    XPEngine.awardXP(earnedXP);

    // 3. Update streak
    const streakResult = StreakTracker.recordCompletion();

    // 4. Save session to history
    const session = {
      id: getUniqueId(),
      name: data.name,
      duration: data.duration,
      completedAt: Date.now(),
    };
    SessionStorage.saveSession(session);

    // 5. Update garden (awards stage bonus XP + emits events)
    GardenManager.addGrowth(data.duration);

    // 6. Check achievements (auto-unlocks + awards bonus XP)
    AchievementEngine.checkAchievements();

    // Get final progression state and check if leveled up
    const finalXP = XPStorage.getTotalXP();
    const progression = XPEngine.getProgression(finalXP);
    const leveledUp = progression.level > startingLevel;

    // 7. Show completion feedback
    elCompleteXP.textContent = `+${earnedXP} XP`;
    elCountdown.textContent = '00:00';
    elProgressFill.style.width = '100%';
    setCardState('completed');

    // 8. Refresh all UI components
    renderRecentSessions();
    refreshProgressionUI();
    refreshStreakUI();
    refreshGardenUI();
    refreshAchievementsUI();
    refreshAnalyticsUI();
    refreshQuestUI();

    // 9. Dispatch custom events for notifications and celebrations
    document.dispatchEvent(new CustomEvent('sessionCompleted', {
      detail: {
        sessionName: data.name,
        duration: data.duration
      }
    }));

    document.dispatchEvent(new CustomEvent('xpEarned', {
      detail: {
        xp: earnedXP
      }
    }));

    if (leveledUp) {
      document.dispatchEvent(new CustomEvent('levelUp', {
        detail: {
          level: progression.level,
          previousLevel: startingLevel,
          rank: progression.rank
        }
      }));
    }

    const milestones = [3, 7, 30, 100];
    if (streakResult.justExtended && milestones.includes(streakResult.currentStreak)) {
      document.dispatchEvent(new CustomEvent('streakMilestone', {
        detail: {
          streak: streakResult.currentStreak
        }
      }));
    }

    // 10. Return to idle after delay
    setTimeout(() => {
      sessionNameIn.value = '';
      timer.reset();
      setCardState('idle');
      elProgressFill.style.width = '0%';
    }, leveledUp ? 4000 : 2500);
  });

  /* ══════════════════════════════════════════════════════════════════
     PROGRESSION UI — Updates hero + XP card from stored data
     ══════════════════════════════════════════════════════════════════ */

  function refreshProgressionUI() {
    const totalXP = XPStorage.getTotalXP();
    const prog = XPEngine.getProgression(totalXP);

    /* ── Hero section ────────────────────────────────────────────── */

    // Rank badge
    if (dom.rankText) dom.rankText.textContent = prog.rank;

    // Level ring number
    if (dom.levelNumber) dom.levelNumber.textContent = prog.level;

    // Level ring SVG fill
    if (dom.ringFill) dom.ringFill.style.setProperty('--ring-pct', prog.progressPct);

    // XP big number in hero
    if (dom.heroXPCounter) {
      dom.heroXPCounter.textContent = prog.totalXP;
      dom.heroXPCounter.dataset.count = prog.totalXP;
    }

    // Hero XP bar
    if (dom.heroXPBar) {
      dom.heroXPBar.style.width = `${prog.progressPct}%`;
      dom.heroXPBar.dataset.progress = prog.progressPct;
    }

    // XP to next level text
    if (dom.xpToNext) dom.xpToNext.textContent = `${prog.xpToNext} XP to Level ${prog.level + 1}`;

    // Next rank
    if (dom.nextRankName) dom.nextRankName.textContent = prog.nextRank;

    /* ── XP Progression card ─────────────────────────────────────── */

    // Level display
    if (dom.xpLevelBig) dom.xpLevelBig.textContent = prog.level;

    // Current XP number
    if (dom.xpEarned) {
      dom.xpEarned.textContent = prog.totalXP;
      dom.xpEarned.dataset.count = prog.totalXP;
    }

    // Next level XP target
    if (dom.xpNeeded) dom.xpNeeded.textContent = `${prog.nextLevelXP.toLocaleString()} XP`;

    // XP progress bar
    if (dom.xpProgressFill) {
      dom.xpProgressFill.style.width = `${prog.progressPct}%`;
      dom.xpProgressFill.dataset.progress = prog.progressPct;
    }

    // XP progress glow dot
    if (dom.xpGlow) dom.xpGlow.style.setProperty('--progress-pct', `${prog.progressPct}%`);

    // Milestones
    if (dom.milestoneWrap) {
      renderMilestones(dom.milestoneWrap, prog.level);
    }

    if (dom.quickLevel) dom.quickLevel.textContent = prog.level;
    if (dom.quickXP) dom.quickXP.textContent = prog.totalXP.toLocaleString();

    // Note: Analytics UI is refreshed separately via debounced event listeners.
    // Removed duplicate refreshAnalyticsUI() call here to avoid double-rendering.
  }

  /**
   * Render milestone labels around the current level.
   * Shows 5 levels: 2 before current, current, 2 after.
   */
  function renderMilestones(container, currentLevel) {
    const start = Math.max(1, currentLevel - 2);
    const end = start + 4;
    let html = '';

    for (let lv = start; lv <= end; lv++) {
      let cls = 'milestone';
      if (lv < currentLevel) cls += ' passed';
      else if (lv === currentLevel) cls += ' current';
      else cls += ' future';

      html += `<span class="${cls}">Lv ${lv}</span>`;
    }

    container.innerHTML = html;
  }

  /**
   * Inject styles for analytics insights (runs once).
   * @private
   */
  function _injectAnalyticsStyles() {
    if (document.getElementById('analytics-insight-styles')) return;
    const style = document.createElement('style');
    style.id = 'analytics-insight-styles';
    style.textContent = `
      .analytics-insights {
        margin-top: var(--sp-16);
        padding-top: var(--sp-16);
        border-top: 1px solid var(--clr-border);
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .insight {
        font-size: var(--fs-xs);
        color: var(--clr-text-muted);
        line-height: 1.5;
        display: flex;
        align-items: baseline;
        gap: 6px;
      }
      .insight-icon {
        flex-shrink: 0;
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Refresh the analytics "Your Journey" card using AnalyticsEngine.
   */
  function refreshAnalyticsUI() {
    _injectAnalyticsStyles();

    const snapshot = AnalyticsEngine.getSnapshot();

    // Update the 4 stat cards
    if (dom.analyticNumbers.length >= 4) {
      const hasData = snapshot.completedSessions > 0;
      if (dom.analyticsRow) dom.analyticsRow.hidden = !hasData;

      if (!hasData) {
        _renderInsights();
        return;
      }

      // Card 1: Total Focus — show minutes if < 60, otherwise hours
      if (snapshot.totalMinutes < 60) {
        dom.analyticNumbers[0].textContent = snapshot.totalMinutes;
        dom.analyticNumbers[0].dataset.count = snapshot.totalMinutes;
        if (dom.analyticLabels.length >= 1) dom.analyticLabels[0].textContent = 'Min';
      } else {
        const displayHours = Math.round(snapshot.totalMinutes / 60);
        dom.analyticNumbers[0].textContent = displayHours;
        dom.analyticNumbers[0].dataset.count = displayHours;
        if (dom.analyticLabels.length >= 1) dom.analyticLabels[0].textContent = 'Hours';
      }

      // Card 2: Completed Sessions
      dom.analyticNumbers[1].textContent = snapshot.completedSessions;
      dom.analyticNumbers[1].dataset.count = snapshot.completedSessions;

      // Card 3: Average Session Duration (minutes)
      dom.analyticNumbers[2].textContent = snapshot.averageDuration;
      dom.analyticNumbers[2].dataset.count = snapshot.averageDuration;

      // Card 4: Productivity Score
      dom.analyticNumbers[3].textContent = snapshot.productivityScore;
      dom.analyticNumbers[3].dataset.count = snapshot.productivityScore;
    }

    // Render insights below the stat cards
    _renderInsights();
  }

  /**
   * Render data-driven insights inside the analytics card.
   * @private
   */
  function _renderInsights() {
    if (!dom.analyticsCard) return;

    // Find or create insights container
    let container = dom.analyticsCard.querySelector('.analytics-insights');
    if (!container) {
      container = document.createElement('div');
      container.className = 'analytics-insights';
      dom.analyticsCard.appendChild(container);
    }

    const sessions = SessionStorage.getSessions();

    // Empty state: no sessions yet
    if (sessions.length === 0) {
      container.innerHTML = `
        <div class="empty-state analytics-empty" role="status">
          <div class="empty-title">No productivity data available yet.</div>
        </div>
      `;
      return;
    }

    const insights = AnalyticsEngine.generateInsights();

    container.innerHTML = insights
      .map((i) => `<div class="insight"><span class="insight-icon">${i.icon}</span><span>${i.text}</span></div>`)
      .join('');
  }

  /* ══════════════════════════════════════════════════════════════════
     STREAK UI — Updates streak card from stored data
     ══════════════════════════════════════════════════════════════════ */

  function refreshStreakUI() {
    const state = StreakTracker.getCurrentState();
    const weekActivity = StreakTracker.getWeekActivity();

    /* ── Streak card ─────────────────────────────────────────────── */

    // Big streak number
    if (dom.streakCounter) {
      dom.streakCounter.textContent = state.currentStreak;
      dom.streakCounter.dataset.count = state.currentStreak;
    }

    // Longest streak — use singular/plural
    if (dom.streakMeta) {
      const dayWord = state.longestStreak === 1 ? 'day' : 'days';
      dom.streakMeta.innerHTML = `Longest: <strong>${state.longestStreak} ${dayWord}</strong>`;
    }

    // Weekly streak bar (Mon–Sun)
    if (dom.streakDays.length === 7) {
      const labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
      dom.streakDays.forEach((el, i) => {
        el.textContent = labels[i];
        if (weekActivity[i]) {
          el.classList.add('active');
        } else {
          el.classList.remove('active');
        }
      });
    }

    /* ── Hero streak stat ────────────────────────────────────────── */
    if (dom.heroStats.length >= 1) {
      const heroDay = state.currentStreak === 1 ? 'Day' : 'Days';
      dom.heroStats[0].textContent = `${state.currentStreak} ${heroDay} Streak`;
    }

    if (dom.quickStreak) dom.quickStreak.textContent = `${state.currentStreak}d`;
  }


  /* ══════════════════════════════════════════════════════════════════
     DAILY QUEST UI — Compact progress for today's 25-minute goal
     ══════════════════════════════════════════════════════════════════ */

  function refreshQuestUI() {
    const today = StreakTracker.toDateString(new Date());
    const completedToday = SessionStorage.getSessions().some((session) => {
      return session.duration >= 25 && StreakTracker.toDateString(new Date(session.completedAt)) === today;
    });
    const progressPct = completedToday ? 100 : 0;

    if (dom.questProgressFill) {
      dom.questProgressFill.style.width = `${progressPct}%`;
      dom.questProgressFill.dataset.progress = progressPct;
    }

    if (dom.questStatus) {
      dom.questStatus.textContent = completedToday ? '1 / 1 Completed' : '0 / 1 Completed';
    }
  }



  /* ══════════════════════════════════════════════════════════════════
     RECENT SESSIONS — Dynamic rendering from LocalStorage
     ══════════════════════════════════════════════════════════════════ */

  function renderRecentSessions() {
    const sessions = SessionStorage.getSessions();

    if (sessions.length === 0) {
      timelineWrap.innerHTML = `
        <div class="tl-item">
          <div class="tl-dot"></div>
          <div class="tl-body">
            <div class="tl-name" style="color: var(--clr-text-dim);">No sessions yet</div>
            <div class="tl-meta">Complete a focus session to see it here</div>
          </div>
        </div>
      `;
      return;
    }

    const displaySessions = sessions.slice(0, 10);

    timelineWrap.innerHTML = displaySessions
      .map((session, index) => {
        const xp = XPEngine.calculateXP(session.duration);
        const isLast = index === displaySessions.length - 1;
        const timeAgo = formatTimeAgo(session.completedAt);

        return `
          <div class="tl-item" data-session-id="${session.id}">
            <div class="tl-dot"></div>
            ${!isLast ? '<div class="tl-line"></div>' : ''}
            <div class="tl-body">
              <div class="tl-name">${escapeHTML(session.name)}</div>
              <div class="tl-meta">${session.duration} min · <span class="tl-xp">+${xp} XP</span> · ${timeAgo}</div>
            </div>
          </div>
        `;
      })
      .join('');
  }

  /* ══════════════════════════════════════════════════════════════════
     UTILITIES
     ══════════════════════════════════════════════════════════════════ */

  function escapeHTML(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function formatTimeAgo(timestamp) {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    const hrs  = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} min ago`;
    if (hrs < 24) return `${hrs} hr${hrs > 1 ? 's' : ''} ago`;
    if (days <= 1) return 'Yesterday';
    return `${days} days ago`;
  }

  function getUniqueId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    return `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  }

  /* ══════════════════════════════════════════════════════════════════
     INLINE STYLES — Uses CSS custom properties from style.css
     ══════════════════════════════════════════════════════════════════ */

  function applyTimerStyles() {
    timerDisplay.style.cssText = `
      display: none;
      text-align: center;
    `;

    elTimerName.style.cssText = `
      font-family: var(--ff-mono);
      font-size: var(--fs-sm);
      color: var(--clr-text-muted);
      letter-spacing: var(--tracking-wide);
      text-transform: uppercase;
      margin-bottom: var(--sp-8);
    `;

    elCountdown.style.cssText = `
      font-size: var(--fs-4xl);
      font-weight: var(--fw-black);
      font-family: var(--ff-mono);
      color: var(--clr-text);
      line-height: 1;
      letter-spacing: -0.02em;
      margin-bottom: var(--sp-16);
      text-shadow: 0 0 30px var(--clr-accent-glow);
    `;

    elProgressTrack.style.cssText = `
      width: 100%;
      height: 6px;
      background: var(--clr-surface-3);
      border-radius: var(--r-pill);
      overflow: hidden;
      margin-bottom: var(--sp-16);
    `;

    elProgressFill.style.cssText = `
      height: 100%;
      width: 0%;
      background: linear-gradient(90deg, var(--clr-accent-dim), var(--clr-accent));
      border-radius: var(--r-pill);
      box-shadow: 0 0 10px var(--clr-accent-glow);
      transition: width 0.4s var(--ease-out);
    `;

    elControls.style.cssText = `
      display: flex;
      gap: var(--sp-8);
    `;

    btnPauseResume.style.cssText = `
      flex: 1;
    `;

    btnReset.textContent = 'Reset';
    btnReset.style.cssText = `
      flex-shrink: 0;
      padding: var(--sp-12) var(--sp-20);
      border: 1px solid var(--clr-border);
      border-radius: var(--r-xl);
      background: transparent;
      color: var(--clr-text-muted);
      font-size: var(--fs-sm);
      font-weight: var(--fw-semi);
      cursor: pointer;
      transition: border-color var(--dur-fast), color var(--dur-fast);
    `;
    btnReset.addEventListener('mouseenter', () => {
      btnReset.style.borderColor = 'var(--clr-border-hover)';
      btnReset.style.color = 'var(--clr-text)';
    });
    btnReset.addEventListener('mouseleave', () => {
      btnReset.style.borderColor = 'var(--clr-border)';
      btnReset.style.color = 'var(--clr-text-muted)';
    });

    const elCompleteEmoji = document.getElementById('complete-emoji');
    const elCompleteText  = document.getElementById('complete-text');

    elCompleteMsg.style.cssText = `
      padding: var(--sp-16) 0;
      text-align: center;
    `;
    elCompleteEmoji.style.cssText = `
      font-size: var(--fs-3xl);
      margin-bottom: var(--sp-8);
      animation: fadeUp 0.5s var(--ease-out) both;
    `;
    elCompleteText.style.cssText = `
      font-size: var(--fs-lg);
      font-weight: var(--fw-bold);
      color: var(--clr-green);
      margin-bottom: var(--sp-4);
    `;
    elCompleteXP.style.cssText = `
      font-size: var(--fs-xl);
      font-weight: var(--fw-black);
      color: var(--clr-accent);
    `;
  }

  /* ══════════════════════════════════════════════════════════════════
     ACHIEVEMENTS UI — Renders the achievement grid from live data
     ══════════════════════════════════════════════════════════════════ */

  function refreshAchievementsUI() {
    const allAchievements = AchievementEngine.getAllAchievements();
    const unlockedCount = AchievementEngine.getUnlockedCount();
    const totalCount = AchievementEngine.getTotalAchievements();

    // Update header count
    const cardCount = document.querySelector('.bento-achievements .card-count');
    if (cardCount) {
      cardCount.textContent = `${unlockedCount} / ${totalCount} Unlocked`;
    }

    // Render achievement grid
    const grid = document.querySelector('.achievement-grid');
    if (!grid) return;

    // Show up to 8 achievements: prioritize unlocked first, then closest-to-unlock
    const progress = AchievementEngine.getAchievementProgress();
    const unlocked = allAchievements.filter((a) => a.unlocked);

    // For locked items, merge progress data with full definition to get icon + description
    const lockedWithDefs = progress
      .filter((a) => !a.unlocked)
      .sort((a, b) => b.progress - a.progress)
      .map((prog) => {
        const def = AchievementEngine.DEFINITIONS.find((d) => d.id === prog.id);
        return { ...prog, icon: def?.icon || '🏆', description: def?.description || '' };
      });

    // Merge: all unlocked + top locked to fill 8 slots
    const displayList = [
      ...unlocked.map((a) => ({ ...a, _progress: 100 })),
      ...lockedWithDefs.slice(0, 8 - unlocked.length),
    ].slice(0, 8);

    // Empty state: no achievements at all
    if (displayList.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: var(--sp-32) var(--sp-16);">
          <div style="font-size: 2.5rem; margin-bottom: var(--sp-12);">🏆</div>
          <div style="font-size: var(--fs-sm); color: var(--clr-text-muted); font-weight: var(--fw-semi);">No achievements yet</div>
          <div style="font-size: var(--fs-xs); color: var(--clr-text-dim); margin-top: var(--sp-4);">Complete sessions to unlock your first achievement</div>
        </div>
      `;
      return;
    }

    grid.innerHTML = displayList
      .map((ach) => {
        if (ach.unlocked) {
          return `
            <div class="achievement unlocked" data-tooltip="Completed!" data-id="${ach.id}">
              <div class="ach-shine"></div>
              <div class="ach-icon">${ach.icon}</div>
              <div class="ach-name">${escapeHTML(ach.title)}</div>
              <div class="ach-desc">${escapeHTML(ach.description)}</div>
            </div>
          `;
        } else {
          return `
            <div class="achievement locked" data-id="${ach.id}">
              <div class="ach-lock-overlay">🔒</div>
              <div class="ach-icon">${ach.icon}</div>
              <div class="ach-name">${escapeHTML(ach.title)}</div>
              <div class="ach-desc">${escapeHTML(ach.description)}</div>
            </div>
          `;
        }
      })
      .join('');
  }

  /* ══════════════════════════════════════════════════════════════════
     GARDEN UI — Renders garden timeline, stats, and progress bar
     ══════════════════════════════════════════════════════════════════ */

  function refreshGardenUI() {
    const progress = GardenManager.getProgressToNextStage();
    const stages = GardenManager.STAGES;
    const currentIdx = stages.findIndex((s) => s.id === progress.currentStage.id);
    const currentStage = progress.currentStage;
    const data = GardenManager.getGardenData();

    /* ── Growth Timeline ────────────────────────────────────────── */
    const timeline = dom.growthTimeline;
    if (timeline) {
      let html = '';
      stages.forEach((stage, i) => {
        const isCompleted = i < currentIdx;
        const isActive = i === currentIdx;
        const isLocked = i > currentIdx;

        // Add connector before each stage (except first)
        if (i > 0) {
          let connCls = 'growth-connector';
          if (i <= currentIdx) connCls += ' filled';
          else if (i === currentIdx + 1) connCls += ' partial';
          html += `<div class="${connCls}"></div>`;
        }

        const stateClass = isCompleted ? 'completed' : isActive ? 'active' : 'locked';
        html += `
          <div class="growth-stage ${stateClass}" aria-current="${isActive ? 'step' : 'false'}">
            <div class="stage-node ${isActive ? 'active-node' : ''}">
              ${getStageGlyphSVG(stage.id)}
              ${isCompleted ? '<div class="stage-check">✓</div>' : ''}
              ${isActive ? '<div class="stage-pulse"></div>' : ''}
            </div>
            <div class="stage-label">${escapeHTML(stage.title)}</div>
          </div>`;
      });

      timeline.innerHTML = html;
    }

    /* ── Dynamic Illustration + Description ────────────────────── */
    if (dom.gardenIllustration) {
      dom.gardenIllustration.innerHTML = getGardenSceneSVG(currentStage.id);
    }
    if (dom.gardenCurrentStage) dom.gardenCurrentStage.textContent = currentStage.title;
    if (dom.gardenSessionsLeft) dom.gardenSessionsLeft.textContent = progress.isMaxStage ? 'Complete' : progress.sessionsRemaining;
    if (dom.gardenGrowthPoints) dom.gardenGrowthPoints.textContent = data.totalGrowthPoints.toLocaleString();
    if (dom.gardenStageTitle) dom.gardenStageTitle.textContent = currentStage.stageTitle;
    if (dom.gardenStageDescription) dom.gardenStageDescription.textContent = currentStage.description;
    if (dom.gardenProgressPercent) dom.gardenProgressPercent.textContent = `${progress.progressPercentage}%`;
    if (dom.gardenNextStage) dom.gardenNextStage.textContent = progress.isMaxStage ? 'Fully Grown' : progress.nextStage.title;

    if (dom.gardenTip) {
      if (progress.currentSessions === 0) {
        dom.gardenTip.textContent = 'Your garden is waiting to grow. Complete sessions to begin cultivation.';
      } else if (progress.isMaxStage) {
        dom.gardenTip.textContent = currentStage.completeMessage;
      } else {
        dom.gardenTip.textContent = currentStage.progressMessage.replace('{remaining}', progress.sessionsRemaining);
      }
    }

    /* ── Progress Bar ─────────────────────────────────────────── */
    if (dom.gardenProgressFill) {
      dom.gardenProgressFill.style.width = `${progress.progressPercentage}%`;
      dom.gardenProgressFill.dataset.progress = progress.progressPercentage;
    }

    /* ── Hero garden stat (if exists) ─────────────────────────── */
    if (dom.heroStats.length >= 2) {
      dom.heroStats[1].textContent = `${currentStage.title} • ${progress.gardenLevel}/${GardenManager.getTotalStages()}`;
    }
  }

  function getStageGlyphSVG(stageId) {
    const glyphs = {
      seed: '<path d="M20 35 C26 24 35 22 43 29 C34 31 27 36 22 45 C20 42 19 38 20 35 Z" /><path d="M22 46 C28 39 34 35 42 33" />',
      sprout: '<path d="M32 48 C32 38 32 30 32 21" /><path d="M31 31 C22 24 15 25 10 32 C18 35 25 35 31 31 Z" /><path d="M33 27 C42 18 51 18 56 26 C47 31 40 31 33 27 Z" />',
      sapling: '<path d="M32 52 C32 38 31 27 30 14" /><path d="M30 25 C20 17 13 18 8 26 C17 30 24 30 30 25 Z" /><path d="M32 20 C41 11 50 12 56 20 C48 26 40 26 32 20 Z" /><path d="M31 36 C22 30 15 32 11 39 C19 42 26 41 31 36 Z" /><path d="M33 37 C43 29 51 31 56 39 C47 43 40 42 33 37 Z" />',
      tree: '<path d="M29 52 C31 39 31 27 30 15 L36 15 C34 28 34 40 37 52 Z" /><path d="M18 25 C19 12 31 6 42 10 C54 14 57 28 48 38 C38 49 19 42 18 25 Z" />',
      mature_tree: '<path d="M28 54 C32 39 31 27 28 14 L37 14 C34 28 35 40 40 54 Z" /><path d="M13 32 C6 19 15 8 28 10 C34 0 50 5 50 18 C62 21 62 38 50 43 C39 51 21 47 13 32 Z" />',
      flourishing_tree: '<path d="M28 54 C33 39 32 27 28 13 L37 13 C34 27 36 40 42 54 Z" /><path d="M10 34 C2 18 15 6 29 10 C35 -1 52 4 52 17 C66 20 67 39 53 45 C41 55 20 51 10 34 Z" /><path d="M18 18 L22 22 M49 12 L53 16 M55 36 L59 40" />',
      enchanted_forest: '<path d="M12 54 L18 19 L24 54 Z" /><path d="M25 54 L33 10 L41 54 Z" /><path d="M42 54 L49 22 L56 54 Z" /><path d="M9 54 C22 42 42 42 57 54" />',
    };
    return `<svg class="stage-glyph" viewBox="0 0 64 64" aria-hidden="true">${glyphs[stageId] || glyphs.seed}</svg>`;
  }

  function getGardenSceneSVG(stageId) {
    const canopies = {
      seed: '',
      sprout: '<path class="scene-leaf" d="M196 147 C159 119 122 127 102 160 C137 171 169 166 196 147 Z" /><path class="scene-leaf" d="M206 139 C235 101 281 96 314 126 C276 154 239 158 206 139 Z" />',
      sapling: '<path class="scene-leaf" d="M194 134 C154 102 113 114 93 151 C132 164 165 159 194 134 Z" /><path class="scene-leaf" d="M205 123 C238 82 285 80 321 113 C280 145 242 149 205 123 Z" /><path class="scene-leaf leaf-soft" d="M199 177 C158 155 129 166 113 195 C146 203 174 198 199 177 Z" /><path class="scene-leaf leaf-soft" d="M211 175 C246 146 284 150 310 180 C274 195 241 193 211 175 Z" />',
      tree: '<path class="scene-canopy" d="M118 155 C101 100 143 63 191 77 C210 30 281 43 291 91 C342 91 370 144 336 186 C297 234 157 226 118 155 Z" />',
      mature_tree: '<path class="scene-canopy" d="M84 175 C51 101 111 48 176 63 C207 10 291 21 315 80 C377 78 414 145 374 200 C324 266 132 254 84 175 Z" /><path class="scene-canopy canopy-deep" d="M138 112 C159 78 222 74 239 116 C196 133 165 132 138 112 Z" />',
      flourishing_tree: '<path class="scene-canopy" d="M74 177 C35 93 106 37 177 58 C211 -8 302 15 323 78 C390 74 429 149 383 207 C327 279 124 262 74 177 Z" /><path class="scene-glow-branch" d="M122 136 C184 115 236 121 299 96" /><path class="scene-glow-branch" d="M153 195 C215 163 286 174 350 148" />',
      enchanted_forest: '<path class="forest-tree back" d="M33 275 L66 92 L98 275 Z" /><path class="forest-tree" d="M111 275 L157 50 L202 275 Z" /><path class="forest-tree back" d="M312 275 L352 88 L392 275 Z" /><path class="forest-tree" d="M229 275 L279 33 L330 275 Z" /><path class="forest-path" d="M165 275 C194 234 236 213 287 194 C257 231 238 254 231 275 Z" />',
    };

    const trunk = ['tree', 'mature_tree', 'flourishing_tree'].includes(stageId)
      ? '<path class="scene-trunk" d="M197 260 C211 219 211 164 203 102 L234 102 C222 165 225 221 246 260 Z" /><path class="scene-root" d="M214 252 C180 270 145 274 102 268" /><path class="scene-root" d="M226 252 C260 270 304 274 349 266" />'
      : '';
    const stem = ['seed', 'sprout', 'sapling'].includes(stageId)
      ? '<path class="scene-stem" d="M205 235 C205 192 205 158 202 119" />'
      : '';
    const seed = stageId === 'seed'
      ? '<path class="scene-seed" d="M196 211 C211 190 237 191 249 213 C237 232 212 233 196 211 Z" />'
      : '';

    return `
      <svg class="garden-scene-svg scene-${stageId}" viewBox="0 0 430 300" role="img" aria-label="${escapeHTML((GardenManager.STAGES.find((stage) => stage.id === stageId) || GardenManager.STAGES[0]).stageTitle)} illustration">
        <defs>
          <radialGradient id="gardenGlow" cx="50%" cy="68%" r="58%">
            <stop offset="0%" stop-color="#8fd64a" stop-opacity="0.42" />
            <stop offset="55%" stop-color="#5a9a3e" stop-opacity="0.12" />
            <stop offset="100%" stop-color="#0a110c" stop-opacity="0" />
          </radialGradient>
          <linearGradient id="leafGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stop-color="#c7f05a" />
            <stop offset="62%" stop-color="#6caf38" />
            <stop offset="100%" stop-color="#315d22" />
          </linearGradient>
        </defs>
        <rect class="scene-sky" width="430" height="300" />
        <ellipse class="scene-aura" cx="215" cy="205" rx="190" ry="92" />
        <path class="scene-ground" d="M0 249 C74 224 128 240 186 230 C248 218 300 222 430 244 L430 300 L0 300 Z" />
        <path class="scene-mound" d="M142 244 C158 213 189 199 219 200 C250 199 286 214 304 244 C257 258 190 260 142 244 Z" />
        ${seed}
        ${stem}
        ${canopies[stageId] || canopies.seed}
        ${trunk}
        <path class="scene-shadow" d="M109 265 C175 247 260 246 329 263 C270 285 164 286 109 265 Z" />
        <g class="scene-sparks">
          <path d="M106 140 L110 148 L118 151 L110 154 L106 162 L102 154 L94 151 L102 148 Z" />
          <path d="M330 104 L333 111 L340 114 L333 117 L330 124 L327 117 L320 114 L327 111 Z" />
          <path d="M287 215 L290 221 L296 224 L290 227 L287 233 L284 227 L278 224 L284 221 Z" />
        </g>
      </svg>
    `;
  }

  /* ══════════════════════════════════════════════════════════════════
     ANALYTICS EVENT LISTENERS — auto-refresh on relevant data changes
     ══════════════════════════════════════════════════════════════════ */

  let _analyticsDebounce = null;
  const _refreshAnalyticsDebounced = () => {
    if (_analyticsDebounce) clearTimeout(_analyticsDebounce);
    _analyticsDebounce = setTimeout(() => refreshAnalyticsUI(), 100);
  };
  document.addEventListener('sessionCompleted', _refreshAnalyticsDebounced);
  document.addEventListener('xpEarned', _refreshAnalyticsDebounced);
  document.addEventListener('achievementUnlocked', _refreshAnalyticsDebounced);
  document.addEventListener('gardenStageUnlocked', _refreshAnalyticsDebounced);

  /* ══════════════════════════════════════════════════════════════════
     SETTINGS — Sound toggle
     ══════════════════════════════════════════════════════════════════ */

  const btnToggleSound = document.getElementById('btn-toggle-sound');

  function syncSoundToggleUI() {
    if (!btnToggleSound || typeof AudioManager === 'undefined') return;
    const enabled = AudioManager.isSoundEnabled();
    btnToggleSound.setAttribute('aria-checked', String(enabled));
  }

  if (btnToggleSound && typeof AudioManager !== 'undefined') {
    btnToggleSound.addEventListener('click', () => {
      const newState = AudioManager.toggleSound();
      btnToggleSound.setAttribute('aria-checked', String(newState));
    });
  }

  /* ══════════════════════════════════════════════════════════════════
     INIT — Load saved data and render on page load
     ══════════════════════════════════════════════════════════════════ */

  try {
    // Check achievements first (cascading loop handles bonus-XP chains)
    AchievementEngine.checkAchievements();

    // Then render all UI from current state
    renderRecentSessions();
    refreshProgressionUI();
    refreshStreakUI();
    refreshGardenUI();
    refreshAchievementsUI();
    refreshAnalyticsUI();
    refreshQuestUI();

    // Sync settings toggle to persisted state
    syncSoundToggleUI();
  } catch (err) {
    console.error('[App] Initialization failed — some data may be corrupted.', err);
    // Attempt a minimal UI render so the page isn't blank
    try { renderRecentSessions(); } catch (_) { /* noop */ }
    try { refreshProgressionUI(); } catch (_) { /* noop */ }
  }
})();
