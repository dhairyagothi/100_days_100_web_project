/* ============================================================
   CODE EXECUTION VISUALIZER — Complete JS
   ============================================================ */
'use strict';

// ── Constants ──────────────────────────────────────────────────
const STORAGE_KEY  = 'cev_code';
const SETTINGS_KEY = 'cev_settings';

// ── Code Examples ──────────────────────────────────────────────
const EXAMPLES = {
  fibonacci: `// Fibonacci Sequence
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

let result = fibonacci(6);
console.log("fibonacci(6) =", result);`,

  factorial: `// Factorial using Recursion
function factorial(n) {
  if (n === 0) return 1;
  return n * factorial(n - 1);
}

let n = 5;
let result = factorial(n);
console.log("factorial(" + n + ") =", result);`,

  bubbleSort: `// Bubble Sort Algorithm
function bubbleSort(arr) {
  let n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}

let arr = [64, 34, 25, 12, 22, 11, 90];
console.log("Before:", arr.join(", "));
let sorted = bubbleSort(arr);
console.log("After:", sorted.join(", "));`,

  binarySearch: `// Binary Search Algorithm
function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    let mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

let arr = [1, 3, 5, 7, 9, 11, 13, 15];
let target = 7;
let index = binarySearch(arr, target);
console.log("Found", target, "at index:", index);`,

  stackOps: `// Stack Implementation
class Stack {
  constructor() {
    this.items = [];
  }
  push(item) {
    this.items.push(item);
    return this;
  }
  pop() {
    return this.items.pop();
  }
  peek() {
    return this.items[this.items.length - 1];
  }
  isEmpty() {
    return this.items.length === 0;
  }
  size() {
    return this.items.length;
  }
}

let stack = new Stack();
stack.push(10);
stack.push(20);
stack.push(30);
console.log("Top:", stack.peek());
console.log("Size:", stack.size());
let popped = stack.pop();
console.log("Popped:", popped);
console.log("New top:", stack.peek());`,

  closures: `// Closures and Scope
function makeCounter(start) {
  let count = start;

  function increment() {
    count += 1;
    return count;
  }

  function decrement() {
    count -= 1;
    return count;
  }

  function getCount() {
    return count;
  }

  return { increment, decrement, getCount };
}

let counter = makeCounter(0);
console.log(counter.increment());
console.log(counter.increment());
console.log(counter.increment());
console.log(counter.decrement());
console.log("Final:", counter.getCount());`
};

// ── State ──────────────────────────────────────────────────────
let settings     = { theme: 'dark' };
let currentLang  = 'javascript';
let steps        = [];
let currentStep  = -1;
let isPlaying    = false;
let playInterval = null;
let speed        = 5;
let breakpoints  = new Set();
let variables    = {};
let callStack    = [];
let heapObjects  = {};
let heapCounter  = 1;

// ── DOM ────────────────────────────────────────────────────────
const $ = id => document.getElementById(id);

// ── Init ───────────────────────────────────────────────────────
function init() {
  loadSettings();
  applyTheme();
  loadSavedCode();
  updateLineNumbers();
  bindEvents();
}

// ── Storage ────────────────────────────────────────────────────
function loadSettings() {
  try { settings = { theme:'dark', ...JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}') }; } catch(e) {}
}
function saveSettings() { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }
function loadSavedCode() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if(saved) $('codeEditor').value = saved;
}
function saveCode() { localStorage.setItem(STORAGE_KEY, $('codeEditor').value); }

// ── Theme ──────────────────────────────────────────────────────
function applyTheme() {
  document.documentElement.setAttribute('data-theme', settings.theme);
  $('themeToggle').querySelector('i').className =
    settings.theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
}
function toggleTheme() {
  settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
  applyTheme(); saveSettings();
}

// ── Bind Events ────────────────────────────────────────────────
function bindEvents() {
  $('themeToggle').addEventListener('click', toggleTheme);
  $('shareBtn').addEventListener('click', shareCode);
  $('resetAllBtn').addEventListener('click', resetAll);

  $('codeEditor').addEventListener('input', () => {
    updateLineNumbers(); saveCode(); resetExecution();
  });
  $('codeEditor').addEventListener('keydown', handleEditorKeydown);
  $('codeEditor').addEventListener('scroll', syncScroll);

  $('lineNumbers').addEventListener('click', toggleBreakpoint);

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLang = btn.dataset.lang;
      resetExecution();
      showToast(`Switched to ${btn.textContent.trim()}`, 'info');
    });
  });

  $('exampleSelect').addEventListener('change', () => {
    const val = $('exampleSelect').value;
    if(val && EXAMPLES[val]) {
      $('codeEditor').value = EXAMPLES[val];
      updateLineNumbers();
      resetExecution();
      saveCode();
      showToast(`Loaded: ${val}`, 'success');
      $('exampleSelect').value = '';
    }
  });

  $('speedSlider').addEventListener('input', () => {
    speed = parseInt($('speedSlider').value);
    $('speedLabel').textContent = `${speed}x`;
    if(isPlaying) { stopPlay(); startPlay(); }
  });

  $('playBtn').addEventListener('click', togglePlay);
  $('stepFwdBtn').addEventListener('click', stepForward);
  $('stepBackBtn').addEventListener('click', stepBackward);
  $('resetBtn').addEventListener('click', resetExecution);
  $('runBtn').addEventListener('click', runAll);

  $('clearCodeBtn').addEventListener('click', () => {
    if(confirm('Clear all code?')) {
      $('codeEditor').value = '';
      updateLineNumbers();
      resetExecution();
      localStorage.removeItem(STORAGE_KEY);
    }
  });

  $('clearConsole').addEventListener('click', clearConsole);
  $('clearTimeline').addEventListener('click', () => {
    $('timelineList').innerHTML = `
      <div class="timeline-empty">
        <i class="fas fa-stream"></i>
        <span>Steps will appear here during execution</span>
      </div>`;
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', e => {
    if(e.target === $('codeEditor')) return;
    if(e.code === 'Space') { e.preventDefault(); togglePlay(); }
    if(e.code === 'ArrowRight') stepForward();
    if(e.code === 'ArrowLeft')  stepBackward();
    if(e.code === 'KeyR' && !e.ctrlKey) resetExecution();
  });
}

function handleEditorKeydown(e) {
  if(e.key === 'Tab') {
    e.preventDefault();
    const start = e.target.selectionStart;
    const end   = e.target.selectionEnd;
    e.target.value = e.target.value.substring(0,start) + '  ' + e.target.value.substring(end);
    e.target.selectionStart = e.target.selectionEnd = start + 2;
  }
}

function syncScroll() {
  $('lineNumbers').scrollTop = $('codeEditor').scrollTop;
}

// ── Line Numbers ───────────────────────────────────────────────
function updateLineNumbers() {
  const lines = $('codeEditor').value.split('\n');
  const total = Math.max(lines.length, 20);
  $('lineNumbers').innerHTML = Array.from({length: total}, (_,i) => {
    const n = i + 1;
    const isBP = breakpoints.has(n);
    return `<span class="ln${isBP ? ' breakpoint' : ''}" data-line="${n}">${isBP ? '●' : n}</span>`;
  }).join('');
}

function toggleBreakpoint(e) {
  const ln = e.target.dataset.line;
  if(!ln) return;
  const num = parseInt(ln);
  if(breakpoints.has(num)) breakpoints.delete(num);
  else breakpoints.add(num);
  updateLineNumbers();
  showToast(breakpoints.has(num) ? `Breakpoint added at line ${num}` : `Breakpoint removed`, 'info');
}

// ── Parse & Build Steps ────────────────────────────────────────
function buildSteps(code) {
  const lines = code.split('\n');
  const stps  = [];
  let scope   = { vars: {}, name: 'global' };
  let scopeStack = [scope];
  let callSt  = [];
  let heap    = {};
  let hc      = 1;
  let output  = [];

  // Simple JS interpreter / step builder
  function makeStep(lineNum, type, desc, concept, code, vars, stack, heapSnap, out) {
    return {
      lineNum, type, desc, concept,
      code: code || lines[lineNum - 1] || '',
      vars: JSON.parse(JSON.stringify(vars)),
      stack: JSON.parse(JSON.stringify(stack)),
      heap: JSON.parse(JSON.stringify(heapSnap)),
      output: [...out]
    };
  }

  // Intercept console.log
  const logs = [];
  const fakeConsole = {
    log:  (...a) => { logs.push({ type:'log',  val: a.map(formatVal).join(' ') }); },
    warn: (...a) => { logs.push({ type:'warn', val: a.map(formatVal).join(' ') }); },
    error:(...a) => { logs.push({ type:'error',val: a.map(formatVal).join(' ') }); }
  };

  // Execute code and capture steps
  try {
    const lineMap = {};
    lines.forEach((line, i) => {
      const trimmed = line.trim();
      if(trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
        lineMap[i + 1] = trimmed;
      }
    });

    // Build execution steps from line analysis
    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const trimmed = line.trim();
      if(!trimmed || trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed === '{' || trimmed === '}') return;

      // Detect step type
      let type = 'statement', desc = '', concept = '';

      if(trimmed.match(/^(let|var|const)\s+\w+\s*=/)) {
        type    = 'assign';
        const varName = trimmed.match(/^(?:let|var|const)\s+(\w+)/)?.[1];
        desc    = `Declaring variable <strong>${varName}</strong> and assigning it a value.`;
        concept = `<strong>Variable Declaration:</strong> The <code>${trimmed.split(' ')[0]}</code> keyword creates a new variable in the current scope.`;
      } else if(trimmed.match(/^\w+\s*=/)) {
        type    = 'assign';
        const varName = trimmed.match(/^(\w+)\s*=/)?.[1];
        desc    = `Updating variable <strong>${varName}</strong> with a new value.`;
        concept = `<strong>Assignment:</strong> The = operator stores a value in a variable.`;
      } else if(trimmed.match(/^function\s+\w+/)) {
        type    = 'define';
        const fnName = trimmed.match(/^function\s+(\w+)/)?.[1];
        desc    = `Defining function <strong>${fnName}</strong>. The function body is stored but not executed yet.`;
        concept = `<strong>Function Declaration:</strong> Functions are defined first and can be called later. They create a new scope when invoked.`;
      } else if(trimmed.match(/\w+\s*\(/)) {
        type    = 'call';
        const fnName = trimmed.match(/(\w+)\s*\(/)?.[1];
        if(fnName === 'console') {
          type  = 'log';
          desc  = `Printing output to the console.`;
          concept = `<strong>console.log():</strong> Used to output values for debugging and displaying results.`;
        } else {
          desc  = `Calling function <strong>${fnName}()</strong>. A new execution frame is pushed onto the call stack.`;
          concept = `<strong>Function Call:</strong> When a function is called, JavaScript pushes a new frame onto the call stack and jumps to the function body.`;
        }
      } else if(trimmed.startsWith('return')) {
        type    = 'return';
        desc    = `Returning a value from the current function. The call stack frame is popped.`;
        concept = `<strong>Return Statement:</strong> Exits the current function and returns control to the caller. The call stack frame is removed.`;
      } else if(trimmed.startsWith('if')) {
        type    = 'condition';
        desc    = `Evaluating the <strong>if</strong> condition to decide which branch to execute.`;
        concept = `<strong>Conditional:</strong> JavaScript evaluates the expression in parentheses. If truthy, the if-block runs; otherwise the else-block (if present) runs.`;
      } else if(trimmed.startsWith('for') || trimmed.startsWith('while')) {
        type    = 'loop';
        const loopType = trimmed.startsWith('for') ? 'for' : 'while';
        desc    = `Executing <strong>${loopType} loop</strong> iteration. Checking loop condition.`;
        concept = `<strong>Loop:</strong> Repeats a block of code while the condition is true. Each iteration is a separate execution step.`;
      } else if(trimmed.startsWith('class')) {
        type    = 'define';
        const className = trimmed.match(/class\s+(\w+)/)?.[1];
        desc    = `Defining class <strong>${className}</strong>.`;
        concept = `<strong>Class Declaration:</strong> Classes are blueprints for creating objects. They encapsulate data and behavior.`;
      } else {
        desc    = `Executing statement on line ${lineNum}.`;
        concept = '';
      }

      stps.push({ lineNum, type, desc, concept, code: line, vars:{}, stack:[], heap:{}, output:[] });
    });

    // Actually run the code to get real variable states
    const realSteps = runCodeInSandbox(code, fakeConsole);
    if(realSteps && realSteps.length > 0) {
      realSteps.forEach((rs, i) => {
        if(stps[i]) {
          stps[i].vars   = rs.vars   || {};
          stps[i].stack  = rs.stack  || [];
          stps[i].heap   = rs.heap   || {};
          stps[i].output = rs.output || [];
        }
      });
    }

  } catch(err) {
    stps.push({
      lineNum: 1, type: 'error',
      desc: `Error: ${err.message}`,
      concept: '',
      code: err.message,
      vars: {}, stack: [], heap: {}, output: []
    });
  }

  return stps;
}

// ── Sandbox Runner ─────────────────────────────────────────────
function runCodeInSandbox(code, fakeConsole) {
  const steps  = [];
  const output = [];
  let vars     = {};
  let stack    = [{ name: 'global', line: 0 }];
  let heap     = {};
  let hc       = 1;

  // Proxy console
  const proxyConsole = {
    log:  (...a) => {
      const val = a.map(formatVal).join(' ');
      output.push({ type:'log', val });
      steps.push({ vars: {...vars}, stack: [...stack], heap: {...heap}, output: [...output] });
    },
    warn: (...a) => {
      output.push({ type:'warn', val: a.map(formatVal).join(' ') });
    },
    error:(...a) => {
      output.push({ type:'error', val: a.map(formatVal).join(' ') });
    }
  };

  try {
    // Wrap with proxy
    const wrappedCode = `
      (function() {
        const console = arguments[0];
        ${code}
      })
    `;
    const fn = eval(wrappedCode);
    fn(proxyConsole);
  } catch(e) {
    output.push({ type:'error', val: e.message });
  }

  // Return one combined result
  return [{ vars, stack, heap, output }];
}

function formatVal(v) {
  if(v === null) return 'null';
  if(v === undefined) return 'undefined';
  if(typeof v === 'string') return `"${v}"`;
  if(typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

// ── Execution Controls ─────────────────────────────────────────
function runAll() {
  const code = $('codeEditor').value.trim();
  if(!code) { showToast('Please write some code first.', 'error'); return; }

  resetState();
  steps = buildSteps(code);

  if(steps.length === 0) { showToast('No executable statements found.', 'error'); return; }

  // Run actual code for console output
  executeRealCode(code);

  // Start stepping through
  currentStep = 0;
  renderStep(currentStep);
  updateControls();
  showToast(`${steps.length} steps ready. Use controls to navigate.`, 'success');
}

function executeRealCode(code) {
  clearConsole();
  const lines = [];
  const fakeConsole = {
    log:  (...a) => addConsoleLine(a.map(v => formatVal(v)).join(' '), 'log'),
    warn: (...a) => addConsoleLine(a.map(v => formatVal(v)).join(' '), 'warn'),
    error:(...a) => addConsoleLine(a.map(v => formatVal(v)).join(' '), 'error'),
    info: (...a) => addConsoleLine(a.map(v => formatVal(v)).join(' '), 'info')
  };

  // Execute in sandbox with real console
  try {
    const fn = new Function('console', code);
    fn(fakeConsole);
  } catch(err) {
    addConsoleLine(`${err.name}: ${err.message}`, 'error');
    showError(err.message);
  }
}

function togglePlay() {
  if(steps.length === 0) { runAll(); return; }
  if(isPlaying) stopPlay();
  else startPlay();
}

function startPlay() {
  if(currentStep >= steps.length - 1) currentStep = -1;
  isPlaying = true;
  $('playBtn').innerHTML = '<i class="fas fa-pause"></i>';
  $('playBtn').classList.add('playing');

  const delay = Math.max(200, 1100 - speed * 100);
  playInterval = setInterval(() => {
    if(currentStep >= steps.length - 1) {
      stopPlay();
      showToast('Execution complete!', 'success');
      return;
    }
    currentStep++;
    if(breakpoints.has(steps[currentStep]?.lineNum)) { stopPlay(); showToast('Breakpoint hit!', 'info'); return; }
    renderStep(currentStep);
    updateControls();
  }, delay);
}

function stopPlay() {
  isPlaying = false;
  clearInterval(playInterval);
  $('playBtn').innerHTML = '<i class="fas fa-play"></i>';
  $('playBtn').classList.remove('playing');
}

function stepForward() {
  if(steps.length === 0) { runAll(); return; }
  if(currentStep < steps.length - 1) {
    currentStep++;
    renderStep(currentStep);
    updateControls();
  } else {
    showToast('Reached end of execution.', 'info');
  }
}

function stepBackward() {
  if(currentStep > 0) {
    currentStep--;
    renderStep(currentStep);
    updateControls();
  }
}

function resetExecution() {
  stopPlay();
  resetState();
  steps = [];
  currentStep = -1;
  updateControls();
  clearExplain();
  clearVars();
  clearStack();
  clearMemory();
  hideError();
}

function resetState() {
  variables  = {};
  callStack  = [];
  heapObjects = {};
  heapCounter = 1;
}

function resetAll() {
  resetExecution();
  clearConsole();
  clearTimeline();
  updateLineNumbers();
  showToast('Everything reset.', 'info');
}

function clearTimeline() {
  $('timelineList').innerHTML = `
    <div class="timeline-empty">
      <i class="fas fa-stream"></i>
      <span>Steps will appear here during execution</span>
    </div>`;
}

// ── Render Step ────────────────────────────────────────────────
function renderStep(idx) {
  const step = steps[idx];
  if(!step) return;

  // Highlight line
  highlightLine(step.lineNum);

  // Explain panel
  renderExplain(step, idx);

  // Variables
  renderVars(step, idx);

  // Call stack
  renderCallStack(step, idx);

  // Timeline
  addTimelineItem(step, idx);
}

function highlightLine(lineNum) {
  const editor   = $('codeEditor');
  const lines    = editor.value.split('\n');
  const lineHeight = 1.6 * 13.6; // approx px
  const offset   = (lineNum - 1) * lineHeight;

  const highlight = $('execHighlight');
  highlight.style.display = 'block';
  highlight.style.top     = `${offset + 16}px`;
  highlight.style.height  = `${lineHeight}px`;

  // Update line numbers
  document.querySelectorAll('.ln').forEach(el => {
    el.classList.toggle('executing', parseInt(el.dataset.line) === lineNum);
  });
}

function renderExplain(step, idx) {
  const el = $('explainContent');
  el.innerHTML = `
    <div class="explain-step">
      <div class="explain-line-badge">
        <i class="fas fa-map-marker-alt"></i> Line ${step.lineNum}
      </div>
      <div class="explain-code">${escapeHTML(step.code.trim())}</div>
      <div class="explain-text">${step.desc}</div>
      ${step.concept ? `<div class="explain-concept">💡 <strong>Concept:</strong> ${step.concept}</div>` : ''}
    </div>
  `;
}

function renderVars(step, idx) {
  // Build vars from executed code context
  const list  = $('varsList');
  const empty = $('varsEmpty');

  // Extract variable assignments from steps up to current
  const currentVars = extractVarsFromSteps(idx);
  const keys = Object.keys(currentVars);

  $('varCount').textContent = keys.length;

  if(keys.length === 0) {
    empty.style.display = 'flex';
    list.querySelectorAll('.var-item').forEach(i => i.remove());
    return;
  }
  empty.style.display = 'none';
  list.querySelectorAll('.var-item').forEach(i => i.remove());

  keys.forEach(name => {
    const { value, type, scope: sc } = currentVars[name];
    const el = document.createElement('div');
    el.className = 'var-item';
    const scopeClass = sc === 'global' ? 'scope-global' : sc === 'local' ? 'scope-local' : 'scope-block';
    el.innerHTML = `
      <div class="var-scope ${scopeClass}" title="${sc}"></div>
      <span class="var-name">${escapeHTML(name)}</span>
      <span class="var-type">${escapeHTML(type)}</span>
      <span class="var-value">${escapeHTML(String(value))}</span>
    `;
    list.appendChild(el);
  });
}

function extractVarsFromSteps(upToIdx) {
  const vars = {};
  for(let i = 0; i <= upToIdx; i++) {
    const step = steps[i];
    if(!step) continue;
    const code = step.code.trim();

    // Match variable declarations
    const declMatch = code.match(/^(?:let|var|const)\s+(\w+)\s*=\s*(.+?);?$/);
    if(declMatch) {
      const name = declMatch[1];
      const raw  = declMatch[2].trim();
      const val  = evalSimple(raw, vars);
      vars[name] = { value: val, type: getType(val), scope: 'global' };
    }

    // Match assignments
    const assignMatch = code.match(/^(\w+)\s*=\s*(.+?);?$/);
    if(assignMatch && !code.startsWith('let') && !code.startsWith('const') && !code.startsWith('var')) {
      const name = assignMatch[1];
      const raw  = assignMatch[2].trim();
      const val  = evalSimple(raw, vars);
      if(vars[name]) vars[name].value = val;
      else vars[name] = { value: val, type: getType(val), scope: 'local' };
    }
  }
  return vars;
}

function evalSimple(expr, vars) {
  try {
    // Replace known var names
    let e = expr;
    Object.keys(vars).forEach(k => {
      e = e.replace(new RegExp(`\\b${k}\\b`, 'g'), JSON.stringify(vars[k].value));
    });
    return Function('"use strict"; return (' + e + ')')();
  } catch { return expr; }
}

function getType(val) {
  if(val === null)      return 'null';
  if(Array.isArray(val))return 'array';
  return typeof val;
}

function renderCallStack(step, idx) {
  const list  = $('stackList');
  const empty = $('stackEmpty');
  list.querySelectorAll('.stack-frame').forEach(f => f.remove());

  // Build simple call stack from steps
  const stack = buildCallStack(idx);
  $('stackDepth').textContent = stack.length === 0 ? 'Empty' : `${stack.length} frame${stack.length>1?'s':''}`;

  if(stack.length === 0) { empty.style.display = 'flex'; return; }
  empty.style.display = 'none';

  stack.reverse().forEach((frame, i) => {
    const el = document.createElement('div');
    el.className = 'stack-frame';
    el.innerHTML = `
      <div class="sf-index">${stack.length - i}</div>
      <div class="sf-info">
        <div class="sf-name">${escapeHTML(frame.name)}()</div>
        <div class="sf-line">Line ${frame.line}</div>
      </div>
    `;
    list.appendChild(el);
  });
}

function buildCallStack(upToIdx) {
  const stack = [{ name: 'global', line: 1 }];
  for(let i = 0; i <= upToIdx; i++) {
    const step = steps[i];
    if(!step) continue;
    const code = step.code.trim();
    if(step.type === 'call' && !code.includes('console')) {
      const fn = code.match(/(\w+)\s*\(/)?.[1];
      if(fn) stack.push({ name: fn, line: step.lineNum });
    }
    if(step.type === 'return' && stack.length > 1) stack.pop();
  }
  return stack;
}

function addTimelineItem(step, idx) {
  const list = $('timelineList');
  const empty = list.querySelector('.timeline-empty');
  if(empty) empty.remove();

  // Remove current highlight
  list.querySelectorAll('.timeline-item').forEach(i => i.classList.remove('current'));

  // Check if item exists
  const existing = list.querySelector(`[data-step="${idx}"]`);
  if(existing) { existing.classList.add('current'); return; }

  const el = document.createElement('div');
  el.className = 'timeline-item current';
  el.dataset.step = idx;
  el.innerHTML = `
    <div class="tl-step">${idx + 1}</div>
    <div class="tl-info">
      <div class="tl-line">Line ${step.lineNum}</div>
      <div class="tl-desc">${step.desc.replace(/<[^>]+>/g,'').substring(0,60)}...</div>
    </div>
    <span class="tl-type ${step.type}">${step.type}</span>
  `;
  el.addEventListener('click', () => { currentStep = idx; renderStep(idx); updateControls(); });
  list.appendChild(el);
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function updateControls() {
  const total = steps.length;
  const cur   = currentStep + 1;
  $('stepCounter').textContent = `Step ${cur} / ${total}`;
  const pct = total > 0 ? (cur / total) * 100 : 0;
  $('stepProgFill').style.width = `${pct}%`;
}

// ── Console ────────────────────────────────────────────────────
function addConsoleLine(val, type='log') {
  const out = $('consoleOutput');
  const ph  = out.querySelector('.console-placeholder');
  if(ph) ph.remove();

  const el = document.createElement('div');
  el.className = `console-line ${type}`;
  const icons = { log:'›', warn:'⚠', error:'✖', info:'ℹ' };
  el.innerHTML = `<span class="console-prefix">${icons[type]||'›'}</span><span class="console-val">${escapeHTML(val)}</span>`;
  out.appendChild(el);
  out.scrollTop = out.scrollHeight;
}

function clearConsole() {
  $('consoleOutput').innerHTML = `
    <div class="console-placeholder">
      <i class="fas fa-terminal"></i>
      <span>Output will appear here...</span>
    </div>`;
}

// ── Clear Helpers ──────────────────────────────────────────────
function clearExplain() {
  $('explainContent').innerHTML = `
    <div class="explain-placeholder">
      <div class="explain-icon">🎯</div>
      <p>Press <strong>Run</strong> or <strong>Step Forward</strong> to start visualizing your code.</p>
    </div>`;
}

function clearVars() {
  $('varsList').querySelectorAll('.var-item').forEach(i => i.remove());
  $('varsEmpty').style.display = 'flex';
  $('varCount').textContent = '0';
}

function clearStack() {
  $('stackList').querySelectorAll('.stack-frame').forEach(f => f.remove());
  $('stackEmpty').style.display = 'flex';
  $('stackDepth').textContent = 'Empty';
}

function clearMemory() {
  $('memoryGrid').querySelectorAll('.memory-obj').forEach(o => o.remove());
  $('memoryEmpty').style.display = 'flex';
}

function showError(msg) {
  $('errorCard').classList.remove('hidden');
  $('errorContent').innerHTML = `<i class="fas fa-times-circle"></i> ${escapeHTML(msg)}`;
}

function hideError() {
  $('errorCard').classList.add('hidden');
}

// ── Share ──────────────────────────────────────────────────────
function shareCode() {
  const code = $('codeEditor').value;
  if(!code.trim()) { showToast('No code to copy.', 'error'); return; }
  navigator.clipboard.writeText(code).then(() => {
    showToast('Code copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Copy failed.', 'error');
  });
}

// ── Toast ──────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, type='success') {
  clearTimeout(toastTimer);
  $('toastMsg').textContent = msg;
  const icon = $('toast').querySelector('.toast-icon');
  icon.className = `toast-icon fas ${
    type==='success' ? 'fa-check-circle' :
    type==='error'   ? 'fa-times-circle' : 'fa-info-circle'
  }`;
  $('toast').className = `toast ${type} show`;
  toastTimer = setTimeout(() => $('toast').classList.remove('show'), 3000);
}

// ── Helpers ────────────────────────────────────────────────────
function escapeHTML(str) {
  const el = document.createElement('div');
  el.textContent = str || ''; return el.innerHTML;
}

// ── Start ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);