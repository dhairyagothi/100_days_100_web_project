// ===== DOM ELEMENTS =====
const ip = document.getElementById("ip");
const locationText = document.getElementById("location");
const timezone = document.getElementById("timezone");
const isp = document.getElementById("isp");
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const clearBtn = document.getElementById("clearBtn");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");
const locateMeBtn = document.getElementById("locateMeBtn");
const toast = document.getElementById("toast");
const toastText = document.getElementById("toastText");

// Extra info elements
const countryCode = document.getElementById("countryCode");
const postalCode = document.getElementById("postalCode");
const coordinates = document.getElementById("coordinates");
const currency = document.getElementById("currency");

let map;
let marker;
let circle;

// ===== CUSTOM MAP MARKER =====
const customIcon = L.divIcon({
  className: "custom-marker",
  html: `
    <div style="
      width: 30px;
      height: 30px;
      background: linear-gradient(135deg, #6366f1, #4f46e5);
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid white;
      box-shadow: 0 4px 15px rgba(99,102,241,0.5);
      position: relative;
    ">
      <div style="
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      "></div>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

// ===== SHOW SKELETON LOADING =====
function showSkeletons() {
  const skeletonHTML = '<span class="skeleton"></span>';
  ip.innerHTML = skeletonHTML;
  locationText.innerHTML = skeletonHTML;
  timezone.innerHTML = skeletonHTML;
  isp.innerHTML = skeletonHTML;
}

// ===== HIDE ERROR =====
function hideError() {
  errorMessage.classList.add("hidden");
}

// ===== SHOW ERROR =====
function showError(message) {
  errorText.textContent = message;
  errorMessage.classList.remove("hidden");
}

// ===== SHOW TOAST =====
function showToast(message) {
  toastText.textContent = message;
  toast.classList.remove("hidden");

  // Force reflow for animation restart
  void toast.offsetWidth;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.classList.add("hidden"), 300);
  }, 2000);
}

// ===== VALIDATE IP ADDRESS =====
function isValidIP(str) {
  // IPv4
  const ipv4Regex =
    /^(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
  // Basic domain check
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;

  return ipv4Regex.test(str) || domainRegex.test(str);
}

// ===== FETCH IP DATA =====
async function fetchIPData(query = "") {
  hideError();
  showSkeletons();

  // Set button to loading state
  searchBtn.classList.add("loading");
  const btnIcon = searchBtn.querySelector("i");
  const originalIconClass = btnIcon.className;
  btnIcon.className = "fas fa-spinner";

  try {
    let url;

    if (query.trim() === "") {
      url = "https://ipapi.co/json/";
    } else {
      // Validate before fetching
      if (!isValidIP(query.trim())) {
        showError("Please enter a valid IP address or domain");
        resetCardsFallback();
        return;
      }
      url = `https://ipapi.co/${query.trim()}/json/`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      showError(data.reason || "Unable to find information for this IP");
      resetCardsFallback();
      return;
    }

    updateUI(data);
  } catch (error) {
    showError("Failed to fetch data. Please check your connection.");
    resetCardsFallback();
    console.error(error);
  } finally {
    // Reset button loading state
    searchBtn.classList.remove("loading");
    btnIcon.className = originalIconClass;
  }
}

// ===== RESET CARDS ON ERROR =====
function resetCardsFallback() {
  ip.textContent = "N/A";
  locationText.textContent = "N/A";
  timezone.textContent = "N/A";
  isp.textContent = "N/A";
  countryCode.textContent = "--";
  postalCode.textContent = "--";
  coordinates.textContent = "--";
  currency.textContent = "--";
}

// ===== UPDATE UI =====
function updateUI(data) {
  // Animate card content appearance
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.style.animation = "none";
    void card.offsetWidth;
    card.style.animation = "cardSlideUp 0.5s ease backwards";
  });

  ip.textContent = data.ip || "N/A";

  const locationParts = [data.city, data.region, data.country_name].filter(
    Boolean
  );
  locationText.textContent =
    locationParts.length > 0 ? locationParts.join(", ") : "N/A";

  timezone.textContent = data.utc_offset
    ? `UTC ${data.utc_offset} (${data.timezone || ""})`
    : data.timezone || "N/A";

  isp.textContent = data.org || "N/A";

  // Extra info
  countryCode.textContent = data.country_code || "--";
  postalCode.textContent = data.postal || "--";
  currency.textContent = data.currency_name
    ? `${data.currency_name} (${data.currency || ""})`
    : data.currency || "--";

  const lat = data.latitude;
  const lon = data.longitude;

  coordinates.textContent =
    lat && lon ? `${lat.toFixed(4)}, ${lon.toFixed(4)}` : "--";

  if (!lat || !lon) return;

  // Initialize or update map
  if (!map) {
    map = L.map("map", {
      zoomControl: true,
      scrollWheelZoom: true,
    }).setView([lat, lon], 13);

    // Use a nicer tile layer
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
      }
    ).addTo(map);

    marker = L.marker([lat, lon], { icon: customIcon }).addTo(map);

    // Add accuracy circle
    circle = L.circle([lat, lon], {
      color: "#6366f1",
      fillColor: "#6366f1",
      fillOpacity: 0.1,
      radius: 1500,
      weight: 1,
    }).addTo(map);

    // Bind popup
    marker
      .bindPopup(
        `<div style="text-align:center;font-family:system-ui;padding:4px;">
        <strong style="font-size:14px;">${data.ip}</strong><br/>
        <span style="color:#666;font-size:12px;">${locationParts.join(", ")}</span>
      </div>`
      )
      .openPopup();
  } else {
    map.flyTo([lat, lon], 13, {
      animate: true,
      duration: 1.5,
    });

    marker.setLatLng([lat, lon]);
    circle.setLatLng([lat, lon]);

    marker
      .bindPopup(
        `<div style="text-align:center;font-family:system-ui;padding:4px;">
        <strong style="font-size:14px;">${data.ip}</strong><br/>
        <span style="color:#666;font-size:12px;">${locationParts.join(", ")}</span>
      </div>`
      )
      .openPopup();
  }
}

// ===== EVENT LISTENERS =====

// Search button click
searchBtn.addEventListener("click", () => {
  fetchIPData(searchInput.value);
});

// Enter key in search input
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    fetchIPData(searchInput.value);
  }
});

// Show/hide clear button based on input
searchInput.addEventListener("input", () => {
  if (searchInput.value.length > 0) {
    clearBtn.classList.remove("hidden");
  } else {
    clearBtn.classList.add("hidden");
  }
  hideError();
});

// Clear button
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  clearBtn.classList.add("hidden");
  searchInput.focus();
  hideError();
});

// Locate me button - reset to own IP
locateMeBtn.addEventListener("click", () => {
  searchInput.value = "";
  clearBtn.classList.add("hidden");
  hideError();
  fetchIPData();
});

// Copy buttons
document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-copy");
    const targetEl = document.getElementById(targetId);
    const text = targetEl.textContent;

    if (text && text !== "N/A" && !targetEl.querySelector(".skeleton")) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          btn.classList.add("copied");
          const icon = btn.querySelector("i");
          icon.className = "fas fa-check";

          showToast(`Copied: ${text}`);

          setTimeout(() => {
            btn.classList.remove("copied");
            icon.className = "fas fa-copy";
          }, 1500);
        })
        .catch(() => {
          showToast("Failed to copy");
        });
    }
  });
});

// ===== INITIAL FETCH =====
fetchIPData();