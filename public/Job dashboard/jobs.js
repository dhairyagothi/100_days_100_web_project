document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('jobFilterForm');
    
    // Add event listeners to form elements
    form.title.addEventListener('input', filterJobs);
    form.location.addEventListener('input', filterJobs);
    form.datePosted.addEventListener('change', filterJobs);
    form.salary.addEventListener('change', filterJobs);
    form.jobType.addEventListener('change', filterJobs);
    form.education.addEventListener('change', filterJobs);
    form.shift.addEventListener('change', filterJobs);

    // Add event listener to reset button
    document.getElementById('resetButton').addEventListener('click', () => {
        form.reset();
        filterJobs(); // Reapply filter with default values
    });

    // Add event listeners to View details buttons
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', (event) => {
            // Perform any custom action here if needed
            // For example, you can check if the URL is valid before navigating
            const href = button.getAttribute('href');
            if (href && href !== '#') {
                window.location.href = href;
            } else {
                alert('Invalid URL!');
            }
        });
    });
});

function selectDropdown(element) {
    let input = element.parentElement.previousElementSibling;
    input.value = element.innerText;
    filterJobs(); // Call filterJobs whenever a dropdown is selected
}

function filterJobs() {
    const form = document.getElementById('jobFilterForm');
    const title = form.title.value.trim().toLowerCase();
    const location = form.location.value.trim().toLowerCase();
    const datePosted = form.datePosted.value.toLowerCase();
    const salary = form.salary.value.toLowerCase();
    const jobType = form.jobType.value.toLowerCase();
    const education = form.education.value.toLowerCase();
    const shift = form.shift.value.toLowerCase();

    const jobs = [
        {company: 'IT Infosy co.', title: 'Senior Web Developer', location: 'mumbai, india', datePosted: '2 days ago', salary: '10k - 20k', jobType: 'part-time', education: 'bachelor\'s degree', shift: 'day shift', image: './image/html.webp', link: 'ITinfosy.html'},
        {company: 'All Media Ltd.', title: 'Qualified Developer', location: 'mumbai, india', datePosted: '2 days ago', salary: '9000', jobType: 'full-time', education: 'master\'s degree', shift: 'flexible shift', image: './image/css3-logo-png-transparent.png', link: 'AllmediaLtd.html'},
        {company: 'Software Solution', title: 'Javascript Developer', location: 'mumbai, india', datePosted: 'posted today', salary: '10k - 20k', jobType: 'internship', education: 'bachelor\'s degree', shift: 'night shift', image: './image/java.jpg', link: 'softwareSolution.html'},
        {company: 'IT World', title: 'Junior Front-End', location: 'mumbai, india', datePosted: '19 days ago', salary: '40k - 50k', jobType: 'contract', education: 'diploma', shift: 'fixed shift', image: 'https://static.vecteezy.com/system/resources/previews/001/198/090/non_2x/world-png.png', link: 'ITWorlds.html'},
        {company: 'Info Statics', title: 'Junior Assistant', location: 'mumbai, india', datePosted: '2 days ago', salary: '5000', jobType: 'temporary', education: '10th pass', shift: 'flexible shift', image: 'https://th.bing.com/th/id/OIP.iJbuiX_YdBeTqI7wYawlwwHaHa?rs=1&pid=ImgDetMain', link: 'InfoStatics.html'},
        {company: 'Mass Idea', title: 'PHP Developer', location: 'mumbai, india', datePosted: '2 days ago', salary: '50k - 1 lakh', jobType: 'fresher', education: 'bachelor\'s degree', shift: 'day shift', image: './image/php.jpg', link: 'massIdea.html'}
    ];

    const filteredJobs = jobs.filter(job => 
        job.title.toLowerCase().includes(title) &&
        (location === '' || job.location.toLowerCase().includes(location)) &&
        filterByDatePosted(job.datePosted, datePosted) &&
        filterBySalary(job.salary, salary) &&
        job.jobType.toLowerCase().includes(jobType) &&
        (education === '' || job.education.toLowerCase().includes(education)) &&
        job.shift.toLowerCase().includes(shift)
    );

    displayFilteredJobs(filteredJobs);

    return false; 
}

function filterByDatePosted(jobDate, filterDate) {
    const dateMapping = {
        'today': 0,
        '3 days ago': 3,
        '7 days ago': 7,
        '15 days ago': 15,
        '30 days ago': 30
    };

    if (!filterDate) return true;

    const daysAgo = dateMapping[filterDate];
    if (daysAgo === undefined) return true;

    const jobDaysAgo = parseInt(jobDate.match(/\d+/));
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

function displayFilteredJobs(jobs) {
    const jobContainer = document.querySelector('.job-container .box-container');
    jobContainer.innerHTML = '';

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
    
  // Add event listeners to the new View details buttons after they are created
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', (event) => {
        handleButtonClick(event, button);
    });
});

function handleButtonClick(event, button) {
    const href = button.getAttribute('href');
    if (href && href !== '#') {
        window.location.href = href;
    } else {
        alert('Invalid URL!');
    }
}
}