/* =========================================================
   SELECTORS
========================================================= */

const form = document.querySelector('.add-transaction');

const amountInput = document.getElementById('amt');
const descInput = document.getElementById('desc');
const categoryInput = document.getElementById('cat');
const dateInput = document.getElementById('date');

const transactionList = document.getElementById('transaction-list');

const balanceEl = document.getElementById('curramt');

const incomeEl = document.getElementById('income');

const expenseEl = document.getElementById('expense');

const categoryEls = {
  food: document.querySelector('[data-cat="food"]'),

  travel: document.querySelector('[data-cat="travel"]'),

  shopping: document.querySelector('[data-cat="shopping"]'),

  other: document.querySelector('[data-cat="other"]'),
};

const budgetInput = document.getElementById('budgetInput');

const budgetText = document.getElementById('budget');

const progressFill = document.querySelector('.progress-fill');

const modeToggle = document.querySelector('.mode');

const resetBtn = document.getElementById('resetBtn');

const emptyState = document.querySelector('.empty-state');

const toast = document.getElementById('toast');

const loader = document.querySelector('.loader');

const successSound = document.getElementById('successSound');

/* =========================================================
   STATE
========================================================= */

let transactions = [];
let monthlyBudget = 0;

/* =========================================================
   INJECT SHAKE KEYFRAME
========================================================= */

(function injectShakeKeyframe() {
  if (document.getElementById('shake-style')) return;

  const style = document.createElement('style');

  style.id = 'shake-style';

  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0);    }
      20%      { transform: translateX(-6px); }
      40%      { transform: translateX( 6px); }
      60%      { transform: translateX(-4px); }
      80%      { transform: translateX( 4px); }
    }
  `;

  document.head.appendChild(style);
})();

/* =========================================================
   LOADER
========================================================= */

function showLoader() {
  loader.classList.remove('hidden');
}

function hideLoader() {
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 700);
}

/* =========================================================
   TOAST
========================================================= */

function showToast(message) {
  toast.textContent = message;

  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

/* =========================================================
   DARK MODE
========================================================= */

modeToggle.addEventListener('change', () => {
  document.body.classList.toggle('dark');

  localStorage.setItem(
    'theme',
    document.body.classList.contains('dark') ? 'dark' : 'light'
  );

  showToast(
    document.body.classList.contains('dark')
      ? 'Dark Mode Enabled 🌙'
      : 'Light Mode Enabled ☀️'
  );

  // Redraw charts in new theme colours
  drawCharts();
});

/* =========================================================
   LIVE CLOCK
========================================================= */

function updateClock() {
  const now = new Date();
  const time = now.toLocaleTimeString();

  document.getElementById('clock').textContent = time;
}

setInterval(updateClock, 1000);

updateClock();

/* =========================================================
   ADD TRANSACTION
========================================================= */

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const rawValue = amountInput.value.trim();
  const amount = Number(rawValue);
  const errorEl = document.getElementById('amt-error');

  if (rawValue === '' || isNaN(amount) || !isFinite(amount)) {
    if (errorEl) errorEl.textContent = 'Please enter a valid number ⚠️';
    amountInput.focus();
    return;
  }

  if (amount <= 0) {
    if (errorEl) errorEl.textContent = 'Amount must be greater than zero ⚠️';
    amountInput.focus();
    return;
  }

  if (amount > 1_000_000) {
    if (errorEl) errorEl.textContent = 'Amount cannot exceed ₹10,00,000 ⚠️';
    amountInput.focus();
    return;
  }

  if (errorEl) errorEl.textContent = '';

  showLoader();

  const recurringToggle = document.getElementById('recurringToggle');

  const transaction = {
    id: Date.now(),

    amount: amount,

    description: descInput.value.trim(),

    category: categoryInput.value,

    type: categoryInput.value === 'income' ? 'income' : 'expense',

    date: dateInput.value,

    recurring: recurringToggle ? recurringToggle.checked : false,

    // Track which month this recurring entry was last auto-added (YYYY-MM)
    lastAdded: recurringToggle && recurringToggle.checked
      ? dateInput.value.slice(0, 7)
      : null,
  };

  transactions.unshift(transaction);

  saveAndUpdate();

  successSound.play().catch(() => {});

  showToast(
    transaction.recurring
      ? 'Recurring Transaction Added 🔁'
      : 'Transaction Added Successfully 🚀'
  );

  form.reset();

  if (recurringToggle) recurringToggle.checked = false;

  const today = new Date().toISOString().split('T')[0];

  dateInput.value = today;

  hideLoader();

  updateMonthPrediction();
});

/* =========================================================
   RECURRING TRANSACTIONS — AUTO-REPEAT ON PAGE LOAD
   For every transaction with recurring: true, if the current
   month (YYYY-MM) is newer than lastAdded, inject a copy.
========================================================= */

function applyRecurringTransactions() {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const todayStr = now.toISOString().split('T')[0];

  let added = 0;

  // We only look at "seed" recurring entries (those that have a lastAdded field
  // and whose lastAdded is earlier than the current month).
  // To avoid duplicating duplicates we only operate on entries where
  // recurring === true AND lastAdded < currentMonth.
  const seeds = transactions.filter(
    (txn) => txn.recurring && txn.lastAdded && txn.lastAdded < currentMonth
  );

  seeds.forEach((seed) => {
    // Create a fresh entry for this month
    const copy = {
      id: Date.now() + Math.random(), // unique id
      amount: seed.amount,
      description: seed.description + ' (recurring)',
      category: seed.category,
      type: seed.type,
      date: todayStr,
      recurring: true,
      lastAdded: currentMonth,
    };

    transactions.unshift(copy);

    // Update the seed so it won't fire again this month
    seed.lastAdded = currentMonth;

    added++;
  });

  if (added > 0) {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    showToast(`${added} recurring transaction${added > 1 ? 's' : ''} added for this month 🔁`);
  }
}

/* =========================================================
   RENDER TRANSACTIONS
========================================================= */

function renderTransactions() {
  transactionList.innerHTML = '';

  if (transactions.length === 0) {
    emptyState.style.display = 'flex';
  } else {
    emptyState.style.display = 'none';
  }

  transactions.forEach((txn) => {
    const row = document.createElement('tr');

    row.style.animation = 'slideIn 0.5s ease';

    row.innerHTML = `
      <td>${formatDate(txn.date)}</td>

      <td>${txn.description}</td>

      <td>
        <span class="category-badge ${txn.category}">
          ${capitalize(txn.category)}
        </span>
      </td>

      <td class="${txn.type === 'income' ? 'income-text' : 'expense-text'}">
        ${txn.type === 'income' ? '+' : '-'}₹${txn.amount}
      </td>

      <td>
        ${txn.recurring
          ? '<span class="recurring-badge" title="Auto-repeats monthly">🔁 Yes</span>'
          : '<span style="color:#94a3b8;font-size:0.8rem;">—</span>'}
      </td>

      <td>
        <button
          class="delete-btn"
          data-id="${txn.id}"
        >
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;

    transactionList.appendChild(row);
  });
}

/* =========================================================
   DELETE TRANSACTION
========================================================= */

transactionList.addEventListener('click', (e) => {
  const deleteBtn = e.target.closest('.delete-btn');

  if (!deleteBtn) return;

  const id = Number(deleteBtn.dataset.id);

  transactions = transactions.filter((txn) => txn.id !== id);

  saveAndUpdate();

  showToast('Transaction Deleted 🗑️');

  updateMonthPrediction();
});

/* =========================================================
   UPDATE SUMMARY
========================================================= */

function updateSummary() {
  let income = 0;
  let expense = 0;

  transactions.forEach((txn) => {
    if (txn.type === 'income') {
      income += txn.amount;
    } else {
      expense += txn.amount;
    }
  });

  const balance = income - expense;

  animateNumber(balanceEl, balance);
  animateNumber(incomeEl, income);
  animateNumber(expenseEl, expense);

  balanceEl.style.color = balance < 0 ? '#ff4d4d' : '#00c853';
}

/* =========================================================
   UPDATE CATEGORIES
========================================================= */

function updateCategories() {
  const totals = {
    food: 0,
    travel: 0,
    shopping: 0,
    other: 0,
  };

  transactions.forEach((txn) => {
    if (txn.type === 'expense') {
      if (totals[txn.category] !== undefined) {
        totals[txn.category] += txn.amount;
      }
    }
  });

  Object.keys(totals).forEach((cat) => {
    categoryEls[cat].textContent = `₹${totals[cat]}`;
  });
}

/* =========================================================
   BUDGET
========================================================= */

budgetInput.addEventListener('change', () => {
  monthlyBudget = Number(budgetInput.value);

  updateBudget();

  localStorage.setItem('budget', monthlyBudget);

  showToast('Budget Updated 💸');

  updateMonthPrediction();
});

function updateBudget() {
  const expense = transactions
    .filter((txn) => txn.type === 'expense')
    .reduce((sum, txn) => sum + txn.amount, 0);

  budgetText.textContent = `₹${expense} / ₹${monthlyBudget}`;

  const percentage = monthlyBudget > 0 ? (expense / monthlyBudget) * 100 : 0;

  progressFill.style.width = `${Math.min(percentage, 100)}%`;

  const smartSuggestionEl = document.getElementById('smart-suggestion');

  const financialStatusEl = document.getElementById('financial-status');

  if (monthlyBudget <= 0) {
    progressFill.style.background = '#6366f1';
    budgetText.style.color = '';

    return;
  }

  if (percentage < 50) {
    progressFill.style.background = '#00c853';
    budgetText.style.color = '#00c853';

    smartSuggestionEl.textContent =
      'Great job! Your spending is well under control ✅';

    financialStatusEl.textContent = 'Healthy financial condition 💰';
  } else if (percentage >= 50 && percentage < 80) {
    progressFill.style.background = '#ffb300';
    budgetText.style.color = '#ff9800';

    smartSuggestionEl.textContent = 'Caution: Budget usage is increasing ⚠️';

    financialStatusEl.textContent = 'Monitor expenses carefully 👀';
  } else if (percentage >= 80 && percentage < 100) {
    progressFill.style.background = '#ff6d00';
    budgetText.style.color = '#ff6d00';

    smartSuggestionEl.textContent =
      'Warning: You are close to exceeding your budget 🚨';

    financialStatusEl.textContent = 'Critical spending level ⚠️';
  } else {
    progressFill.style.background = '#ff1744';
    budgetText.style.color = '#ff1744';

    smartSuggestionEl.textContent =
      'Budget exceeded! Reduce unnecessary expenses immediately ❌';

    financialStatusEl.textContent = 'Over budget 🚫';

    showToast('Monthly Budget Exceeded 🚨');

    const budgetWidget = document.querySelector('.monthly-budget');

    budgetWidget.style.animation = 'none';

    void budgetWidget.offsetHeight;

    budgetWidget.style.animation = 'shake 0.5s ease';
  }
}

/* =========================================================
   INSIGHTS
========================================================= */

function updateInsights() {
  const totals = {
    food: 0,
    travel: 0,
    shopping: 0,
    other: 0,
  };

  let totalExpense = 0;
  let totalIncome = 0;

  transactions.forEach((txn) => {
    if (txn.type === 'expense') {
      if (totals[txn.category] !== undefined) {
        totals[txn.category] += txn.amount;
      } else {
        totals.other += txn.amount;
      }

      totalExpense += txn.amount;
    } else {
      totalIncome += txn.amount;
    }
  });

  const highestSpendingCatEl = document.getElementById('highest-spending-cat');

  const smartSuggestionEl = document.getElementById('smart-suggestion');

  const financialStatusEl = document.getElementById('financial-status');

  let maxCat = '';
  let maxAmount = 0;

  Object.keys(totals).forEach((cat) => {
    if (totals[cat] > maxAmount) {
      maxAmount = totals[cat];
      maxCat = cat;
    }
  });

  highestSpendingCatEl.textContent =
    maxAmount > 0 ? `${capitalize(maxCat)} (₹${maxAmount})` : 'None';

  let suggestion = 'Add more transactions to generate insights.';

  if (maxCat === 'food') suggestion = 'Food expenses are high 🍔';
  else if (maxCat === 'travel') suggestion = 'Travel spending increased ✈️';
  else if (maxCat === 'shopping') suggestion = 'Shopping expenses are high 🛍️';
  else if (maxCat === 'other') suggestion = 'Track miscellaneous expenses 📦';

  let status = 'No financial data available.';

  if (totalIncome > 0) {
    const savings = totalIncome - totalExpense;
    const savingsRate = ((savings / totalIncome) * 100).toFixed(0);

    if (savingsRate >= 50) {
      status = `Excellent! Saving ${savingsRate}% 🎉`;
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 150,
          spread: 90,
          origin: { y: 0.6 },
        });
      }
    } else if (savingsRate >= 20) {
      status = `Good savings rate ${savingsRate}%`;
    } else {
      status = `Low savings rate ${savingsRate}%`;
    }
  }

  if (monthlyBudget <= 0) {
    smartSuggestionEl.textContent = suggestion;
    financialStatusEl.textContent = status;
  }
}

/* =========================================================
   RESET
========================================================= */

resetBtn.addEventListener('click', () => {
  const confirmReset = confirm('Reset all transactions?');

  if (!confirmReset) return;

  transactions = [];
  monthlyBudget = 0;

  localStorage.removeItem('transactions');
  localStorage.removeItem('budget');
  localStorage.removeItem('groqApiKey');

  budgetInput.value = '';

  saveAndUpdate();

  showToast('All Expense Tracker Data Reset 🔄');

  document.getElementById('aiSpendingText').textContent =
    'Add transactions and click Analyze.';

  document.getElementById('aiBudgetText').textContent =
    'Enter your income below to get recommendations.';

  document.getElementById('aiPredictionText').textContent = 'No data yet.';

  const chatMessages = document.getElementById('aiChatMessages');

  chatMessages.innerHTML = `
    <div class="ai-msg ai-msg--bot">
      👋 Hi! I'm your AI financial advisor powered by Groq. Ask me anything about your spending!
    </div>
  `;
});

/* =========================================================
   STORAGE
========================================================= */

function saveAndUpdate() {
  localStorage.setItem('transactions', JSON.stringify(transactions));

  renderAll();
}

/* =========================================================
   RENDER ALL
========================================================= */

function renderAll() {
  renderTransactions();
  updateSummary();
  updateCategories();
  updateBudget();
  updateInsights();
  drawCharts();
}

/* =========================================================
   ANIMATE NUMBER
========================================================= */

function animateNumber(element, target) {
  if (target === 0) {
    element.textContent = '₹0';
    return;
  }

  let start = 0;

  const duration = 1000;
  const increment = target / (duration / 16);

  const counter = setInterval(() => {
    start += increment;

    const reached = target > 0 ? start >= target : start <= target;

    if (reached) {
      start = target;
      clearInterval(counter);
    }

    element.textContent = `₹${Math.round(start)}`;
  }, 16);
}

/* =========================================================
   HELPERS
========================================================= */

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function formatDate(date) {
  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  return new Date(date).toLocaleDateString('en-IN', options);
}

/* =========================================================
   MAGNETIC BUTTON EFFECT
========================================================= */

const buttons = document.querySelectorAll('.submit-btn, #resetBtn');

buttons.forEach((button) => {
  button.addEventListener('mousemove', (e) => {
    const rect = button.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translate(0, 0)';
  });
});

/* =========================================================
   ✨ FEATURE: DONUT CHART — category spending breakdown
========================================================= */

function drawDonutChart() {
  const canvas = document.getElementById('donutChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const isDark = document.body.classList.contains('dark');
  const textColor = isDark ? '#e2e8f0' : '#1e293b';

  const catColors = {
    food:     '#f59e0b',
    travel:   '#6366f1',
    shopping: '#ec4899',
    other:    '#10b981',
  };

  const totals = { food: 0, travel: 0, shopping: 0, other: 0 };
  transactions.forEach((txn) => {
    if (txn.type === 'expense' && totals[txn.category] !== undefined) {
      totals[txn.category] += txn.amount;
    }
  });

  const entries = Object.entries(totals).filter(([, v]) => v > 0);
  const total = entries.reduce((s, [, v]) => s + v, 0);

  const cx = W / 2;
  const cy = H / 2;
  const outerR = Math.min(W, H) / 2 - 10;
  const innerR = outerR * 0.55; // donut hole

  if (total === 0) {
    ctx.fillStyle = isDark ? '#475569' : '#cbd5e1';
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = isDark ? '#1e293b' : '#f8fafc';
    ctx.beginPath();
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.font = '13px Poppins, sans-serif';
    ctx.fillText('No expenses', cx, cy + 5);

    // Clear legend
    const legend = document.getElementById('donutLegend');
    if (legend) legend.innerHTML = '';
    return;
  }

  let startAngle = -Math.PI / 2;

  entries.forEach(([cat, val]) => {
    const slice = (val / total) * Math.PI * 2;
    const color = catColors[cat] || '#94a3b8';

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outerR, startAngle, startAngle + slice);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // Percentage label on slice if large enough
    if (slice > 0.3) {
      const midAngle = startAngle + slice / 2;
      const labelR = (outerR + innerR) / 2;
      const lx = cx + Math.cos(midAngle) * labelR;
      const ly = cy + Math.sin(midAngle) * labelR;
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${Math.round((val / total) * 100)}%`, lx, ly);
    }

    startAngle += slice;
  });

  // Donut hole
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.fillStyle = isDark ? '#1e293b' : '#f8fafc';
  ctx.fill();

  // Centre total text
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = 'bold 14px Poppins, sans-serif';
  ctx.fillText(`₹${total.toLocaleString('en-IN')}`, cx, cy - 8);
  ctx.font = '11px Poppins, sans-serif';
  ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
  ctx.fillText('Total Spent', cx, cy + 10);

  // Legend
  const legend = document.getElementById('donutLegend');
  if (legend) {
    legend.innerHTML = entries
      .map(
        ([cat, val]) => `
        <div class="legend-item">
          <span class="legend-dot" style="background:${catColors[cat] || '#94a3b8'}"></span>
          <span>${capitalize(cat)}</span>
          <span class="legend-amount">₹${val.toLocaleString('en-IN')}</span>
        </div>`
      )
      .join('');
  }
}

/* =========================================================
   ✨ FEATURE: BAR CHART — income vs expenses last 6 months
========================================================= */

function drawBarChart() {
  const canvas = document.getElementById('barChart');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const isDark = document.body.classList.contains('dark');
  const textColor = isDark ? '#e2e8f0' : '#1e293b';
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';

  // Build last-6-months labels
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
      income: 0,
      expense: 0,
    });
  }

  transactions.forEach((txn) => {
    const monthKey = txn.date ? txn.date.slice(0, 7) : '';
    const bucket = months.find((m) => m.key === monthKey);
    if (!bucket) return;
    if (txn.type === 'income') bucket.income += txn.amount;
    else bucket.expense += txn.amount;
  });

  const allValues = months.flatMap((m) => [m.income, m.expense]);
  const maxVal = Math.max(...allValues, 1);

  const PAD_LEFT = 60;
  const PAD_RIGHT = 16;
  const PAD_TOP = 20;
  const PAD_BOT = 44;
  const chartW = W - PAD_LEFT - PAD_RIGHT;
  const chartH = H - PAD_TOP - PAD_BOT;

  const barGroupW = chartW / months.length;
  const barW = Math.min(barGroupW * 0.32, 24);
  const gap = barW * 0.4;

  // Y-axis grid + labels
  const ySteps = 4;
  for (let i = 0; i <= ySteps; i++) {
    const y = PAD_TOP + chartH - (i / ySteps) * chartH;
    const val = Math.round((i / ySteps) * maxVal);

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(PAD_LEFT, y);
    ctx.lineTo(W - PAD_RIGHT, y);
    ctx.stroke();

    ctx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    ctx.font = '10px Poppins, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillText(val >= 1000 ? `₹${(val / 1000).toFixed(0)}k` : `₹${val}`, PAD_LEFT - 6, y);
  }

  // Bars
  months.forEach((m, i) => {
    const groupX = PAD_LEFT + i * barGroupW + barGroupW / 2;

    // Income bar (left of pair)
    const incomeH = (m.income / maxVal) * chartH;
    const incomeX = groupX - gap / 2 - barW;
    const incomeY = PAD_TOP + chartH - incomeH;

    const incomeGrad = ctx.createLinearGradient(0, incomeY, 0, incomeY + incomeH);
    incomeGrad.addColorStop(0, '#34d399');
    incomeGrad.addColorStop(1, '#059669');
    ctx.fillStyle = incomeGrad;
    ctx.beginPath();
    ctx.roundRect
      ? ctx.roundRect(incomeX, incomeY, barW, incomeH, [4, 4, 0, 0])
      : ctx.rect(incomeX, incomeY, barW, incomeH);
    ctx.fill();

    // Expense bar (right of pair)
    const expH = (m.expense / maxVal) * chartH;
    const expX = groupX + gap / 2;
    const expY = PAD_TOP + chartH - expH;

    const expGrad = ctx.createLinearGradient(0, expY, 0, expY + expH);
    expGrad.addColorStop(0, '#f87171');
    expGrad.addColorStop(1, '#dc2626');
    ctx.fillStyle = expGrad;
    ctx.beginPath();
    ctx.roundRect
      ? ctx.roundRect(expX, expY, barW, expH, [4, 4, 0, 0])
      : ctx.rect(expX, expY, barW, expH);
    ctx.fill();

    // X-axis label
    ctx.fillStyle = textColor;
    ctx.font = '10px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(m.label, groupX, PAD_TOP + chartH + 8);
  });

  // Legend
  const legendY = H - 12;
  const items = [
    { label: 'Income', color: '#34d399' },
    { label: 'Expenses', color: '#f87171' },
  ];
  const legendTotalW = items.length * 90;
  let lx = W / 2 - legendTotalW / 2;

  items.forEach(({ label, color }) => {
    ctx.fillStyle = color;
    ctx.fillRect(lx, legendY - 8, 12, 12);
    ctx.fillStyle = textColor;
    ctx.font = '11px Poppins, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, lx + 16, legendY - 2);
    lx += 90;
  });
}

/* =========================================================
   DRAW BOTH CHARTS
========================================================= */

function drawCharts() {
  drawDonutChart();
  drawBarChart();
}

/* =========================================================
   ✨ FEATURE: CSV EXPORT
========================================================= */

function exportCSV() {
  if (transactions.length === 0) {
    showToast('No transactions to export ⚠️');
    return;
  }

  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount (₹)', 'Recurring'];

  const rows = transactions.map((txn) => [
    txn.date,
    `"${txn.description.replace(/"/g, '""')}"`,
    capitalize(txn.category),
    capitalize(txn.type),
    txn.amount,
    txn.recurring ? 'Yes' : 'No',
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
  a.click();

  URL.revokeObjectURL(url);

  showToast('CSV Exported Successfully 📥');
}

/* =========================================================
   INIT
========================================================= */
function safeLoadJSON(key, fallback) {
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Corrupted localStorage["${key}"], resetting it.`, err);
    localStorage.removeItem(key);
    return fallback;
  }
}

(function init() {
  transactions = safeLoadJSON('transactions', []);

  monthlyBudget = safeLoadJSON('budget', 0);

  budgetInput.value = monthlyBudget || '';

  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');

    modeToggle.checked = true;
  }

  const today = new Date().toISOString().split('T')[0];

  dateInput.value = today;

  // ✨ Apply recurring transactions before first render
  applyRecurringTransactions();

  renderAll();

  // Load saved Groq key
  const savedKey = localStorage.getItem('groqApiKey');
  if (savedKey) {
    document.getElementById('groqApiKey').value = savedKey;
  }

  updateMonthPrediction();
})();

/* =========================================================
   AI ENGINE — GROQ POWERED
========================================================= */

const groqKeyInput = document.getElementById('groqApiKey');
const saveKeyBtn = document.getElementById('saveKeyBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const aiIncomeInput = document.getElementById('aiIncomeInput');
const aiChatInput = document.getElementById('aiChatInput');
const aiSendBtn = document.getElementById('aiSendBtn');
const aiChatMessages = document.getElementById('aiChatMessages');
const aiToggleBtn = document.getElementById('aiToggleBtn');
const aiEngineBody = document.getElementById('aiEngineBody');

/* ----- Save API Key ----- */
saveKeyBtn.addEventListener('click', () => {
  const key = groqKeyInput.value.trim();
  if (!key) {
    showToast('Please enter a Groq API Key ⚠️');
    return;
  }
  localStorage.setItem('groqApiKey', key);
  showToast('Groq API Key Saved 🔑');
});

/* ----- Toggle Panel Visibility ----- */
aiToggleBtn.addEventListener('click', () => {
  const isHidden = aiEngineBody.style.display === 'none';
  aiEngineBody.style.display = isHidden ? 'block' : 'none';
  aiToggleBtn.textContent = isHidden ? 'Hide' : 'Show';
});

/* ----- Build Expense Summary from current transactions ----- */
function buildExpenseSummary() {
  const totals = { food: 0, travel: 0, shopping: 0, other: 0 };
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((txn) => {
    if (txn.type === 'income') {
      totalIncome += txn.amount;
    } else {
      if (totals[txn.category] !== undefined) {
        totals[txn.category] += txn.amount;
      } else {
        totals.other += txn.amount;
      }
      totalExpense += txn.amount;
    }
  });

  return { totals, totalIncome, totalExpense };
}

/* ----- Month-end Spending Prediction (no API needed) ----- */
function updateMonthPrediction() {
  const { totalExpense } = buildExpenseSummary();
  const predictionEl = document.getElementById('aiPredictionText');

  if (totalExpense === 0) {
    predictionEl.textContent = 'No data yet.';
    return;
  }

  const today = new Date();
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate();
  const daysPassed = today.getDate();

  const predicted = Math.round((totalExpense / daysPassed) * daysInMonth);

  let budgetStatus = '';
  if (monthlyBudget > 0) {
    if (predicted > monthlyBudget) {
      budgetStatus = ` ⚠️ Projected to exceed budget by ₹${(predicted - monthlyBudget).toLocaleString('en-IN')}`;
    } else {
      budgetStatus = ` ✅ Within budget (₹${(monthlyBudget - predicted).toLocaleString('en-IN')} remaining)`;
    }
  }

  predictionEl.textContent = `Predicted month-end spend: ₹${predicted.toLocaleString('en-IN')}${budgetStatus}`;
}

/* ----- Call Groq API ----- */
async function callGroq(prompt) {
  const apiKey = localStorage.getItem('groqApiKey');

  if (!apiKey) {
    showToast('Enter & Save your Groq API Key first 🔑');
    return null;
  }

  try {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content:
                'You are a concise, friendly financial advisor. Give short, practical advice in 2-4 sentences. Use ₹ for currency.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 300,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json();
      console.error('Groq API error:', err);
      showToast('Groq API error. Check your API key ⚠️');
      return null;
    }

    const data = await response.json();
    return (
      data.choices?.[0]?.message?.content?.trim() || 'No response from AI.'
    );
  } catch (error) {
    console.error('Fetch error:', error);
    showToast('Network error. Please try again ⚠️');
    return null;
  }
}

/* ----- Analyze Button ----- */
analyzeBtn.addEventListener('click', async () => {
  if (transactions.length === 0) {
    showToast('Add some transactions first ⚠️');
    return;
  }

  const { totals, totalIncome, totalExpense } = buildExpenseSummary();
  const income = Number(aiIncomeInput.value) || totalIncome;

  analyzeBtn.innerHTML =
    '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';
  analyzeBtn.disabled = true;

  const expenseBreakdown = Object.entries(totals)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => `${capitalize(k)}: ₹${v.toLocaleString('en-IN')}`)
    .join(', ');

  const spendingPrompt = `My expense breakdown this month is: ${expenseBreakdown}. Total expenses: ₹${totalExpense.toLocaleString('en-IN')}. Monthly budget: ₹${monthlyBudget || 'not set'}. Give me 2-3 specific, actionable tips to reduce my spending. Be concise.`;

  const budgetPrompt =
    income > 0
      ? `My monthly income is ₹${income.toLocaleString('en-IN')}. Apply the 50/30/20 budgeting rule and tell me exactly: how much for needs (50%), wants (30%), and savings (20%). Then compare these targets with my actual spending: ${expenseBreakdown}. Keep it very brief.`
      : null;

  const [spendingAdvice, budgetAdvice] = await Promise.all([
    callGroq(spendingPrompt),
    budgetPrompt
      ? callGroq(budgetPrompt)
      : Promise.resolve(
          'Enter your monthly income above to get 50/30/20 budget recommendations.'
        ),
  ]);

  if (spendingAdvice) {
    document.getElementById('aiSpendingText').textContent = spendingAdvice;
  }
  if (budgetAdvice) {
    document.getElementById('aiBudgetText').textContent = budgetAdvice;
  }

  updateMonthPrediction();

  analyzeBtn.innerHTML = '<i class="fa-solid fa-brain"></i> Analyze';
  analyzeBtn.disabled = false;

  showToast('AI Analysis Complete 🤖');
});

/* ----- Chat: Send Message ----- */
async function sendAiMessage() {
  const userMsg = aiChatInput.value.trim();
  if (!userMsg) return;

  const { totals, totalIncome, totalExpense } = buildExpenseSummary();

  const expenseBreakdown =
    Object.entries(totals)
      .filter(([, v]) => v > 0)
      .map(([k, v]) => `${capitalize(k)}: ₹${v.toLocaleString('en-IN')}`)
      .join(', ') || 'No expenses logged yet';

  appendChatMessage(userMsg, 'user');
  aiChatInput.value = '';

  const loadingId = 'loading-' + Date.now();
  appendChatMessage('Thinking...', 'loading', loadingId);
  aiChatMessages.scrollTop = aiChatMessages.scrollHeight;

  const contextPrompt = `User's current financial data:
- Total Income: ₹${totalIncome.toLocaleString('en-IN')}
- Total Expenses: ₹${totalExpense.toLocaleString('en-IN')}
- Expense Breakdown: ${expenseBreakdown}
- Monthly Budget: ₹${monthlyBudget || 'not set'}
- Balance: ₹${(totalIncome - totalExpense).toLocaleString('en-IN')}

User question: ${userMsg}

Answer based on their actual data above. Be concise and friendly.`;

  const reply = await callGroq(contextPrompt);

  const loadingEl = document.getElementById(loadingId);
  if (loadingEl) loadingEl.remove();

  appendChatMessage(
    reply || "Sorry, I couldn't get a response. Please check your API key.",
    'bot'
  );
  aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
}

/* ----- Helper: Append chat bubble ----- */
function appendChatMessage(text, type, id = null) {
  const div = document.createElement('div');
  div.className = `ai-msg ai-msg--${type}`;
  if (id) div.id = id;
  div.textContent = text;
  aiChatMessages.appendChild(div);
  aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
}

/* ----- Event Listeners for Chat ----- */
aiSendBtn.addEventListener('click', sendAiMessage);

aiChatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendAiMessage();
  }
});
