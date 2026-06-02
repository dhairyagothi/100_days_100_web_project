document.addEventListener("DOMContentLoaded", () => {
    const foodForm = document.getElementById("foodForm");
    const geoBtn = document.getElementById("geoBtn");
    const locationStatus = document.getElementById("locationStatus");
    const locationCoords = document.getElementById("locationCoords");
    const foodList = document.getElementById("foodList");
    const noFoodMessage = document.getElementById("noFoodMessage");

    // Array to store active donations (In real app, this comes from a database)
    let donations = [];

    // 1. Geolocation API Integration
    geoBtn.addEventListener("click", () => {
        if (!navigator.geolocation) {
            locationStatus.textContent = "Geolocation is not supported by your browser";
            return;
        }

        locationStatus.textContent = "Locating...";
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(4);
                const lon = position.coords.longitude.toFixed(4);
                locationCoords.value = `${lat},${lon}`;
                locationStatus.textContent = `📍 Location Secured (${lat}, ${lon})`;
                geoBtn.textContent = "Change Location";
                geoBtn.style.backgroundColor = "#20c997";
            },
            () => {
                locationStatus.textContent = "Unable to retrieve location. Using default.";
                locationCoords.value = "28.6139,77.2090"; // Default Delhi Coords
            }
        );
    });

    // 2. Handle Form Submission
    foodForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const foodItem = document.getElementById("foodItem").value;
        const donorName = document.getElementById("donorName").value;
        const expiryHours = parseInt(document.getElementById("expiryHours").value);
        const coords = locationCoords.value || "28.6139,77.2090";

        // Calculate exact expiration time
        const expiryTime = new Date();
        expiryTime.setHours(expiryTime.getHours() + expiryHours);

        const newDonation = {
            id: Date.now(),
            foodItem,
            donorName,
            expiryTime,
            coords,
            addedTime: new Date()
        };

        donations.unshift(newDonation); // Add new donation to top
        updateDashboard();

        // Reset Form
        foodForm.reset();
        locationStatus.textContent = "";
        geoBtn.textContent = "📍 Get My Location";
        geoBtn.style.backgroundColor = "#17a2b8";
    });

    // 3. Update Dashboard UI & Live Countdowns
    function updateDashboard() {
        foodList.innerHTML = "";
        const now = new Date();

        // Filter out expired food
        donations = donations.filter(d => new Date(d.expiryTime) > now);

        if (donations.length === 0) {
            noFoodMessage.style.display = "block";
            return;
        } else {
            noFoodMessage.style.display = "none";
        }

        donations.forEach(donation => {
            const timeLeftMs = new Date(donation.expiryTime) - now;
            const timeLeftHours = Math.ceil(timeLeftMs / (1000 * 60 * 60));

            // Determine urgency
            const isUrgent = timeLeftHours <= 2;
            const badgeClass = isUrgent ? "badge-urgent" : "badge-fresh";
            const badgeText = isUrgent ? `Expires in ${timeLeftHours}h!` : `${timeLeftHours}h left`;

            const card = document.createElement("div");
            card.className = "food-card";
            if (isUrgent) card.style.borderLeftColor = "#dc3545";

            card.innerHTML = `
                <span class="badge ${badgeClass}">${badgeText}</span>
                <h3>${donation.foodItem}</h3>
                <p><strong>From:</strong> ${donation.donorName}</p>
                <p><strong>Posted:</strong> ${donation.addedTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                
                <div class="action-links">
                    <a href="https://www.google.com/maps/search/?api=1&query=${donation.coords}" target="_blank" class="action-btn">🗺️ View Map</a>
                    <a href="https://wa.me/?text=Hi, I am interested in collecting the surplus food (${donation.foodItem}) listed on AaharShare." target="_blank" class="action-btn" style="color: #25D366;">💬 Claim on WhatsApp</a>
                </div>
            `;
            foodList.appendChild(card);
        });
    }

    // Auto-refresh dashboard every 60 seconds to update timers
    setInterval(updateDashboard, 60000);
});