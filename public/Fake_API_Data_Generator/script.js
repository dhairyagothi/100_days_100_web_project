// Fake Data Sources
const fakeData = {
  names: ["Rahul Sharma", "Aman Verma", "Priya Singh", "Arjun Patel", "Neha Gupta", "Karan Malhotra", "Riya Desai", "Aditya Joshi", "Simran Kaur", "Vikram Reddy", "Anita Roy", "Siddharth Rao"],
  companies: ["TechNova", "DevSphere", "CodeHub", "NextByte", "InnovateX", "DataCloud", "AlphaSystems", "PioneerSoft", "QuantumLogic", "ZenithCorp"],
  addresses: ["Delhi", "Mumbai", "Lucknow", "Bengaluru", "Pune", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Jaipur"],
  genders: ["Male", "Female", "Non-binary"],
  domains: ["gmail.com", "yahoo.com", "outlook.com", "tech.co", "dev.in"]
};

// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const generatorForm = document.getElementById('generator-form');
const recordCountInput = document.getElementById('record-count');
const countError = document.getElementById('count-error');
const fieldsError = document.getElementById('fields-error');
const generateBtn = document.getElementById('generate-btn');
const btnText = document.querySelector('.btn-text');
const spinner = document.getElementById('generate-spinner');

const emptyState = document.getElementById('empty-state');
const loadingOverlay = document.getElementById('loading-overlay');
const codeOutput = document.getElementById('code-output');
const codeContent = document.getElementById('code-content');
const statsBar = document.getElementById('stats-bar');
const generatedCountEl = document.getElementById('generated-count');

const copyBtn = document.getElementById('copy-btn');
const downloadTrigger = document.getElementById('download-trigger');
const downloadMenu = document.querySelector('.dropdown-menu');
const downloadJsonBtn = document.getElementById('download-json-btn');
const downloadCsvBtn = document.getElementById('download-csv-btn');
const toast = document.getElementById('toast');

let currentData = null;
let currentFormat = 'json';

// Initialize App
function init() {
  loadPreferences();
  
  // Event Listeners
  themeToggle.addEventListener('click', toggleTheme);
  generatorForm.addEventListener('submit', handleGenerate);
  copyBtn.addEventListener('click', handleCopy);
  
  // Dropdown toggle
  downloadTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    downloadMenu.classList.toggle('show');
  });

  // Close dropdown on click outside
  document.addEventListener('click', () => {
    downloadMenu.classList.remove('show');
  });

  // Downloads
  downloadJsonBtn.addEventListener('click', () => handleDownload('json'));
  downloadCsvBtn.addEventListener('click', () => handleDownload('csv'));

  // Save preferences on change
  generatorForm.addEventListener('change', savePreferences);
}

// Theme Management
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Preferences
function loadPreferences() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  const savedCount = localStorage.getItem('recordCount');
  if (savedCount) recordCountInput.value = savedCount;

  const savedFormat = localStorage.getItem('format');
  if (savedFormat) {
    const radio = document.querySelector(`input[name="format"][value="${savedFormat}"]`);
    if (radio) radio.checked = true;
  }

  const savedFields = JSON.parse(localStorage.getItem('fields'));
  if (savedFields) {
    const checkboxes = document.querySelectorAll('input[name="fields"]:not(:disabled)');
    checkboxes.forEach(cb => {
      cb.checked = savedFields.includes(cb.value);
    });
  }
}

function savePreferences() {
  localStorage.setItem('recordCount', recordCountInput.value);
  
  const format = document.querySelector('input[name="format"]:checked').value;
  localStorage.setItem('format', format);

  const selectedFields = Array.from(document.querySelectorAll('input[name="fields"]:checked'))
    .map(cb => cb.value);
  localStorage.setItem('fields', JSON.stringify(selectedFields));
}

// Generators
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateFakeData(count, fields) {
  const result = [];
  
  for (let i = 1; i <= count; i++) {
    const record = {};
    if (fields.includes('id')) record.id = i;
    
    let baseName = getRandomItem(fakeData.names);
    if (fields.includes('name')) record.name = baseName;
    
    if (fields.includes('username')) {
      record.username = baseName.toLowerCase().replace(' ', '') + getRandomInt(10, 999);
    }
    
    if (fields.includes('email')) {
      const domain = getRandomItem(fakeData.domains);
      const emailName = baseName.toLowerCase().replace(' ', '.');
      record.email = `${emailName}@${domain}`;
    }
    
    if (fields.includes('phone')) {
      record.phone = `+91 ${getRandomInt(60000, 99999)}${getRandomInt(10000, 99999)}`;
    }
    
    if (fields.includes('address')) record.address = getRandomItem(fakeData.addresses);
    if (fields.includes('company')) record.company = getRandomItem(fakeData.companies);
    if (fields.includes('age')) record.age = getRandomInt(18, 60);
    if (fields.includes('gender')) record.gender = getRandomItem(fakeData.genders);
    
    if (fields.includes('website')) {
      const company = getRandomItem(fakeData.companies).toLowerCase();
      record.website = `https://www.${company}.com`;
    }
    
    if (fields.includes('image')) {
      record.profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${baseName.replace(' ', '')}`;
    }
    
    result.push(record);
  }
  
  return result;
}

function convertToCSV(data) {
  if (data.length === 0) return '';
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // Headers
  csvRows.push(headers.join(','));
  
  // Data
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header];
      return typeof val === 'string' ? `"${val}"` : val;
    });
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

// Handlers
async function handleGenerate(e) {
  e.preventDefault();
  
  // Validation
  const count = parseInt(recordCountInput.value);
  if (isNaN(count) || count < 1 || count > 100) {
    countError.classList.add('visible');
    return;
  }
  countError.classList.remove('visible');

  const selectedFields = Array.from(document.querySelectorAll('input[name="fields"]:checked'))
    .map(cb => cb.value);
  
  if (selectedFields.length === 0) {
    fieldsError.classList.add('visible');
    return;
  }
  fieldsError.classList.remove('visible');

  // UI State - Loading
  currentFormat = document.querySelector('input[name="format"]:checked').value;
  generateBtn.disabled = true;
  btnText.textContent = 'Generating...';
  spinner.classList.remove('hidden');
  emptyState.classList.add('hidden');
  codeOutput.classList.add('hidden');
  statsBar.classList.add('hidden');
  loadingOverlay.classList.remove('hidden');
  copyBtn.disabled = true;
  downloadTrigger.disabled = true;

  // Simulate network delay for effect (1-2s)
  const delay = getRandomInt(1000, 2000);
  
  setTimeout(() => {
    // Generate data
    currentData = generateFakeData(count, selectedFields);
    
    // Display data
    displayData(currentData, currentFormat);
    animateCounter(count);

    // UI State - Done
    generateBtn.disabled = false;
    btnText.textContent = 'Generate Data';
    spinner.classList.add('hidden');
    loadingOverlay.classList.add('hidden');
    codeOutput.classList.remove('hidden');
    statsBar.classList.remove('hidden');
    copyBtn.disabled = false;
    downloadTrigger.disabled = false;
  }, delay);
}

function displayData(data, format) {
  let outputStr = '';
  if (format === 'json') {
    outputStr = JSON.stringify(data, null, 2);
    // basic syntax highlighting simulation
    outputStr = outputStr.replace(/(".*?"):/g, '<span style="color: #6366f1;">$1</span>:');
    outputStr = outputStr.replace(/: (".*?")/g, ': <span style="color: #10b981;">$1</span>');
    outputStr = outputStr.replace(/: (\d+)/g, ': <span style="color: #f59e0b;">$1</span>');
  } else {
    const csvStr = convertToCSV(data);
    // escape html
    outputStr = csvStr.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  
  codeContent.innerHTML = outputStr;
}

function animateCounter(target) {
  let current = 0;
  const increment = target / 20;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    generatedCountEl.textContent = Math.floor(current);
  }, 20);
}

async function handleCopy() {
  if (!currentData) return;
  
  let textToCopy = '';
  if (currentFormat === 'json') {
    textToCopy = JSON.stringify(currentData, null, 2);
  } else {
    textToCopy = convertToCSV(currentData);
  }

  try {
    await navigator.clipboard.writeText(textToCopy);
    showToast('Copied to clipboard');
  } catch (err) {
    showToast('Failed to copy', true);
  }
}

function handleDownload(type) {
  if (!currentData) return;
  
  let content, filename, mimeType;
  
  if (type === 'json') {
    content = JSON.stringify(currentData, null, 2);
    filename = 'fake-data.json';
    mimeType = 'application/json';
  } else {
    content = convertToCSV(currentData);
    filename = 'fake-data.csv';
    mimeType = 'text/csv';
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  downloadMenu.classList.remove('show');
}

function showToast(message, isError = false) {
  const toastMsg = document.getElementById('toast-message');
  toastMsg.textContent = message;
  
  if (isError) {
    toast.style.background = 'var(--error-color)';
  } else {
    toast.style.background = 'var(--success-color)';
  }

  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Start app
init();
