/**
 * SQL Editor with syntax highlighting
 */

import { highlightSQL } from '../parser/sqlParser.js';

export function initEditor(textarea, highlightEl, lineNumbersEl) {
  function updateHighlight() {
    const value = textarea.value;
    highlightEl.innerHTML = highlightSQL(value) + '\n';
    updateLineNumbers(value);
    syncScroll();
  }

  function updateLineNumbers(value) {
    const lines = value.split('\n').length;
    lineNumbersEl.textContent = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
  }

  function syncScroll() {
    highlightEl.scrollTop = textarea.scrollTop;
    highlightEl.scrollLeft = textarea.scrollLeft;
    lineNumbersEl.scrollTop = textarea.scrollTop;
  }

  textarea.addEventListener('input', updateHighlight);
  textarea.addEventListener('scroll', syncScroll);
  textarea.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
      textarea.selectionStart = textarea.selectionEnd = start + 2;
      updateHighlight();
    }
  });

  updateHighlight();

  return {
    getValue: () => textarea.value,
    setValue: (val) => {
      textarea.value = val;
      updateHighlight();
    },
    updateHighlight,
  };
}

export function renderTimeline(container, steps, currentStep, onStepClick) {
  container.innerHTML = '';

  steps.forEach((step, i) => {
    if (i > 0) {
      const line = document.createElement('div');
      line.className = 'timeline-line' + (i <= currentStep ? ' completed' : '');
      container.appendChild(line);
    }

    const item = document.createElement('div');
    item.className = 'timeline-item';

    const dot = document.createElement('div');
    dot.className = 'timeline-dot';
    if (i === currentStep) dot.classList.add('active');
    else if (i < currentStep) dot.classList.add('completed');
    dot.textContent = i + 1;
    dot.title = step.title;
    dot.addEventListener('click', () => onStepClick(i));

    const label = document.createElement('div');
    label.className = 'timeline-label';
    label.textContent = step.operation;
    label.title = step.title;

    item.appendChild(dot);
    item.appendChild(label);

    const stepWrap = document.createElement('div');
    stepWrap.className = 'timeline-step';
    stepWrap.appendChild(item);
    container.appendChild(stepWrap);
  });
}
