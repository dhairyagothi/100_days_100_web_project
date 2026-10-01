/* ============================================================
   CPU SCHEDULER SIMULATOR — script.js
   ============================================================ */

'use strict';

/* ── Process colors ─────────────────────────────────────── */
const COLORS = [
  '#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6',
  '#06b6d4','#f97316','#ec4899','#84cc16','#14b8a6',
  '#6366f1','#e11d48'
];

/* ── Algorithm metadata ─────────────────────────────────── */
const ALGO_META = {
  fcfs: {
    title:    'First Come First Serve',
    subtitle: 'Non-preemptive · Schedules in arrival order',
    info:     'FCFS executes processes in the order they arrive. Simple and fair, but suffers from the convoy effect where short processes wait behind long ones.',
    hasPriority: false,
    preemptive:  false,
  },
  sjf: {
    title:    'Shortest Job First',
    subtitle: 'Non-preemptive · Picks shortest burst time next',
    info:     'SJF picks the process with the smallest burst time. Minimizes average waiting time but may cause starvation for long processes.',
    hasPriority: false,
    preemptive:  false,
  },
  srtf: {
    title:    'Shortest Remaining Time First',
    subtitle: 'Preemptive · SJF variant',
    info:     'SRTF preempts the running process if a newly arrived process has a shorter remaining time. Optimal for minimizing average waiting time.',
    hasPriority: false,
    preemptive:  true,
  },
  rr: {
    title:    'Round Robin',
    subtitle: 'Preemptive · Fixed time quantum per process',
    info:     'Round Robin gives each process a fixed time slice (quantum). Ensures fairness and good response time. Performance depends heavily on quantum size.',
    hasPriority: false,
    preemptive:  true,
  },
  priority_np: {
    title:    'Priority Scheduling (Non-Preemptive)',
    subtitle: 'Non-preemptive · Higher priority runs first',
    info:     'Processes are executed by priority (lower number = higher priority). Efficient for critical tasks but may starve low-priority processes.',
    hasPriority: true,
    preemptive:  false,
  },
  priority_p: {
    title:    'Priority Scheduling (Preemptive)',
    subtitle: 'Preemptive · Preempts on higher-priority arrival',
    info:     'A higher-priority process immediately preempts the currently running process upon arrival. Ensures critical tasks are never delayed.',
    hasPriority: true,
    preemptive:  true,
  },
  hrrn: {
    title:    'Highest Response Ratio Next',
    subtitle: 'Non-preemptive · Balances wait time and burst time',
    info:     'HRRN selects the process with the highest response ratio = (wait + burst) / burst. Prevents starvation while still rewarding shorter jobs.',
    hasPriority: false,
    preemptive:  false,
  },
  multilevel: {
    title:    'Multilevel Queue',
    subtitle: 'Mixed · High-priority queue uses RR, low-priority uses FCFS',
    info:     'Two queues: high-priority (Round Robin, quantum = 2) and low-priority (FCFS). Processes with priority ≤ 2 are placed in the high-priority queue.',
    hasPriority: true,
    preemptive:  true,
  },
};

/* ── AI predefined knowledge base ───────────────────────── */
const AI_KB = [
  {
    keywords: ['fcfs','first come','first serve','arrival order'],
    answer:   'FCFS (First Come First Serve) is the simplest scheduling algorithm. Processes are executed in the exact order they arrive in the ready queue. It is non-preemptive — once a process starts, it runs to completion. Downside: it can cause the "convoy effect" where short processes get stuck behind a long one, increasing average waiting time.'
  },
  {
    keywords: ['sjf','shortest job','shortest job first'],
    answer:   'SJF (Shortest Job First) selects the process with the smallest CPU burst time from the ready queue. It is non-preemptive and provably minimizes average waiting time among all non-preemptive algorithms. Downside: it can cause starvation for long processes if short jobs keep arriving.'
  },
  {
    keywords: ['srtf','shortest remaining','preemptive sjf'],
    answer:   'SRTF (Shortest Remaining Time First) is the preemptive version of SJF. When a new process arrives, if its burst time is shorter than the remaining time of the current process, the CPU is preempted. This algorithm achieves the minimum possible average waiting time, but causes more context switches and can starve long processes.'
  },
  {
    keywords: ['round robin','rr','time quantum','time slice'],
    answer:   'Round Robin assigns a fixed time slice called the quantum to each process in cyclic order. When a process uses up its quantum, it is preempted and placed at the back of the queue. It ensures fairness and good response time. A small quantum improves responsiveness but increases context-switch overhead; a large quantum approaches FCFS behavior.'
  },
  {
    keywords: ['priority scheduling','priority','higher priority'],
    answer:   'Priority Scheduling assigns a numeric priority to each process and always runs the highest-priority process next (lower number = higher priority in this simulator). It exists in both non-preemptive form (runs to completion) and preemptive form (new high-priority arrivals immediately preempt the CPU). Main risk: low-priority processes may starve.'
  },
  {
    keywords: ['hrrn','highest response ratio','response ratio'],
    answer:   'HRRN (Highest Response Ratio Next) calculates a response ratio for every ready process: RR = (waiting time + burst time) / burst time. The process with the highest ratio is selected. This naturally prevents starvation because waiting time grows over time, boosting a process\'s ratio. It balances between SJF and FCFS.'
  },
  {
    keywords: ['multilevel','multilevel queue','multiple queue'],
    answer:   'Multilevel Queue divides the ready queue into multiple separate queues, each with its own scheduling algorithm. In this simulator: processes with priority ≤ 2 go into a high-priority queue (scheduled with Round Robin, quantum = 2), while others go into a low-priority queue (scheduled with FCFS). The high-priority queue is always served first.'
  },
  {
    keywords: ['starvation','starve','starving'],
    answer:   'Starvation occurs when a process waits indefinitely because higher-priority or shorter processes keep arriving and being selected ahead of it. It is common in SJF and priority scheduling. The fix is "aging" — gradually increasing a waiting process\'s priority over time so it eventually gets CPU access.'
  },
  {
    keywords: ['convoy effect','convoy'],
    answer:   'The convoy effect happens in FCFS when one long process holds the CPU while many short processes queue up behind it. All those short processes experience unnecessarily high waiting times. This is the main weakness of FCFS and is avoided by algorithms like SJF and Round Robin.'
  },
  {
    keywords: ['turnaround time','turnaround','tat'],
    answer:   'Turnaround Time (TAT) is the total time a process spends in the system from arrival to completion.\n\nFormula: TAT = Completion Time − Arrival Time\n\nIt includes both waiting time and actual CPU execution time. Minimizing average TAT is a key goal of scheduling algorithms.'
  },
  {
    keywords: ['waiting time','wait time','wt'],
    answer:   'Waiting Time is the total time a process spends in the ready queue waiting for the CPU (not actually executing).\n\nFormula: Waiting Time = Turnaround Time − Burst Time\n\nLower average waiting time means the CPU is being allocated more efficiently across all processes.'
  },
  {
    keywords: ['preemptive','non-preemptive','preemption'],
    answer:   'Non-preemptive: once a process gets the CPU, it runs until it finishes or voluntarily gives up the CPU. Examples: FCFS, SJF, HRRN.\n\nPreemptive: the OS can forcibly take the CPU away from a running process (e.g., when a higher-priority or shorter process arrives). Examples: SRTF, Round Robin, Priority-P.\n\nPreemptive algorithms give better response time but have higher context-switch overhead.'
  },
  {
    keywords: ['cpu burst','burst time','burst'],
    answer:   'CPU Burst Time is the amount of CPU time a process needs to complete its execution (or the time until its next I/O request). It is the core input to most scheduling algorithms. Shorter burst times generally get better treatment in SJF and SRTF. In practice, burst times are often estimated using past behavior.'
  },
  {
    keywords: ['context switch','context switching','overhead'],
    answer:   'A context switch happens when the CPU switches from one process to another. The OS must save the state (registers, program counter, etc.) of the outgoing process and load the state of the incoming process. Context switches take real time and produce no useful work, so minimizing unnecessary switches is important — especially for algorithms like SRTF and Round Robin with small quanta.'
  },
  {
    keywords: ['best','which is best','optimal','recommend','compare'],
    answer:   'There is no single "best" algorithm — it depends on goals:\n\n• Best throughput / min waiting time → SRTF (if burst times are known)\n• Fairness / interactive systems → Round Robin\n• Simple / batch systems → FCFS\n• Critical task prioritization → Priority Scheduling\n• Prevent starvation while favoring short jobs → HRRN\n• Mixed workloads → Multilevel Queue\n\nReal operating systems often combine multiple strategies.'
  },
  {
    keywords: ['arrival time','arrive'],
    answer:   'Arrival Time is the moment a process enters the ready queue and becomes available for scheduling. Processes that arrive later cannot be scheduled before their arrival time, even if the CPU is idle. In this simulator, arrival time 0 means the process is available from the very start.'
  },
  {
    keywords: ['gantt','gantt chart','timeline','chart'],
    answer:   'A Gantt chart visualizes CPU scheduling over time. Each colored bar represents a process executing on the CPU during that time interval. The x-axis is time. By reading the chart left-to-right you can see which process ran when, identify idle periods, and understand preemptions. It is the standard tool for analyzing scheduling algorithms.'
  },
  {
    keywords: ['response time','first response'],
    answer:   'Response Time is the time from when a process first arrives to when it first starts executing on the CPU. It is especially important for interactive systems where users expect quick feedback. Round Robin typically has the best average response time since every process gets the CPU within at most (n−1)×quantum time.'
  },
  {
    keywords: ['throughput','processes per'],
    answer:   'Throughput is the number of processes completed per unit of time. It measures how productive the CPU is. A higher throughput means the scheduler is finishing more work in less time. Throughput can be reduced by excessive context switches or long idle periods.'
  },
  {
    keywords: ['cpu utilization','utilization','efficiency'],
    answer:   'CPU Utilization is the percentage of time the CPU spends executing processes (as opposed to being idle). Ideal utilization is 100%, but real systems target 40–90%. Keeping CPU utilization high is a primary goal of any scheduling algorithm.'
  },
];

/* ── State ───────────────────────────────────────────────── */
let currentAlgo = 'fcfs';
let processes   = [];
let pidCounter  = 4;

/* ── Helpers ─────────────────────────────────────────────── */
function makeProcess(id, arrival = 0, burst = 1, priority = 1) {
  return { id, arrival, burst, priority };
}

function getColor(pid) {
  const idx = processes.findIndex(p => p.id === pid);
  return COLORS[(idx >= 0 ? idx : pid - 1) % COLORS.length];
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

/* ── Process rendering ───────────────────────────────────── */
function initProcesses() {
  processes = [
    makeProcess(1, 0, 5, 2),
    makeProcess(2, 1, 3, 1),
    makeProcess(3, 2, 8, 3),
  ];
  pidCounter = 4;
  renderProcesses();
}

function renderProcesses() {
  const meta      = ALGO_META[currentAlgo];
  const container = document.getElementById('processRows');
  container.innerHTML = '';

  document.getElementById('col3Header').textContent =
    meta.hasPriority ? 'Priority' : '—';

  processes.forEach((p, i) => {
    const row  = document.createElement('div');
    row.className = 'process-grid';

    const color = COLORS[i % COLORS.length];

    row.innerHTML = `
      <div class="pid-cell">
        <div class="pid-dot" style="background:${color}" title="P${p.id}"></div>
      </div>
      <input class="pfield" type="number" min="0" value="${p.arrival}"
             placeholder="0" data-id="${p.id}" data-field="arrival" />
      <input class="pfield" type="number" min="1" value="${p.burst}"
             placeholder="1" data-id="${p.id}" data-field="burst" />
      <input class="pfield" type="number" min="1" value="${p.priority}"
             placeholder="1" data-id="${p.id}" data-field="priority"
             ${!meta.hasPriority ? 'disabled' : ''} />
      <button class="btn-icon" data-id="${p.id}" title="Remove process">✕</button>
    `;
    container.appendChild(row);
  });
}

/* ── Process events ──────────────────────────────────────── */
document.getElementById('processRows').addEventListener('input', e => {
  const { id, field } = e.target.dataset;
  if (!id || !field) return;
  const p = processes.find(x => x.id == id);
  if (p) p[field] = parseFloat(e.target.value) || 0;
});

document.getElementById('processRows').addEventListener('click', e => {
  const btn = e.target.closest('.btn-icon[data-id]');
  if (!btn) return;
  if (processes.length <= 1) { showToast('Need at least 1 process'); return; }
  processes = processes.filter(p => p.id != btn.dataset.id);
  renderProcesses();
});

document.getElementById('addProcessBtn').addEventListener('click', () => {
  if (processes.length >= 20) { showToast('Maximum 20 processes'); return; }
  processes.push(makeProcess(pidCounter++, 0, 1, 1));
  renderProcesses();
});

/* ── Algorithm selection ─────────────────────────────────── */
document.querySelectorAll('.algo-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.algo-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentAlgo = btn.dataset.algo;

    const meta = ALGO_META[currentAlgo];
    document.getElementById('algoTitle').textContent    = meta.title;
    document.getElementById('algoSubtitle').textContent = meta.subtitle;
    document.getElementById('algoInfo').textContent     = meta.info;
    document.getElementById('rrParam').style.display    =
      (currentAlgo === 'rr') ? 'flex' : 'none';

    document.getElementById('resultsSection').style.display = 'none';
    renderProcesses();
  });
});

document.getElementById('sampleBtn').addEventListener('click', () => {
  initProcesses();
  document.getElementById('resultsSection').style.display = 'none';
});

/* ── Validation ──────────────────────────────────────────── */
function validate() {
  for (const p of processes) {
    if (isNaN(p.arrival) || p.arrival < 0) {
      showToast(`P${p.id}: arrival must be ≥ 0`); return false;
    }
    if (isNaN(p.burst) || p.burst < 1) {
      showToast(`P${p.id}: burst must be ≥ 1`); return false;
    }
    if (ALGO_META[currentAlgo].hasPriority &&
        (isNaN(p.priority) || p.priority < 1)) {
      showToast(`P${p.id}: priority must be ≥ 1`); return false;
    }
  }
  return true;
}

/* ══════════════════════════════════════════════════════════
   SCHEDULING ALGORITHMS
══════════════════════════════════════════════════════════ */

/* Merge adjacent same-PID segments in timeline */
function mergeTimeline(tl) {
  let i = 0;
  while (i < tl.length - 1) {
    if (tl[i].pid === tl[i + 1].pid && tl[i].end === tl[i + 1].start) {
      tl[i].end = tl[i + 1].end;
      tl.splice(i + 1, 1);
    } else {
      i++;
    }
  }
}

/* ── FCFS ── */
function runFCFS(ps) {
  const procs = ps.map(p => ({ ...p }))
                  .sort((a, b) => a.arrival - b.arrival || a.id - b.id);
  const timeline = [], results = [];
  let time = 0;

  for (const p of procs) {
    if (time < p.arrival) time = p.arrival;
    timeline.push({ pid: p.id, start: time, end: time + p.burst });
    p.finish     = time + p.burst;
    p.wait       = time - p.arrival;
    p.turnaround = p.finish - p.arrival;
    time += p.burst;
    results.push(p);
  }
  return { timeline, results };
}

/* ── SJF (Non-preemptive) ── */
function runSJF(ps) {
  const procs    = ps.map(p => ({ ...p }));
  const timeline = [], results = [];
  const finished = new Set();
  let time = 0;

  while (results.length < procs.length) {
    const ready = procs.filter(p => p.arrival <= time && !finished.has(p.id));
    if (!ready.length) { time++; continue; }
    ready.sort((a, b) => a.burst - b.burst || a.arrival - b.arrival);
    const p = ready[0];
    timeline.push({ pid: p.id, start: time, end: time + p.burst });
    p.finish     = time + p.burst;
    p.wait       = time - p.arrival;
    p.turnaround = p.finish - p.arrival;
    time += p.burst;
    finished.add(p.id);
    results.push(p);
  }
  return { timeline, results };
}

/* ── SRTF (Preemptive SJF) ── */
function runSRTF(ps) {
  const procs = ps.map(p => ({ ...p, rem: p.burst }));
  const timeline = [], results = [];
  let time = 0, current = null, segStart = 0;
  const maxT = ps.reduce((s, p) => s + p.burst, 0) +
               ps.reduce((m, p) => Math.max(m, p.arrival), 0) + 2;

  while (results.length < procs.length && time <= maxT) {
    const ready = procs.filter(p => p.arrival <= time && p.rem > 0);
    const best  = ready.length
      ? ready.reduce((m, p) => p.rem < m.rem ? p : m)
      : null;

    if (current !== best) {
      if (current && segStart < time)
        timeline.push({ pid: current.id, start: segStart, end: time });
      current  = best;
      segStart = time;
    }
    if (!best) { time++; continue; }

    best.rem--;
    time++;
    if (best.rem === 0) {
      timeline.push({ pid: best.id, start: segStart, end: time });
      best.finish     = time;
      best.turnaround = best.finish - best.arrival;
      best.wait       = best.turnaround - best.burst;
      results.push(best);
      current = null;
    }
  }
  mergeTimeline(timeline);
  return { timeline, results };
}

/* ── Round Robin ── */
function runRR(ps, quantum) {
  const procs = ps.map(p => ({ ...p, rem: p.burst }));
  const timeline = [], results = [];
  const sorted   = [...procs].sort((a, b) => a.arrival - b.arrival);
  const queue    = [], inQueue = new Set();
  let time = 0, idx = 0;

  sorted.filter(p => p.arrival <= 0).forEach(p => {
    queue.push(p); inQueue.add(p.id);
  });
  idx = queue.length;

  while (results.length < procs.length) {
    if (!queue.length) {
      if (idx < sorted.length) {
        time = sorted[idx].arrival;
        queue.push(sorted[idx]);
        inQueue.add(sorted[idx].id);
        idx++;
      }
      continue;
    }
    const p   = queue.shift();
    const run = Math.min(quantum, p.rem);
    timeline.push({ pid: p.id, start: time, end: time + run });
    time  += run;
    p.rem -= run;

    sorted.slice(idx).filter(x => x.arrival <= time && !inQueue.has(x.id))
          .forEach(x => { queue.push(x); inQueue.add(x.id); idx++; });

    if (p.rem > 0) {
      queue.push(p);
    } else {
      p.finish     = time;
      p.turnaround = p.finish - p.arrival;
      p.wait       = p.turnaround - p.burst;
      results.push(p);
    }
  }
  mergeTimeline(timeline);
  return { timeline, results };
}

/* ── Priority Non-Preemptive ── */
function runPriorityNP(ps) {
  const procs    = ps.map(p => ({ ...p }));
  const timeline = [], results = [];
  const finished = new Set();
  let time = 0;

  while (results.length < procs.length) {
    const ready = procs.filter(p => p.arrival <= time && !finished.has(p.id));
    if (!ready.length) { time++; continue; }
    ready.sort((a, b) => a.priority - b.priority || a.arrival - b.arrival);
    const p = ready[0];
    timeline.push({ pid: p.id, start: time, end: time + p.burst });
    p.finish     = time + p.burst;
    p.wait       = time - p.arrival;
    p.turnaround = p.finish - p.arrival;
    time += p.burst;
    finished.add(p.id);
    results.push(p);
  }
  return { timeline, results };
}

/* ── Priority Preemptive ── */
function runPriorityP(ps) {
  const procs = ps.map(p => ({ ...p, rem: p.burst }));
  const timeline = [], results = [];
  let time = 0, current = null, segStart = 0;
  const maxT = ps.reduce((s, p) => s + p.burst, 0) +
               ps.reduce((m, p) => Math.max(m, p.arrival), 0) + 2;

  while (results.length < procs.length && time <= maxT) {
    const ready = procs.filter(p => p.arrival <= time && p.rem > 0);
    const best  = ready.length
      ? ready.reduce((m, p) => p.priority < m.priority ? p : m)
      : null;

    if (current !== best) {
      if (current && segStart < time)
        timeline.push({ pid: current.id, start: segStart, end: time });
      current  = best;
      segStart = time;
    }
    if (!best) { time++; continue; }

    best.rem--;
    time++;
    if (best.rem === 0) {
      timeline.push({ pid: best.id, start: segStart, end: time });
      best.finish     = time;
      best.turnaround = best.finish - best.arrival;
      best.wait       = best.turnaround - best.burst;
      results.push(best);
      current = null;
    }
  }
  mergeTimeline(timeline);
  return { timeline, results };
}

/* ── HRRN ── */
function runHRRN(ps) {
  const procs    = ps.map(p => ({ ...p }));
  const timeline = [], results = [];
  const finished = new Set();
  let time = 0;

  while (results.length < procs.length) {
    const ready = procs.filter(p => p.arrival <= time && !finished.has(p.id));
    if (!ready.length) { time++; continue; }
    ready.forEach(p => {
      p.responseRatio = ((time - p.arrival) + p.burst) / p.burst;
    });
    ready.sort((a, b) => b.responseRatio - a.responseRatio);
    const p = ready[0];
    timeline.push({ pid: p.id, start: time, end: time + p.burst });
    p.finish     = time + p.burst;
    p.wait       = time - p.arrival;
    p.turnaround = p.finish - p.arrival;
    time += p.burst;
    finished.add(p.id);
    results.push(p);
  }
  return { timeline, results };
}

/* ── Multilevel Queue ── */
function runMultilevel(ps) {
  const ML_QUANTUM = 2;
  const hi = ps.filter(p => p.priority <= 2).map(p => ({ ...p, rem: p.burst }));
  const lo = ps.filter(p => p.priority >  2).map(p => ({ ...p, rem: p.burst }));
  const timeline = [], results = [];
  const allSorted = [...hi, ...lo].sort((a, b) => a.arrival - b.arrival);
  const hiQ = [], loQ = [], inQ = new Set();
  let time = 0, idx = 0;

  function enqueue(t) {
    while (idx < allSorted.length && allSorted[idx].arrival <= t) {
      const p = allSorted[idx];
      (hi.includes(p) ? hiQ : loQ).push(p);
      inQ.add(p.id);
      idx++;
    }
  }

  enqueue(0);

  while (results.length < ps.length) {
    enqueue(time);
    const isHiQueue = hiQ.length > 0;
    const queue     = isHiQueue ? hiQ : loQ;

    if (!queue.length) {
      if (idx < allSorted.length) {
        time = allSorted[idx].arrival;
        enqueue(time);
      }
      continue;
    }

    const p   = queue.shift();
    const run = isHiQueue ? Math.min(ML_QUANTUM, p.rem) : p.rem;
    timeline.push({ pid: p.id, start: time, end: time + run });
    time  += run;
    p.rem -= run;
    enqueue(time);

    if (p.rem > 0) {
      queue.unshift(p);
    } else {
      p.finish     = time;
      p.turnaround = p.finish - p.arrival;
      p.wait       = p.turnaround - p.burst;
      results.push(p);
    }
  }
  mergeTimeline(timeline);
  return { timeline, results };
}

/* ── Dispatch ── */
function simulate() {
  const quantum = parseInt(document.getElementById('quantumInput').value) || 2;
  const ps      = processes.map(p => ({ ...p }));

  switch (currentAlgo) {
    case 'fcfs':        return runFCFS(ps);
    case 'sjf':         return runSJF(ps);
    case 'srtf':        return runSRTF(ps);
    case 'rr':          return runRR(ps, quantum);
    case 'priority_np': return runPriorityNP(ps);
    case 'priority_p':  return runPriorityP(ps);
    case 'hrrn':        return runHRRN(ps);
    case 'multilevel':  return runMultilevel(ps);
    default:            return runFCFS(ps);
  }
}

/* ── Run button ── */
document.getElementById('runBtn').addEventListener('click', () => {
  if (!validate()) return;
  const { timeline, results } = simulate();
  renderMetrics(results);
  renderGantt(timeline);
  renderTable(results);
  document.getElementById('resultsSection').style.display = 'block';
  document.getElementById('resultsSection')
          .scrollIntoView({ behavior: 'smooth', block: 'start' });
});

/* ══════════════════════════════════════════════════════════
   RENDER RESULTS
══════════════════════════════════════════════════════════ */

/* ── Metrics cards ── */
function renderMetrics(results) {
  const n      = results.length;
  const avgWT  = results.reduce((s, p) => s + p.wait, 0) / n;
  const avgTAT = results.reduce((s, p) => s + p.turnaround, 0) / n;
  const maxEnd = Math.max(...results.map(p => p.finish));
  const busy   = results.reduce((s, p) => s + p.burst, 0);
  const thru   = (n / maxEnd).toFixed(3);
  const cpu    = ((busy / maxEnd) * 100).toFixed(1);

  document.getElementById('metricsGrid').innerHTML = `
    <div class="metric-card">
      <div class="metric-label">Avg Waiting Time</div>
      <div class="metric-value">${avgWT.toFixed(2)}<span class="metric-unit">ms</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Avg Turnaround Time</div>
      <div class="metric-value">${avgTAT.toFixed(2)}<span class="metric-unit">ms</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-label">Throughput</div>
      <div class="metric-value">${thru}<span class="metric-unit">p/ms</span></div>
    </div>
    <div class="metric-card">
      <div class="metric-label">CPU Utilization</div>
      <div class="metric-value">${cpu}<span class="metric-unit">%</span></div>
    </div>
  `;
}

/* ── Gantt chart (SVG) ── */
function renderGantt(timeline) {
  if (!timeline.length) return;

  const svg    = document.getElementById('ganttSvg');
  const legend = document.getElementById('ganttLegend');
  const BAR_H  = 36;
  const ROW_Y  = 40;
  const TICK_Y = ROW_Y + BAR_H + 18;
  const SVG_H  = ROW_Y + BAR_H + 30;

  const totalEnd = Math.max(...timeline.map(t => t.end));
  const svgW     = Math.max(600, totalEnd * 40 + 80);
  const scale    = (svgW - 80) / totalEnd;

  let ticks = '';
  let bars  = '';
  const seen = new Set();

  for (let t = 0; t <= totalEnd; t++) {
    const x = 40 + t * scale;
    ticks += `<line x1="${x}" y1="${ROW_Y + BAR_H}" x2="${x}" y2="${ROW_Y + BAR_H + 6}"
               stroke="#1e2535" stroke-width="1"/>`;
    ticks += `<text x="${x}" y="${TICK_Y}" text-anchor="middle"
               fill="#475569" font-size="10" font-family="Inter,sans-serif">${t}</text>`;
  }

  for (const seg of timeline) {
    const x = 40 + seg.start * scale;
    const w = (seg.end - seg.start) * scale;
    const c = getColor(seg.pid);
    seen.add(seg.pid);

    bars += `<rect class="gantt-bar" x="${x}" y="${ROW_Y}" width="${w}"
              height="${BAR_H}" rx="4" fill="${c}" opacity="0.88">
               <title>P${seg.pid}  [${seg.start} → ${seg.end}]</title>
             </rect>`;
    if (w > 18) {
      bars += `<text x="${x + w / 2}" y="${ROW_Y + BAR_H / 2 + 5}"
                text-anchor="middle" fill="white" font-size="12"
                font-weight="600" font-family="Inter,sans-serif"
                pointer-events="none">P${seg.pid}</text>`;
    }
  }

  svg.setAttribute('viewBox', `0 0 ${svgW} ${SVG_H}`);
  svg.setAttribute('height', SVG_H);
  svg.innerHTML = ticks + bars;

  legend.innerHTML = '';
  [...seen].sort((a, b) => a - b).forEach(pid => {
    const div = document.createElement('div');
    div.className = 'legend-item';
    div.innerHTML = `<div class="legend-dot" style="background:${getColor(pid)}"></div> P${pid}`;
    legend.appendChild(div);
  });
}

/* ── Results table ── */
function renderTable(results) {
  const sorted = [...results].sort((a, b) => a.id - b.id);
  let html = `
    <table class="results">
      <thead>
        <tr>
          <th>PID</th>
          <th>Arrival</th>
          <th>Burst</th>
          <th>Finish</th>
          <th>Waiting</th>
          <th>Turnaround</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
  `;
  for (const p of sorted) {
    html += `
      <tr>
        <td><span style="color:${getColor(p.id)};font-weight:600">P${p.id}</span></td>
        <td>${p.arrival}</td>
        <td>${p.burst}</td>
        <td>${p.finish}</td>
        <td>${p.wait}</td>
        <td>${p.turnaround}</td>
        <td><span class="badge-done">Done</span></td>
      </tr>
    `;
  }
  html += '</tbody></table>';
  document.getElementById('resultTable').innerHTML = html;
}

/* ══════════════════════════════════════════════════════════
   AI LEARNING ASSISTANT  (predefined answers)
══════════════════════════════════════════════════════════ */

/**
 * Searches the knowledge base for a matching answer.
 * Returns the best matching entry's answer, or a fallback message.
 */
function getAIAnswer(input) {
  const q = input.toLowerCase().trim();

  // Find the entry whose keywords best overlap with the query
  let bestEntry  = null;
  let bestScore  = 0;

  for (const entry of AI_KB) {
    const score = entry.keywords.filter(kw => q.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  if (bestEntry && bestScore > 0) return bestEntry.answer;

  // Polite fallback
  return `I don't have a specific answer for that yet. Try asking about:\n` +
         `• FCFS, SJF, SRTF, Round Robin, Priority Scheduling, HRRN, Multilevel Queue\n` +
         `• Waiting time, Turnaround time, Throughput, CPU Utilization\n` +
         `• Starvation, Convoy effect, Context switch, Preemption`;
}

/* Append a message bubble to the chat */
function addMessage(role, text) {
  const container = document.getElementById('aiMessages');
  const div       = document.createElement('div');
  div.className   = `ai-msg ${role === 'user' ? 'user' : ''}`;

  // div.innerHTML = `
  //   <div class="ai-avatar ${role === 'bot' ? 'bot' : 'user'}">
  //     ${role === 'bot' ? 'AI' : 'You'}
  //   </div>
  //   <div class="ai-bubble">${text.replace(/\n/g, '<br>')}</div>
  // `;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  return div.querySelector('.ai-bubble');
}

/* Handle a user question */
function handleQuestion(question) {
  if (!question.trim()) return;
  addMessage('user', question);

  // Simulate a tiny delay so the reply feels natural
  setTimeout(() => {
    const answer = getAIAnswer(question);
    addMessage('bot', answer);
  }, 180);
}

/* Send button */
document.getElementById('aiSend').addEventListener('click', () => {
  const input = document.getElementById('aiInput');
  handleQuestion(input.value);
  input.value = '';
});

/* Enter key */
document.getElementById('aiInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const input = document.getElementById('aiInput');
    handleQuestion(input.value);
    input.value = '';
  }
});

/* Quick-reply chips */
document.getElementById('aiChips').addEventListener('click', e => {
  const chip = e.target.closest('.ai-chip');
  if (!chip) return;
  handleQuestion(chip.dataset.q);
});

/* ── Boot ── */
initProcesses();
