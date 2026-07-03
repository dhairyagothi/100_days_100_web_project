// =============================================
// StudySync - script.js
// =============================================

// ── 1. MOBILE MENU TOGGLE ──────────────────────────────────────────────────

const menuBtn = document.querySelector('.menu');
const navUl = document.querySelector('nav ul');
const navButton = document.querySelector('nav .button');

// Build the mobile dropdown overlay
const mobileMenu = document.createElement('div');
mobileMenu.classList.add('mobile-menu');
mobileMenu.innerHTML = `
  <ul>
    <li><a href="#Home">Home</a></li>
    <li><a href="#Features">Features</a></li>
    <li><a href="#ai-planner">AI Planner</a></li>
    <li><a href="#Prising">Pricing</a></li>
    <li><a href="#Blogs">Blogs</a></li>
    <li><a href="#Contact">Contact</a></li>
  </ul>
  <a href="#button" class="mobile-contact-btn">Contact Us</a>
`;
document.querySelector('header').appendChild(mobileMenu);

// Inject mobile menu styles dynamically
const mobileStyle = document.createElement('style');
mobileStyle.textContent = `
  .mobile-menu {
    display: none;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    background: #fff;
    padding: 20px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    z-index: 999;
    animation: slideDown 0.3s ease;
  }
  .mobile-menu.open {
    display: flex;
  }
  .mobile-menu ul {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 0;
    width: 100%;
    text-align: center;
  }
  .mobile-menu ul a {
    text-decoration: none;
    color: #555;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 600;
    font-size: 1rem;
    transition: color 0.2s;
  }
  .mobile-menu ul a:hover { color: #2563EB; }
  .mobile-contact-btn {
    display: inline-block;
    background: #2563EB;
    color: #fff;
    padding: 10px 24px;
    border-radius: 4px;
    text-decoration: none;
    font-family: Arial, Helvetica, sans-serif;
    font-weight: 600;
    transition: background 0.2s;
  }
  .mobile-contact-btn:hover { background: #598ae4; }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  /* Make header relative so the dropdown positions correctly */
  header { position: relative; }
`;
document.head.appendChild(mobileStyle);

let menuOpen = false;
menuBtn.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
  });
});

// Close when clicking outside
document.addEventListener('click', (e) => {
  if (menuOpen && !menuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
    menuOpen = false;
    mobileMenu.classList.remove('open');
  }
});


// ── 2. SMOOTH SCROLLING ────────────────────────────────────────────────────

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


// ── 3. STICKY NAVBAR with shrink effect ──────────────────────────────────

const header = document.querySelector('header');
const nav = document.querySelector('nav');

const stickyStyle = document.createElement('style');
stickyStyle.textContent = `
  header {
    transition: box-shadow 0.3s ease, background 0.3s ease;
  }
  header.sticky {
    position: sticky;
    top: 0;
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(8px);
    box-shadow: 0 2px 16px rgba(37,99,235,0.1);
    z-index: 1000;
  }
  header.sticky nav {
    padding: 16px 30px;
    transition: padding 0.3s ease;
  }
`;
document.head.appendChild(stickyStyle);

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    header.classList.add('sticky');
  } else {
    header.classList.remove('sticky');
  }
});


// ── 4. SCROLL-TRIGGERED ANIMATIONS ────────────────────────────────────────

const animStyle = document.createElement('style');
animStyle.textContent = `
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
  .card.reveal {
    transition-delay: calc(var(--i, 0) * 0.1s);
  }
  .review.reveal {
    transition-delay: calc(var(--i, 0) * 0.15s);
  }
`;
document.head.appendChild(animStyle);

// Add reveal class to elements
const revealTargets = [
  '.subcontent',
  '.head',
  '.news',
  '.test .h',
];

revealTargets.forEach(sel => {
  document.querySelectorAll(sel).forEach(el => el.classList.add('reveal'));
});

// Cards with stagger
document.querySelectorAll('.card').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.setProperty('--i', i);
});

// Reviews with stagger
document.querySelectorAll('.review').forEach((el, i) => {
  el.classList.add('reveal');
  el.style.setProperty('--i', i);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// ── 5. NEWSLETTER FORM VALIDATION & TOAST ─────────────────────────────────

// Toast notification
const toastStyle = document.createElement('style');
toastStyle.textContent = `
  .toast {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: #2563EB;
    color: #fff;
    padding: 14px 24px;
    border-radius: 8px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 0.9rem;
    box-shadow: 0 4px 20px rgba(37,99,235,0.35);
    z-index: 9999;
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: none;
  }
  .toast.show {
    opacity: 1;
    transform: translateY(0);
  }
  .toast.error {
    background: #e53e3e;
  }
  /* Input error state */
  .newstext .khabar form input.input-error {
    outline: 2px solid #e53e3e;
  }
`;
document.head.appendChild(toastStyle);

const toast = document.createElement('div');
toast.classList.add('toast');
document.body.appendChild(toast);

function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.classList.toggle('error', type === 'error');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

const newsletterForm = document.querySelector('.newstext .khabar form');
const emailInput = document.querySelector('.newstext .khabar form input[type="email"]');

if (newsletterForm && emailInput) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      emailInput.classList.add('input-error');
      showToast('Please enter your email address.', 'error');
      return;
    }
    if (!emailRegex.test(email)) {
      emailInput.classList.add('input-error');
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    emailInput.classList.remove('input-error');
    emailInput.value = '';
    showToast('🎉 You\'re subscribed! Welcome to StudySync.');
  });

  emailInput.addEventListener('input', () => {
    emailInput.classList.remove('input-error');
  });
}


// ── 6. ACTIVE NAV LINK on scroll ──────────────────────────────────────────

const sections = [
  { id: 'Home',       el: document.querySelector('.content') },
  { id: 'Features',   el: document.querySelector('.foot') },
  { id: 'ai-planner', el: document.querySelector('.ai-planner-section') },
  { id: 'Prising',    el: document.querySelector('.review-section') },
  { id: 'Blogs',      el: document.querySelector('.news') },
  { id: 'Contact',    el: document.querySelector('footer') },
];

// Give sections their ids if missing
sections.forEach(({ id, el }) => {
  if (el && !el.id) el.id = id;
});

const navLinks = document.querySelectorAll('nav ul a');

window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 100;
  sections.forEach(({ id, el }) => {
    if (!el) return;
    if (el.offsetTop <= scrollPos && el.offsetTop + el.offsetHeight > scrollPos) {
      navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${id}` ? '#2563EB' : '';
      });
    }
  });
});


// ── 7. "START NOW" BUTTON — scroll to AI Planner ──────────────────────────

const startBtn = document.querySelector('#p4');
if (startBtn) {
  startBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const plannerSection = document.querySelector('.ai-planner-section');
    if (plannerSection) {
      plannerSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const examNameField = document.getElementById('examName');
        examNameField && examNameField.focus();
      }, 700);
    }
  });
}


// ── 8. "TAKE TOUR" BUTTON — highlight features cards ─────────────────────

const tourBtn = document.querySelector('#p5');
if (tourBtn) {
  tourBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const featuresSection = document.querySelector('.foot');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
      // Briefly pulse all cards
      setTimeout(() => {
        document.querySelectorAll('.card').forEach((card, i) => {
          setTimeout(() => {
            card.style.transform = 'scale(1.04)';
            card.style.transition = 'transform 0.3s ease';
            setTimeout(() => card.style.transform = '', 350);
          }, i * 80);
        });
      }, 600);
    }
  });
}


// ── 9. CARD HOVER — subtle lift (extends existing CSS) ───────────────────

const cardHoverStyle = document.createElement('style');
cardHoverStyle.textContent = `
  .card {
    transition: transform 0.25s ease, box-shadow 0.25s ease;
    cursor: default;
  }
  .card:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  }
`;
document.head.appendChild(cardHoverStyle);


// ── 10. BACK TO TOP BUTTON ─────────────────────────────────────────────────

const backTopStyle = document.createElement('style');
backTopStyle.textContent = `
  #back-to-top {
    position: fixed;
    bottom: 30px;
    left: 30px;
    background: #2563EB;
    color: #fff;
    border: none;
    border-radius: 50%;
    width: 42px;
    height: 42px;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 14px rgba(37,99,235,0.4);
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.3s ease, transform 0.3s ease, background 0.2s;
    z-index: 9998;
  }
  #back-to-top.visible {
    opacity: 1;
    transform: translateY(0);
  }
  #back-to-top:hover {
    background: #598ae4;
  }
`;
document.head.appendChild(backTopStyle);

const backTopBtn = document.createElement('button');
backTopBtn.id = 'back-to-top';
backTopBtn.title = 'Back to top';
backTopBtn.innerHTML = '&#8679;';
document.body.appendChild(backTopBtn);

window.addEventListener('scroll', () => {
  backTopBtn.classList.toggle('visible', window.scrollY > 400);
});

backTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ── 11. FOOTER SOCIAL ICONS — ripple + redirect hints ────────────────────

const socialLinks = {
  'fa-linkedin-in': 'https://linkedin.com',
  'fa-facebook-f':  'https://facebook.com',
  'fa-instagram':   'https://instagram.com',
  'fa-envelope':    'mailto:contact@studysync.com',
};

document.querySelectorAll('#ic-tab .ic').forEach(ic => {
  const icon = ic.querySelector('i');
  if (!icon) return;

  const key = [...icon.classList].find(c => socialLinks[c]);
  if (key) {
    ic.style.cursor = 'pointer';
    ic.title = key.replace('fa-', '');
    ic.addEventListener('click', () => window.open(socialLinks[key], '_blank'));
  }
});

// Top section social icons too
document.querySelectorAll('.subcontent .icon').forEach(ic => {
  const icon = ic.querySelector('i');
  if (!icon) return;
  const key = [...icon.classList].find(c => socialLinks[c]);
  if (key) {
    ic.style.cursor = 'pointer';
    ic.addEventListener('click', () => window.open(socialLinks[key], '_blank'));
  }
});


// ── 12. AI STUDY PLANNER  (Groq · Llama 3.1 8B Instant) — Issue #9526 ────

const STORAGE_KEY   = 'studysync_groq_api_key';
const GROQ_MODEL    = 'llama-3.1-8b-instant'; // NOTE: Groq is deprecating this
                                                // model on 2026-08-16. Switch to
                                                // 'openai/gpt-oss-20b' before then.
const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

// Elements (only present on pages that include the AI Planner section)
const apiKeyBox     = document.getElementById('apiKeyBox');
const apiKeyInput   = document.getElementById('groqApiKeyInput');
const saveApiKeyBtn = document.getElementById('saveApiKeyBtn');
const apiKeySaved   = document.getElementById('apiKeySaved');
const changeKeyBtn  = document.getElementById('changeKeyBtn');

const examNameEl   = document.getElementById('examName');
const examDateEl   = document.getElementById('examDate');
const dailyHoursEl = document.getElementById('dailyHours');
const subjectsEl   = document.getElementById('subjects');
const weakTopicsEl = document.getElementById('weakTopics');
const diffBtns     = document.querySelectorAll('.diff-btn');

const generateBtn  = document.getElementById('generateBtn');
const clearPlanBtn = document.getElementById('clearPlanBtn');

const outputPlaceholder = document.getElementById('outputPlaceholder');
const outputLoading     = document.getElementById('outputLoading');
const outputContent     = document.getElementById('outputContent');
const planText           = document.getElementById('planText');
const copyPlanBtn        = document.getElementById('copyPlanBtn');

if (generateBtn) {

  let selectedDifficulty = 'Beginner';

  /* ---- API key persistence (localStorage only — no backend, no .env) ---- */
  function loadApiKey() {
    return localStorage.getItem(STORAGE_KEY) || '';
  }

  function showKeySavedState(saved) {
    apiKeyBox.style.display   = saved ? 'none' : 'block';
    apiKeySaved.style.display = saved ? 'flex' : 'none';
  }

  function initApiKeyUI() {
    showKeySavedState(!!loadApiKey());
  }

  saveApiKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (!key) {
      alert('Please paste a valid Groq API key (starts with "gsk_").');
      return;
    }
    localStorage.setItem(STORAGE_KEY, key);
    apiKeyInput.value = '';
    showKeySavedState(true);
  });

  changeKeyBtn.addEventListener('click', () => {
    apiKeyInput.value = loadApiKey();
    showKeySavedState(false);
    apiKeyInput.focus();
  });

  initApiKeyUI();

  /* ---- Difficulty tab selection ---- */
  diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      diffBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDifficulty = btn.dataset.diff;
    });
  });

  /* ---- Output state helper ---- */
  function setOutputState(state) {
    // state: 'placeholder' | 'loading' | 'content'
    outputPlaceholder.style.display = state === 'placeholder' ? 'flex' : 'none';
    outputLoading.style.display     = state === 'loading'     ? 'flex' : 'none';
    outputContent.style.display     = state === 'content'     ? 'flex' : 'none';
  }

  /* ---- Wrap "Day N" markers for the CSS .day-marker badge style ---- */
  function formatPlan(rawText) {
    return rawText.replace(/(^|\n)\s*(Day\s*\d+[:.\-]?)/gi, (m, lead, label) => {
      return `${lead}<span class="day-marker">${label.trim()}</span> `;
    });
  }

  /* ---- Build the prompt sent to Groq ---- */
  function buildPrompt() {
    const exam     = examNameEl.value.trim() || 'an upcoming exam';
    const dateVal  = examDateEl.value ? new Date(examDateEl.value).toDateString() : 'not specified';
    const hours    = dailyHoursEl.value;
    const subjects = subjectsEl.value.trim() || 'Not specified';
    const weak     = weakTopicsEl.value.trim() || 'None mentioned';

    return `You are an expert academic study planner. Create a personalized, day-wise study roadmap.

Exam/Goal: ${exam}
Exam Date: ${dateVal}
Available Study Time: ${hours} hour(s) per day
Subjects/Topics: ${subjects}
Difficulty Level: ${selectedDifficulty}
Weak Topics (need extra focus): ${weak}

Instructions:
- Break the plan into "Day 1", "Day 2", etc., up to the exam date (or up to 14 days if no date is given).
- For each day, list specific topics to study with approximate time allocation.
- Prioritize the weak topics with dedicated revision slots.
- Add 1-2 short revision/mock-test days near the end.
- Keep the tone encouraging and concise. Plain text, clear day-by-day structure, no markdown tables.`;
  }

  /* ---- Call Groq API and render the plan ---- */
  async function generatePlan() {
    const apiKey = loadApiKey();

    if (!apiKey) {
      alert('Please save your Groq API key first.');
      apiKeyBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (!subjectsEl.value.trim()) {
      alert('Please enter at least one subject/topic to study.');
      subjectsEl.focus();
      return;
    }

    setOutputState('loading');
    generateBtn.disabled = true;

    try {
      const response = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [{ role: 'user', content: buildPrompt() }],
          temperature: 0.6,
          max_tokens: 1500
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content?.trim();

      if (!text) throw new Error('Empty response from Groq API.');

      planText.innerHTML = formatPlan(text);
      setOutputState('content');
      clearPlanBtn.style.display = 'flex';

    } catch (err) {
      console.error('Groq API error:', err);
      setOutputState('placeholder');
      alert(`Could not generate your plan: ${err.message}`);
    } finally {
      generateBtn.disabled = false;
    }
  }

  generateBtn.addEventListener('click', generatePlan);

  clearPlanBtn.addEventListener('click', () => {
    planText.innerHTML = '';
    setOutputState('placeholder');
    clearPlanBtn.style.display = 'none';
  });

  copyPlanBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(planText.innerText).then(() => {
      const original = copyPlanBtn.innerHTML;
      copyPlanBtn.innerHTML = '<i class="fa fa-check"></i> Copied!';
      setTimeout(() => { copyPlanBtn.innerHTML = original; }, 1800);
    });
  });

}


console.log('%cStudySync JS loaded ✅', 'color:#2563EB;font-weight:bold;font-size:14px;');