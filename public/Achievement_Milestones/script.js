const badgesData = [
    { id: 1, title: 'First PR', desc: 'Merged your first pull request.', icon: 'ph-rocket-launch', color: 'badge-blue', locked: false },
    { id: 2, title: 'Bug Squasher', desc: 'Fixed 5+ confirmed bugs.', icon: 'ph-bug', color: 'badge-green', locked: false },
    { id: 3, title: '10 Day Streak', desc: 'Contributed 10 days in a row.', icon: 'ph-fire', color: 'badge-purple', locked: false },
    { id: 4, title: 'Code Reviewer', desc: 'Reviewed 20+ PRs.', icon: 'ph-check-square-offset', color: 'badge-gold', locked: false },
    { id: 5, title: 'Top Contributor', desc: 'Ranked in top 10 for the month.', icon: 'ph-crown', color: 'badge-gold', locked: true },
    { id: 6, title: 'Helpful Mentor', desc: 'Resolved 10+ discussions.', icon: 'ph-users-three', color: 'badge-blue', locked: true },
    { id: 7, title: 'Night Owl', desc: 'Commits between 12AM - 4AM.', icon: 'ph-moon-stars', color: 'badge-purple', locked: true },
    { id: 8, title: 'Documentation', desc: 'Added a README or guide.', icon: 'ph-book-open-text', color: 'badge-green', locked: true },
];

const activityData = [
    { title: 'Unlocked "Code Reviewer" Badge', desc: 'You reviewed your 20th PR in the react-ui repo.', time: '2 hours ago', icon: 'ph-medal' },
    { title: 'PR Merged: #1042', desc: 'feat: add pagination to grid component', time: '5 hours ago', icon: 'ph-git-merge' },
    { title: 'Level Up!', desc: 'You reached Level 42.', time: '1 day ago', icon: 'ph-trend-up' },
    { title: 'Unlocked "10 Day Streak"', desc: 'You have contributed 10 days consecutively!', time: '2 days ago', icon: 'ph-fire' }
];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Render Badges
    const badgesContainer = document.getElementById('badges-container');
    
    // Update badge count dynamically
    const unlockedCount = badgesData.filter(b => !b.locked).length;
    const totalCount = badgesData.length;
    const badgeCountEl = document.querySelector('.badge-count');
    if (badgeCountEl) {
        badgeCountEl.textContent = `${unlockedCount}/${totalCount}`;
    }

    badgesData.forEach(badge => {
        const badgeEl = document.createElement('div');
        badgeEl.className = `badge-card ${badge.locked ? 'badge-locked' : badge.color}`;
        
        let lockIcon = badge.locked ? `<i class="ph ph-lock-key lock-overlay"></i>` : '';
        
        badgeEl.innerHTML = `
            ${lockIcon}
            <div class="badge-icon-wrapper">
                <i class="ph ${badge.icon}"></i>
            </div>
            <h4>${badge.title}</h4>
            <p>${badge.desc}</p>
        `;
        badgesContainer.appendChild(badgeEl);
    });

    // 2. Render Activity
    const activityList = document.getElementById('activity-list');
    activityData.forEach(act => {
        const li = document.createElement('li');
        li.className = 'activity-item';
        li.innerHTML = `
            <div class="activity-icon">
                <i class="ph ${act.icon}"></i>
            </div>
            <div class="activity-details">
                <h4>${act.title}</h4>
                <p>${act.desc}</p>
            </div>
            <span class="activity-time">${act.time}</span>
        `;
        activityList.appendChild(li);
    });

    // 3. Animate Progress Bar
    setTimeout(() => {
        const xpBar = document.getElementById('xp-bar');
        xpBar.style.width = '62.5%'; // 1250 / 2000
    }, 500);

    // 4. Claim Reward Logic
    const claimBtn = document.getElementById('claim-reward-btn');
    const toast = document.getElementById('toast');

    claimBtn.addEventListener('click', () => {
        // Show Toast
        toast.classList.add('show');
        
        // Change Button State
        claimBtn.innerHTML = `<i class="ph ph-check"></i> Reward Claimed`;
        claimBtn.style.background = '#10b981';
        claimBtn.disabled = true;
        claimBtn.style.cursor = 'not-allowed';

        // Add 50 XP
        const xpBar = document.getElementById('xp-bar');
        xpBar.style.width = '65%'; // (1250+50) / 2000

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    });
});
