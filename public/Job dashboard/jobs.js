/* ============================================================
   JOB DASHBOARD – JavaScript (Redesigned)
   ============================================================ */

// ---- Data ----
const JOBS_DATA = [
  {
    id: 1,
    company: 'IT Infosy Co.',
    title: 'Senior Web Developer',
    location: 'Mumbai, India',
    datePosted: '2 days ago',
    daysAgo: 2,
    salary: '10k - 20k',
    salaryMin: 10000,
    salaryMax: 20000,
    jobType: 'part-time',
    education: "bachelor's degree",
    shift: 'day shift',
    image: './image/html.webp',
    link: 'ITinfosy.html',
    featured: false,
  },
  {
    id: 2,
    company: 'All Media Ltd.',
    title: 'Qualified Developer',
    location: 'Mumbai, India',
    datePosted: '2 days ago',
    daysAgo: 2,
    salary: '9000',
    salaryMin: 9000,
    salaryMax: 9000,
    jobType: 'full-time',
    education: "master's degree",
    shift: 'flexible shift',
    image: './image/css3-logo-png-transparent.png',
    link: 'AllmediaLts.html',
    featured: false,
  },
  {
    id: 3,
    company: 'Software Solution',
    title: 'Javascript Developer',
    location: 'Mumbai, India',
    datePosted: 'posted today',
    daysAgo: 0,
    salary: '10k - 20k',
    salaryMin: 10000,
    salaryMax: 20000,
    jobType: 'internship',
    education: "bachelor's degree",
    shift: 'night shift',
    image: './image/java.jpg',
    link: 'softwareSolution.html',
    featured: true,
  },
  {
    id: 4,
    company: 'IT World',
    title: 'Junior Front-End Developer',
    location: 'Mumbai, India',
    datePosted: '19 days ago',
    daysAgo: 19,
    salary: '40k - 50k',
    salaryMin: 40000,
    salaryMax: 50000,
    jobType: 'contract',
    education: 'diploma',
    shift: 'fixed shift',
    image: 'https://static.vecteezy.com/system/resources/previews/001/198/090/non_2x/world-png.png',
    link: 'ITWorlds.html',
    featured: false,
  },
  {
    id: 5,
    company: 'Info Statics',
    title: 'Junior Assistant',
    location: 'Mumbai, India',
    datePosted: '2 days ago',
    daysAgo: 2,
    salary: '5000',
    salaryMin: 5000,
    salaryMax: 5000,
    jobType: 'temporary',
    education: '10th pass',
    shift: 'flexible shift',
    image: 'https://th.bing.com/th/id/OIP.iJbuiX_YdBeTqI7wYawlwwHaHa?rs=1&pid=ImgDetMain',
    link: 'InfoStatics.html',
    featured: false,
  },
  {
    id: 6,
    company: 'Mass Idea',
    title: 'PHP Developer',
    location: 'Mumbai, India',
    datePosted: '2 days ago',
    daysAgo: 2,
    salary: '50k - 1 lakh',
    salaryMin: 50000,
    salaryMax: 100000,
    jobType: 'fresher',
    education: "bachelor's degree",
    shift: 'day shift',
    image: './image/php.jpg',
    link: 'massIdea.html',
    featured: false,
  },
];

// Salary range map (filter value → [min, max])
const SALARY_MAP = {
  '1k or less':      [0,        1000],
  '1k - 5k':         [1000,     5000],
  '5k - 10k':        [5000,     10000],
  '10k - 20k':       [10000,    20000],
  '20k - 30k':       [20000,    30000],
  '30k - 40k':       [30000,    40000],
  '40k - 50k':       [40000,    50000],
  '50k - 1 lakh':    [50000,    100000],
  '1 lakh - 5 lakh': [100000,   500000],
  '5 lakh - 10 lakh':[500000,   1000000],
  '10 lakh - 20 lakh':[1000000, 2000000],
  '20 lakh - 50 lakh':[2000000, 5000000],
  '50 lakh - 1 crore':[5000000, 10000000],
};

// Date max-days map
const DATE_MAP = {
  'today': 0, '3 days ago': 3, '7 days ago': 7,
  '15 days ago': 15, '30 days ago': 30,
};

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initDropdowns();
  initFilters();
  initBookmarks();
  initSort();
  renderJobs(JOBS_DATA);
});

/* ============================================================
   NAVBAR – scroll shadow + hamburger
   ============================================================ */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close menu on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });
}

/* ============================================================
   CUSTOM DROPDOWNS
   ============================================================ */
function initDropdowns() {
  document.querySelectorAll('.custom-select').forEach(sel => {
    const display = sel.querySelector('.select-display');

    // Toggle open on display click
    display.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = sel.classList.toggle('open');
      sel.setAttribute('aria-expanded', isOpen);
      // Close all others
      document.querySelectorAll('.custom-select').forEach(other => {
        if (other !== sel) {
          other.classList.remove('open');
          other.setAttribute('aria-expanded', false);
        }
      });
    });
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-select').forEach(sel => {
      sel.classList.remove('open');
      sel.setAttribute('aria-expanded', false);
    });
  });
}

function selectDropdown(optionEl, groupId) {
  const group   = document.getElementById(groupId);
  const display = group.querySelector('.select-display');
  const allOpts = group.querySelectorAll('.select-option');

  // Update display value
  display.value = optionEl.textContent.trim();

  // Mark selected
  allOpts.forEach(o => o.classList.remove('selected'));
  optionEl.classList.add('selected');

  // Close the dropdown
  const sel = group.querySelector('.custom-select');
  sel.classList.remove('open');
  sel.setAttribute('aria-expanded', false);

  filterJobs();
}

/* ============================================================
   FILTERS
   ============================================================ */
function initFilters() {
  const form = document.getElementById('jobFilterForm');

  // Live filter on text inputs
  form.title.addEventListener('input',    filterJobs);
  form.location.addEventListener('input', filterJobs);

  form.addEventListener('submit', (e) => { e.preventDefault(); filterJobs(); });

  document.getElementById('resetButton').addEventListener('click', resetFilters);
}

function getFilterValues() {
  const form = document.getElementById('jobFilterForm');
  return {
    title:      form.title.value.trim().toLowerCase(),
    location:   form.location.value.trim().toLowerCase(),
    datePosted: form.datePosted.value.trim().toLowerCase(),
    salary:     form.salary.value.trim().toLowerCase(),
    jobType:    form.jobType.value.trim().toLowerCase(),
    education:  form.education.value.trim().toLowerCase(),
    shift:      form.shift.value.trim().toLowerCase(),
  };
}

function filterJobs() {
  const f = getFilterValues();

  const filtered = JOBS_DATA.filter(job => {
    // Title
    if (f.title && !job.title.toLowerCase().includes(f.title)) return false;
    // Location
    if (f.location && !job.location.toLowerCase().includes(f.location)) return false;
    // Date posted
    if (f.datePosted) {
      const maxDays = DATE_MAP[f.datePosted];
      if (maxDays !== undefined && job.daysAgo > maxDays) return false;
    }
    // Salary
    if (f.salary && SALARY_MAP[f.salary]) {
      const [min, max] = SALARY_MAP[f.salary];
      if (job.salaryMax < min || job.salaryMin > max) return false;
    }
    // Job type
    if (f.jobType && !job.jobType.toLowerCase().includes(f.jobType)) return false;
    // Education
    if (f.education && !job.education.toLowerCase().includes(f.education)) return false;
    // Shift
    if (f.shift && !job.shift.toLowerCase().includes(f.shift)) return false;

    return true;
  });

  const sortVal = document.getElementById('sortSelect').value;
  const sorted  = sortJobs(filtered, sortVal);
  renderJobs(sorted);
}

function resetFilters() {
  document.getElementById('jobFilterForm').reset();

  // Clear all custom selects
  document.querySelectorAll('.select-display').forEach(d => { d.value = ''; });
  document.querySelectorAll('.select-option').forEach(o => o.classList.remove('selected'));

  renderJobs(JOBS_DATA);
}

/* ============================================================
   SORT
   ============================================================ */
function initSort() {
  document.getElementById('sortSelect').addEventListener('change', filterJobs);
}

function sortJobs(jobs, method) {
  const arr = [...jobs];
  switch (method) {
    case 'salary-high': return arr.sort((a, b) => b.salaryMax - a.salaryMax);
    case 'salary-low':  return arr.sort((a, b) => a.salaryMin - b.salaryMin);
    default:            return arr.sort((a, b) => a.daysAgo - b.daysAgo);
  }
}

/* ============================================================
   RENDER
   ============================================================ */
function renderJobs(jobs) {
  const grid      = document.getElementById('jobsGrid');
  const noResults = document.getElementById('noResults');
  const countEl   = document.getElementById('jobCount');

  grid.innerHTML = '';

  if (jobs.length === 0) {
    noResults.hidden = false;
    grid.hidden      = true;
    countEl.innerHTML = 'Showing <strong>0</strong> opportunities';
    return;
  }

  noResults.hidden = true;
  grid.hidden      = false;
  countEl.innerHTML = `Showing <strong>${jobs.length}</strong> opportunit${jobs.length === 1 ? 'y' : 'ies'}`;

  jobs.forEach((job, i) => {
    const card = createCard(job, i);
    grid.appendChild(card);
  });

  // Re-init bookmark events after render
  initBookmarks();
}

function formatSalary(s) {
  // Clean display
  return s.replace(/-/g, '–').replace('lakh', 'Lakh').replace('crore', 'Crore');
}

function formatJobType(t) {
  return t.replace(/-/g, '-').replace(/\b\w/g, c => c.toUpperCase());
}

function formatShift(s) {
  return s.replace(/\b\w/g, c => c.toUpperCase());
}

function createCard(job, index) {
  const article = document.createElement('article');
  article.className = 'job-card' + (job.featured ? ' featured-card' : '');
  article.dataset.jobId = job.id;
  article.setAttribute('role', 'listitem');
  article.style.animationDelay = `${index * 0.07}s`;

  article.innerHTML = `
    ${job.featured ? '<span class="featured-badge"><i class="fas fa-star"></i> Featured</span>' : ''}
    <div class="card-top">
      <div class="company-info">
        <div class="company-logo-wrap">
          <img src="${job.image}" alt="${job.company} Logo" class="company-logo" loading="lazy" />
        </div>
        <div class="company-meta">
          <h3 class="company-name">${job.company}</h3>
          <span class="posted-time"><i class="far fa-clock"></i> ${job.datePosted}</span>
        </div>
      </div>
      <button class="btn-bookmark" aria-label="Save this job" data-saved="false" data-job-id="${job.id}">
        <i class="far fa-bookmark"></i>
      </button>
    </div>

    <h3 class="job-title-card">${job.title}</h3>
    <p class="job-location"><i class="fas fa-map-marker-alt"></i> ${job.location}</p>

    <div class="job-tags">
      <span class="tag tag-salary"><i class="fas fa-indian-rupee-sign"></i> ${formatSalary(job.salary)}</span>
      <span class="tag tag-type"><i class="fas fa-briefcase"></i> ${formatJobType(job.jobType)}</span>
      <span class="tag tag-shift"><i class="fas fa-clock"></i> ${formatShift(job.shift)}</span>
    </div>

    <div class="card-footer">
      <a href="${job.link}" class="btn-view-details" aria-label="View details for ${job.title} at ${job.company}">
        View Details <i class="fas fa-arrow-right"></i>
      </a>
      <div class="apply-badge"><i class="fas fa-circle-check"></i> Easy Apply</div>
    </div>
  `;

  return article;
}

/* ============================================================
   BOOKMARK TOGGLE
   ============================================================ */
function initBookmarks() {
  document.querySelectorAll('.btn-bookmark').forEach(btn => {
    // Remove any existing listener by cloning
    const fresh = btn.cloneNode(true);
    btn.parentNode.replaceChild(fresh, btn);

    fresh.addEventListener('click', function () {
      const saved = this.dataset.saved === 'true';
      const icon  = this.querySelector('i');
      this.dataset.saved = !saved;
      icon.className = saved ? 'far fa-bookmark' : 'fas fa-bookmark';
      this.style.color = saved ? '' : 'var(--clr-primary)';

      // Micro pop animation
      this.style.transform = 'scale(1.3)';
      setTimeout(() => { this.style.transform = ''; }, 200);
    });
  });
}