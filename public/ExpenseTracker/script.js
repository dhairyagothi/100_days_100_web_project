/* =========================================================
   EXPENSE TRACKER - PROFESSIONAL FINAL SCRIPT
========================================================= */

/* ---------------- APP STATE ---------------- */

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let income = parseFloat(localStorage.getItem("income")) || 0;
let monthlyBudget = parseFloat(localStorage.getItem("monthlyBudget")) || 0;
let categoryLimits = JSON.parse(localStorage.getItem("categoryLimits")) || {};

let currentFilter = "All";
let searchQuery = "";
let editingExpenseId = null;

/* ---------------- DOM ELEMENTS ---------------- */

const incomeForm = document.getElementById("income-form");
const incomeInput = document.getElementById("income-input");

const budgetForm = document.getElementById("budget-form");
const budgetInput = document.getElementById("budget-input");

const expenseForm = document.getElementById("expense-form");
const expenseNameInput = document.getElementById("expense-name");
const expenseAmountInput = document.getElementById("expense-amount");
const expenseCategorySelect = document.getElementById("expense-category");
const expenseRecurringInput = document.getElementById("expense-recurring");
const receiptUploadInput = document.getElementById("receipt-upload");
const receiptStatusEl = document.getElementById("receipt-status");
const addExpenseBtn = expenseForm ? expenseForm.querySelector('button[type="submit"]') : null;


const categoryLimitsForm = document.getElementById("category-limits-form");
const categoryLimitInputs = document.querySelectorAll("[data-category]");

const totalIncomeEl = document.getElementById("total-income");
const totalExpensesEl = document.getElementById("total-expenses");
const netBalanceEl = document.getElementById("net-balance");

const monthlyBudgetEl = document.getElementById("monthly-budget");
const budgetLeftEl = document.getElementById("budget-left");
const budgetLeftCard = document.getElementById("budget-left-card");
const budgetLeftIcon = document.getElementById("budget-left-icon");
const budgetWarningMessage = document.getElementById("budget-warning-message");

const categoryFilterSelect = document.getElementById("category-filter");
const expenseListEl = document.getElementById("expense-list");
const noExpensesEl = document.getElementById("no-expenses");

const chartProgress = document.getElementById("chart-progress");
const expenseRatioEl = document.getElementById("expense-ratio");
const legendEl = document.getElementById("category-breakdown-legend");

const dateTextEl = document.getElementById("date-text");

const searchInput = document.getElementById("search-transaction");

const themeToggle = document.getElementById("theme-toggle");
const exportCsvBtn = document.getElementById("export-csv");

/* ---------------- CATEGORY CONFIG ---------------- */

const categories = {
    Food: {
        color: "#10b981",
        class: "cat-food",
        icon: "🍔"
    },
    Travel: {
        color: "#0ea5e9",
        class: "cat-travel",
        icon: "✈️"
    },
    Shopping: {
        color: "#8b5cf6",
        class: "cat-shopping",
        icon: "🛍️"
    },
    Bills: {
        color: "#f59e0b",
        class: "cat-bills",
        icon: "📄"
    },
    Other: {
        color: "#64748b",
        class: "cat-other",
        icon: "📦"
    }
};

/* ---------------- INIT ---------------- */

document.addEventListener("DOMContentLoaded", () => {

    loadTheme();

    if (income > 0) {
        incomeInput.value = income;
    }

    if (monthlyBudget > 0) {
        budgetInput.value = monthlyBudget;
    }

    populateCategoryLimitInputs();

    processRecurringExpenses();

    displayCurrentDate();

    setupEventListeners();

    updateUI();
});

/* ---------------- EVENT LISTENERS ---------------- */

function setupEventListeners() {

    if (exportCsvBtn) {
        exportCsvBtn.addEventListener("click", exportExpensesToCSV);
    }

    /* Income */

    incomeForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const value = parseFloat(incomeInput.value);

        if (!isNaN(value) && value >= 0) {
            income = value;

            localStorage.setItem("income", income);

            updateUI();
        }
    });

    /* Budget */

    if (budgetForm) {
        budgetForm.addEventListener("submit", (e) => {

            e.preventDefault();

            const value = parseFloat(budgetInput.value);

            if (!isNaN(value) && value >= 0) {

                monthlyBudget = value;

                localStorage.setItem("monthlyBudget", monthlyBudget);

                updateUI();
            }
        });
    }

    /* Category Limits */

    if (categoryLimitsForm) {
        categoryLimitsForm.addEventListener("submit", (e) => {
            e.preventDefault();

            categoryLimitInputs.forEach(input => {
                const category = input.dataset.category;
                const value = parseFloat(input.value);

                if (!isNaN(value) && value > 0) {
                    categoryLimits[category] = value;
                } else {
                    delete categoryLimits[category];
                    input.value = "";
                }
            });

            saveCategoryLimits();

            updateUI();
        });
    }

    /* Add Expense */

    expenseForm.addEventListener("submit", (e) => {
        e.preventDefault();

        addExpense();
    });
    /* Receipt OCR */

    if (receiptUploadInput) {
        receiptUploadInput.addEventListener("change", handleReceiptUpload);
    }
    /* Filter */

    categoryFilterSelect.addEventListener("change", (e) => {

        currentFilter = e.target.value;

        renderExpenses();
    });

    /* Search */

    if (searchInput) {

        searchInput.addEventListener("input", (e) => {

            searchQuery = e.target.value.toLowerCase();

            renderExpenses();
        });
    }

    /* Theme Toggle */

    if (themeToggle) {

        themeToggle.addEventListener("click", () => {

            document.body.classList.toggle("light-theme");

            localStorage.setItem(
                "theme",
                document.body.classList.contains("light-theme")
                    ? "light"
                    : "dark"
            );
        });
    }
}

/* ---------------- THEME ---------------- */

function loadTheme() {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-theme");
    }
}

/* ---------------- DATE ---------------- */

function displayCurrentDate() {

    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    };

    const today = new Date();

    dateTextEl.textContent = today.toLocaleDateString("en-US", options);
}

/* ---------------- ADD EXPENSE ---------------- */

function addExpense() {

    const name = expenseNameInput.value.trim();

    const amount = parseFloat(expenseAmountInput.value);

    const category = expenseCategorySelect.value;

    const recurring = expenseRecurringInput
        ? expenseRecurringInput.checked
        : false;

    if (!name || isNaN(amount) || amount <= 0 || !category) {

        alert("Please fill all fields correctly.");

        return;
    }

    /* EDIT MODE */

    if (editingExpenseId) {

        expenses = expenses.map(exp => {

            if (exp.id === editingExpenseId) {

                const recurringParentId =
                    exp.recurringParentId || exp.id;

                return {
                    ...exp,
                    name,
                    amount,
                    category,
                    recurring,
                    recurringParentId: recurring
                        ? recurringParentId
                        : undefined
                };
            }

            return exp;
        });

        editingExpenseId = null;

    } else {

        const id = Date.now().toString();

        const newExpense = {
            id,
            name,
            amount,
            category,
            date: Date.now(),
            recurring,
            recurringParentId: recurring ? id : undefined,
            recurringMonth: recurring ? getMonthKey(new Date()) : undefined
        };

        expenses.push(newExpense);
    }

    saveExpenses();
    // Receipt OCR: top-level handlers defined below
    updateUI();

    expenseForm.reset();

    expenseCategorySelect.selectedIndex = 0;
}

/* ---------------- EDIT EXPENSE ---------------- */

/* ---------------- RECEIPT OCR (Top-level) ---------------- */

const OCR_CONFIDENCE_THRESHOLD = 0.68;

// Preprocess the receipt before OCR. Grayscale + contrast + light thresholding
// makes small receipt totals much easier for Tesseract to read.
async function preprocessImage(file, maxWidth = 2000) {
    const imgBitmap = await createImageBitmap(file);

    const scale = Math.min(1, maxWidth / imgBitmap.width);
    const width = Math.round(imgBitmap.width * scale);
    const height = Math.round(imgBitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imgBitmap, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    const contrast = 55;
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        let lum = 0.299 * r + 0.587 * g + 0.114 * b;
        lum = factor * (lum - 128) + 128;
        lum = Math.max(0, Math.min(255, lum));

        // Keep a soft threshold so decimals and currency symbols survive.
        if (lum > 205) {
            lum = 255;
        } else if (lum < 55) {
            lum = 0;
        }

        data[i] = data[i + 1] = data[i + 2] = lum;
    }

    ctx.putImageData(imageData, 0, 0);

    return canvas;
}

async function handleReceiptUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!window.Tesseract) {
        receiptStatusEl.textContent = "Receipt scanning is unavailable. Please enter it manually.";
        receiptStatusEl.className = 'receipt-status error';
        return;
    }

    receiptStatusEl.textContent = 'Scanning receipt...';
    receiptStatusEl.className = 'receipt-status loading';
    if (addExpenseBtn) addExpenseBtn.disabled = true;

    try {
        const canvas = await preprocessImage(file);

        const { data } = await Tesseract.recognize(canvas, 'eng', {
            logger: m => {
                if (m.status === 'recognizing text' && m.progress) {
                    const pct = Math.round(m.progress * 100);
                    receiptStatusEl.textContent = `Scanning receipt... ${pct}%`;
                }
            }
        });

        const text = data.text || '';

        const result = extractAmountFromText(text);

        if (result.amount !== null && result.confidence >= OCR_CONFIDENCE_THRESHOLD) {
            expenseAmountInput.value = result.amount.toFixed(2);
            receiptStatusEl.textContent = `Detected amount: ${formatCurrency(result.amount)}`;
            receiptStatusEl.className = 'receipt-status success';
        } else if (result.amount !== null && result.confidence >= 0.52) {
            expenseAmountInput.value = result.amount.toFixed(2);
            receiptStatusEl.textContent = "Detected amount (low confidence). Please verify.";
            receiptStatusEl.className = 'receipt-status error';
        } else {
            receiptStatusEl.textContent = "Couldn't detect the amount. Please enter it manually.";
            receiptStatusEl.className = 'receipt-status error';
        }

    } catch (err) {
        console.error(err);
        receiptStatusEl.textContent = 'Failed to scan image. Please try again.';
        receiptStatusEl.className = 'receipt-status error';
    } finally {
        if (addExpenseBtn) addExpenseBtn.disabled = false;
    }
}

function extractAmountFromText(text) {
    if (!text || !text.trim()) return { amount: null, confidence: 0 };

    const normalized = normalizeOcrText(text);
    const lines = normalized.split('\n').map(line => line.trim()).filter(Boolean);
    const candidates = [];

    lines.forEach((line, index) => {
        const context = [
            lines[index - 1] || "",
            line,
            lines[index + 1] || ""
        ].join(" ");

        getMoneyMatches(line).forEach(match => {
            const candidate = buildAmountCandidate(match, line, context, index, lines.length);

            if (candidate) {
                candidates.push(candidate);
            }
        });
    });

    if (candidates.length === 0) {
        return { amount: null, confidence: 0 };
    }

    const keywordCandidates = candidates
        .filter(candidate => candidate.keywordScore > 0)
        .sort((a, b) => b.score - a.score || b.value - a.value);

    if (keywordCandidates.length > 0) {
        const best = keywordCandidates[0];

        return {
            amount: roundTwo(best.value),
            confidence: Math.min(0.97, Math.max(0.72, best.score / 100))
        };
    }

    const fallbackCandidates = candidates
        .filter(candidate => candidate.value > 0)
        .sort((a, b) => b.score - a.score || b.value - a.value);

    const best = fallbackCandidates[0];
    const second = fallbackCandidates[1];

    if (!best || best.score < 35) {
        return { amount: null, confidence: 0 };
    }

    let confidence = Math.min(0.78, best.score / 100);

    if (second && Math.abs(best.value - second.value) / best.value < 0.03) {
        confidence -= 0.1;
    }

    return {
        amount: roundTwo(best.value),
        confidence: Math.max(0.45, confidence)
    };
}

function normalizeOcrText(text) {
    return text
        .replace(/\r/g, "\n")
        .replace(/[|]/g, "1")
        .replace(/[¢€£₹]/g, "$")
        .replace(/[，]/g, ",")
        .replace(/[．]/g, ".")
        .replace(/\bO(?=\d)/gi, "0")
        .replace(/(?<=\d)O\b/gi, "0")
        .replace(/[ \t]+/g, " ");
}

function getMoneyMatches(line) {
    const moneyPatterns = [
        /(?:[$]|rs\.?|inr|usd|eur|gbp|cad|aud)\s*[-+]?\s*\d{1,3}(?:(?:,\d{3})+|\d*)(?:[.,]\d{1,2})?/gi,
        /[-+]?\d{1,3}(?:(?:,\d{3})+|\d*)(?:[.,]\d{2})\b/g,
        /\b\d{1,5}\b/g
    ];

    const matches = [];

    moneyPatterns.forEach(pattern => {
        let match;

        while ((match = pattern.exec(line)) !== null) {
            matches.push({
                raw: match[0],
                index: match.index
            });
        }
    });

    return matches;
}

function buildAmountCandidate(match, line, context, lineIndex, lineCount) {
    const value = parseCurrencyNumber(match.raw);

    if (!isFinite(value) || value <= 0 || value > 1000000) {
        return null;
    }

    const raw = match.raw.trim();
    const lowerLine = line.toLowerCase();
    const lowerContext = context.toLowerCase();

    if (looksLikeNonAmount(raw, lowerLine, value)) {
        return null;
    }

    const keywordScore = getKeywordScore(lowerContext);
    let score = keywordScore;

    if (/[$]|rs\.?|inr|usd|eur|gbp|cad|aud/i.test(raw)) score += 18;
    if (/[.,]\d{2}\b/.test(raw)) score += 14;
    if (lineIndex >= Math.floor(lineCount * 0.55)) score += 10;
    if (lineIndex >= Math.floor(lineCount * 0.75)) score += 10;
    if (value >= 1) score += 8;
    if (value >= 10) score += 8;
    if (value >= 100) score += 5;

    if (/\b(subtotal|sub total|tax|gst|vat|cgst|sgst|discount|change|cash|tender|round(?:ed)?|tip)\b/i.test(lowerContext)) {
        score -= 22;
    }

    if (/\b(balance due|amount due|total due|amount payable|net amount|grand total)\b/i.test(lowerContext)) {
        score += 16;
    }

    return {
        value,
        raw,
        line,
        keywordScore,
        score
    };
}

function getKeywordScore(text) {
    const keywordPatterns = [
        { regex: /\bgrand\s*total\b/i, score: 68 },
        { regex: /\bamount\s*payable\b/i, score: 66 },
        { regex: /\bnet\s*amount\b/i, score: 64 },
        { regex: /\btotal\s*due\b/i, score: 64 },
        { regex: /\bpayable\b/i, score: 58 },
        { regex: /\bbalance\s*due\b/i, score: 58 },
        { regex: /\btotal\s*(amount|amt)\b/i, score: 56 },
        { regex: /\bamount\s*due\b/i, score: 54 },
        { regex: /\btotal\b/i, score: 46 }
    ];

    const match = keywordPatterns.find(item => item.regex.test(text));
    return match ? match.score : 0;
}

function parseCurrencyNumber(str) {
    let cleaned = str
        .replace(/(?:rs\.?|inr|usd|eur|gbp|cad|aud)/gi, "")
        .replace(/[$\s]/g, "")
        .replace(/[^0-9.,-]/g, "");

    if (!cleaned || cleaned === "-" || cleaned === ".") {
        return NaN;
    }

    const hasComma = cleaned.includes(",");
    const hasDot = cleaned.includes(".");

    if (hasComma && hasDot) {
        cleaned = cleaned.replace(/,/g, "");
    } else if (hasComma) {
        const parts = cleaned.split(",");
        const lastPart = parts[parts.length - 1];

        cleaned = lastPart.length === 2
            ? `${parts.slice(0, -1).join("")}.${lastPart}`
            : cleaned.replace(/,/g, "");
    }

    return parseFloat(cleaned);
}

function looksLikeNonAmount(raw, line, value) {
    const digits = raw.replace(/[^0-9]/g, "");

    if (!digits) return true;
    if (value <= 0) return true;
    if (digits.length >= 7 && !/[.,]\d{1,2}\b/.test(raw)) return true;
    if (looksLikeDateOrYear(raw, line)) return true;

    const nonAmountWords = /\b(invoice|inv|bill\s*no|receipt\s*no|order|token|phone|mobile|tel|gstin|tin|tax\s*id|qty|quantity|table|cashier|card|auth|approval|ref|terminal|time|date)\b/i;

    if (nonAmountWords.test(line) && !getKeywordScore(line)) {
        return true;
    }

    return false;
}

function looksLikeDateOrYear(raw, line = "") {
    const digits = raw.replace(/[^0-9]/g, '');
    const n = parseInt(digits, 10);

    if (!isNaN(n) && n >= 1900 && n <= 2100) return true;
    if (/\b\d{1,2}[/-]\d{1,2}(?:[/-]\d{2,4})?\b/.test(line)) return true;
    if (/\b\d{1,2}:\d{2}(?::\d{2})?\b/.test(line)) return true;
    if (digits.length >= 7 && !/[.,]\d{1,2}\b/.test(raw)) return true;

    return false;
}

function roundTwo(n) {
    return Math.round((n + Number.EPSILON) * 100) / 100;
}

function editExpense(id) {

    const expense = expenses.find(exp => exp.id === id);

    if (!expense) return;

    expenseNameInput.value = expense.name;

    expenseAmountInput.value = expense.amount;

    expenseCategorySelect.value = expense.category;

    if (expenseRecurringInput) {
        expenseRecurringInput.checked = Boolean(expense.recurring);
    }

    editingExpenseId = id;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* ---------------- DELETE EXPENSE ---------------- */

function deleteExpense(id) {

    const expenseItem = document.querySelector(`[data-id="${id}"]`);

    if (expenseItem) {

        expenseItem.classList.add("deleting");

        expenseItem.addEventListener("animationend", () => {

            expenses = expenses.filter(exp => exp.id !== id);

            saveExpenses();

            updateUI();
        });

    } else {

        expenses = expenses.filter(exp => exp.id !== id);

        saveExpenses();

        updateUI();
    }
}

/* ---------------- SAVE ---------------- */

function saveExpenses() {

    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function saveCategoryLimits() {

    localStorage.setItem("categoryLimits", JSON.stringify(categoryLimits));
}

function populateCategoryLimitInputs() {

    categoryLimitInputs.forEach(input => {

        const category = input.dataset.category;

        if (categoryLimits[category]) {
            input.value = categoryLimits[category];
        }
    });
}

function getMonthKey(date) {

    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getExpenseMonthKey(expense) {

    if (expense.recurringMonth) {
        return expense.recurringMonth;
    }

    return getMonthKey(new Date(expense.date));
}

function processRecurringExpenses() {

    const currentMonth = getMonthKey(new Date());
    const lastRecurringMonth = localStorage.getItem("lastRecurringMonth");

    if (lastRecurringMonth === currentMonth) {
        return;
    }

    const recurringTemplates = new Map();

    expenses
        .filter(exp => exp.recurring && getExpenseMonthKey(exp) !== currentMonth)
        .sort((a, b) => a.date - b.date)
        .forEach(exp => {
            const seriesId = exp.recurringParentId || exp.id;
            recurringTemplates.set(seriesId, exp);
        });

    recurringTemplates.forEach((template, seriesId) => {

        const alreadyAdded = expenses.some(exp =>
            exp.recurring &&
            (exp.recurringParentId || exp.id) === seriesId &&
            getExpenseMonthKey(exp) === currentMonth
        );

        if (alreadyAdded) {
            return;
        }

        expenses.push({
            ...template,
            id: `${Date.now()}-${seriesId}`,
            date: Date.now(),
            recurring: true,
            recurringParentId: seriesId,
            recurringMonth: currentMonth
        });
    });

    localStorage.setItem("lastRecurringMonth", currentMonth);

    saveExpenses();
}

/* ---------------- FORMATTERS ---------------- */

function formatCurrency(amount) {

    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(amount);
}

function formatDate(timestamp) {

    const date = new Date(timestamp);

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

/* ---------------- RENDER EXPENSES ---------------- */

function renderExpenses() {

    expenseListEl.innerHTML = "";

    let filteredExpenses = expenses;

    /* Category Filter */

    if (currentFilter !== "All") {

        filteredExpenses = filteredExpenses.filter(
            exp => exp.category === currentFilter
        );
    }

    /* Search Filter */

    if (searchQuery) {

        filteredExpenses = filteredExpenses.filter(exp =>
            exp.name.toLowerCase().includes(searchQuery)
        );
    }

    /* Sort */

    filteredExpenses.sort((a, b) => b.date - a.date);

    if (filteredExpenses.length === 0) {

        noExpensesEl.style.display = "flex";

        expenseListEl.style.display = "none";

        return;
    }

    noExpensesEl.style.display = "none";

    expenseListEl.style.display = "flex";

    filteredExpenses.forEach(exp => {

        const catConfig = categories[exp.category] || categories.Other;
        const recurringTag = exp.recurring
            ? `<span class="recurring-tag">Monthly</span>`
            : "";

        const li = document.createElement("li");

        li.className = "expense-item";

        li.setAttribute("data-id", exp.id);

        li.innerHTML = `
            <div class="item-category-icon ${catConfig.class}">
                ${catConfig.icon}
            </div>

            <div class="item-details">
                <span class="item-name">${escapeHTML(exp.name)}</span>

                <div class="item-meta">
                    <span class="item-category-label ${catConfig.class}-label">
                        ${exp.category}
                    </span>

                    <span>•</span>

                    <span>${formatDate(exp.date)}</span>

                    ${recurringTag}
                </div>
            </div>

            <div class="item-amount">
                -${formatCurrency(exp.amount)}
            </div>

            <div class="expense-actions">

                <button class="btn-edit"
                    onclick="editExpense('${exp.id}')">
                    ✏️
                </button>

                <button class="btn-delete"
                    onclick="deleteExpense('${exp.id}')">
                    🗑️
                </button>

            </div>
        `;

        expenseListEl.appendChild(li);
    });
}

/* ---------------- UPDATE SUMMARY ---------------- */

function updateSummary() {

    const totalExpenses = expenses.reduce(
        (sum, exp) => sum + exp.amount,
        0
    );

    const balance = income - totalExpenses;

    totalIncomeEl.textContent = formatCurrency(income);

    totalExpensesEl.textContent = formatCurrency(totalExpenses);

    netBalanceEl.textContent = formatCurrency(balance);

    /* Budget */

    if (monthlyBudgetEl) {

        monthlyBudgetEl.textContent =
            formatCurrency(monthlyBudget);

        const left = monthlyBudget - totalExpenses;

        budgetLeftEl.textContent =
            formatCurrency(left);

        updateBudgetWarning(totalExpenses);
    }

    /* Donut Chart */

    let percentage = 0;

    if (income > 0) {

        percentage = Math.round(
            (totalExpenses / income) * 100
        );

    } else if (totalExpenses > 0) {

        percentage = 100;
    }

    expenseRatioEl.textContent = `${percentage}%`;

    let strokeDashOffset = 251.2;

    if (percentage > 0) {

        const clampedPercentage = Math.min(percentage, 100);

        strokeDashOffset =
            251.2 - (clampedPercentage / 100) * 251.2;
    }

    chartProgress.style.strokeDashoffset = strokeDashOffset;

    updateLegend(totalExpenses);
}

function updateBudgetWarning(totalExpenses) {

    if (!budgetLeftCard || !budgetWarningMessage || !budgetLeftIcon) {
        return;
    }

    budgetLeftCard.classList.remove("budget-warning", "budget-danger");
    budgetWarningMessage.textContent = "";
    budgetLeftIcon.textContent = "📊";

    if (monthlyBudget <= 0) {
        return;
    }

    const spentPercent = (totalExpenses / monthlyBudget) * 100;

    if (spentPercent >= 100) {
        budgetLeftCard.classList.add("budget-danger");
        budgetLeftIcon.textContent = "⚠️";
        budgetWarningMessage.textContent = "Budget exceeded";
    } else if (spentPercent >= 80) {
        budgetLeftCard.classList.add("budget-warning");
        budgetLeftIcon.textContent = "⚠️";
        budgetWarningMessage.textContent = `${Math.round(spentPercent)}% of budget used`;
    }
}

/* ---------------- LEGEND ---------------- */

function updateLegend(totalExpenses) {

    legendEl.innerHTML = "";

    const catTotals = {
        Food: 0,
        Travel: 0,
        Shopping: 0,
        Bills: 0,
        Other: 0
    };

    expenses.forEach(exp => {

        if (catTotals[exp.category] !== undefined) {

            catTotals[exp.category] += exp.amount;

        } else {

            catTotals.Other += exp.amount;
        }
    });

    const activeCategories = Object.keys(catTotals)
        .filter(cat => catTotals[cat] > 0 || categoryLimits[cat] > 0);

    if (activeCategories.length === 0) {

        legendEl.innerHTML =
            `<div class="legend-placeholder">
                No data to display.
            </div>`;

        return;
    }

    activeCategories.forEach(cat => {

        const total = catTotals[cat];

        const percent =
            totalExpenses > 0
                ? Math.round((total / totalExpenses) * 100)
                : 0;

        const config = categories[cat];
        const limit = categoryLimits[cat] || 0;
        const limitPercent = limit > 0
            ? Math.round((total / limit) * 100)
            : 0;
        const clampedLimitPercent = Math.min(limitPercent, 100);
        const progressState = limit > 0 && limitPercent >= 100
            ? "danger"
            : limit > 0 && limitPercent >= 80
                ? "warning"
                : "";
        const limitText = limit > 0
            ? `${limitPercent}% of ${formatCurrency(limit)}`
            : "No limit set";

        const legendItem = document.createElement("div");

        legendItem.className = "legend-item";

        legendItem.innerHTML = `
            <div class="legend-left">
                <span class="legend-color"
                    style="background:${config.color}">
                </span>

                <span class="legend-category">
                    ${cat}
                </span>
            </div>

            <div class="legend-right">
                <span class="legend-value">
                    ${formatCurrency(total)}
                </span>

                <span class="legend-percent">
                    ${percent}%
                </span>
            </div>

            <div class="category-limit-progress">
                <div class="category-limit-meta">
                    <span>${limitText}</span>
                </div>

                <div class="progress-track">
                    <div class="progress-fill ${progressState}"
                        style="width:${limit > 0 ? clampedLimitPercent : 0}%">
                    </div>
                </div>
            </div>
        `;

        legendEl.appendChild(legendItem);
    });
}

/* ---------------- UPDATE UI ---------------- */

function updateUI() {

    renderExpenses();

    updateSummary();
}

/* ---------------- ESCAPE HTML ---------------- */

function escapeHTML(str) {

    return str.replace(/[&<>'"]/g,

        tag => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            '"': "&quot;"
        }[tag] || tag)
    );
}

function exportExpensesToCSV() {

    if (expenses.length === 0) {
        alert("No expenses to export.");
        return;
    }

    const headers = ["Name", "Amount", "Category", "Date", "Recurring"];

    const rows = expenses.map(exp => [
        exp.name,
        exp.amount.toFixed(2),
        exp.category,
        new Date(exp.date).toLocaleString("en-US"),
        exp.recurring ? "Yes" : "No"
    ]);

    const csvContent = "\uFEFF" + [
        headers,
        ...rows
    ]
        .map(row => row.map(escapeCSVValue).join(","))
        .join("\r\n");

    const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");

    downloadLink.href = url;
    downloadLink.download = "spendwise-expenses.csv";

    document.body.appendChild(downloadLink);

    downloadLink.click();

    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(url);
}

function escapeCSVValue(value) {

    const stringValue = String(value);

    if (
        stringValue.includes(",") ||
        stringValue.includes("\"") ||
        stringValue.includes("\n")
    ) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
}

/* ---------------- GLOBAL ---------------- */

window.deleteExpense = deleteExpense;

window.editExpense = editExpense;
