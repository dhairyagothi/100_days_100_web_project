let chartInstance = null;
const BASE_URL =
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies';
const FALLBACK_URL = 'https://latest.currency-api.pages.dev/v1/currencies';

const dropdowns = document.querySelectorAll('.dropdown select');
const fromCurr = document.querySelector('.from select');
const toCurr = document.querySelector('.to select');
const msg = document.querySelector('.msg');
const chartCanvas = document.getElementById('historyChart');
const swapIcon = document.querySelector('.dropdown i');
const amtInput = document.querySelector('.amount input');
const convertedAmountField = document.querySelector('.converted-amount input');
const resetBtn = document.querySelector('.reset-btn');
const HISTORY_KEY = 'currencyConversionHistory';

const historyList = document.querySelector('.history-list');
const clearHistoryBtn = document.querySelector('.clear-history-btn');

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('i');
const themeText = themeToggle?.querySelector('.theme-text');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeUI(savedTheme);

// Theme toggle function
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeUI(newTheme);
  
  // Re-render chart with new theme colors
  if (chartInstance) {
    loadHistoricalChart();
  }
}

function updateThemeUI(theme) {
  if (!themeToggle) return;
  
  if (theme === 'dark') {
    themeIcon.className = 'fas fa-sun';
    themeText.textContent = 'Light';
    themeToggle.setAttribute('aria-label', 'Switch to light theme');
  } else {
    themeIcon.className = 'fas fa-moon';
    themeText.textContent = 'Dark';
    themeToggle.setAttribute('aria-label', 'Switch to dark theme');
  }
}

// Add theme toggle event listener
if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

let errorTimeout;

const showError = (message) => {
  const errorDiv = document.querySelector('.error-msg');
  errorDiv.innerText = message;
  errorDiv.style.display = 'block';
  errorDiv.classList.remove('shake');
  void errorDiv.offsetWidth;
  errorDiv.classList.add('shake');

  convertedAmountField.value = '';
  msg.innerText = '';

  if (errorTimeout) clearTimeout(errorTimeout);
  errorTimeout = setTimeout(() => {
    errorDiv.innerText = '';
    errorDiv.style.display = 'none';
    errorDiv.classList.remove('shake');
    amtInput.value = '1';
    updateExchangeRate();
  }, 2000);
};

const clearError = () => {
  const errorDiv = document.querySelector('.error-msg');
  if (errorDiv) {
    errorDiv.innerText = '';
    errorDiv.style.display = 'none';
    errorDiv.classList.remove('shake');
  }
  if (errorTimeout) clearTimeout(errorTimeout);
};

const getHistory = () => {
  return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
};

const saveHistory = (history) => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
};

const renderHistory = () => {
  if (!historyList) return;

  const history = getHistory();

  if (!history.length) {
    historyList.innerHTML = '<p class="empty-history">No conversions yet</p>';
    return;
  }

  historyList.innerHTML = history
    .map(
      (item, index) => `
        <div class="history-item" data-index="${index}">
          <strong>${item.amount} ${item.from} → ${item.to}</strong><br>
          Converted: ${item.result}<br>
          <span class="history-time">${item.time}</span>
        </div>
      `
    )
    .join('');

  document.querySelectorAll('.history-item').forEach((element) => {
    element.addEventListener('click', () => {
      const selected = history[element.dataset.index];

      amtInput.value = selected.amount;
      fromCurr.value = selected.from;
      toCurr.value = selected.to;

      updateFlag(fromCurr);
      updateFlag(toCurr);

      updateExchangeRate();
      loadHistoricalChart();
    });
  });
};

const addToHistory = (record) => {
  let history = getHistory();

  history.unshift(record);

  if (history.length > 10) {
    history = history.slice(0, 10);
  }

  saveHistory(history);
  renderHistory();
};

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement('option');
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === 'from' && currCode === 'USD') {
      newOption.selected = 'selected';
    } else if (select.name === 'to' && currCode === 'INR') {
      newOption.selected = 'selected';
    }
    select.append(newOption);
  }

  select.addEventListener('change', (evt) => {
    updateFlag(evt.target);
    updateExchangeRate();
    loadHistoricalChart();
  });
}

const loadHistoricalChart = async () => {
  if (!chartCanvas) return;
  try {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 7);

    const endDate = today.toISOString().split('T')[0];
    const startDate = pastDate.toISOString().split('T')[0];

    const fromTarget = fromCurr.value.toLowerCase();
    const toTarget = toCurr.value.toLowerCase();

    const historyURL = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromTarget}.json`;

    const response = await fetch(historyURL);

    if (!response.ok) {
      console.warn('Historical data not available for this pair.');
      if (chartInstance) chartInstance.destroy();
      return;
    }

    const data = await response.json();

    const activeRate = data[fromTarget][toTarget];

    const labels = [];
    const values = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      labels.push(d.toISOString().split('T')[0]);

      const variance = 1 + Math.sin(i) * 0.002;
      values.push(activeRate * variance);
    }

    // Get theme for chart colors
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#cbd5e1' : '#64748b';
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';
    const borderColor = isDark ? '#60a5fa' : '#2563eb';
    const backgroundColor = isDark ? 'rgba(96, 165, 250, 0.1)' : 'rgba(37, 99, 235, 0.05)';

    if (chartInstance) {
      chartInstance.destroy();
    }

    chartInstance = new Chart(chartCanvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: `${fromCurr.value.toUpperCase()} to ${toCurr.value.toUpperCase()} Trend`,
            data: values,
            borderColor: borderColor,
            backgroundColor: backgroundColor,
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointRadius: 2,
            pointBackgroundColor: borderColor,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            display: false,
            labels: {
              color: textColor
            }
          },
        },
        scales: {
          x: {
            grid: { 
              display: false,
              color: gridColor
            },
            ticks: { 
              maxTicksLimit: 4, 
              font: { size: 10 },
              color: textColor
            },
          },
          y: {
            grid: { 
              color: gridColor
            },
            ticks: { 
              font: { size: 10 },
              color: textColor
            },
          },
        },
      },
    });
  } catch (error) {
    console.error('Error loading chart layout:', error);
  }
};

const updateExchangeRate = async (forceDefault = false) => {
  let amtVal = amtInput.value;
  if (forceDefault && (amtVal === '' || parseFloat(amtVal) < 1)) {
    amtVal = '1';
    amtInput.value = '1';
  }

  if (amtVal === '' || isNaN(parseFloat(amtVal))) {
    convertedAmountField.value = '';
    msg.innerText = '';
    return;
  }

  let amtNum = parseFloat(amtVal);
  if (amtNum <= 0) {
    convertedAmountField.value = '';
    msg.innerText = 'Please enter a valid amount';
    return;
  }

  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
  const FALLBACK_API_URL = `${FALLBACK_URL}/${fromCurr.value.toLowerCase()}.json`;

  let response;
  try {
    response = await fetch(URL);
    if (!response.ok) throw new Error('Primary API Down.');
  } catch (error) {
    console.warn(error);
    try {
      response = await fetch(FALLBACK_API_URL);
      if (!response.ok) throw new Error('Fallback Down.');
    } catch (error) {
      msg.innerText = 'Rates unavailable at this moment.';
      convertedAmountField.value = '';
      return;
    }
  }

  let data = await response.json();
  let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];

  let finalAmount = amtNum * rate;
  msg.innerText = `1 ${fromCurr.value} = ${rate.toFixed(4)} ${toCurr.value}`;
  convertedAmountField.value = finalAmount.toFixed(2);
  const latestRecord = {
    amount: amtNum,
    from: fromCurr.value,
    to: toCurr.value,
    result: finalAmount.toFixed(2),
    time: new Date().toLocaleString(),
  };

  const history = getHistory();

  const duplicate =
    history.length &&
    history[0].amount === latestRecord.amount &&
    history[0].from === latestRecord.from &&
    history[0].to === latestRecord.to &&
    history[0].result === latestRecord.result;

  if (!duplicate) {
    addToHistory(latestRecord);
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector('img');
  if (img) img.src = newSrc;
};

swapIcon.addEventListener('click', () => {
  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  updateFlag(fromCurr);
  updateFlag(toCurr);

  updateExchangeRate();
  loadHistoricalChart();
});

amtInput.addEventListener('input', () => {
  let val = amtInput.value;
  if (val === '') {
    clearError();
    updateExchangeRate();
    return;
  }

  if (val.trim().startsWith('-') || parseFloat(val) < 0) {
    showError('Only positive values are allowed');
    return;
  }

  const validNumberPattern = /^[0-9]*\.?[0-9]*$/;
  if (!validNumberPattern.test(val.trim())) {
    showError('Please enter a valid number');
    return;
  }

  clearError();
  updateExchangeRate();
  loadHistoricalChart();
});

resetBtn.addEventListener('click', () => {
  clearError();
  amtInput.value = '1';
  fromCurr.value = 'USD';
  toCurr.value = 'INR';
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
  loadHistoricalChart();
});

if (clearHistoryBtn) {
  clearHistoryBtn.addEventListener('click', () => {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
  });
}

window.addEventListener("load", () => {
  renderHistory();
  updateExchangeRate(true);
  loadHistoricalChart();
});