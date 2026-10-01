/* ===================================================================
   PhishGuard AI Terminal — script.js
   1. Matrix digital rain (canvas)
   2. Rule-based URL threat-scoring engine
   3. Terminal scan simulation + results rendering
=================================================================== */

/* ---------------------------------------------------------------
   1. MATRIX RAIN BACKGROUND
--------------------------------------------------------------- */
(function matrixRain() {
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const glyphs = 'アァイィウヴエカキクケコサシスセソタチツテト0123456789ABCDEF$#%&'.split('');
  let columns, drops, fontSize = 16;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns).fill(0).map(() => Math.random() * -50);
  }

  function draw() {
    ctx.fillStyle = 'rgba(5, 10, 7, 0.18)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = glyphs[Math.floor(Math.random() * glyphs.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctx.fillStyle = Math.random() > 0.975 ? '#c9f5da' : '#3dffa0';
      ctx.globalAlpha = Math.random() * 0.5 + 0.5;
      ctx.fillText(text, x, y);
      ctx.globalAlpha = 1;

      if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);

  if (reduceMotion) {
    draw(); // single static frame, no interval
  } else {
    setInterval(draw, 50);
  }
})();

/* ---------------------------------------------------------------
   2. RULE-BASED THREAT ENGINE
--------------------------------------------------------------- */
const SHORTENERS = ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'is.gd', 'buff.ly', 'rebrand.ly'];
const SUSPICIOUS_KEYWORDS = ['login', 'verify', 'bank', 'secure', 'account', 'update', 'confirm', 'password', 'signin', 'wallet'];

const RULES = [
  {
    id: 'ip',
    weight: 25,
    label: 'Hostname is a raw IP address instead of a domain name',
    test: (u) => /^(\d{1,3}\.){3}\d{1,3}$/.test(u.hostname),
  },
  {
    id: 'at',
    weight: 20,
    label: 'Contains an "@" symbol — a classic URL-obfuscation trick',
    test: (u, raw) => raw.includes('@'),
  },
  {
    id: 'http',
    weight: 15,
    label: 'Uses unencrypted HTTP instead of HTTPS',
    test: (u) => u.protocol === 'http:',
  },
  {
    id: 'subdomains',
    weight: 15,
    label: 'Excessive subdomain nesting',
    test: (u) => u.hostname.split('.').length > 3,
  },
  {
    id: 'hyphens',
    weight: 10,
    label: 'Multiple hyphens in the domain (common brand-spoofing pattern)',
    test: (u) => (u.hostname.match(/-/g) || []).length >= 2,
  },
  {
    id: 'keywords',
    weight: 20,
    label: 'Suspicious keyword found in the URL path or query',
    test: (u) => SUSPICIOUS_KEYWORDS.some((kw) => (u.pathname + u.search).toLowerCase().includes(kw)),
  },
  {
    id: 'shortener',
    weight: 15,
    label: 'Hostname matches a known URL-shortening service',
    test: (u) => SHORTENERS.some((s) => u.hostname.toLowerCase() === s || u.hostname.toLowerCase().endsWith('.' + s)),
  },
  {
    id: 'length',
    weight: 10,
    label: 'Unusually long URL',
    test: (u, raw) => raw.length > 75,
  },
  {
    id: 'digits',
    weight: 10,
    label: 'Heavy use of numeric characters in the domain name',
    test: (u) => (u.hostname.match(/\d/g) || []).length >= 4,
  },
];

function normalizeUrl(input) {
  let raw = input.trim();
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(raw)) {
    raw = 'http://' + raw;
  }
  return raw;
}

function analyzeUrl(input) {
  const raw = normalizeUrl(input);
  let parsed;
  try {
    parsed = new URL(raw);
  } catch (e) {
    return { error: true };
  }

  const triggered = [];
  let score = 0;

  for (const rule of RULES) {
    if (rule.test(parsed, raw)) {
      triggered.push(rule);
      score += rule.weight;
    }
  }

  score = Math.min(100, score);

  let category;
  if (score < 30) category = 'safe';
  else if (score < 60) category = 'suspicious';
  else category = 'threat';

  // Confidence: more decisive the further the score is from the ambiguous mid-zone,
  // and more triggered/clean rules give the model more to go on.
  const decisiveness = Math.abs(score - 45);
  const ruleSignal = triggered.length === 0 ? 12 : Math.min(triggered.length * 6, 24);
  const confidence = Math.max(58, Math.min(98, 60 + decisiveness * 0.55 + ruleSignal));

  return {
    error: false,
    url: raw,
    hostname: parsed.hostname,
    score,
    category,
    confidence: Math.round(confidence),
    triggered,
    cleanCount: RULES.length - triggered.length,
  };
}

/* ---------------------------------------------------------------
   3. TERMINAL SCAN SIMULATION + RENDERING
--------------------------------------------------------------- */
const form = document.getElementById('scan-form');
const input = document.getElementById('url-input');
const scanBtn = document.getElementById('scan-btn');
const logPane = document.getElementById('log-pane');
const results = document.getElementById('results');

const statusBadge = document.getElementById('status-badge');
const scoreNumber = document.getElementById('score-number');
const scoreMeter = document.getElementById('score-meter');
const confidenceNumber = document.getElementById('confidence-number');
const confidenceFill = document.getElementById('confidence-bar-fill');
const aiExplanation = document.getElementById('ai-explanation');
const indicatorList = document.getElementById('indicator-list');

const CATEGORY_META = {
  safe: { label: '🟢 SAFE SIGNAL', badgeClass: 'safe', verdict: 'shows no significant phishing indicators' },
  suspicious: { label: '🟡 SUSPICIOUS ACTIVITY', badgeClass: 'suspicious', verdict: 'shows some patterns associated with phishing attempts' },
  threat: { label: '🔴 THREAT DETECTED', badgeClass: 'threat', verdict: 'matches multiple strong indicators of a phishing attempt' },
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function appendLog(tag, text, cls) {
  const line = document.createElement('div');
  line.className = 'log-line' + (cls ? ' ' + cls : '');

  // Build nodes directly instead of innerHTML + string interpolation, so any
  // user-controlled value in `text` (e.g. raw URL input) is always treated as
  // plain text and never parsed as markup.
  const tagSpan = document.createElement('span');
  tagSpan.className = 'tag';
  tagSpan.textContent = `[${tag}]`;

  line.appendChild(tagSpan);
  line.appendChild(document.createTextNode(' ' + text));

  logPane.appendChild(line);
  return line;
}

async function runScanAnimation(result) {
  logPane.innerHTML = '';
  results.classList.add('hidden');

  await sleep(150);
  appendLog('INIT', 'Initializing heuristic engine...');
  await sleep(220);
  appendLog('NET', `Parsing target → ${result.error ? input.value.trim() : result.url}`);
  await sleep(260);

  if (result.error) {
    appendLog('FAIL', 'Could not parse a valid URL from input.', 'warn');
    return;
  }

  appendLog('SCAN', 'Checking protocol integrity (HTTP/HTTPS)...');
  await sleep(220);
  appendLog('SCAN', `Inspecting domain structure → ${result.hostname}`);
  await sleep(240);
  appendLog('SCAN', 'Cross-referencing suspicious keyword patterns...');
  await sleep(220);
  appendLog('SCAN', `Found ${result.triggered.length} of ${RULES.length} rule matches.`, result.triggered.length ? 'warn' : '');
  await sleep(240);
  appendLog('CALC', 'Computing weighted threat score...');
  await sleep(260);
  appendLog('DONE', 'Analysis complete.', 'done');
}

function buildScoreMeter(score, category) {
  scoreMeter.innerHTML = '';
  const totalSegments = 20;
  const filled = Math.round((score / 100) * totalSegments);
  for (let i = 0; i < totalSegments; i++) {
    const seg = document.createElement('div');
    seg.className = 'seg' + (i < filled ? ' fill-' + category : '');
    scoreMeter.appendChild(seg);
  }
}

function buildExplanation(result) {
  const meta = CATEGORY_META[result.category];
  if (result.triggered.length === 0) {
    return `Scan complete. No rule-based risk indicators were triggered — this URL ${meta.verdict}. Threat score: ${result.score}/100.`;
  }
  const ruleWord = result.triggered.length === 1 ? 'indicator' : 'indicators';
  return `Scan complete. Detected ${result.triggered.length} risk ${ruleWord}, raising the threat score to ${result.score}/100. This URL ${meta.verdict}.`;
}

function typewrite(el, text, speed = 14) {
  el.textContent = '';
  let i = 0;
  return new Promise((resolve) => {
    const id = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(id);
        resolve();
      }
    }, speed);
  });
}

async function renderResults(result) {
  if (result.error) {
    return;
  }

  results.classList.remove('hidden');

  const meta = CATEGORY_META[result.category];
  statusBadge.textContent = meta.label;
  statusBadge.className = 'status-badge ' + meta.badgeClass;

  scoreNumber.textContent = '0';
  buildScoreMeter(0, result.category);
  confidenceNumber.textContent = '0%';
  confidenceFill.style.width = '0%';

  // Animate score count-up
  const duration = 500;
  const start = performance.now();
  await new Promise((resolve) => {
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration);
      const current = Math.round(progress * result.score);
      scoreNumber.textContent = current;
      buildScoreMeter(current, result.category);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        resolve();
      }
    }
    requestAnimationFrame(tick);
  });

  confidenceNumber.textContent = result.confidence + '%';
  confidenceFill.style.width = result.confidence + '%';

  indicatorList.innerHTML = '';
  if (result.triggered.length === 0) {
    const li = document.createElement('li');
    li.className = 'clean';
    li.textContent = `All ${RULES.length} heuristic checks passed cleanly.`;
    indicatorList.appendChild(li);
  } else {
    result.triggered.forEach((rule) => {
      const li = document.createElement('li');
      li.textContent = rule.label;
      indicatorList.appendChild(li);
    });
  }

  await typewrite(aiExplanation, buildExplanation(result), 12);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const value = input.value.trim();
  if (!value) return;

  scanBtn.disabled = true;
  results.classList.add('hidden');
  aiExplanation.textContent = '';

  const result = analyzeUrl(value);
  await runScanAnimation(result);
  await renderResults(result);

  scanBtn.disabled = false;
});