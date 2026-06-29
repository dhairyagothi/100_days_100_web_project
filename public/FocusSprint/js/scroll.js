/* ════════════════════════════════════════════════════════════════════
   FocusSprint — Scroll & Interaction Engine (Polish Pass)
   Vanilla JS · IntersectionObserver · CSS-transform-only animations
   Target: 60 FPS, minimal DOM mutations
   ════════════════════════════════════════════════════════════════════ */

(() => {
  'use strict';

  /* ── 1. SCROLL REVEAL (IntersectionObserver) ─────────────────────── */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.10 }
  );
  revealEls.forEach((el) => revealObs.observe(el));

  /* ── 2. PARALLAX BACKGROUND ─────────────────────────────────────── */
  const bgLayer = document.getElementById('bg-layer');
  let ticking = false;

  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (bgLayer) {
          bgLayer.style.transform = `translate3d(0, ${scrollY * 0.28}px, 0)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── 3. COUNT-UP ANIMATION ──────────────────────────────────────── */
  const animateCounter = (el, target, duration = 1400) => {
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic for smoother deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const counters = document.querySelectorAll('.counter[data-count]');
  const counterObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.count, 10);
          animateCounter(entry.target, target);
          counterObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.25 }
  );
  counters.forEach((c) => counterObs.observe(c));

  /* ── 4. PROGRESS BAR ANIMATION ─────────────────────────────────── */
  const progressBars = document.querySelectorAll('.anim-progress');
  const progressObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pct = entry.target.dataset.progress || 0;
          // Small delay so the reveal animation starts first
          setTimeout(() => {
            entry.target.style.width = `${pct}%`;
          }, 300);
          progressObs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  progressBars.forEach((bar) => progressObs.observe(bar));

  /* ── 5. CARD TILT EFFECT (CSS transforms only) ──────────────────── */
  const tiltCards = document.querySelectorAll('[data-tilt]');
  const maxTilt = 2.5; // degrees — subtle

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform =
        `perspective(900px) rotateY(${x * maxTilt}deg) rotateX(${-y * maxTilt}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ── 6. MAGNETIC BUTTON ─────────────────────────────────────────── */
  const magneticBtns = document.querySelectorAll('.btn-magnetic');
  const MAG_STRENGTH = 20;

  magneticBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const tx = (x / rect.width) * MAG_STRENGTH;
      const ty = (y / rect.height) * MAG_STRENGTH;
      btn.style.transform = `translate(${tx}px, ${ty}px) scale(1.03)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ── 7. FLOATING PARTICLES ──────────────────────────────────────── */
  const particleContainer = document.getElementById('particles');
  const PARTICLE_COUNT = 22;

  if (particleContainer) {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      if (i >= Math.floor(PARTICLE_COUNT * 0.65)) {
        p.classList.add('firefly');
      }

      const size  = Math.random() * 3.5 + 1.5;         // 1.5–5 px
      const left  = Math.random() * 100;
      const top   = Math.random() * 100;
      const dur   = Math.random() * 25 + 18;           // 18–43 s
      const delay = Math.random() * -35;
      const dx    = (Math.random() - 0.5) * 100;
      const dy    = -(Math.random() * 250 + 60);

      p.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${left}%; top: ${top}%;
        --dx: ${dx}px; --dy: ${dy}px;
        animation-duration: ${dur}s;
        animation-delay: ${delay}s;
      `;
      particleContainer.appendChild(p);
    }
  }

  /* ── 8. GARDEN SPARKLES ─────────────────────────────────────────── */
  const sparkleContainer = document.querySelector('.garden-sparkles');
  const SPARKLE_COUNT = 10;

  if (sparkleContainer) {
    for (let i = 0; i < SPARKLE_COUNT; i++) {
      const s = document.createElement('div');
      s.classList.add('garden-sparkle');

      const left  = 20 + Math.random() * 60;    // keep within garden area
      const top   = 10 + Math.random() * 50;
      const dur   = Math.random() * 4 + 3;     // 3–7s
      const delay = Math.random() * -6;
      const sdx   = (Math.random() - 0.5) * 30;
      const sdy   = -(Math.random() * 40 + 10);

      s.style.cssText = `
        left: ${left}%; top: ${top}%;
        --sdx: ${sdx}px; --sdy: ${sdy}px;
        animation-duration: ${dur}s;
        animation-delay: ${delay}s;
      `;
      sparkleContainer.appendChild(s);
    }
  }

  /* ── 9. DURATION PILL SELECTOR ──────────────────────────────────── */
  const pills = document.querySelectorAll('.pill');
  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => {
        p.classList.remove('selected');
        p.setAttribute('aria-pressed', 'false');
      });
      pill.classList.add('selected');
      pill.setAttribute('aria-pressed', 'true');
    });
  });
})();
