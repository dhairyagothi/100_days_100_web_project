document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('jobFilterForm');

    if (form) {
        form.title.addEventListener('input', filterJobs);
        form.location.addEventListener('input', filterJobs);
        
        form.querySelectorAll('.dropdown .items').forEach(item => {
            item.addEventListener('click', (e) => {
                selectDropdown(e.target);
            });
        });

        const resetButton = document.getElementById('resetButton');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                form.reset();
                form.querySelectorAll('.dropdown .output').forEach(input => {
                    input.value = '';
                });
                filterJobs();
            });
        }
    }

    const jobContainer = document.querySelector('.job-container');
    if (jobContainer) {
        jobContainer.addEventListener('click', async (event) => {
            const target = event.target;
            const heartButton = target.closest('.fa-heart');
            
            if (heartButton) {
                event.preventDefault();
                const box = heartButton.closest('.box');
                if (!box) return;
                
                const jobId = box.dataset.id;
                let savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
                
                const isSaving = heartButton.classList.contains('far');
                if (isSaving) {
                    heartButton.classList.remove('far');
                    heartButton.classList.add('fas');
                    if (!savedJobs.includes(jobId)) savedJobs.push(jobId);
                    alert('Job saved successfully!');
                } else {
                    heartButton.classList.remove('fas');
                    heartButton.classList.add('far');
                    savedJobs = savedJobs.filter(id => id !== jobId);
                    alert('Job removed from saved!');
                }
                
                localStorage.setItem('savedJobs', JSON.stringify(savedJobs));
                syncHeartIcons(jobId, isSaving);
                await loadSavedJobs();
                return;
            }
        });
    }

    initializeDashboard();
});

async function fetchJobsData() {
    try {
        const response = await fetch('jobs.json');
        if (!response.ok) throw new Error('Failed to load jobs database');
        return await response.json();
    } catch (error) {
        console.error('Data Fetch Error:', error);
        return [];
    }
}

async function initializeDashboard() {
    await filterJobs();
    await loadSavedJobs();
    updateDetailSync();
}

function selectDropdown(element) {
    let input = element.parentElement.previousElementSibling;
    input.value = element.innerText;
    filterJobs();
}

function syncHeartIcons(jobId, isSaved) {
    document.querySelectorAll(`.box[data-id="${jobId}"] .fa-heart`).forEach(heart => {
        if (isSaved) {
            heart.classList.replace('far', 'fas');
        } else {
            heart.classList.replace('fas', 'far');
        }
    });
}

function updateDetailSync() {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
    const detailsSection = document.querySelector('.job-details');
    
    if (detailsSection) {
        const path = window.location.pathname;
        const file = path.substring(path.lastIndexOf('/') + 1);
        
        const fileToIdMap = {
            'ITinfosy.html': 'job1',
            'AllmediaLts.html': 'job2',
            'softwareSolution.html': 'job3',
            'ITWorlds.html': 'job4',
            'InfoStatics.html': 'job5',
            'massIdea.html': 'job6'
        };

        const currentId = fileToIdMap[file];
        const heartIcon = detailsSection.querySelector('.save i');
        const spanText = detailsSection.querySelector('.save span');

        if (currentId && savedJobs.includes(currentId) && heartIcon) {
            heartIcon.classList.replace('far', 'fas');
            if (spanText) spanText.textContent = 'job saved';
        }
    }
}

async function filterJobs() {
    const form = document.getElementById('jobFilterForm');
    if (!form) return;

    const filters = {
        title: form.title.value.trim().toLowerCase(),
        location: form.location.value.trim().toLowerCase(),
        date: form.datePosted.value.toLowerCase(),
        salary: form.salary.value.toLowerCase(),
        type: form.jobType.value.toLowerCase(),
        edu: form.education.value.toLowerCase(),
        shift: form.shift.value.toLowerCase(),
        sort: form.sortBy.value.toLowerCase()
    };

    const allJobs = await fetchJobsData();
    console.log(allJobs);
    const filtered = allJobs.filter(job => 
        (job.title.toLowerCase().includes(filters.title) || job.company.toLowerCase().includes(filters.title)) &&
        (filters.location === '' || job.location.toLowerCase().includes(filters.location)) &&
        matchDate(job.datePosted, filters.date) &&
        matchSalary(job.salary, filters.salary) &&
        (filters.type === '' || job.jobType.toLowerCase() === filters.type) &&
        (filters.edu === '' || job.education.toLowerCase() === filters.edu) &&
        (filters.shift === '' || job.shift.toLowerCase() === filters.shift)
    );
    const totalJobs = document.getElementById("total-jobs");
    totalJobs.value=filtered.length + " Jobs Found"
    sortJobs(filtered, filters.sort);
    renderJobs(filtered, '.job-container .box-container');
}

function renderJobs(jobs, containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    container.innerHTML = jobs.length ? '' : '<p class="no-jobs">No matches found.</p>';
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];

    jobs.forEach(job => {
        const isSaved = savedJobs.includes(job.id);
        const div = document.createElement('div');
        div.className = 'box';
        div.dataset.id = job.id;
        div.innerHTML = `
            <div class="company">
                <img src="${job.image}" alt="logo">
                <div><h3>${job.company}</h3><p>${job.datePosted}</p></div>
            </div>
            <h3 class="job-title">${job.title}</h3>
            <p class="location"><i class="fas fa-map-marker-alt"></i><span>${job.location}</span></p>
            <div class="tags">
                <p><i class="fas fa-indian-rupee-sign"></i><span>${job.salary}</span></p>
                <p><i class="fas fa-briefcase"></i><span>${job.jobType}</span></p>
                <p><i class="fas fa-clock"></i><span>${job.shift}</span></p>
            </div>
            <div class="flex-btn">
                <a href="${job.link}" class="btn">View details</a>
                <button class="${isSaved ? 'fas' : 'far'} fa-heart"></button>
            </div>`;
        container.appendChild(div);
    });
}

async function loadSavedJobs() {
    const container = document.getElementById('savedJobsContainer');
    if (!container) return;

    const savedIds = JSON.parse(localStorage.getItem('savedJobs')) || [];
    const allJobs = await fetchJobsData();
    const savedData = allJobs.filter(job => savedIds.includes(job.id));

    container.innerHTML = '';
    if (!savedData.length) {
        container.innerHTML = '<p class="no-saved">No saved jobs yet.</p>';
        return;
    }

    savedData.forEach(job => {
        const div = document.createElement('div');
        div.className = 'box';
        div.dataset.id = job.id;
        div.innerHTML = `
            <div class="company">
                <img src="${job.image}" alt="logo">
                <div><h3>${job.company}</h3><p>${job.datePosted}</p></div>
            </div>
            <h3 class="job-title">${job.title}</h3>
            <p class="location"><i class="fas fa-map-marker-alt"></i><span>${job.location}</span></p>
            <div class="tags">
                <p><i class="fas fa-indian-rupee-sign"></i><span>${job.salary}</span></p>
            </div>
            <div class="flex-btn">
                <a href="${job.link}" class="btn">View details</a>
                <button class="fas fa-heart"></button>
            </div>`;
        container.appendChild(div);
    });
}

function matchDate(posted, filter) {
    if (!filter) return true;
    const days = { 'today': 0, '3 days ago': 3, '7 days ago': 7, '15 days ago': 15, '30 days ago': 30 }[filter];
    if (posted.toLowerCase() === 'posted today') return true;
    const num = parseInt(posted.match(/\d+/));
    return isNaN(num) ? true : num <= days;
}

function matchSalary(jobSal, filterSal) {
    if (!filterSal) return true;
    const map = { '1k or less': [0, 1000], '1k - 5k': [1000, 5000], '5k - 10k': [5000, 10000], '10k - 20k': [10000, 20000], '50k - 1 lakh': [50000, 100000], '1 lakh - 5 lakh': [100000, 500000] };
    const range = map[filterSal] || [0, Infinity];
    const val = getSalaryValue(jobSal);
    return val >= range[0] && val <= range[1];
}

function getSalaryValue(s) {
    const n = parseInt(s.match(/\d+/));
    if (s.toLowerCase().includes('lakh')) return n * 100000;
    if (s.toLowerCase().includes('k')) return n * 1000;
    return n;
}

function sortJobs(jobs, type) {
    if (type.includes('low to high')) jobs.sort((a,b) => getSalaryValue(a.salary) - getSalaryValue(b.salary));
    if (type.includes('high to low')) jobs.sort((a,b) => getSalaryValue(b.salary) - getSalaryValue(a.salary));
    if (type === 'title a-z') jobs.sort((a,b) => a.title.localeCompare(b.title));
}