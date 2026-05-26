document.addEventListener('DOMContentLoaded', () => {
    const contestGrid = document.getElementById('contest-grid');
    const loadingIndicator = document.getElementById('loading');
    const platformFilter = document.getElementById('platform-filter');

    let allContests = [];
    let timerInterval;

    const fetchContests = async () => {
        //Fetch API
        try {
            const response = await fetch('https://codeforces.com/api/contest.list');
            const data = await response.json();

            if (data.status === 'OK') {
                
                allContests = data.result
                    .filter(contest => contest.phase === 'BEFORE')
                    .map(contest => ({
                        site: 'Codeforces',
                        name: contest.name,
                        start_time: contest.startTimeSeconds * 1000,
                        url: `https://codeforces.com/contestRegistration/${contest.id}`
                    }))
                    .sort((a, b) => a.start_time - b.start_time);
                
                populateFilters(allContests);
                renderContests(allContests);
            } else {
                throw new Error('API Error');
            }
        } catch (error) {
            console.error('Error fetching contests:', error);
            loadingIndicator.textContent = 'Failed to load contests. Please try again later.';
        }
    };

    const populateFilters = (contests) => {
        const platforms = [...new Set(contests.map(c => c.site))].sort();
        platformFilter.innerHTML = '<option value="ALL">All Platforms</option>';
        platforms.forEach(site => {
            const option = document.createElement('option');
            option.value = site;
            option.textContent = site;
            platformFilter.appendChild(option);
        });
    };

    // Cards and Time management
    const renderContests = (contestsToRender) => {
        loadingIndicator.style.display = 'none';
        
        if (contestsToRender.length === 0) {
            contestGrid.innerHTML = '<p class="loading">No upcoming contests found.</p>';
            return;
        }

        //card html
        const cardsHTML = contestsToRender.map(contest => `
            <div class="contest-card">
                <span class="platform-badge">${contest.site}</span>
                <h2 class="contest-name">${contest.name}</h2>
                <div class="contest-detail">
                    <span><strong>Starts:</strong></span>
                    <span>${new Date(contest.start_time).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                
                <div class="timer-container">
                    <div class="timer-label">Starts in:</div>
                    <div class="timer-element" data-start="${contest.start_time}">Loading...</div>
                </div>

                <a href="${contest.url}" target="_blank" rel="noopener noreferrer" class="contest-link">
                    Register Now
                </a>
            </div>
        `).join('');

        contestGrid.innerHTML = cardsHTML;
        
        clearInterval(timerInterval);
        startTimers();
    };

    //time
    const startTimers = () => {
        const updateTimers = () => {
            const timerElements = document.querySelectorAll('.timer-element');
            const now = new Date().getTime();

            timerElements.forEach(el => {
                const startTime = el.dataset.start;
                const diff = startTime - now;

                if (diff <= 0) {
                    el.textContent = "Started or Ended!";
                    el.style.color = "#059669"; 
                    return;
                }

                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                el.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            });
        };

        updateTimers();
        timerInterval = setInterval(updateTimers, 1000);
    };

    platformFilter.addEventListener('change', (e) => {
        const selectedPlatform = e.target.value;
        if (selectedPlatform === 'ALL') {
            renderContests(allContests);
        } else {
            const filtered = allContests.filter(c => c.site === selectedPlatform);
            renderContests(filtered);
        }
    });

    fetchContests();
});