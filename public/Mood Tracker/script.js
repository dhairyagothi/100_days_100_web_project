document.addEventListener('DOMContentLoaded', () => {
    const moodButtons = Array.from(document.querySelectorAll('.mood-button'));
    const intensitySlider = document.getElementById('intensity');
    const intensityValue = document.getElementById('intensity-value');
    const notesInput = document.getElementById('notes');
    const saveEntryButton = document.getElementById('save-entry');
    const entriesList = document.getElementById('entries-list');
    const entryDaysList = document.getElementById('entry-days-list');
    const moodSummary = document.getElementById('mood-summary');
    const moodChartCtx = document.getElementById('moodChart').getContext('2d');
    const toggleThemeButton = document.getElementById('toggle-theme');
    const themeIcon = document.getElementById('theme-icon');
    const moodMessage = document.createElement('p');
    moodMessage.style.marginTop = '10px';
    document.querySelector('.container').insertBefore(moodMessage, document.querySelector('.intensity-slider'));

    let selectedMood = null;
    const moodData = [];
    let moodChart;
    let moodStreak = 0;
    const achievements = {
        streaks: false,
        moodMaster: false
    };
    const moodGoals = {
        reduceStress: 0,
        increaseHappiness: 0
    };

    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                setDailyReminder();
            }
        });
    }

    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedMood = button.getAttribute('data-mood');
            console.log(`Selected Mood: ${selectedMood}`);
            moodButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            moodMessage.textContent = `You have selected: ${selectedMood}`;
            showRecommendations(selectedMood);
        });
    });

    intensitySlider.addEventListener('input', () => {
        intensityValue.textContent = intensitySlider.value;
        console.log(`Intensity: ${intensitySlider.value}`);
    });

    saveEntryButton.addEventListener('click', () => {
        if (!selectedMood) {
            alert("Please select a mood before saving.");
            return;
        }
        const notes = notesInput.value;
        const intensity = intensitySlider.value;
        const date = new Date().toLocaleDateString();
        const entry = { mood: selectedMood, intensity, notes, date };
        console.log('Entry Saved:', entry);
        moodData.push(entry);

        // Remove default messages if present
        removeDefaultMessages();

        addEntryToList(entry);
        addEntryDay(entry);
        updateMoodChart();
        updateMoodSummary();
        sendPositiveReinforcement();
        updateMoodStreak();
        checkAchievements();
        trackMoodGoals();
    });

    toggleThemeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    });

    function removeDefaultMessages() {
        const defaultEntryMessage = entriesList.querySelector('.collection-item');
        const defaultDayMessage = entryDaysList.querySelector('.collection-item');
        if (defaultEntryMessage && defaultEntryMessage.textContent.includes('No entries yet')) {
            defaultEntryMessage.remove();
        }
        if (defaultDayMessage && defaultDayMessage.textContent.includes('No entries yet')) {
            defaultDayMessage.remove();
        }
    }

    function addEntryToList(entry) {
        const listItem = document.createElement('li');
        const moodEmoji = moodButtons.find(button => button.getAttribute('data-mood') === entry.mood).textContent;
        listItem.className = 'collection-item';
        listItem.innerHTML = `
            Date: ${entry.date}, Mood: ${entry.mood} ${moodEmoji}, Intensity: ${entry.intensity}, Notes: ${entry.notes}
            <button class="delete-entry btn-small red right">Delete</button>
        `;
        entriesList.appendChild(listItem);

        // Add event listener for the delete button
        listItem.querySelector('.delete-entry').addEventListener('click', () => {
            removeEntry(entry, listItem);
        });
    }

    function removeEntry(entry, listItem) {
        // Remove the entry from the moodData array
        const index = moodData.findIndex(e => e.date === entry.date && e.mood === entry.mood && e.intensity === entry.intensity && e.notes === entry.notes);
        if (index !== -1) {
            moodData.splice(index, 1);
        }

        // Remove the list item from the DOM
        listItem.remove();

        // Update the chart and summary
        updateMoodChart();
        updateMoodSummary();
    }

    function addEntryDay(entry) {
        const existingDay = Array.from(entryDaysList.children).find(day => day.textContent === entry.date);
        if (!existingDay) {
            const dayItem = document.createElement('li');
            dayItem.className = 'collection-item';
            dayItem.textContent = entry.date;
            entryDaysList.appendChild(dayItem);
        }
    }

    function updateMoodChart() {
        if (moodChart) {
            moodChart.destroy();
        }

        const labels = moodData.map(entry => entry.date);
        const data = moodData.map(entry => entry.intensity);
        const backgroundColors = moodData.map(entry => {
            switch (entry.mood) {
                case 'Happy': return 'rgba(255, 255, 0, 0.5)';
                case 'Sad': return 'rgba(0, 0, 255, 0.5)';
                case 'Angry': return 'rgba(255, 0, 0, 0.5)';
                case 'Calm': return 'rgba(0, 255, 0, 0.5)';
                case 'Excited': return 'rgba(255, 165, 0, 0.5)';
                default: return 'rgba(200, 200, 200, 0.5)';
            }
        });

        moodChart = new Chart(moodChartCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Mood Intensity',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(color => color.replace('0.5', '1')),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 10
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const entry = moodData[context.dataIndex];
                                return `Mood: ${entry.mood}, Intensity: ${entry.intensity}`;
                            }
                        }
                    }
                }
            }
        });
    }

    function updateMoodSummary() {
        const moodCounts = moodData.reduce((acc, entry) => {
            acc[entry.mood] = (acc[entry.mood] || 0) + 1;
            return acc;
        }, {});

        const mostFrequentMood = Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b, '');
        moodSummary.textContent = `Most frequent mood: ${mostFrequentMood}`;
    }

    function setDailyReminder() {
        const now = new Date();
        const nextReminder = new Date();
        nextReminder.setHours(9, 0, 0, 0);

        if (now > nextReminder) {
            nextReminder.setDate(nextReminder.getDate() + 1);
        }

        const timeUntilReminder = nextReminder - now;
        setTimeout(() => {
            new Notification("Mood Tracker", {
                body: "How are you feeling today?",
                icon: "path/to/icon.png"
            });
            setInterval(() => {
                new Notification("Mood Tracker", {
                    body: "How are you feeling today?",
                    icon: "path/to/icon.png"
                });
            }, 24 * 60 * 60 * 1000);
        }, timeUntilReminder);
    }

    function sendPositiveReinforcement() {
        const quotes = [
            "Keep smiling, you're doing great!",
            "Every day is a new beginning.",
            "Believe in yourself and all that you are.",
            "Stay positive, work hard, make it happen."
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification("Positive Vibes", {
                body: randomQuote,
                icon: "path/to/icon.png"
            });
        }
    }

    function showRecommendations(mood) {
        const recommendations = {
            Happy: {
                music: "https://open.spotify.com/playlist/37i9dQZF1DXdPec7aLTmlC", // Example Spotify playlist
                quote: "Happiness is not something ready-made. It comes from your own actions.",
                activity: "Go for a walk or dance to your favorite music!"
            },
            Sad: {
                music: "https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0",
                quote: "This too shall pass.",
                activity: "Try journaling or talking to a friend."
            },
            Angry: {
                music: "https://open.spotify.com/playlist/37i9dQZF1DX3YSRoSdA634",
                quote: "For every minute you remain angry, you give up sixty seconds of peace of mind.",
                activity: "Consider meditation or deep breathing exercises."
            },
            Calm: {
                music: "https://open.spotify.com/playlist/37i9dQZF1DX3Ogo9pFvBkY",
                quote: "Peace comes from within. Do not seek it without.",
                activity: "Enjoy a quiet moment with a book or a cup of tea."
            },
            Excited: {
                music: "https://open.spotify.com/playlist/37i9dQZF1DX1s9knjP51Oa",
                quote: "The only way to do great work is to love what you do.",
                activity: "Channel your energy into a creative project or workout."
            }
        };

        const recommendation = recommendations[mood];
        const recommendationsContent = document.getElementById('recommendations-content');
        if (recommendation) {
            recommendationsContent.innerHTML = `
                <p><strong>Music:</strong> <a href="${recommendation.music}" target="_blank">Listen on Spotify</a></p>
                <p><strong>Quote:</strong> "${recommendation.quote}"</p>
                <p><strong>Activity:</strong> ${recommendation.activity}</p>
            `;
        }
    }

    function updateMoodStreak() {
        const today = new Date().toLocaleDateString();
        const lastEntryDate = moodData[moodData.length - 2]?.date;
        if (lastEntryDate && new Date(lastEntryDate).getTime() === new Date(today).getTime() - 86400000) {
            moodStreak++;
        } else {
            moodStreak = 1;
        }
        if (moodStreak >= 7 && !achievements.streaks) {
            achievements.streaks = true;
            alert("Congratulations! You've earned a badge for a 7-day mood tracking streak!");
        }
    }

    function checkAchievements() {
        const moodCounts = moodData.reduce((acc, entry) => {
            acc[entry.mood] = (acc[entry.mood] || 0) + 1;
            return acc;
        }, {});

        if (moodCounts.Happy >= 10 && !achievements.moodMaster) {
            achievements.moodMaster = true;
            alert("Achievement unlocked: Mood Master! You've logged 'Happy' 10 times!");
        }
    }

    function trackMoodGoals() {
        const stressDays = moodData.filter(entry => entry.mood === 'Sad' || entry.mood === 'Angry').length;
        const happyDays = moodData.filter(entry => entry.mood === 'Happy').length;

        if (stressDays < moodGoals.reduceStress) {
            moodGoals.reduceStress = stressDays;
            alert("Great job! You've reduced your stress days!");
        }

        if (happyDays > moodGoals.increaseHappiness) {
            moodGoals.increaseHappiness = happyDays;
            alert("Awesome! You've increased your happy days!");
        }
    }
});
