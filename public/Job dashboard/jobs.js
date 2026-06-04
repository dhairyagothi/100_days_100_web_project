document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('jobFilterForm');

    if (form) {
        form.title.addEventListener('input', filterJobs);
        form.location.addEventListener('input', filterJobs);
        form.datePosted.addEventListener('change', filterJobs);
        form.salary.addEventListener('change', filterJobs);
        form.jobType.addEventListener('change', filterJobs);
        form.education.addEventListener('change', filterJobs);
        form.shift.addEventListener('change', filterJobs);
        form.sortBy.addEventListener('change', filterJobs);

        const resetButton = document.getElementById('resetButton');
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                form.reset();
                filterJobs();
            });
        }
    }

    // Event delegation for job container (handles view details + heart icons)
    const jobContainer = document.querySelector('.job-container');
    if (jobContainer) {
        jobContainer.addEventListener('click', (event) => {
            const target = event.target;

            // Handle Save Job (Heart Button)
            const heartButton = target.closest('.fa-heart');
            if (heartButton) {
                event.preventDefault();
                const isSaved = heartButton.classList.contains('far');
                if (isSaved) {
                    heartButton.classList.remove('far');
                    heartButton.classList.add('fas');
                    alert('Job saved successfully!');
                } else {
                    heartButton.classList.remove('fas');
                    heartButton.classList.add('far');
                    alert('Job removed from saved!');
                }
                return;
            }

            // Handle View Details button
            const viewDetailsBtn = target.closest('a.btn');
            if (viewDetailsBtn) {
                const href = viewDetailsBtn.getAttribute('href');
                if (!href || href === '#') {
                    event.preventDefault();
                    alert('Invalid URL!');
                }
            }
        });
    }

    // Handle Apply Now / Save Job on detail pages
    const detailsSection = document.querySelector('.job-details');
    if (detailsSection) {
        const detailsForm = detailsSection.querySelector('form');
        if (detailsForm) {
            detailsForm.addEventListener('submit', (event) => {
                event.preventDefault();
            });
        }

        const applyBtn = detailsSection.querySelector('input[name="apply"]');
        if (applyBtn) {
            applyBtn.addEventListener('click', (event) => {
                event.preventDefault();
                alert('Application submitted successfully!');
            });
        }

        const saveBtn = detailsSection.querySelector('.save');
        if (saveBtn) {
            saveBtn.addEventListener('click', (event) => {
                event.preventDefault();
                const heartIcon = saveBtn.querySelector('i');
                if (heartIcon) {
                    const isSaved = heartIcon.classList.contains('far');
                    const spanText = saveBtn.querySelector('span');
                    if (isSaved) {
                        heartIcon.classList.remove('far');
                        heartIcon.classList.add('fas');
                        if (spanText) spanText.textContent = 'job saved';
                        alert('Job saved successfully!');
                    } else {
                        heartIcon.classList.remove('fas');
                        heartIcon.classList.add('far');
                        if (spanText) spanText.textContent = 'save job';
                        alert('Job removed from saved!');
                    }
                }
            });
        }
    }
});

function selectDropdown(element) {
    let input = element.parentElement.previousElementSibling;
    input.value = element.innerText;
    filterJobs();
}

function filterJobs() {
    const form = document.getElementById('jobFilterForm');
    if (!form) return;

    const title = form.title.value.trim().toLowerCase();
    const location = form.location.value.trim().toLowerCase();
    const datePosted = form.datePosted.value.toLowerCase();
    const salary = form.salary.value.toLowerCase();
    const jobType = form.jobType.value.toLowerCase();
    const education = form.education.value.toLowerCase();
    const shift = form.shift.value.toLowerCase();
    const sortBy = form.sortBy.value.toLowerCase();

    const jobs = [
        { company: 'IT Infosy co.', title: 'Senior Web Developer', location: 'mumbai, india', datePosted: '2 days ago', salary: '10k - 20k', jobType: 'part-time', education: "bachelor's degree", shift: 'day shift', image: './image/html.webp', link: 'ITinfosy.html' },
        { company: 'All Media Ltd.', title: 'Qualified Developer', location: 'mumbai, india', datePosted: '2 days ago', salary: '9000', jobType: 'full-time', education: "master's degree", shift: 'flexible shift', image: './image/css3-logo-png-transparent.png', link: 'AllmediaLts.html' },
        { company: 'Software Solution', title: 'Javascript Developer', location: 'mumbai, india', datePosted: 'posted today', salary: '10k - 20k', jobType: 'internship', education: "bachelor's degree", shift: 'night shift', image: './image/java.jpg', link: 'softwareSolution.html' },
        { company: 'IT World', title: 'Junior Front-End', location: 'mumbai, india', datePosted: '19 days ago', salary: '40k - 50k', jobType: 'contract', education: 'diploma', shift: 'fixed shift', image: 'https://static.vecteezy.com/system/resources/previews/001/198/090/non_2x/world-png.png', link: 'ITWorlds.html' },
        { company: 'Info Statics', title: 'Junior Assistant', location: 'mumbai, india', datePosted: '2 days ago', salary: '5000', jobType: 'temporary', education: '10th pass', shift: 'flexible shift', image: 'https://th.bing.com/th/id/OIP.iJbuiX_YdBeTqI7wYawlwwHaHa?rs=1&pid=ImgDetMain', link: 'InfoStatics.html' },
        { company: 'Mass Idea', title: 'PHP Developer', location: 'mumbai, india', datePosted: '2 days ago', salary: '50k - 1 lakh', jobType: 'fresher', education: "bachelor's degree", shift: 'day shift', image: './image/php.jpg', link: 'massIdea.html' }
    ];

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(title) &&
        (location === '' || job.location.toLowerCase().includes(location)) &&
        filterByDatePosted(job.datePosted, datePosted) &&
        filterBySalary(job.salary, salary) &&
        (jobType === '' || job.jobType.toLowerCase().includes(jobType)) &&
        (education === '' || job.education.toLowerCase().includes(education)) &&
        (shift === '' || job.shift.toLowerCase().includes(shift))
    );

    sortJobs(filteredJobs, sortBy);
    displayFilteredJobs(filteredJobs);

    return false;
}

function filterByDatePosted(jobDate, filterDate) {
    if (!filterDate) return true;

    const dateMapping = {
        'today': 0,
        '3 days ago': 3,
        '7 days ago': 7,
        '15 days ago': 15,
        '30 days ago': 30
    };

    const daysAgo = dateMapping[filterDate];
    if (daysAgo === undefined) return true;

    if (jobDate === 'posted today') return daysAgo >= 0;

    const match = jobDate.match(/\d+/);
    if (!match) return true;
    const jobDaysAgo = parseInt(match[0]);
    return jobDaysAgo <= daysAgo;
}

function filterBySalary(jobSalary, filterSalary) {
    if (!filterSalary) return true;

    const salaryMapping = {
        '1k or less': [0, 1000],
        '1k - 5k': [1000, 5000],
        '5k - 10k': [5000, 10000],
        '10k - 20k': [10000, 20000],
        '20k - 30k': [20000, 30000],
        '30k - 40k': [30000, 40000],
        '40k - 50k': [40000, 50000],
        '50k - 1 lakh': [50000, 100000],
        '1 lakh - 5 lakh': [100000, 500000],
        '5 lakh - 10 lakh': [500000, 1000000],
        '10 lakh - 20 lakh': [1000000, 2000000],
        '20 lakh - 50 lakh': [2000000, 5000000],
        '50 lakh - 1 crore': [5000000, 10000000]
    };

    const range = salaryMapping[filterSalary];
    const [minSalary, maxSalary] = range || [0, Infinity];

    const parseSalary = (salary) => {
        const parts = salary.split(' - ').map(s => parseInt(s.replace(/[^\d]/g, '')));
        const min = parts[0] || 0;
        const max = parts[1] || min;
        return { min, max };
    };

    const { min: jobMinSalary, max: jobMaxSalary } = parseSalary(jobSalary);
    return jobMaxSalary >= minSalary && jobMinSalary <= maxSalary;
}

function displayFilteredJobs(jobs) {
    const jobContainer = document.querySelector('.job-container .box-container');
    if (!jobContainer) return;

    jobContainer.innerHTML = '';

    if (jobs.length === 0) {
        jobContainer.innerHTML = '<p class="no-jobs">No jobs found matching your criteria.</p>';
        return;
    }

    jobs.forEach(job => {
        const jobBox = document.createElement('div');
        jobBox.classList.add('box');
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
                <button class="far fa-heart"></button>
            </div>
        `;
        jobContainer.appendChild(jobBox);
    });
}

function getSalaryValue(salary) {
    const numbers = salary.match(/\d+/g);
    if (!numbers) return 0;
    return parseInt(numbers[0]) * 1000;
}

function sortJobs(jobs, sortBy) {
    if (sortBy === 'salary low to high') {
        jobs.sort((a, b) => getSalaryValue(a.salary) - getSalaryValue(b.salary));
    } else if (sortBy === 'salary high to low') {
        jobs.sort((a, b) => getSalaryValue(b.salary) - getSalaryValue(a.salary));
    } else if (sortBy === 'title a-z') {
        jobs.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'newest first') {
        jobs.sort((a, b) => {
            const aDays = a.datePosted === 'posted today' ? 0 : (parseInt(a.datePosted.match(/\d+/)) || 0);
            const bDays = b.datePosted === 'posted today' ? 0 : (parseInt(b.datePosted.match(/\d+/)) || 0);
            return aDays - bDays;
        });
    }
}

function loadSavedJobs() {
    const savedContainer = document.getElementById('savedJobsContainer');
    if (!savedContainer) return;

    const savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];
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

    if (!found) {
        savedContainer.innerHTML = '<p class="no-saved">No saved jobs yet.</p>';
    }
}

window.addEventListener('load', () => {
    const savedJobs = JSON.parse(localStorage.getItem('savedJobs')) || [];

    document.querySelectorAll('.job-container .box').forEach(job => {
        const jobId = job.dataset.id;
        const heart = job.querySelector('.fa-heart');
        if (heart && savedJobs.includes(jobId)) {
            heart.classList.remove('far');
            heart.classList.add('fas');
        }
    });

    loadSavedJobs();
});