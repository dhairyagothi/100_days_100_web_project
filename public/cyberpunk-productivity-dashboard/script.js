const commitsEl =
    document.getElementById("commits");

const streakEl =
    document.getElementById("streak");

const focusEl =
    document.getElementById("focus");

const consistencyEl =
    document.getElementById("consistency");

const activeDaysEl =
    document.getElementById("activeDays");

const fetchBtn =
    document.getElementById("fetchBtn");

const hoursInput =
    document.getElementById("hoursInput");

const saveHours =
    document.getElementById("saveHours");

const savedHours =
    document.getElementById("savedHours");

const avatar =
    document.getElementById("avatar");

const profileName =
    document.getElementById("profileName");

const bio =
    document.getElementById("bio");


let chartInstance;



// SAVE HOURS

saveHours.addEventListener("click", () => {

    const hours = Number(hoursInput.value);

    if(!hours) {
        alert("Enter coding hours");
        return;
    }

    localStorage.setItem(
        "codingHours",
        hours
    );

    savedHours.innerText =
        `Today's Hours: ${hours}`;

});



// LOAD HOURS

window.addEventListener("load", () => {

    const storedHours =
        localStorage.getItem("codingHours");

    if(storedHours) {

        savedHours.innerText =
            `Today's Hours: ${storedHours}`;

    }

});



// STREAK SYSTEM

function updateStreak() {

    const today =
        new Date().toDateString();

    let streakData =
        JSON.parse(
            localStorage.getItem("streakData")
        ) || {
            streak: 0,
            lastDate: null
        };

    if(streakData.lastDate === today) {

        streakEl.innerText =
            `${streakData.streak} Days`;

        return streakData.streak;
    }

    const yesterday = new Date();

    yesterday.setDate(
        yesterday.getDate() - 1
    );

    if(
        streakData.lastDate ===
        yesterday.toDateString()
    ) {
        streakData.streak += 1;
    }
    else {
        streakData.streak = 1;
    }

    streakData.lastDate = today;

    localStorage.setItem(
        "streakData",
        JSON.stringify(streakData)
    );

    streakEl.innerText =
        `${streakData.streak} Days`;

    return streakData.streak;

}



// FOCUS SCORE

function calculateFocus(repos, hours) {

    let score = 0;

    score += repos * 2;

    score += hours * 10;

    if(score > 100) {
        score = 100;
    }

    return score;

}



// SAVE HISTORY

function saveDailyProgress(score) {

    let history =
        JSON.parse(
            localStorage.getItem("history")
        ) || [];

    const today =
        new Date().toLocaleDateString();

    const alreadyExists =
        history.find(item => item.date === today);

    if(!alreadyExists) {

        history.push({
            date: today,
            score: score
        });

    }

    if(history.length > 7) {
        history.shift();
    }

    localStorage.setItem(
        "history",
        JSON.stringify(history)
    );

}



// CONSISTENCY

function calculateConsistency() {

    const history =
        JSON.parse(
            localStorage.getItem("history")
        ) || [];

    const activeDays = history.length;

    const consistency =
        Math.floor(
            (activeDays / 7) * 100
        );

    consistencyEl.innerText =
        `${consistency}%`;

    activeDaysEl.innerText =
        activeDays;

}



// BADGES

function unlockBadges(streak, focus, consistency) {

    const badges =
        document.querySelectorAll(".badge");

    if(streak >= 7) {
        badges[1].classList.add("unlocked");
    }

    if(focus >= 80) {
        badges[2].classList.add("unlocked");
    }

    if(consistency >= 70) {
        badges[3].classList.add("unlocked");
    }

}



// CHART

function renderChart() {

    const history =
        JSON.parse(
            localStorage.getItem("history")
        ) || [];



    // GENERATE DUMMY DATA IF TOO SMALL

    if(history.length < 7) {

        const fakeData = [];

        for(let i = 6; i >= 0; i--) {

            const date = new Date();

            date.setDate(date.getDate() - i);

            fakeData.push({

                date:
                    date.toLocaleDateString(),

                score:
                    Math.floor(Math.random() * 40) + 40

            });

        }

        localStorage.setItem(
            "history",
            JSON.stringify(fakeData)
        );

        history.push(...fakeData);

    }



    const labels =
        history.map(item => item.date);

    const scores =
        history.map(item => item.score);



    const ctx =
        document
        .getElementById("activityChart")
        .getContext("2d");



    // GRADIENT

    const gradient =
        ctx.createLinearGradient(0,0,0,400);

    gradient.addColorStop(
        0,
        "rgba(0,255,225,0.5)"
    );

    gradient.addColorStop(
        1,
        "rgba(255,0,255,0)"
    );



    if(chartInstance) {
        chartInstance.destroy();
    }



    chartInstance = new Chart(ctx, {

        type: "line",

        data: {

            labels: labels,

            datasets: [{

                label: "Dopamine Activity",

                data: scores,

                borderColor: "#00ffe1",

                backgroundColor: gradient,

                borderWidth: 3,

                pointBackgroundColor: "#ff00ff",

                pointBorderColor: "#00ffe1",

                pointRadius: 6,

                pointHoverRadius: 10,

                tension: 0.45,

                fill: true

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            interaction: {

                intersect: false,
                mode: "index"

            },

            plugins: {

                legend: {

                    labels: {

                        color: "#00ffe1",

                        font: {
                            size: 16
                        }

                    }

                }

            },

            scales: {

                x: {

                    grid: {

                        color:
                            "rgba(0,255,225,0.08)"

                    },

                    ticks: {

                        color: "#00ffe1"

                    }

                },

                y: {

                    min: 0,

                    max: 100,

                    grid: {

                        color:
                            "rgba(0,255,225,0.08)"

                    },

                    ticks: {

                        color: "#00ffe1"

                    }

                }

            }

        }

    });

}



// GITHUB FETCH

fetchBtn.addEventListener("click", async () => {

    const username =
        document
        .getElementById("username")
        .value
        .trim();

    if(username === "") {
        alert("Enter GitHub username");
        return;
    }

    try {

        // USER DATA

        const userResponse =
            await fetch(
                `https://api.github.com/users/${username}`
            );

        if(!userResponse.ok) {
            throw new Error("User not found");
        }

        const userData =
            await userResponse.json();



        // REPOSITORIES

        const repoResponse =
            await fetch(
                `https://api.github.com/users/${username}/repos`
            );

        const repos =
            await repoResponse.json();



        // PROFILE UPDATE

        avatar.src = userData.avatar_url;

        profileName.innerText =
            userData.name || username;

        bio.innerText =
            userData.bio || "No bio found.";




        // REPO COUNT

        const totalRepos =
            repos.length;

        commitsEl.innerText =
            totalRepos;




        // HOURS

        const storedHours =
            Number(
                localStorage.getItem("codingHours")
            ) || 0;




        // FOCUS

        const focus =
            calculateFocus(
                totalRepos,
                storedHours
            );

        focusEl.innerText =
            `${focus}%`;

        document
            .getElementById("dopamineFill")
            .style.width =
            `${focus}%`;




        // STREAK

        const streak =
            updateStreak();




        // HISTORY

        saveDailyProgress(focus);




        // CONSISTENCY

        calculateConsistency();

        const consistency =
            parseInt(
                consistencyEl.innerText
            );




        // BADGES

        unlockBadges(
            streak,
            focus,
            consistency
        );




        // GRAPH

        renderChart();

    }

    catch(error) {

        console.log(error);

        alert(error.message);

    }

});