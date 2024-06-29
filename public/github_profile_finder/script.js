const url = "https://api.github.com/users/";
const get = (element) => document.getElementById(`${element}`);


const input = get("input");
const btn = get("btn");


btn.addEventListener('click', () => {
    if (input.value !== "") {
        getUserData(url + input.value);
    }
})

input.addEventListener('keydown', (e) => {
    // console.log(e.key);
    if (e.key === 'Enter') {
        if (input.value !== "") {
            getUserData(url + input.value);
        }
    }
}, false);

async function getUserData(gitUrl) {
    const response = await fetch(gitUrl);
    const data = await response.json();
    if (!data) {
        throw data;
    }
    updateProfile(data);
    // return data;
}

let dateSegment;
const noResults = get("noResults");

function updateProfile(data) {
    noResults.style.scale = 0;
    if (data.message !== "Not Found") {
        function checkNull(apiItem, domItem) {
            if (apiItem === "" || apiItem === null) {
                domItem.style.opacity = 0.5;
                domItem.previousElementSibling.style.opacity = 0.5;
                return false;
            }
            else {
                return true;
            }
        }
        const userImage = get("userImage");
        const name = get("name");
        const username = get("username");
        const date = get("date");
        const repos = get("repos");
        const followers = get("followers");
        const following = get("following");
        const profileBio = get("profileBio");
        const location = get("location");
        const website = get("website");
        const twitter = get("twitter");
        const company = get("company");
        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


        // console.log(name);
        userImage.src = `${data.avatar_url}`;
        name.innerText = data?.name;
        username.innerText = `@${data?.login}`;
        username.href = data?.html_url;
        dateSegment = data?.created_at.split("T").shift().split("-");
        date.innerText = `Joined ${dateSegment[2]} ${month[dateSegment[1] - 1]} ${dateSegment[0]}`;

        profileBio.innerText = (data?.bio === null) ? "This Profile has no Bio" : data?.bio;;

        repos.innerText = data?.public_repos;
        repos.href = data?.repos_url;
        followers.innerText = data?.followers;
        followers.href = data?.followers_url;
        following.innerText = data?.following;
        following.href = data?.following_url;

        location.innerText = checkNull(data?.location, location) ? data?.location : "Not Available";

        website.innerText = checkNull(data?.blog, website) ? data?.blog : "Not Available";

        website.href = checkNull(data?.blog, website) ? data?.blog : "#";

        twitter.innerText = checkNull(data?.twitter_username, twitter) ? data?.twitter_username : "Not Available";

        twitter.href = checkNull(data?.twitter_username, twitter) ? `https://twitter.com/${data?.twitter_username}` : "#";

        company.innerText = checkNull(data?.company, company) ? data?.company : "Not Available";
    }
    else {
        noResults.style.scale = 1;
        setTimeout(() => {
            noResults.style.scale = 0;
        }, 2500);
    }
}


// Dark And Light Mode 
const modeBtn = get("modeBtn");
const modeText = get("modeText");
const modeIcon = get("modeIcon");
let darkMode = false;
const root = document.documentElement.style;

modeBtn.addEventListener("click", () => {

    if (darkMode === false) {
        enableDarkMode();
    }
    else {
        enableLightMode();
    }
});

function enableDarkMode() {
    root.setProperty("--lm-bg", "#141D2F");
    root.setProperty("--lm-bg-content", "#1E2A47");
    root.setProperty("--lm-text", "white");
    root.setProperty("--lm-text-alt", "white");
    root.setProperty("--lm-shadow-xl", "rgba(70,88,109,0.15)");
    modeText.innerText = "LIGHT";
    modeIcon.src = "./Images/sun-icon.svg";
    root.setProperty("--lm-icon-bg", "brightness(1000%)");
    darkMode = true;
    localStorage.setItem("dark-mode", true);

}

function enableLightMode() {
    root.setProperty("--lm-bg", "#F6F8FF");
    root.setProperty("--lm-bg-content", "#FEFEFE");
    root.setProperty("--lm-text", "#4B6A9B");
    root.setProperty("--lm-text-alt", "#2B3442");
    root.setProperty("--lm-shadow-xl", "rgba(70, 88, 109, 0.25)");
    modeText.innerText = "DARK";
    modeIcon.src = "./Images/moon-icon.svg";
    root.setProperty("--lm-icon-bg", "brightness(100%)");
    darkMode = false;
    localStorage.setItem("dark-mode", false);
}


// This code checks if the user's device has a preference for dark mode
const prefersDarkMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;

// Check if there is a value for "dark-mode" in the user's localStorage
if (localStorage.getItem("dark-mode") === null) {
    // If there is no value for "dark-mode" in localStorage, check the device preference
    if (prefersDarkMode) {
        // If the device preference is for dark mode, apply dark mode properties
        enableDarkMode();
    } else {
        // If the device preference is not for dark mode, apply light mode properties
        enableLightMode();
    }
} else {
    // If there is a value for "dark-mode" in localStorage, use that value instead of device preference
    if (localStorage.getItem("dark-mode") === "true") {
        // If the value is "true", apply dark mode properties
        enableDarkMode();
    } else {
        // If the value is not "true", apply light mode properties
        enableLightMode();
    }
}

getUserData(url + "priyansh70");
