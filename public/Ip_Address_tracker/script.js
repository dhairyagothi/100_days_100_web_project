const ip = document.getElementById("ip");
const locationText = document.getElementById("location");
const timezone = document.getElementById("timezone");
const isp = document.getElementById("isp");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");

let map;
let marker;

async function fetchIPData(query = "") {
    try {
        let url;

        if (query.trim() === "") {
            url = "https://ipapi.co/json/";
        } else {
            url = `https://ipapi.co/${query}/json/`;
        }

        const response = await fetch(url);
        const data = await response.json();

        updateUI(data);
    } catch (error) {
        alert("Failed to fetch data");
        console.log(error);
    }
}

function updateUI(data) {
    ip.textContent = data.ip || "N/A";

    locationText.textContent =
        `${data.city || ""}, ${data.region || ""}, ${data.country_name || ""}`;

    timezone.textContent = data.timezone || "N/A";

    isp.textContent = data.org || "N/A";

    const lat = data.latitude;
    const lon = data.longitude;

    if (!lat || !lon) return;

    if (!map) {
        map = L.map("map").setView([lat, lon], 13);

        L.tileLayer(
            "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    '&copy; OpenStreetMap contributors'
            }
        ).addTo(map);

        marker = L.marker([lat, lon]).addTo(map);
    } else {
        map.setView([lat, lon], 13);
        marker.setLatLng([lat, lon]);
    }
}

searchBtn.addEventListener("click", () => {
    fetchIPData(searchInput.value);
});

searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        fetchIPData(searchInput.value);
    }
});

fetchIPData();