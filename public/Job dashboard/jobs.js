document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('jobFilterForm');
  const resetButton = document.getElementById('resetButton');
  const jobContainer = document.querySelector('.job-container .box-container');

  // Sample jobs data (kept from original)
  const jobs = [
    {company: 'IT Infosy co.', title: 'Senior Web Developer', location: 'mumbai, india', datePosted: '2 days ago', salary: '10k - 20k', jobType: 'part-time', education: "bachelor's degree", shift: 'day shift', image: './image/html.webp', link: 'ITinfosy.html', id: 'job-1'},
    {company: 'All Media Ltd.', title: 'Qualified Developer', location: 'mumbai, india', datePosted: '2 days ago', salary: '9000', jobType: 'full-time', education: "master's degree", shift: 'flexible shift', image: './image/css3-logo-png-transparent.png', link: 'AllmediaLts.html', id: 'job-2'},
    {company: 'Software Solution', title: 'Javascript Developer', location: 'mumbai, india', datePosted: 'posted today', salary: '10k - 20k', jobType: 'internship', education: "bachelor's degree", shift: 'night shift', image: './image/java.jpg', link: 'softwareSolution.html', id: 'job-3'},
    {company: 'IT World', title: 'Junior Front-End', location: 'mumbai, india', datePosted: '19 days ago', salary: '40k - 50k', jobType: 'contract', education: 'diploma', shift: 'fixed shift', image: 'https://static.vecteezy.com/system/resources/previews/001/198/090/non_2x/world-png.png', link: 'ITWorlds.html', id: 'job-4'},
    {company: 'Info Statics', title: 'Junior Assistant', location: 'mumbai, india', datePosted: '2 days ago', salary: '5000', jobType: 'temporary', education: '10th pass', shift: 'flexible shift', image: 'https://th.bing.com/th/id/OIP.iJbuiX_YdBeTqI7wYawlwwHaHa?rs=1&pid=ImgDetMain', link: 'InfoStatics.html', id: 'job-5'},
    {company: 'Mass Idea', title: 'PHP Developer', location: 'mumbai, india', datePosted: '2 days ago', salary: '50k - 1 lakh', jobType: 'fresher', education: "bachelor's degree", shift: 'day shift', image: './image/php.jpg', link: 'massIdea.html', id: 'job-6'}
  ];

  function attachFormListeners() {
    if (!form) return;
    const fields = ['title','location','datePosted','salary','jobType','education','shift','sortBy'];
    fields.forEach(name => {
      const el = form[name];
      if (el) el.addEventListener(el.tagName === 'SELECT' || el.type === 'select-one' ? 'change' : 'input', filterJobs);
    });
  }

  function attachReset() {
    if (!resetButton) return;
    resetButton.addEventListener('click', () => {
      if (form) form.reset();
      filterJobs();
    });
  }

  function attachSaveButtons() {
    document.addEventListener('click', (e) => {
      const saveBtn = e.target.closest('.save-btn, .fa-heart, button.far, button.fas');
      if (!saveBtn) return;
      // toggle icon classes
      if (saveBtn.classList) {
        saveBtn.classList.toggle('far');
        saveBtn.classList.toggle('fas');
      }
      // store saved jobs in localStorage by data-id if present
      const box = saveBtn.closest('.box');
      if (box && box.dataset && box.dataset.id) {
        const id = box.dataset.id;
        const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        if (saved.includes(id)) {
          const idx = saved.indexOf(id);
          saved.splice(idx,1);
          localStorage.setItem('savedJobs', JSON.stringify(saved));
          alert('Job removed from saved!');
        } else {
          saved.push(id);
          localStorage.setItem('savedJobs', JSON.stringify(saved));
          alert('Job saved successfully!');
        }
      }
    });
  }

  function attachJobContainerDelegation() {
    const container = document.querySelector('.job-container');
    if (!container) return;
    container.addEventListener('click', (event) => {
      const target = event.target;
      const viewLink = target.closest('a.btn');
      if (viewLink) {
        const href = viewLink.getAttribute('href');
        if (!href || href === '#') {
          event.preventDefault();
          alert('Invalid URL!');
        }
      }
    });
  }

  function renderJobs(list) {
    if (!jobContainer) return;
    jobContainer.innerHTML = '';
    list.forEach(job => {
      const jobBox = document.createElement('div');
      jobBox.className = 'box';
      jobBox.dataset.id = job.id || '';
      jobBox.innerHTML = `
        <div class="company">
          <img src="${job.image}" alt="${job.company} Logo">
          <div>
            <h3>${job.company}</h3>
            <p>${job.datePosted}</p>
          </div>
        </div>
        <h3 class="job-title">${job.title}</h3>
        <p class="location"><i class="fas fa-map-marker-alt"></i> <span>${job.location}</span></p>
        <div class="tags">
          <p><i class="fas fa-indian-rupee-sign"></i> <span>${job.salary}</span></p>
          <p><i class="fas fa-briefcase"></i> <span>${job.jobType}</span></p>
          <p><i class="fas fa-clock"></i> <span>${job.shift}</span></p>
          <p><i class="fas fa-graduation-cap"></i> <span>${job.education}</span></p>
        </div>
        <div class="flex-btn">
          <a href="${job.link}" class="btn">View details</a>
          <button class="far fa-heart save-btn" aria-label="Save job"></button>
        </div>
      `;
      jobContainer.appendChild(jobBox);
    });
  }

  // Filtering / sorting utilities (kept from original implementation)
  function filterByDatePosted(jobDate, filterDate) {
    const dateMapping = { 'today': 0, '3 days ago': 3, '7 days ago': 7, '15 days ago': 15, '30 days ago': 30 };
    if (!filterDate) return true;
    const daysAgo = dateMapping[filterDate];
    if (daysAgo === undefined) return true;
    const jobDaysAgo = parseInt(jobDate.match(/\d+/));
    return jobDaysAgo <= daysAgo;
  }

  function getSalaryValue(salary) {
    const numbers = salary.match(/\d+/g);
    if (!numbers) return 0;
    return parseInt(numbers[0]) * 1000;
  }

  function filterBySalary(jobSalary, filterSalary) {
    if (!filterSalary) return true;
    const salaryMapping = {
      '1k or less': [0, 1000], '1k - 5k': [1000, 5000], '5k - 10k': [5000, 10000], '10k - 20k': [10000, 20000],
      '20k - 30k': [20000, 30000], '30k - 40k': [30000, 40000], '40k - 50k': [40000, 50000], '50k - 1 lakh': [50000, 100000],
      '1 lakh - 5 lakh': [100000, 500000], '5 lakh - 10 lakh': [500000, 1000000], '10 lakh - 20 lakh': [1000000, 2000000],
      '20 lakh - 50 lakh': [2000000, 5000000], '50 lakh - 1 crore': [5000000, 10000000]
    };
    const [minSalary, maxSalary] = salaryMapping[filterSalary] || [0, Infinity];
    const parseSalary = (salary) => {
      const [min, max] = salary.split(' - ').map(s => parseInt(s.replace(/[^\d]/g, '')));
      return { min: min || 0, max: max || min || 0 };
    };
    const { min: jobMinSalary, max: jobMaxSalary } = parseSalary(jobSalary);
    if (filterSalary.includes('-')) {
      const [filterMin, filterMax] = filterSalary.split('-').map(s => parseInt(s.trim().replace(/[^\d]/g, '')));
      return jobMaxSalary >= filterMin && jobMinSalary <= filterMax;
    } else {
      return jobMaxSalary >= minSalary && jobMinSalary <= maxSalary;
    }
  }

  function sortJobs(list, sortBy) {
    if (!sortBy) return;
    if (sortBy === 'salary low to high') list.sort((a,b)=> getSalaryValue(a.salary)-getSalaryValue(b.salary));
    else if (sortBy === 'salary high to low') list.sort((a,b)=> getSalaryValue(b.salary)-getSalaryValue(a.salary));
    else if (sortBy === 'title a-z') list.sort((a,b)=> a.title.localeCompare(b.title));
    else if (sortBy === 'newest first') list.sort((a,b)=> (parseInt(a.datePosted.match(/\d+/))||0) - (parseInt(b.datePosted.match(/\d+/))||0));
  }

  function displayFilteredJobs(list) {
    renderJobs(list);
  }

  function filterJobs() {
    if (!form) return;
    const title = form.title ? form.title.value.trim().toLowerCase() : '';
    const location = form.location ? form.location.value.trim().toLowerCase() : '';
    const datePosted = form.datePosted ? form.datePosted.value.toLowerCase() : '';
    const salary = form.salary ? form.salary.value.toLowerCase() : '';
    const jobType = form.jobType ? form.jobType.value.toLowerCase() : '';
    const education = form.education ? form.education.value.toLowerCase() : '';
    const shift = form.shift ? form.shift.value.toLowerCase() : '';
    const sortBy = form.sortBy ? form.sortBy.value.toLowerCase() : '';

    const filtered = jobs.filter(job =>
      job.title.toLowerCase().includes(title) &&
      (location === '' || job.location.toLowerCase().includes(location)) &&
      filterByDatePosted(job.datePosted, datePosted) &&
      filterBySalary(job.salary, salary) &&
      job.jobType.toLowerCase().includes(jobType) &&
      (education === '' || job.education.toLowerCase().includes(education)) &&
      job.shift.toLowerCase().includes(shift)
    );

    sortJobs(filtered, sortBy);
    displayFilteredJobs(filtered);
    return false;
  }

  function loadSavedJobs() {
    const savedContainer = document.getElementById('savedJobsContainer');
    if (!savedContainer) return;
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const allJobs = document.querySelectorAll('.job-container .box');
    savedContainer.innerHTML = '';
    let found = false;
    allJobs.forEach(job => {
      const jobId = job.dataset.id;
      if (savedJobs.includes(jobId)) {
        const clone = job.cloneNode(true);
        savedContainer.appendChild(clone);
        found = true;
      }
    });
    if (!found) savedContainer.innerHTML = '<p class="no-saved">No saved jobs yet.</p>';
  }

  // init
  attachFormListeners();
  attachReset();
  attachSaveButtons();
  attachJobContainerDelegation();
  renderJobs(jobs);
  filterJobs();

  window.addEventListener('load', () => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    document.querySelectorAll('.job-container .box').forEach(job => {
      const jobId = job.dataset.id;
      const heart = job.querySelector('.fa-heart');
      if (savedJobs.includes(jobId) && heart) {
        heart.classList.remove('far');
        heart.classList.add('fas');
      }
    });
    loadSavedJobs();
  });
});
