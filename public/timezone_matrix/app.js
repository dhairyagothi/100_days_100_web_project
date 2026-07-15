/**
 * TimeZone Matrix Logic Engine
 * Handles timezone offsets and dynamically maps overlapping golden hours (9 AM - 6 PM).
 */

// Initial default pinned locations list state structure layout
let pinnedCities = [
    { id: "1", name: "Mumbai (Local)", zone: "Asia/Kolkata" },
    { id: "2", name: "London", zone: "Europe/London" },
    { id: "3", name: "New York", zone: "America/New_York" }
];

// Document Object Handle Mappings references
const rowsContainer = document.getElementById('timezone-rows-container');
const citySelector = document.getElementById('city-selector');
const addCityBtn = document.getElementById('add-city-btn');
const globalSlider = document.getElementById('global-hour-slider');
const currentHourLabel = document.getElementById('current-hour-label');

/**
 * Formats basic numerical integer indexing properties into standard human-readable 12-hour values.
 * @param {number} hour - Base 24-hour marker input integer index.
 * @returns {string} String sequence formatting match (e.g. "04:00 PM")
 */
function formatAmPm(hour) {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    let displayHour = hour % 12;
    displayHour = displayHour ? displayHour : 12; // Handle evaluate block zero index to 12 map
    return `${displayHour}:00 ${ampm}`;
}

/**
 * Calculates time offset map relationships between system local environments and requested IANA zones.
 * @param {number} baseLocalHour - Selected standard hours metric input from control slider track.
 * @param {string} targetZone - The IANA target timezone name lookup string token identifier property.
 * @returns {Array<Object>} Evaluated 24-element metadata list tracking corresponding hour values.
 */
function computeTimelineHours(baseLocalHour, targetZone) {
    const timeline = [];
    const now = new Date();
    
    // Establish absolute timestamp anchors bound to selected slider hour settings parameters
    const baseAnchor = new Date(now.getFullYear(), now.getMonth(), now.getDate(), baseLocalHour, 0, 0);

    for (let h = 0; h < 24; h++) {
        // Offset relative distance shifts matching looping sequences
        const offsetDate = new Date(baseAnchor.getTime() + ((h - baseLocalHour) * 60 * 60 * 1000));
        
        // Convert explicit timestamp boundaries to target target configuration structures
        const targetString = offsetDate.toLocaleString("en-US", { timeZone: targetZone, hour: 'numeric', hour12: false });
        const calculatedTargetHour = parseInt(targetString, 10) % 24;

        timeline.push({
            gridIndex: h,
            hourValue: calculatedTargetHour,
            isGoldenZone: calculatedTargetHour >= 9 && calculatedTargetHour <= 18,
            isSelectedActive: h === baseLocalHour
        });
    }
    return timeline;
}

/**
 * Main Interface Assembly Update Pipeline Execution Routine
 */
function renderMatrixView() {
    const activeBaseHour = parseInt(globalSlider.value, 10);
    currentHourLabel.innerText = formatAmPm(activeBaseHour);
    
    // Wipe track display nodes array map layout fully
    rowsContainer.innerHTML = '';

    pinnedCities.forEach(city => {
        const rowWrapper = document.createElement('div');
        rowWrapper.className = 'timezone-row';

        // Calculate dynamic timing matrix array sets mapping to specific row locations data values
        const hoursDataArray = computeTimelineHours(activeBaseHour, city.zone);
        
        // Find current display string sequence mapping for meta layout visualization tracking targets
        const currentZoneTimeStr = new Date().toLocaleTimeString("en-US", {
            timeZone: city.zone, hour: '2-digit', minute: '2-digit'
        });

        // 1. Meta Column Structure Injection Section Mapping
        const metaCol = document.createElement('div');
        metaCol.className = 'location-meta';
        metaCol.innerHTML = `<h3>${city.name}</h3><p>${currentZoneTimeStr} • ${city.zone.split('/')[1].replace('_', ' ')}</p>`;
        rowWrapper.appendChild(metaCol);

        // 2. Timeline Strip Track Wrapper Mapping Container Section
        const trackCol = document.createElement('div');
        trackCol.className = 'timeline-track';

        hoursDataArray.forEach(node => {
            const nodeDiv = document.createElement('div');
            nodeDiv.className = 'hour-node';
            nodeDiv.innerText = node.hourValue;

            // Apply appropriate conditional visual class adjustments
            if (node.isGoldenZone) nodeDiv.classList.add('golden-zone');
            if (node.isSelectedActive) nodeDiv.classList.add('selected-active');

            trackCol.appendChild(nodeDiv);
        });
        rowWrapper.appendChild(trackCol);

        // 3. Remove Action Controls Node Mapping Component Injection Anchor
        const actionCol = document.createElement('button');
        actionCol.className = 'btn-remove';
        actionCol.innerHTML = '×';
        actionCol.title = `Remove ${city.name}`;
        actionCol.onclick = () => {
            pinnedCities = pinnedCities.filter(item => item.id !== city.id);
            renderMatrixView();
        };
        rowWrapper.appendChild(actionCol);

        rowsContainer.appendChild(rowWrapper);
    });
}

// Attach Component Event Interface Action Callbacks Hooks Mapping
globalSlider.oninput = renderMatrixView;

addCityBtn.onclick = () => {
    const selectedZone = citySelector.value;
    const cleanLabelName = citySelector.options[citySelector.selectedIndex].text.split('(')[0].trim();

    // Prevent duplicate entries from saturating layout track matrices panels view
    if (pinnedCities.some(city => city.zone === selectedZone)) {
        alert("This global location has already been pinned to your scheduling tracking board matrix workflow.");
        return;
    }

    pinnedCities.push({
        id: Date.now().toString(),
        name: cleanLabelName,
        zone: selectedZone
    });

    renderMatrixView();
};

// Fire initial view engine rendering pass
renderMatrixView();