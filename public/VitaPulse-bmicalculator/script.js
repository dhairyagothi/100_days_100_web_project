/* ==========================================================================
   VitaPulse Glassmorphism BMI Dashboard - Core Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- STATE ---
  let unitSystem = 'metric'; // 'metric' or 'imperial'
  let history = [];
  let currentBmi = 22.9;
  let chartInstance = null;
  let activeChartTab = 'bmi'; // 'bmi' or 'weight'

  // --- DOM ELEMENTS ---
  const themeToggle = document.getElementById('themeToggle');
  const dateText = document.getElementById('dateText');
  
  // Tabs
  const btnMetric = document.getElementById('btnMetric');
  const btnImperial = document.getElementById('btnImperial');
  
  // Groups
  const heightGroupMetric = document.getElementById('heightGroupMetric');
  const heightGroupImperial = document.getElementById('heightGroupImperial');
  const weightGroupMetric = document.getElementById('weightGroupMetric');
  const weightGroupImperial = document.getElementById('weightGroupImperial');
  
  // Inputs
  const ageInput = document.getElementById('ageInput');
  const heightCmInput = document.getElementById('heightCmInput');
  const heightFtInput = document.getElementById('heightFtInput');
  const heightInInput = document.getElementById('heightInInput');
  const weightKgInput = document.getElementById('weightKgInput');
  const weightLbsInput = document.getElementById('weightLbsInput');
  const activityInput = document.getElementById('activityInput');
  const genderRadios = document.getElementsByName('gender');
  const bmiForm = document.getElementById('bmiForm');
  
  // Displays (Values above Sliders)
  const ageVal = document.getElementById('ageVal');
  const heightCmVal = document.getElementById('heightCmVal');
  const heightFtVal = document.getElementById('heightFtVal');
  const heightInVal = document.getElementById('heightInVal');
  const weightKgVal = document.getElementById('weightKgVal');
  const weightLbsVal = document.getElementById('weightLbsVal');
  
  // Buttons
  const btnReset = document.getElementById('btnReset');
  const btnSave = document.getElementById('btnSave');
  const btnExportCSV = document.getElementById('btnExportCSV');
  const btnClearHistory = document.getElementById('btnClearHistory');
  
  // Outputs
  const bmiDisplay = document.getElementById('bmiDisplay');
  const categoryDisplay = document.getElementById('categoryDisplay');
  const healthyRangeVal = document.getElementById('healthyRangeVal');
  const idealWeightVal = document.getElementById('idealWeightVal');
  const calorieVal = document.getElementById('calorieVal');
  const calorieSub = document.getElementById('calorieSub');
  const lastCalcDate = document.getElementById('lastCalcDate');
  const lastCalcTime = document.getElementById('lastCalcTime');
  const tipsContent = document.getElementById('tipsContent');
  
  // Gauge elements
  const gaugeProgress = document.getElementById('gaugeProgress');
  const scalePointer = document.getElementById('scalePointer');
  
  // Table
  const historyList = document.getElementById('historyList');
  
  // Analytics
  const avgBmiText = document.getElementById('avgBmi');
  const maxBmiText = document.getElementById('maxBmi');
  const minBmiText = document.getElementById('minBmi');
  const btnBmiChart = document.getElementById('btnBmiChart');
  const btnWeightChart = document.getElementById('btnWeightChart');

  // --- INITIALIZE ---
  initApp();

  function initApp() {
    // Current date representation
    updateDateDisplay();
    
    // Load local storage
    loadThemeFromLocalStorage();
    loadHistoryFromLocalStorage();
    
    // Bind Event Listeners
    setupEventListeners();
    
    // Initial Run
    updateSliderLabels();
    calculateBmiAndMetrics();
    renderHistory();
    renderStats();
    initAnalyticsChart();
  }

  // --- DATE & TIME DISPLAY ---
  function updateDateDisplay() {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateText.textContent = today.toLocaleDateString('en-US', options);
  }

  // --- LOCALSTORAGE & PREFERENCES ---
  function loadThemeFromLocalStorage() {
    const isDark = localStorage.getItem('dark-theme') === 'true';
    if (isDark) {
      document.body.classList.add('dark-mode');
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
      document.body.classList.remove('dark-mode');
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
  }

  function loadHistoryFromLocalStorage() {
    const storedHistory = localStorage.getItem('bmi-history');
    if (storedHistory) {
      try {
        const parsed = JSON.parse(storedHistory);
        history = Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        history = [];
      }
    }
  }

  function saveHistoryToLocalStorage() {
    localStorage.setItem('bmi-history', JSON.stringify(history));
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Theme toggle click
    themeToggle.addEventListener('click', toggleTheme);

    // Tab clicks
    btnMetric.addEventListener('click', () => setUnitSystem('metric'));
    btnImperial.addEventListener('click', () => setUnitSystem('imperial'));

    // Input changes (Real-time calculation & value updates)
    const inputs = [
      ageInput, heightCmInput, heightFtInput, heightInInput,
      weightKgInput, weightLbsInput, activityInput
    ];
    inputs.forEach(input => {
      input.addEventListener('input', () => {
        updateSliderLabels();
        calculateBmiAndMetrics();
      });
    });

    genderRadios.forEach(radio => {
      radio.addEventListener('change', calculateBmiAndMetrics);
    });

    // Button actions
    btnReset.addEventListener('click', resetForm);
    btnSave.addEventListener('click', saveRecord);
    btnExportCSV.addEventListener('click', exportToCSV);
    btnClearHistory.addEventListener('click', clearAllHistory);

    // Analytics Chart Tabs
    btnBmiChart.addEventListener('click', () => toggleChartTab('bmi'));
    btnWeightChart.addEventListener('click', () => toggleChartTab('weight'));
  }

  // --- THEME TOGGLE ---
  function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('dark-theme', isDark);
    
    // Update theme toggle icon
    themeToggle.innerHTML = isDark 
      ? '<i class="fa-solid fa-sun"></i>' 
      : '<i class="fa-solid fa-moon"></i>';

    // Update Chart theme styling dynamically
    if (chartInstance) {
      updateChartColors();
      chartInstance.update();
    }
  }

  // --- UNIT CONVERSION & TAB SYSTEM ---
  function setUnitSystem(system) {
    if (unitSystem === system) return;
    
    unitSystem = system;

    if (system === 'metric') {
      btnMetric.classList.add('active');
      btnImperial.classList.remove('active');
      
      heightGroupMetric.classList.remove('hidden');
      heightGroupImperial.classList.add('hidden');
      weightGroupMetric.classList.remove('hidden');
      weightGroupImperial.classList.add('hidden');
      
      // Convert imperial slider values to metric
      const feet = parseInt(heightFtInput.value);
      const inches = parseInt(heightInInput.value);
      const lbs = parseInt(weightLbsInput.value);
      
      const totalInches = (feet * 12) + inches;
      const cm = Math.round(totalInches * 2.54);
      const kg = Math.round(lbs / 2.20462);
      
      heightCmInput.value = Math.max(100, Math.min(220, cm));
      weightKgInput.value = Math.max(30, Math.min(180, kg));
    } else {
      btnMetric.classList.remove('active');
      btnImperial.classList.add('active');
      
      heightGroupMetric.classList.add('hidden');
      heightGroupImperial.classList.remove('hidden');
      weightGroupMetric.classList.add('hidden');
      weightGroupImperial.classList.remove('hidden');
      
      // Convert metric slider values to imperial
      const cm = parseInt(heightCmInput.value);
      const kg = parseInt(weightKgInput.value);
      
      const totalInches = cm / 2.54;
      const feet = Math.floor(totalInches / 12);
      const inches = Math.round(totalInches % 12);
      const lbs = Math.round(kg * 2.20462);
      
      heightFtInput.value = Math.max(3, Math.min(8, feet));
      heightInInput.value = Math.max(0, Math.min(11, inches));
      weightLbsInput.value = Math.max(60, Math.min(400, lbs));
    }
    
    updateSliderLabels();
    calculateBmiAndMetrics();
    updateAnalyticsChart(); // Update charting weight units dynamically
  }

  function updateSliderLabels() {
    ageVal.textContent = ageInput.value;
    heightCmVal.textContent = heightCmInput.value;
    heightFtVal.textContent = heightFtInput.value;
    heightInVal.textContent = heightInInput.value;
    weightKgVal.textContent = weightKgInput.value;
    weightLbsVal.textContent = weightLbsInput.value;
  }

  // --- FORM ACTIONS ---
  function resetForm() {
    // Restore default slider states
    ageInput.value = 25;
    heightCmInput.value = 175;
    heightFtInput.value = 5;
    heightInInput.value = 9;
    weightKgInput.value = 70;
    weightLbsInput.value = 154;
    activityInput.value = 1.55;
    document.getElementsByName('gender')[0].checked = true; // Male default
    
    // Update labels and calculate
    updateSliderLabels();
    calculateBmiAndMetrics();
  }

  // --- BMI & HEALTH METRICS MATHEMATICS ---
  function calculateBmiAndMetrics() {
    let weightKg, heightM, heightCm;
    
    if (unitSystem === 'metric') {
      heightCm = parseInt(heightCmInput.value);
      heightM = heightCm / 100;
      weightKg = parseInt(weightKgInput.value);
    } else {
      const feet = parseInt(heightFtInput.value);
      const inches = parseInt(heightInInput.value);
      const weightLbs = parseInt(weightLbsInput.value);
      
      heightCm = ((feet * 12) + inches) * 2.54;
      heightM = heightCm / 100;
      weightKg = weightLbs * 0.45359237;
    }
    
    if (heightM <= 0 || weightKg <= 0) return;
    
    // BMI Core Calculation
    const bmi = weightKg / (heightM * heightM);
    currentBmi = parseFloat(bmi.toFixed(1));
    
    // Get BMI Category Details
    const categoryInfo = getBmiCategory(currentBmi);
    
    // Apply Category Class for Dashboard Theming
    updateDashboardThemeClass(categoryInfo.class);
    
    // Render Gauge & Scale Pointer
    updateGauge(currentBmi, categoryInfo.label);
    
    // Metrics Outputs: Healthy Range, Ideal weight, Calories (BMR / TDEE)
    // Healthy Range: 18.5 * H^2 to 24.9 * H^2
    const minHealthyKg = 18.5 * (heightM * heightM);
    const maxHealthyKg = 24.9 * (heightM * heightM);
    const idealKg = 21.7 * (heightM * heightM);
    
    if (unitSystem === 'metric') {
      healthyRangeVal.textContent = `${minHealthyKg.toFixed(1)} - ${maxHealthyKg.toFixed(1)} kg`;
      idealWeightVal.textContent = `${idealKg.toFixed(1)} kg`;
    } else {
      const minHealthyLbs = minHealthyKg * 2.20462;
      const maxHealthyLbs = maxHealthyKg * 2.20462;
      const idealLbs = idealKg * 2.20462;
      healthyRangeVal.textContent = `${Math.round(minHealthyLbs)} - ${Math.round(maxHealthyLbs)} lbs`;
      idealWeightVal.textContent = `${Math.round(idealLbs)} lbs`;
    }
    
    // Daily Calories (Mifflin-St Jeor BMR formula)
    // Men: 10 * W + 6.25 * H_cm - 5 * Age + 5
    // Women: 10 * W + 6.25 * H_cm - 5 * Age - 161
    const age = parseInt(ageInput.value);
    const genderChecked = document.querySelector('input[name="gender"]:checked');
    const isMale = genderChecked ? genderChecked.value === 'male' : true;
    const bmrOffset = isMale ? 5 : -161;
    const bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + bmrOffset;
    
    const activityMultiplier = parseFloat(activityInput.value);
    const tdee = Math.round(bmr * activityMultiplier);
    
    calorieVal.textContent = `${tdee.toLocaleString()} kcal`;
    
    // Adjust recommendation text depending on weight category
    let calorieGoalText = "To maintain weight";
    if (categoryInfo.class === 'cat-underweight') {
      calorieGoalText = `Gain weight (+500 kcal: ${(tdee + 500).toLocaleString()})`;
    } else if (categoryInfo.class === 'cat-overweight') {
      calorieGoalText = `Lose weight (-500 kcal: ${(tdee - 500).toLocaleString()})`;
    } else if (categoryInfo.class === 'cat-obese') {
      calorieGoalText = `Lose weight (-750 kcal: ${(tdee - 750).toLocaleString()})`;
    }
    calorieSub.textContent = calorieGoalText;
    
    // Load recommendations/health tips
    renderHealthTips(categoryInfo.class);
  }

  function getBmiCategory(bmi) {
    if (bmi < 18.5) {
      return { label: 'Underweight', class: 'cat-underweight', color: 'var(--color-underweight)' };
    } else if (bmi < 25.0) {
      return { label: 'Normal', class: 'cat-normal', color: 'var(--color-normal)' };
    } else if (bmi < 30.0) {
      return { label: 'Overweight', class: 'cat-overweight', color: 'var(--color-overweight)' };
    } else {
      return { label: 'Obese', class: 'cat-obese', color: 'var(--color-obese)' };
    }
  }

  function updateDashboardThemeClass(activeClass) {
    const container = document.querySelector('.app-container');
    container.classList.remove('cat-underweight', 'cat-normal', 'cat-overweight', 'cat-obese');
    container.classList.add(activeClass);
  }

  // --- SVG GAUGE & SCALE ANIMATION ---
  function updateGauge(bmi, categoryLabel) {
    // Text output
    bmiDisplay.textContent = bmi.toFixed(1);
    categoryDisplay.textContent = categoryLabel;
    
    // SVG Circumference = 439.82 (radius = 70)
    // Scale BMI range from 15 to 40 (25 units window)
    const minScale = 15;
    const maxScale = 40;
    
    let percentage = ((bmi - minScale) / (maxScale - minScale)) * 100;
    percentage = Math.max(0, Math.min(100, percentage)); // Clamp between 0% and 100%
    
    const circumference = 439.82;
    const offset = circumference - (percentage / 100) * circumference;
    
    // Update SVG dash offset
    gaugeProgress.style.strokeDashoffset = offset;
    
    // Update Horizontal scale pointer position (left percentage)
    scalePointer.style.left = `${percentage}%`;
  }

  // --- HEALTH RECOMMENDATIONS LOGIC ---
  function renderHealthTips(categoryClass) {
    let tips = [];
    
    switch (categoryClass) {
      case 'cat-underweight':
        tips = [
          { icon: 'fa-apple-whole', text: 'Increase calorie intake: Add healthy fats, nuts, seeds, and avocados to your meals.' },
          { icon: 'fa-dumbbell', text: 'Strength training: Focus on resistance exercises to build healthy muscle weight.' },
          { icon: 'fa-bowl-rice', text: 'Protein-rich diet: Aim for clean proteins like eggs, poultry, fish, tofu, or legumes.' }
        ];
        break;
      case 'cat-normal':
        tips = [
          { icon: 'fa-circle-check', text: 'Maintain current lifestyle: Keep consistency in your daily routines.' },
          { icon: 'fa-person-walking', text: 'Regular exercise: Aim for at least 150 minutes of moderate activity weekly.' },
          { icon: 'fa-carrot', text: 'Balanced diet: Incorporate rich portion diversity of vegetables, fruits, and whole grains.' }
        ];
        break;
      case 'cat-overweight':
        tips = [
          { icon: 'fa-heart-pulse', text: 'Cardio exercises: Increase active cardio sessions (running, cycling, swimming).' },
          { icon: 'fa-scale-balanced', text: 'Portion control: Use smaller plates and listen to satiety cues.' },
          { icon: 'fa-ban-smoking', text: 'Reduce sugar intake: Minimize soft drinks, sweets, and processed snacks.' }
        ];
        break;
      case 'cat-obese':
        tips = [
          { icon: 'fa-user-doctor', text: 'Consult healthcare professional: Talk to medical providers for personalized advice.' },
          { icon: 'fa-calendar-day', text: 'Daily exercise plan: Start with low-impact 20-30 minute walks to protect joints.' },
          { icon: 'fa-clipboard-list', text: 'Weight-loss guidelines: Track calorie targets closely and emphasize high-fiber foods.' }
        ];
        break;
      default:
        tips = [];
    }
    
    tipsContent.innerHTML = tips.map(tip => `
      <div class="tip-item">
        <i class="fa-solid ${tip.icon} text-accent"></i>
        <p>${tip.text}</p>
      </div>
    `).join('');
  }

  // --- HISTORY RECORDS MANAGEMENT ---
  function saveRecord() {
    let weightKg, heightCm, weightDisplay, heightDisplay;
    const today = new Date();
    
    // Formatting date & time
    const dateStr = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    if (unitSystem === 'metric') {
      heightCm = parseInt(heightCmInput.value);
      weightKg = parseInt(weightKgInput.value);
      heightDisplay = `${heightCm} cm`;
      weightDisplay = `${weightKg} kg`;
    } else {
      const feet = parseInt(heightFtInput.value);
      const inches = parseInt(heightInInput.value);
      const lbs = parseInt(weightLbsInput.value);
      
      heightCm = ((feet * 12) + inches) * 2.54;
      weightKg = lbs * 0.45359237;
      heightDisplay = `${feet}ft ${inches}in`;
      weightDisplay = `${lbs} lbs`;
    }

    const categoryInfo = getBmiCategory(currentBmi);

    const newRecord = {
      id: Date.now(),
      date: dateStr,
      time: timeStr,
      weightKg: Math.round(weightKg * 10) / 10,
      weightDisplay: weightDisplay,
      heightDisplay: heightDisplay,
      bmi: currentBmi,
      category: categoryInfo.label,
      categoryClass: categoryInfo.class
    };

    // Prepend to history logs
    history.unshift(newRecord);
    
    // Keep max 20 entries for dashboard visualization
    if (history.length > 50) {
      history.pop();
    }

    // Save and re-render
    saveHistoryToLocalStorage();
    renderHistory();
    renderStats();
    updateAnalyticsChart();
    
    // Notify User visually (pulse element or alert is good, we update display date)
    updateLastCalculationDisplay(dateStr, timeStr);
  }

  function updateLastCalculationDisplay(date, time) {
    lastCalcDate.textContent = date;
    lastCalcTime.textContent = time;
  }

  function renderHistory() {
    if (history.length === 0) {
      historyList.innerHTML = `
        <tr class="empty-state">
          <td colspan="5">No records saved yet. Calculate and save to see history.</td>
        </tr>
      `;
      // Update last calc fields
      lastCalcDate.textContent = "No records yet";
      lastCalcTime.textContent = "--:--";
      return;
    }

    // Update last calculation time using most recent record
    const latest = history[0];
    updateLastCalculationDisplay(latest.date, latest.time);

    historyList.innerHTML = history.map(record => {
      let badgeSubClass = 'normal';
      if (record.categoryClass === 'cat-underweight') badgeSubClass = 'under';
      if (record.categoryClass === 'cat-overweight') badgeSubClass = 'over';
      if (record.categoryClass === 'cat-obese') badgeSubClass = 'obese';
      
      return `
        <tr id="row-${record.id}">
          <td>${record.date} <span class="sub-label">${record.time}</span></td>
          <td>${record.weightDisplay}</td>
          <td class="font-bold">${record.bmi.toFixed(1)}</td>
          <td><span class="history-badge ${badgeSubClass}">${record.category}</span></td>
          <td>
            <button class="btn-delete-row" data-id="${record.id}" title="Delete record">
              <i class="fa-solid fa-trash-can"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach listeners to delete buttons
    document.querySelectorAll('.btn-delete-row').forEach(btn => {
      btn.addEventListener('click', function() {
        const id = parseInt(this.getAttribute('data-id'));
        deleteRecord(id);
      });
    });
  }

  function deleteRecord(id) {
    history = history.filter(record => record.id !== id);
    saveHistoryToLocalStorage();
    renderHistory();
    renderStats();
    updateAnalyticsChart();
  }

  function clearAllHistory() {
    if (history.length === 0) return;
    if (confirm("Are you sure you want to clear all history records?")) {
      history = [];
      saveHistoryToLocalStorage();
      renderHistory();
      renderStats();
      updateAnalyticsChart();
    }
  }

  // --- STATS COMPUTATION ---
  function renderStats() {
    if (history.length === 0) {
      avgBmiText.textContent = '--';
      maxBmiText.textContent = '--';
      minBmiText.textContent = '--';
      return;
    }

    const bmis = history.map(r => r.bmi);
    const sum = bmis.reduce((a, b) => a + b, 0);
    const avg = sum / bmis.length;
    const max = Math.max(...bmis);
    const min = Math.min(...bmis);

    avgBmiText.textContent = avg.toFixed(1);
    maxBmiText.textContent = max.toFixed(1);
    minBmiText.textContent = min.toFixed(1);
  }

  // --- ANALYTICS CHARTING (Chart.js) ---
  function getThemeColors() {
    const isDark = document.body.classList.contains('dark-mode');
    return {
      text: isDark ? '#cbd5e1' : '#475569',
      grid: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(148, 163, 184, 0.12)',
      accent: isDark ? '#818cf8' : '#6366f1',
      accentGlow: isDark ? 'rgba(129, 140, 248, 0.1)' : 'rgba(99, 102, 241, 0.06)'
    };
  }

  function updateChartColors() {
    if (typeof Chart === 'undefined' || !chartInstance) return;
    const colors = getThemeColors();
    
    chartInstance.options.scales.x.grid.color = colors.grid;
    chartInstance.options.scales.x.ticks.color = colors.text;
    chartInstance.options.scales.y.grid.color = colors.grid;
    chartInstance.options.scales.y.ticks.color = colors.text;
    
    chartInstance.data.datasets[0].borderColor = colors.accent;
    chartInstance.data.datasets[0].backgroundColor = colors.accentGlow;
  }

  function initAnalyticsChart() {
    if (typeof Chart === 'undefined') {
      console.warn("Chart.js CDN is not loaded. Analytics charting is disabled.");
      return;
    }
    try {
      const ctx = document.getElementById('analyticsChart').getContext('2d');
      const colors = getThemeColors();

      // Setup empty or populated lists (must reverse chronologically to plot left-to-right)
      const plotData = getChartDataset();
      
      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: plotData.labels,
          datasets: [{
            label: plotData.label,
            data: plotData.data,
            borderColor: colors.accent,
            backgroundColor: colors.accentGlow,
            borderWidth: 3,
            fill: true,
            tension: 0.35,
            pointBackgroundColor: colors.accent,
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: {
              grid: { color: colors.grid },
              ticks: { color: colors.text, font: { family: 'Inter', size: 10 } }
            },
            y: {
              grid: { color: colors.grid },
              ticks: { color: colors.text, font: { family: 'Inter', size: 10 } }
            }
          }
        }
      });
    } catch (e) {
      console.error("Failed to initialize Chart.js analytics:", e);
    }
  }

  function getChartDataset() {
    // Reverse elements for chronological timeline
    const revHistory = [...history].reverse();
    const labels = revHistory.map(r => r.date);
    
    if (activeChartTab === 'bmi') {
      const data = revHistory.map(r => r.bmi);
      return {
        labels: labels.length ? labels : ['No records'],
        data: data.length ? data : [0],
        label: 'BMI'
      };
    } else {
      // Return weight depending on active unit
      const data = revHistory.map(r => {
        // If current metric: plot in kg. If imperial: convert to lbs
        if (unitSystem === 'metric') {
          return r.weightKg;
        } else {
          // If weight display is lbs, get that numeric value
          if (r.weightDisplay.includes('lbs')) {
            return parseFloat(r.weightDisplay);
          } else {
            return Math.round(r.weightKg * 2.20462);
          }
        }
      });
      return {
        labels: labels.length ? labels : ['No records'],
        data: data.length ? data : [0],
        label: unitSystem === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'
      };
    }
  }

  function updateAnalyticsChart() {
    if (typeof Chart === 'undefined' || !chartInstance) return;
    const plotData = getChartDataset();
    
    chartInstance.data.labels = plotData.labels;
    chartInstance.data.datasets[0].label = plotData.label;
    chartInstance.data.datasets[0].data = plotData.data;
    
    // Redefine colors in case theme changes
    const colors = getThemeColors();
    chartInstance.data.datasets[0].borderColor = colors.accent;
    chartInstance.data.datasets[0].backgroundColor = colors.accentGlow;
    chartInstance.data.datasets[0].pointBackgroundColor = colors.accent;
    
    chartInstance.update();
  }

  function toggleChartTab(tab) {
    if (activeChartTab === tab) return;
    activeChartTab = tab;

    if (tab === 'bmi') {
      btnBmiChart.classList.add('active');
      btnWeightChart.classList.remove('active');
    } else {
      btnBmiChart.classList.remove('active');
      btnWeightChart.classList.add('active');
    }

    updateAnalyticsChart();
  }

  // --- CSV DATA EXPORT ---
  function exportToCSV() {
    if (history.length === 0) {
      alert("No data available to export.");
      return;
    }

    const csvRows = [
      ["Date", "Time", "Weight (kg)", "Weight (Formatted)", "Height (Formatted)", "BMI Value", "Category"]
    ];

    history.forEach(item => {
      csvRows.push([
        item.date,
        item.time,
        item.weightKg,
        item.weightDisplay,
        item.heightDisplay,
        item.bmi,
        item.category
      ]);
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + csvRows.map(e => e.map(val => `"${val}"`).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `vitapulse_bmi_history_${Date.now()}.csv`);
    document.body.appendChild(link); // Required for FF
    
    link.click();
    document.body.removeChild(link);
  }
});
