const fileSizeInp = document.getElementById('file-size');
const fileUnitSel = document.getElementById('file-unit');
const networkSpeedInp = document.getElementById('network-speed');
const speedUnitSel = document.getElementById('speed-unit');

const timeDisplay = document.getElementById('time-display');
const actualRateTxt = document.getElementById('actual-rate');

// Matrix Target Selectors
const mTb = document.getElementById('m-tb');
const mGb = document.getElementById('m-gb');
const mMb = document.getElementById('m-mb');
const mKb = document.getElementById('m-kb');

function updateDashboard() {
    const rawSize = parseFloat(fileSizeInp.value) || 0;
    const rawSpeed = parseFloat(networkSpeedInp.value) || 0;

    // --- Part 1: Real-time Storage Matrix Calculations ---
    // Standardize input size down to core Megabytes (MB)
    let sizeInMB = 0;
    if (rawSize > 0) {
        switch (fileUnitSel.value) {
            case 'TB': sizeInMB = rawSize * 1024 * 1024; break;
            case 'GB': sizeInMB = rawSize * 1024; break;
            case 'MB': sizeInMB = rawSize; break;
            case 'KB': sizeInMB = rawSize / 1024; break;
        }
    }

    // Populate all units dynamically from the common MB anchor base
    mTb.textContent = `${(sizeInMB / (1024 * 1024)).toFixed(4)} TB`;
    mGb.textContent = `${(sizeInMB / 1024).toFixed(4)} GB`;
    mMb.textContent = `${sizeInMB.toLocaleString(undefined, {minimumFractionDigits: 1, maximumFractionDigits: 1})} MB`;
    mKb.textContent = `${Math.round(sizeInMB * 1024).toLocaleString()} KB`;

    // --- Part 2: Time Duration Engine Calculations ---
    if (rawSize <= 0 || rawSpeed <= 0) {
        timeDisplay.textContent = "00h 00m 00s";
        actualRateTxt.textContent = "0 MB/s";
        return;
    }

    // Convert network bandwidth into absolute actual download output rate (MB/s)
    let speedInMBps = 0;
    switch (speedUnitSel.value) {
        case 'Gbps': speedInMBps = (rawSpeed * 1024) / 8; break; // Gigabit to Megabit to Megabyte
        case 'Mbps': speedInMBps = rawSpeed / 8; break;          // Megabit to Megabyte
        case 'Kbps': speedInMBps = rawSpeed / (1024 * 8); break;  // Kilobit to Megabyte
        case 'MBps': speedInMBps = rawSpeed; break;               // Already Megabytes per second
    }

    // Time equation: Duration = Size / Speed
    let totalSeconds = sizeInMB / speedInMBps;

    // Build structured timing units
    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const hStr = String(hours).padStart(2, '0') + 'h';
    const mStr = String(minutes).padStart(2, '0') + 'm';
    const sStr = String(seconds).padStart(2, '0') + 's';

    // Push calculations out to UI
    timeDisplay.textContent = `${hStr} ${mStr} ${sStr}`;
    
    // Dynamic fractional rounding for actual rate text readability
    if (speedInMBps >= 1024) {
        actualRateTxt.textContent = `${(speedInMBps / 1024).toFixed(2)} GB/s`;
    } else if (speedInMBps < 0.01) {
        actualRateTxt.textContent = `${(speedInMBps * 1024).toFixed(1)} KB/s`;
    } else {
        actualRateTxt.textContent = `${speedInMBps.toFixed(3)} MB/s`;
    }
}

// Attach event triggers across input modules
fileSizeInp.addEventListener('input', updateDashboard);
fileUnitSel.addEventListener('change', updateDashboard);
networkSpeedInp.addEventListener('input', updateDashboard);
speedUnitSel.addEventListener('change', updateDashboard);

// Run calculation loop once on load
updateDashboard();