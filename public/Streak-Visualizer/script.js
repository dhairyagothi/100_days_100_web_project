document.addEventListener('DOMContentLoaded', () => {
    const fetchBtn = document.getElementById('fetchBtn');
    const user1Input = document.getElementById('user1');
    const user2Input = document.getElementById('user2');
    const loading = document.getElementById('loading');
    const statsWrapper = document.getElementById('stats-wrapper');
    const errorMessage = document.getElementById('error-message');
    const card2 = document.getElementById('card2');

    fetchBtn.addEventListener('click', async () => {
        const u1 = user1Input.value.trim();
        const u2 = user2Input.value.trim();
        
        if (!u1) {
            showError("Player 1 username is required.");
            return;
        }

        // Reset UI
        errorMessage.classList.add('hidden');
        statsWrapper.classList.add('hidden');
        card2.classList.add('hidden');
        resetCrowns();
        loading.classList.remove('hidden');

        try {
            // Fetch User 1
            const data1 = await fetchUserData(u1);
            updateCard(1, data1);

            // Fetch User 2 (If provided)
            if (u2) {
                const data2 = await fetchUserData(u2);
                updateCard(2, data2);
                card2.classList.remove('hidden');
                
                // Compare logic
                compareStats(data1, data2);
            }

            loading.classList.add('hidden');
            statsWrapper.classList.remove('hidden');

        } catch (error) {
            loading.classList.add('hidden');
            showError(error.message);
        }
    });


    async function fetchUserData(username) {
        const [profileRes, solvedRes, calendarRes] = await Promise.all([
            fetch(`https://alfa-leetcode-api.onrender.com/${username}`),
            fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`),
            fetch(`https://alfa-leetcode-api.onrender.com/${username}/calendar`)
        ]);
        
        if (!profileRes.ok || !solvedRes.ok || !calendarRes.ok) throw new Error(`Failed to fetch data for ${username}.`);

        const profileData = await profileRes.json();
        const solvedData = await solvedRes.json();
        const calendarData = await calendarRes.json();

        if (profileData.errors || solvedData.errors || calendarData.errors) {
            throw new Error(`User ${username} not found.`);
        }

        const streak = calculateStreak(calendarData.submissionCalendar);
        
        return {
            username: profileData.name || username,
            avatar: profileData.avatar || "https://assets.leetcode.com/users/leetcode/avatar_1568224780.png",
            solved: solvedData.solvedProblem || 0,
            streak: streak
        };
    }

    function updateCard(playerNum, data) {
        document.getElementById(`name${playerNum}`).textContent = data.username;
        document.getElementById(`avatar${playerNum}`).src = data.avatar;
        document.getElementById(`solved${playerNum}`).textContent = data.solved;
        document.getElementById(`streak${playerNum}`).textContent = `${data.streak} Days`;

        const batteryLevel = document.getElementById(`battery-level${playerNum}`);
        const batteryText = document.getElementById(`battery-text${playerNum}`);

        let chargePercentage = (data.streak / 30) * 100;
        if (chargePercentage > 100) chargePercentage = 100;

        batteryLevel.style.width = `${chargePercentage}%`;
        
        if (data.streak === 0) {
            batteryText.textContent = "Battery Empty";
            batteryLevel.style.backgroundColor = 'var(--lc-border)';
        } else {
            batteryText.textContent = `Power: ${data.streak} Days`;
            if (chargePercentage <= 25) batteryLevel.style.backgroundColor = 'var(--lc-red)';
            else if (chargePercentage <= 60) batteryLevel.style.backgroundColor = 'var(--lc-yellow)';
            else batteryLevel.style.backgroundColor = 'var(--lc-green)';
        }
    }

    function compareStats(data1, data2) {
        // Compare Solved
        if (data1.solved > data2.solved) document.getElementById('solvedCrown1').classList.remove('hidden');
        else if (data2.solved > data1.solved) document.getElementById('solvedCrown2').classList.remove('hidden');

        // Compare Streak
        if (data1.streak > data2.streak) document.getElementById('streakCrown1').classList.remove('hidden');
        else if (data2.streak > data1.streak) document.getElementById('streakCrown2').classList.remove('hidden');
    }

    function calculateStreak(calendarJsonString) {
        if (!calendarJsonString) return 0;
        const submissions = JSON.parse(calendarJsonString);
        const activeDays = new Set();
        
        for (const timestamp in submissions) {
            const date = new Date(parseInt(timestamp) * 1000);
            activeDays.add(date.toISOString().split('T')[0]);
        }

        let currentStreak = 0;
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const todayStr = today.toISOString().split('T')[0];
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (!activeDays.has(todayStr) && !activeDays.has(yesterdayStr)) return 0;

        let checkDate = activeDays.has(todayStr) ? new Date(today) : new Date(yesterday);
        
        while (true) {
            const checkStr = checkDate.toISOString().split('T')[0];
            if (activeDays.has(checkStr)) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
        return currentStreak;
    }

    function resetCrowns() {
        ['solvedCrown1', 'solvedCrown2', 'streakCrown1', 'streakCrown2'].forEach(id => {
            document.getElementById(id).classList.add('hidden');
        });
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }
});