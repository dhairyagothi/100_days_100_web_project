/**
 * SQL Query Visualizer — Main Application
 */

import { TABLES, getTable } from './data/sampleData.js';
import { EXAMPLE_QUERIES } from './data/exampleQueries.js';
import { parseSQL } from './parser/sqlParser.js';
import { executeQuery, getFinalResult } from './engine/queryEngine.js';
import { renderTables, renderTablePreview } from './visualizer/renderer.js';
import { renderJoinDiagram, hideJoinDiagram } from './visualizer/joinDiagram.js';
import { initEditor, renderTimeline } from './ui/editor.js';
import { initTheme } from './ui/theme.js';
import { saveQuery, loadQuery } from './ui/storage.js';
import { downloadCSV } from './ui/csvExport.js';

// DOM Elements
const sqlEditor = document.getElementById('sql-editor');
const editorHighlight = document.getElementById('editor-highlight');
const lineNumbers = document.getElementById('line-numbers');
const parseError = document.getElementById('parse-error');
const runBtn = document.getElementById('run-query');
const vizContent = document.getElementById('viz-content');
const emptyState = document.getElementById('empty-state');
const timeline = document.getElementById('timeline');
const stepIndicator = document.getElementById('step-indicator');
const stepPrev = document.getElementById('step-prev');
const stepNext = document.getElementById('step-next');
const stepPlay = document.getElementById('step-play');
const stepExplanation = document.getElementById('step-explanation');
const explanationText = document.getElementById('explanation-text');
const joinDiagram = document.getElementById('join-diagram');
const learningMode = document.getElementById('learning-mode');
const downloadBtn = document.getElementById('download-csv');
const tableList = document.getElementById('table-list');
const exampleList = document.getElementById('example-list');
const tableModal = document.getElementById('table-modal');
const modalBody = document.getElementById('modal-body');
const modalTitle = document.getElementById('modal-title');

// State
let steps = [];
let currentStep = 0;
let playInterval = null;
let finalResult = null;

// Initialize
const editor = initEditor(sqlEditor, editorHighlight, lineNumbers);
initTheme(document.getElementById('theme-toggle'));

initSidebar();
initModal();
initControls();

function initSidebar() {
  // Table list
  for (const name of Object.keys(TABLES)) {
    const btn = document.createElement('button');
    btn.className = 'table-item';
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <line x1="3" y1="15" x2="21" y2="15"/>
        <line x1="9" y1="3" x2="9" y2="21"/>
      </svg>
      ${name}
    `;
    btn.addEventListener('click', () => showTablePreview(name));
    tableList.appendChild(btn);
  }

  // Example queries
  for (const example of EXAMPLE_QUERIES) {
    const btn = document.createElement('button');
    btn.className = 'example-item';
    btn.innerHTML = `
      <span class="example-label">${example.label}</span>
      <span class="example-desc">${example.description}</span>
    `;
    btn.addEventListener('click', () => {
      editor.setValue(example.sql);
      runQuery();
    });
    exampleList.appendChild(btn);
  }
}

function initModal() {
  const closeBtn = tableModal.querySelector('.modal-close');
  const backdrop = tableModal.querySelector('.modal-backdrop');

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

function showTablePreview(name) {
  const table = getTable(name);
  if (!table) return;
  modalTitle.textContent = `Table: ${name}`;
  modalBody.innerHTML = '';
  modalBody.appendChild(renderTablePreview(table));
  tableModal.classList.remove('hidden');
}

function closeModal() {
  tableModal.classList.add('hidden');
}

function initControls() {
  runBtn.addEventListener('click', runQuery);
  stepPrev.addEventListener('click', () => goToStep(currentStep - 1));
  stepNext.addEventListener('click', () => goToStep(currentStep + 1));
  stepPlay.addEventListener('click', toggleAutoPlay);

  document.getElementById('save-query').addEventListener('click', () => {
    saveQuery(editor.getValue());
    showToast('Query saved to browser storage');
  });

  document.getElementById('load-query').addEventListener('click', () => {
    const saved = loadQuery();
    if (saved) {
      editor.setValue(saved);
      showToast('Query loaded from storage');
    } else {
      showToast('No saved query found');
    }
  });

  downloadBtn.addEventListener('click', () => {
    if (finalResult) {
      downloadCSV(finalResult.columns, finalResult.rows);
    }
  });

  // Keyboard shortcut: Ctrl+Enter to run
  sqlEditor.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      runQuery();
    }
  });
}

function runQuery() {
  stopAutoPlay();
  parseError.classList.add('hidden');

  try {
    const sql = editor.getValue().trim();
    if (!sql) throw new Error('Please enter a SQL query');

    const ast = parseSQL(sql);
    steps = executeQuery(ast);
    currentStep = 0;
    finalResult = getFinalResult(steps);

    emptyState.classList.add('hidden');
    downloadBtn.disabled = !finalResult || finalResult.rows.length === 0;

    renderTimeline(timeline, steps, currentStep, goToStep);
    showStep(0);
  } catch (err) {
    parseError.textContent = `⚠ ${err.message}`;
    parseError.classList.remove('hidden');
    steps = [];
    currentStep = 0;
    timeline.innerHTML = '';
    stepIndicator.textContent = 'Step 0 / 0';
    stepPrev.disabled = true;
    stepNext.disabled = true;
    hideJoinDiagram(joinDiagram);
    stepExplanation.classList.add('hidden');
    downloadBtn.disabled = true;
  }
}

function showStep(index) {
  if (index < 0 || index >= steps.length) return;
  currentStep = index;
  const step = steps[index];

  stepIndicator.textContent = `Step ${index + 1} / ${steps.length}`;
  stepPrev.disabled = index === 0;
  stepNext.disabled = index === steps.length - 1;

  renderTimeline(timeline, steps, currentStep, goToStep);

  // Explanation
  if (learningMode.checked && step.explanation) {
    stepExplanation.classList.remove('hidden');
    explanationText.innerHTML = step.explanation;
  } else {
    stepExplanation.classList.add('hidden');
  }

  // Join diagram
  if (step.joinInfo) {
    renderJoinDiagram(joinDiagram, step.joinInfo, index);
  } else {
    hideJoinDiagram(joinDiagram);
  }

  // Tables
  const tables = step.tables || [];
  renderTables(vizContent, tables, { resultTable: step.resultTable });
}

function goToStep(index) {
  stopAutoPlay();
  showStep(index);
}

function toggleAutoPlay() {
  if (playInterval) {
    stopAutoPlay();
    return;
  }

  if (currentStep >= steps.length - 1) {
    currentStep = 0;
    showStep(0);
  }

  playInterval = setInterval(() => {
    if (currentStep < steps.length - 1) {
      showStep(currentStep + 1);
    } else {
      stopAutoPlay();
    }
  }, 1500);
}

function stopAutoPlay() {
  if (playInterval) {
    clearInterval(playInterval);
    playInterval = null;
  }
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed; bottom: 24px; right: 24px; z-index: 300;
    background: var(--bg-elevated); color: var(--text-primary);
    border: 1px solid var(--border-color); border-radius: 8px;
    padding: 0.75rem 1.25rem; font-size: 0.8125rem;
    box-shadow: var(--shadow); animation: fadeIn 0.3s ease;
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// Auto-run on load with default query
runQuery();
