/* =============================================
   EveSparks — main.js  (shared across all pages)
   ============================================= */

/* ── Theme: Apply saved theme IMMEDIATELY ────── */
const savedTheme = localStorage.getItem('esTheme') || 'light';
document.body.className = savedTheme;

/* ── Update all theme-btn icons on the page ──── */
function updateAllThemeIcons(theme) {
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.innerHTML = theme === 'dark'
      ? '<i class="bi bi-sun-fill" style="color:#facc15"></i>'
      : '<i class="bi bi-moon-fill"></i>';
  });
}

/* ── Event delegation: catches theme buttons
      even if injected dynamically by nav.js ──── */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.theme-btn');
  if (!btn) return;
  const next = document.body.classList.contains('dark') ? 'light' : 'dark';
  document.body.className = next;
  localStorage.setItem('esTheme', next);
  updateAllThemeIcons(next);
});

/* ── Called by nav.js AFTER it injects HTML ──── */
function initPageScripts() {
  /* Update theme icons now that buttons exist in DOM */
  updateAllThemeIcons(savedTheme);

  /* Mobile Drawer */
  const hamburger    = document.getElementById('hamburger');
  const drawer       = document.getElementById('mobileDrawer');
  const drawerClose  = document.getElementById('drawerClose');
  const drawerOverlay= document.getElementById('drawerOverlay');

  function openDrawer()  { drawer?.classList.add('open');    drawerOverlay?.classList.add('visible'); }
  function closeDrawer() { drawer?.classList.remove('open'); drawerOverlay?.classList.remove('visible'); }

  hamburger?.addEventListener('click', openDrawer);
  drawerClose?.addEventListener('click', closeDrawer);
  drawerOverlay?.addEventListener('click', closeDrawer);

  /* Active nav link */
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    if (link.getAttribute('href') === currentFile) link.classList.add('active');
  });
}

/* ── index.html uses inline nav (no nav.js),
      so we still init on DOMContentLoaded ────── */
document.addEventListener('DOMContentLoaded', () => {
  /* Only run if nav was NOT injected by nav.js
     (nav.js calls initPageScripts() itself) */
  if (!window._navJsInjected) {
    initPageScripts();
  }

  /* FAQ Accordion */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item   = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* Budget Planner Calculator */
  const budgetForm = document.getElementById('budgetForm');
  if (budgetForm) {
    budgetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guests = parseInt(document.getElementById('guests')?.value) || 0;
      const type   = document.getElementById('eventType')?.value || '';

      /* Collect all selected options from multi-select */
      const extrasEl = document.getElementById('extras');
      const selected = extrasEl
        ? Array.from(extrasEl.selectedOptions).map(o => o.value)
        : [];

      const baseRates = {
        wedding: 3500, birthday: 1200, corporate: 2000,
        concert: 2800, festival: 1800, other: 1500,
      };

      let base    = (baseRates[type] || 1500) * guests;
      let extras_ = 0;
      if (selected.includes('catering'))    extras_ += guests * 600;
      if (selected.includes('photography')) extras_ += 15000;
      if (selected.includes('decoration'))  extras_ += 20000;
      if (selected.includes('dj'))          extras_ += 18000;

      const total     = base + extras_;
      const resultBox = document.getElementById('budgetResult');
      if (resultBox) {
        resultBox.style.display = 'block';
        document.getElementById('totalAmount').textContent = '₹' + total.toLocaleString('en-IN');
        document.getElementById('baseAmount').textContent  = '₹' + base.toLocaleString('en-IN');
        document.getElementById('extraAmount').textContent = '₹' + extras_.toLocaleString('en-IN');
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  /* Hero Slider */
  const heroSlider = document.getElementById('heroSlider');
  if (heroSlider) {
    const slides = heroSlider.querySelectorAll('.slide');
    if (slides.length > 1) {
      let current = 0;
      slides[0].classList.add('slide-active');
      setInterval(() => {
        slides[current].classList.remove('slide-active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('slide-active');
      }, 4000);
    }
  }

  /* Scroll Reveal */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity    = '1';
        entry.target.style.transform  = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition= 'opacity .55s ease, transform .55s ease';
    revealObserver.observe(el);
  });
});
