const PRESETS = {
  variables: { label: "Variables", code: `int a = 5;\nint b = 3;\nint c = a * b + 2;\nint d = c - a;\nint result = d + b;` },
  loops: { label: "Loops", code: `int n = 6;\nint sum = 0;\nfor (int i = 1; i <= n; i++) {\n  sum = sum + i;\n}\nint average = sum / n;` },
  arrays: { label: "Arrays", code: `int arr[] = {4, 8, 15, 16, 23, 42};\nint target = arr[3];\nint doubled = target * 2;\narr[0] = doubled;\nint mix = arr[0] + arr[5];` },
  bubbleSort: { label: "Bubble Sort", code: `int arr[] = {7, 3, 9, 2, 5};\nfor (int i = 0; i < 4; i++) {\n  for (int j = 0; j < 4 - i; j++) {\n    if (arr[j] > arr[j + 1]) {\n      int temp = arr[j];\n      arr[j] = arr[j + 1];\n      arr[j + 1] = temp;\n    }\n  }\n}` },
  binarySearch: { label: "Binary Search", code: `int arr[] = {2, 4, 7, 11, 18, 23, 31};\nint target = 18;\nint low = 0;\nint high = 6;\nwhile (low <= high) {\n  int mid = (low + high) / 2;\n  if (arr[mid] == target) {\n    int foundAt = mid;\n    break;\n  }\n  if (arr[mid] < target) {\n    low = mid + 1;\n  }\n  if (arr[mid] > target) {\n    high = mid - 1;\n  }\n}` },
  recursion: { label: "Recursion", code: `int fib(int n) {\n  if (n <= 1) {\n    return n;\n  }\n  return fib(n - 1) + fib(n - 2);\n}\nint answer = fib(5);` }
};

const state = {
  selectedPreset: "variables",
  steps: [],
  compiledSnapshots: [],
  pointer: 0,
  timer: null,
  isRunning: false,
  speed: 5,
  display: freshDisplayState(),
  complexity: null,
  lastRenderKey: "",
  pendingRender: false,
  currentLine: -1
};

function freshDisplayState() {
  return { memory: {}, arrays: {}, stack: [{ name: "main", details: "entry" }], loops: [], recursionNodes: [], sortFocus: null };
}

const ui = {
  loading: document.getElementById("loading-screen"),
  toastContainer: document.getElementById("toast-container"),
  appRoot: document.getElementById("app-root"),
  codeInput: document.getElementById("code-input"),
  syntaxView: document.getElementById("syntax-view"),
  lineNumbers: document.getElementById("line-numbers"),
  executionLine: document.getElementById("execution-line"),
  presetSelect: document.getElementById("preset-select"),
  loadPresetBtn: document.getElementById("load-preset-btn"),
  runBtn: document.getElementById("run-btn"),
  pauseBtn: document.getElementById("pause-btn"),
  nextBtn: document.getElementById("next-btn"),
  resetBtn: document.getElementById("reset-btn"),
  speedSlider: document.getElementById("speed-slider"),
  speedValue: document.getElementById("speed-value"),
  runStatus: document.getElementById("run-status"),
  currentLine: document.getElementById("current-line"),
  stepCount: document.getElementById("step-count"),
  lineHighlight: document.getElementById("line-highlight"),
  executionLog: document.getElementById("execution-log"),
  stepList: document.getElementById("step-list"),
  whatHappened: document.getElementById("what-happened"),
  memoryView: document.getElementById("memory-view"),
  stackView: document.getElementById("stack-view"),
  loopTimeline: document.getElementById("loop-timeline"),
  arrayView: document.getElementById("array-view"),
  sortBars: document.getElementById("sort-bars"),
  recursionTree: document.getElementById("recursion-tree"),
  complexityView: document.getElementById("complexity-view"),
  themeToggle: document.getElementById("theme-toggle"),
  fullscreenBtn: document.getElementById("fullscreen-btn"),
  focusModeBtn: document.getElementById("focus-mode-btn")
};

function init() {
  setupParticles();
  setupEvents();
  loadPreset("variables");
  setTimeout(() => ui.loading.classList.add("hidden"), 850);
  enqueueRender();
  toast("System ready");
}

function setupEvents() {
  ui.loadPresetBtn.addEventListener("click", () => loadPreset(ui.presetSelect.value));
  ui.presetSelect.addEventListener("change", (e) => (state.selectedPreset = e.target.value));

  ui.codeInput.addEventListener("input", () => {
    syncEditorDecorations();
    resetPlayback(true);
  });
  ui.codeInput.addEventListener("scroll", syncEditorScroll);

  ui.runBtn.addEventListener("click", runPauseToggle);
  ui.pauseBtn.addEventListener("click", pauseSimulation);
  ui.nextBtn.addEventListener("click", nextStep);
  ui.resetBtn.addEventListener("click", () => resetPlayback(false));

  ui.speedSlider.addEventListener("input", (e) => {
    state.speed = Number(e.target.value);
    ui.speedValue.textContent = `${state.speed}x`;
    if (state.isRunning) restartTimer();
  });

  document.addEventListener("keydown", (e) => {
    if (e.target === ui.codeInput && !e.ctrlKey && !e.metaKey && e.key !== " ") return;
    if (e.code === "Space") { e.preventDefault(); runPauseToggle(); }
    if (e.key.toLowerCase() === "n") { e.preventDefault(); nextStep(); }
    if (e.key.toLowerCase() === "r") { e.preventDefault(); resetPlayback(false); toast("Playback reset"); }
  });

  document.querySelectorAll("[data-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = document.getElementById(btn.dataset.target);
      panel?.scrollIntoView({ behavior: "smooth", block: "start" });
      highlightActivePanel(panel);
    });
  });

  document.querySelectorAll("[data-collapse]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const panel = btn.closest(".panel");
      panel.classList.toggle("collapsed");
      btn.textContent = panel.classList.contains("collapsed") ? "Expand" : "Collapse";
    });
  });

  ui.themeToggle.addEventListener("click", () => {
    const next = document.body.dataset.theme === "dark" ? "light" : "dark";
    document.body.dataset.theme = next;
    toast(`Theme: ${next}`);
  });

  ui.focusModeBtn.addEventListener("click", () => {
    document.body.classList.toggle("focus-mode");
    toast(document.body.classList.contains("focus-mode") ? "Focus mode enabled" : "Focus mode disabled");
  });

  ui.fullscreenBtn.addEventListener("click", async () => {
    if (!document.fullscreenElement) {
      try { await document.documentElement.requestFullscreen(); } catch { toast("Fullscreen blocked"); }
    } else {
      document.exitFullscreen();
    }
  });
}

function runPauseToggle() {
  if (state.isRunning) {
    pauseSimulation();
  } else {
    runSimulation();
  }
}

function loadPreset(key) {
  const preset = PRESETS[key] || PRESETS.variables;
  state.selectedPreset = key;
  ui.presetSelect.value = key;
  ui.codeInput.value = preset.code;
  syncEditorDecorations();
  resetPlayback(false);
  toast(`Loaded ${preset.label}`);
}

function runSimulation() {
  if (!state.steps.length || state.pointer >= state.steps.length) compileProgram();
  if (!state.steps.length) return;
  state.isRunning = true;
  ui.runStatus.textContent = "Running";
  restartTimer();
}

function pauseSimulation() {
  state.isRunning = false;
  clearInterval(state.timer);
  state.timer = null;
  ui.runStatus.textContent = state.pointer >= state.steps.length && state.steps.length ? "Completed" : "Paused";
}

function restartTimer() {
  clearInterval(state.timer);
  const delay = Math.max(100, 860 / state.speed);
  state.timer = setInterval(() => {
    if (state.pointer >= state.steps.length) return pauseSimulation();
    nextStep();
  }, delay);
}

function nextStep() {
  if (!state.steps.length) compileProgram();
  if (state.pointer >= state.steps.length) return pauseSimulation();

  state.display = structuredClone(state.compiledSnapshots[state.pointer]);
  const step = state.steps[state.pointer];
  state.pointer += 1;
  state.currentLine = step.line || -1;

  ui.currentLine.textContent = String(step.line || "-");
  ui.stepCount.textContent = String(state.pointer);
  ui.lineHighlight.textContent = `L${step.line}: ${step.code}`;
  setExecutionLine(step.line);
  log(step.action);
  explainStep(step);
  enqueueRender();

  if (state.pointer >= state.steps.length && state.isRunning) pauseSimulation();
}

function resetPlayback(silent) {
  clearInterval(state.timer);
  state.timer = null;
  state.isRunning = false;
  state.steps = [];
  state.compiledSnapshots = [];
  state.pointer = 0;
  state.currentLine = -1;
  state.display = freshDisplayState();
  state.complexity = null;
  state.lastRenderKey = "";

  ui.runStatus.textContent = "Idle";
  ui.currentLine.textContent = "-";
  ui.stepCount.textContent = "0";
  ui.lineHighlight.textContent = "Waiting for execution...";
  ui.executionLog.innerHTML = "";
  ui.whatHappened.innerHTML = "<p>Each step will include a human-readable explanation.</p>";
  setExecutionLine(-1);
  enqueueRender();
  if (!silent) toast("Reset complete");
}

function compileProgram() {
  resetPlayback(true);
  const code = ui.codeInput.value;

  if (/\bfib\s*\(/.test(code) || state.selectedPreset === "recursion") compileRecursion(code);
  else if (/while\s*\(.*<=.*\)/.test(code) || state.selectedPreset === "binarySearch") compileBinarySearch(code);
  else compileInterpreter(code);

  ui.runStatus.textContent = state.steps.length ? "Ready" : "Idle";
  log(state.steps.length ? `Compiled ${state.steps.length} steps.` : "No executable steps found.");
  enqueueRender();
}

function compileInterpreter(code) {
  const lines = code.split("\n").map((raw, idx) => ({ line: idx + 1, raw, text: raw.trim() })).filter((x) => x.text && !x.text.startsWith("//"));
  const block = parseBlock(lines, 0).block;
  const compileState = freshDisplayState();
  estimateComplexity(block, false, null, null, "Loop and branch analysis from parsed structure.");
  walkBlock(block, compileState, {});
}

function compileBinarySearch(code) {
  const lines = code.split("\n").map((raw, idx) => ({ line: idx + 1, raw, text: raw.trim() }));
  const arrLine = lines.find((l) => /int\s+arr\[\]\s*=\s*\{/.test(l.text));
  const targetLine = lines.find((l) => /int\s+target\s*=/.test(l.text));
  if (!arrLine || !targetLine) return;

  const arr = (arrLine.text.match(/\{(.*)\}/)?.[1] || "").split(",").map((x) => Number(x.trim())).filter((x) => !Number.isNaN(x));
  const target = Number(targetLine.text.match(/=(.*);?/)?.[1] ?? 0);
  const compileState = freshDisplayState();
  compileState.arrays.arr = [...arr];

  let low = 0; let high = arr.length - 1;
  pushCompiledStep(compileState, { line: arrLine.line, code: arrLine.raw, action: `Declared sorted array of ${arr.length} elements`, explain: "Array is sorted, enabling binary elimination." });
  pushCompiledStep(compileState, { line: targetLine.line, code: targetLine.raw, action: `Target set to ${target}`, explain: "Search value is loaded into memory." });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    compileState.memory = { ...compileState.memory, low, high, mid, target };
    compileState.loops.push({ line: targetLine.line, iteration: compileState.loops.length + 1, label: `range [${low}, ${high}]` });
    pushCompiledStep(compileState, {
      line: targetLine.line,
      code: "while (low <= high)",
      action: `Check mid=${mid}, value=${arr[mid]}`,
      explain: "Window is halved by comparing middle element with target.",
      sortFocus: { activeIndices: [mid], snapshot: [...arr], arrayName: "arr" }
    });
    if (arr[mid] === target) {
      compileState.memory.foundAt = mid;
      pushCompiledStep(compileState, { line: targetLine.line, code: "if (arr[mid] == target)", action: `Found at index ${mid}`, explain: "Match found, loop exits." });
      break;
    }
    if (arr[mid] < target) {
      low = mid + 1;
      pushCompiledStep(compileState, { line: targetLine.line, code: "low = mid + 1", action: `Move low -> ${low}`, explain: "Discard left half including mid." });
    } else {
      high = mid - 1;
      pushCompiledStep(compileState, { line: targetLine.line, code: "high = mid - 1", action: `Move high -> ${high}`, explain: "Discard right half including mid." });
    }
  }
  estimateComplexity([], false, "O(log n)", "O(1)", "Binary search halves the range each iteration.");
}

function compileRecursion(code) {
  const lines = code.split("\n").map((raw, idx) => ({ line: idx + 1, raw, text: raw.trim() }));
  const callLine = lines.find((l) => /fib\(\d+\)/.test(l.text));
  const n = Number(callLine?.text.match(/fib\((\d+)\)/)?.[1] ?? 5);
  const compileState = freshDisplayState();

  function fib(x, depth, parentId = null) {
    const nodeId = `${parentId || "root"}-${x}-${depth}-${compileState.recursionNodes.length}`;
    compileState.recursionNodes.push({ id: nodeId, parentId, text: `fib(${x})`, depth, active: true });
    compileState.stack.push({ name: `fib(${x})`, details: `depth ${depth}` });
    pushCompiledStep(compileState, { line: callLine?.line || 1, code: `fib(${x})`, action: `Push fib(${x})`, explain: "Function call adds a new frame to stack." });

    if (x <= 1) {
      compileState.stack.pop();
      const node = compileState.recursionNodes.find((t) => t.id === nodeId); if (node) node.active = false;
      pushCompiledStep(compileState, { line: callLine?.line || 1, code: `return ${x}`, action: `Return ${x}`, explain: "Base case reached, recursion unwinds." });
      return x;
    }

    const left = fib(x - 1, depth + 1, nodeId);
    const right = fib(x - 2, depth + 1, nodeId);
    const result = left + right;

    compileState.stack.pop();
    const node = compileState.recursionNodes.find((t) => t.id === nodeId); if (node) node.active = false;
    pushCompiledStep(compileState, { line: callLine?.line || 1, code: `return fib(${x - 1}) + fib(${x - 2})`, action: `fib(${x}) = ${result}`, explain: "Two child results are combined into parent value.", memoryPatch: { [`fib_${x}`]: result } });
    return result;
  }

  const answer = fib(n, 0);
  pushCompiledStep(compileState, { line: callLine?.line || 1, code: `int answer = fib(${n});`, action: `Final answer ${answer}`, explain: "Root call returns final computed Fibonacci value.", memoryPatch: { answer } });
  estimateComplexity([], true, "O(2^n)", "O(n)", "Naive recursion forms a binary call tree.");
}

function parseBlock(lines, start) {
  const block = []; let i = start;
  while (i < lines.length) {
    const t = lines[i].text;
    if (t === "}") return { block, next: i + 1 };
    if (t.startsWith("for")) {
      const m = t.match(/^for\s*\((.*);(.*);(.*)\)\s*\{?$/);
      if (!m) { block.push({ type: "line", ...lines[i++] }); continue; }
      const body = parseBlock(lines, i + 1);
      block.push({ type: "for", line: lines[i].line, raw: lines[i].raw, init: m[1].trim(), cond: m[2].trim(), inc: m[3].trim(), body: body.block });
      i = body.next; continue;
    }
    if (t.startsWith("if")) {
      const m = t.match(/^if\s*\((.*)\)\s*\{?$/);
      if (!m) { block.push({ type: "line", ...lines[i++] }); continue; }
      const body = parseBlock(lines, i + 1);
      block.push({ type: "if", line: lines[i].line, raw: lines[i].raw, cond: m[1].trim(), body: body.block });
      i = body.next; continue;
    }
    block.push({ type: "line", ...lines[i++] });
  }
  return { block, next: i };
}

function walkBlock(block, compileState, scope) {
  for (const node of block) {
    if (node.type === "line") runMini(node.text, node.line, node.raw, compileState, scope);
    if (node.type === "if") runIf(node, compileState, scope);
    if (node.type === "for") runFor(node, compileState, scope);
  }
}
function runIf(node, cs, scope) {
  const result = Boolean(evalExpr(node.cond, scope, cs));
  pushCompiledStep(cs, { line: node.line, code: node.raw, action: `IF ${node.cond} -> ${result}`, explain: "Condition decides whether branch executes." });
  if (!result) return;
  cs.stack.push({ name: `if@${node.line}`, details: "true branch" });
  pushCompiledStep(cs, { line: node.line, code: node.raw, action: "Enter IF frame", explain: "Control enters branch scope." });
  walkBlock(node.body, cs, scope);
  cs.stack.pop();
  pushCompiledStep(cs, { line: node.line, code: node.raw, action: "Exit IF frame", explain: "Branch scope ends and stack frame pops." });
}
function runFor(node, cs, scope) {
  runMini(node.init, node.line, node.raw, cs, scope);
  let iter = 0;
  while (Boolean(evalExpr(node.cond, scope, cs)) && iter < 300) {
    iter += 1;
    cs.loops.push({ line: node.line, iteration: iter, label: node.cond });
    pushCompiledStep(cs, { line: node.line, code: node.raw, action: `Loop iteration ${iter}`, explain: "Loop condition stayed true for another cycle." });
    cs.stack.push({ name: `for@${node.line}`, details: `iter ${iter}` });
    walkBlock(node.body, cs, scope);
    cs.stack.pop();
    runMini(node.inc, node.line, node.raw, cs, scope);
  }
}

function runMini(rawStmt, line, code, cs, scope) {
  const stmt = rawStmt.replace(/;$/, "").trim();
  if (!stmt || stmt === "{" || stmt === "break") return;

  const arrDecl = stmt.match(/^int\s+([a-zA-Z_]\w*)\s*\[\]\s*=\s*\{(.*)\}$/);
  if (arrDecl) {
    const name = arrDecl[1];
    const arr = arrDecl[2].split(",").map((x) => Number(evalExpr(x.trim(), scope, cs)));
    cs.arrays[name] = arr;
    pushCompiledStep(cs, { line, code, action: `Declare ${name}[${arr.length}]`, explain: "Contiguous array memory allocated.", arrayPatch: { [name]: [...arr] } });
    return;
  }

  const decl = stmt.match(/^int\s+([a-zA-Z_]\w*)(\s*=\s*(.*))?$/);
  if (decl) {
    const name = decl[1];
    const value = decl[3] ? Number(evalExpr(decl[3], scope, cs)) : 0;
    scope[name] = value; cs.memory[name] = value;
    pushCompiledStep(cs, { line, code, action: `Declare ${name} = ${value}`, explain: "A new scalar variable is allocated in local memory.", memoryPatch: { [name]: value } });
    return;
  }

  if (/^\w+\+\+$/.test(stmt)) {
    const name = stmt.replace("++", "").trim();
    const value = Number(scope[name] ?? 0) + 1; scope[name] = value; cs.memory[name] = value;
    pushCompiledStep(cs, { line, code, action: `${name}++ -> ${value}`, explain: "Post-increment updates variable by one.", memoryPatch: { [name]: value } });
    return;
  }

  const assign = stmt.match(/^(.+?)\s*=\s*(.+)$/);
  if (assign) {
    const left = assign[1].trim();
    const value = Number(evalExpr(assign[2], scope, cs));
    const arrSet = left.match(/^([a-zA-Z_]\w*)\[(.+)\]$/);
    if (arrSet) {
      const arrName = arrSet[1];
      const idx = Number(evalExpr(arrSet[2], scope, cs));
      if (!cs.arrays[arrName]) cs.arrays[arrName] = [];
      cs.arrays[arrName][idx] = value;
      pushCompiledStep(cs, {
        line, code, action: `${arrName}[${idx}] = ${value}`,
        explain: "Array cell updated; visual bars and memory map refresh.",
        arrayPatch: { [arrName]: [...cs.arrays[arrName]] },
        sortFocus: { arrayName: arrName, activeIndices: [idx], snapshot: [...cs.arrays[arrName]] }
      });
      return;
    }
    scope[left] = value; cs.memory[left] = value;
    pushCompiledStep(cs, { line, code, action: `${left} = ${value}`, explain: "Existing variable receives a new computed value.", memoryPatch: { [left]: value } });
    return;
  }

  pushCompiledStep(cs, { line, code, action: `Skipped unsupported: ${stmt}`, explain: "This statement is outside the educational parser subset." });
}

function evalExpr(expr, scope, cs) {
  let processed = expr;
  processed = processed.replace(/([a-zA-Z_]\w*)\[(.*?)\]/g, (_, name, idxExpr) => cs.arrays[name]?.[Number(evalExpr(idxExpr, scope, cs))] ?? 0);
  processed = processed.replace(/[a-zA-Z_]\w*/g, (token) => {
    if (["true", "false"].includes(token)) return token;
    if (Object.prototype.hasOwnProperty.call(scope, token)) return scope[token];
    if (Object.prototype.hasOwnProperty.call(cs.memory, token)) return cs.memory[token];
    return 0;
  });
  try { return Function(`"use strict"; return (${processed});`)(); } catch { return 0; }
}

function pushCompiledStep(cs, step) {
  if (step.memoryPatch) cs.memory = { ...cs.memory, ...step.memoryPatch };
  if (step.arrayPatch) Object.entries(step.arrayPatch).forEach(([k, v]) => { cs.arrays[k] = [...v]; });
  if (step.sortFocus) cs.sortFocus = step.sortFocus;
  state.steps.push(step);
  state.compiledSnapshots.push(structuredClone(cs));
}

function estimateComplexity(block, recursion, forcedTime, forcedSpace, forcedExplain) {
  if (forcedTime) {
    state.complexity = { time: forcedTime, space: forcedSpace || "O(1)", explain: forcedExplain || "Preset complexity model.", notes: ["Educational estimate"] };
    return;
  }
  let depth = 0;
  const walk = (nodes, d) => nodes.forEach((n) => { if (n.type === "for") { depth = Math.max(depth, d + 1); walk(n.body, d + 1); } if (n.type === "if") walk(n.body, d); });
  walk(block, 0);
  let time = "O(1)"; if (depth === 1) time = "O(n)"; if (depth === 2) time = "O(n^2)"; if (depth > 2) time = `O(n^${depth})`; if (recursion) time = "O(2^n)";
  state.complexity = { time, space: recursion ? "O(n)" : "O(1)", explain: recursion ? "Recursive depth grows call stack linearly while branching grows calls exponentially." : "Estimated from nested loop depth and branching.", notes: [`Loop depth: ${depth}`] };
}

function enqueueRender() {
  if (state.pendingRender) return;
  state.pendingRender = true;
  requestAnimationFrame(() => {
    state.pendingRender = false;
    render();
  });
}

function render() {
  const key = JSON.stringify({ p: state.pointer, d: state.display, c: state.complexity });
  if (key === state.lastRenderKey) return;
  state.lastRenderKey = key;
  renderSteps(); renderMemory(); renderStack(); renderLoops(); renderArrays(); renderSorting(); renderRecursionTree(); renderComplexity();
}

function renderSteps() {
  ui.stepList.innerHTML = state.steps.map((s, i) => `<li class="${i === state.pointer - 1 ? "active" : ""}">#${i + 1} [L${s.line}] ${escapeHtml(s.action)}<div class="step-note">${escapeHtml(s.explain || "")}</div></li>`).join("") || "<li>No steps yet.</li>";
}
function explainStep(step) {
  ui.whatHappened.innerHTML = `<p><strong>Action:</strong> ${escapeHtml(step.action)}</p><p>${escapeHtml(step.explain || "Execution state transitioned.")}</p>`;
}
function renderMemory() {
  ui.memoryView.innerHTML = Object.entries(state.display.memory).map(([k, v]) => `<div class="memory-cell flash"><strong>${escapeHtml(k)}</strong><p>${escapeHtml(v)}</p></div>`).join("") || "<p>No scalar variables yet.</p>";
}
function renderStack() {
  ui.stackView.innerHTML = state.display.stack.slice().reverse().map((f) => `<div class="stack-frame flash"><strong>${escapeHtml(f.name)}</strong><p>${escapeHtml(f.details)}</p></div>`).join("") || "<p>Stack is empty.</p>";
}
function renderLoops() {
  ui.loopTimeline.innerHTML = state.display.loops.slice(-24).map((l) => `<div class="timeline-event">L${l.line} · Iter ${l.iteration} <small>${escapeHtml(l.label || "")}</small></div>`).join("") || "<p>No loop events yet.</p>";
}
function renderArrays() {
  const arrays = Object.entries(state.display.arrays);
  if (!arrays.length) { ui.arrayView.innerHTML = "<p>No arrays declared.</p>"; return; }
  ui.arrayView.innerHTML = arrays.map(([name, arr]) => `<div class="memory-cell"><strong>${escapeHtml(name)}</strong><div class="array-view">${arr.map((v, i) => `<div class="array-item">${i}:${v ?? 0}</div>`).join("")}</div></div>`).join("");
}
function renderSorting() {
  const focus = state.display.sortFocus; const first = Object.keys(state.display.arrays)[0];
  if (!first) { ui.sortBars.innerHTML = "<p>Bars appear when arrays are manipulated.</p>"; return; }
  const arr = state.display.arrays[first]; const max = Math.max(...arr, 1);
  ui.sortBars.innerHTML = arr.map((v, i) => `<div class="bar-wrap"><div class="bar ${focus?.activeIndices?.includes(i) ? "active" : ""}" style="height:${Math.max(14, Math.round((v / max) * 120))}px"></div><span>${v}</span></div>`).join("");
}
function renderRecursionTree() {
  const nodes = state.display.recursionNodes;
  if (!nodes.length) { ui.recursionTree.innerHTML = "<p>Recursion nodes appear for recursive presets.</p>"; return; }
  ui.recursionTree.innerHTML = nodes.map((n) => `<div class="tree-node" style="margin-left:${n.depth * 14}px; border-left: 3px solid ${n.active ? "var(--blue)" : "var(--border)"};">${escapeHtml(n.text)}</div>`).join("");
}
function renderComplexity() {
  if (!state.complexity) { ui.complexityView.innerHTML = "<p>Compile to estimate complexity.</p>"; return; }
  ui.complexityView.innerHTML = `<div class="complexity-chip"><strong>Time:</strong> ${state.complexity.time}</div><div class="complexity-chip"><strong>Space:</strong> ${state.complexity.space}</div><div class="complexity-chip">${escapeHtml(state.complexity.explain)}</div>${state.complexity.notes.map((n) => `<div class="complexity-chip">${escapeHtml(n)}</div>`).join("")}`;
}

function syncEditorDecorations() {
  const code = ui.codeInput.value;
  ui.lineNumbers.innerHTML = code.split("\n").map((_, i) => `<div>${i + 1}</div>`).join("");
  ui.syntaxView.innerHTML = code.split("\n").map((line) => syntaxHighlight(line)).join("\n");
  syncEditorScroll();
}
function syncEditorScroll() {
  ui.lineNumbers.scrollTop = ui.codeInput.scrollTop;
  ui.syntaxView.scrollTop = ui.codeInput.scrollTop;
  ui.syntaxView.scrollLeft = ui.codeInput.scrollLeft;
}
function setExecutionLine(lineNumber) {
  if (lineNumber < 1) { ui.executionLine.classList.remove("live"); return; }
  const lineHeight = 1.52 * 16;
  ui.executionLine.classList.add("live");
  ui.executionLine.style.transform = `translateY(${(lineNumber - 1) * lineHeight - ui.codeInput.scrollTop}px)`;
}
function syntaxHighlight(line) {
  return escapeHtml(line)
    .replace(/(\/\/.*)/g, '<span class="t-com">$1</span>')
    .replace(/\b(int|for|if|while|return|break)\b/g, '<span class="t-key">$1</span>')
    .replace(/\b(fib|main|arr|sum|low|high|mid|target)\b/g, '<span class="t-type">$1</span>')
    .replace(/\b(\d+)\b/g, '<span class="t-num">$1</span>');
}

function highlightActivePanel(panel) {
  document.querySelectorAll(".panel").forEach((p) => p.classList.remove("active-panel"));
  if (panel?.classList.contains("panel")) panel.classList.add("active-panel");
}

function toast(message) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = message;
  ui.toastContainer.appendChild(t);
  setTimeout(() => t.remove(), 1800);
}

function log(msg) {
  const row = document.createElement("div");
  row.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
  ui.executionLog.prepend(row);
}

function escapeHtml(v) {
  return String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
}

function setupParticles() {
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  const particles = [];
  const mouse = { x: -9999, y: -9999 };
  const settings = { count: 100, linkDistance: 92, radius: 130 };

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  function seed() {
    particles.length = 0;
    for (let i = 0; i < settings.count; i += 1) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, r: Math.random() * 1.7 + 0.5, vx: (Math.random() - 0.5) * 0.45, vy: (Math.random() - 0.5) * 0.45, hue: Math.random() > 0.5 ? 195 : 270 });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      const mdx = mouse.x - p.x; const mdy = mouse.y - p.y; const md = Math.sqrt(mdx * mdx + mdy * mdy);
      if (md < settings.radius) { p.vx += (mdx / settings.radius) * 0.004; p.vy += (mdy / settings.radius) * 0.004; }
      p.x += p.vx; p.y += p.vy; p.vx *= 0.99; p.vy *= 0.99;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = `hsla(${p.hue},100%,72%,0.72)`; ctx.fill();
      for (let j = i + 1; j < particles.length; j += 1) {
        const q = particles[j]; const dx = p.x - q.x; const dy = p.y - q.y; const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < settings.linkDistance) {
          ctx.strokeStyle = `rgba(106,176,255,${(1 - dist / settings.linkDistance) * 0.16})`;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener("mouseleave", () => { mouse.x = -9999; mouse.y = -9999; });
  window.addEventListener("resize", () => { resize(); seed(); });

  resize(); seed(); draw();
}

init();
