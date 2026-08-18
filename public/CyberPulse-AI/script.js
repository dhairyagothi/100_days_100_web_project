/* =========================================================
   PhishGuard AI Terminal — logic
   Rule-based URL threat scoring + matrix canvas + terminal FX
   ========================================================= */

/* ---------------- Matrix rain background ---------------- */

(function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  const ctx = canvas.getContext('2d');
  let width, height, columns, drops;
  const chars = 'アイウエオカキクケコ01ABCDEFGHIJKLMNOPQRSTUVWXYZ$#@%&*'.split('');
  const fontSize = 16;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / fontSize);
    drops = new Array(columns).fill(1);
  }

  function draw() {
    ctx.fillStyle = 'rgba(2, 8, 5, 0.08)';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#39ff8f';
    ctx.font = fontSize + 'px monospace';
    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  window.addEventListener('resize', resize);
  resize();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  setInterval(draw, reduceMotion ? 120 : 45);
})();

/* ---------------- Boot log ---------------- */

(function bootSequence() {
  const bootLog = document.getElementById('bootLog');
  const lines = [
    '[ OK ] loading threat-signature database...',
    '[ OK ] initializing heuristic engine...',
    '[ OK ] calibrating AI explanation module...',
    '> PhishGuard AI Terminal ready.'
  ];
  lines.forEach((line, i) => {
    const el = document.createElement('div');
    el.textContent = line;
    el.style.animationDelay = (i * 0.15) + 's';
    bootLog.appendChild(el);
  });
})();

/* ---------------- Rule-based analysis engine ---------------- */

const SUSPICIOUS_KEYWORDS = ['login', 'verify', 'bank', 'secure', 'account', 'update', 'confirm', 'signin', 'password'];

function analyzeUrl(rawUrl) {
  const url = rawUrl.trim();
  const lower = url.toLowerCase();
  let score = 0;
  const reasons = [];

  // Keyword check
  const foundKeywords = SUSPICIOUS_KEYWORDS.filter(k => lower.includes(k));
  if (foundKeywords.length) {
    score += 20 * Math.min(foundKeywords.length, 2);
    reasons.push(`Contains suspicious keyword(s): "${foundKeywords.join('", "')}" — often used to mimic trusted login/verification pages.`);
  }

  // '@' character check
  if (url.includes('@')) {
    score += 25;
    reasons.push(`URL contains an "@" character, which browsers ignore everything before — a common trick to disguise the real destination.`);
  }

  // HTTP instead of HTTPS
  if (lower.startsWith('http://')) {
    score += 15;
    reasons.push('Uses HTTP instead of HTTPS — the connection is not encrypted.');
  } else if (!lower.startsWith('https://') && !lower.startsWith('http://')) {
    score += 5;
    reasons.push('No protocol specified — assuming an unsecured connection by default.');
  }

  // Subdomain count
  try {
    const hostMatch = url.match(/^[a-z]+:\/\/([^/?#]+)/i) || url.match(/^([^/?#]+)/i);
    const host = hostMatch ? hostMatch[1].replace(/^www\./, '') : '';
    const labelCount = host.split('.').length;
    if (labelCount > 3) {
      score += 20;
      reasons.push(`Domain has ${labelCount - 1} subdomain levels — excessive subdomains are often used to fake legitimacy.`);
    }

    // Hyphenated domain
    if (host.includes('-')) {
      score += 15;
      reasons.push('Domain name contains hyphens — frequently used to imitate well-known brand names (e.g. "secure-bank-login.com").');
    }

    // IP address as host
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
      score += 25;
      reasons.push('Host is a raw IP address instead of a domain name — a strong phishing indicator.');
    }
  } catch (e) {
    /* ignore parse issues, scoring continues with what we have */
  }

  score = Math.min(score, 100);

  if (!reasons.length) {
    reasons.push('No suspicious patterns detected in keywords, structure, or protocol.');
  }

  let verdict, verdictClass, icon;
  if (score >= 60) {
    verdict = 'THREAT DETECTED'; verdictClass = 'verdict--threat'; icon = '🔴';
  } else if (score >= 25) {
    verdict = 'SUSPICIOUS ACTIVITY'; verdictClass = 'verdict--suspicious'; icon = '🟡';
  } else {
    verdict = 'SAFE SIGNAL'; verdictClass = 'verdict--safe'; icon = '🟢';
  }

  // Confidence: higher when score is clearly low or clearly high, lower mid-range
  const distanceFromMid = Math.abs(score - 50);
  const confidence = Math.min(98, 55 + distanceFromMid * 0.8);

  return { score, verdict, verdictClass, icon, confidence: Math.round(confidence), reasons };
}

/* ---------------- UI wiring ---------------- */

const form = document.getElementById('scanForm');
const input = document.getElementById('urlInput');
const scanBtn = document.getElementById('scanBtn');
const liveLog = document.getElementById('liveLog');
const resultGrid = document.getElementById('resultGrid');
const emptyState = document.getElementById('emptyState');

const verdictBadge = document.getElementById('verdictBadge');
const verdictIcon = document.getElementById('verdictIcon');
const verdictText = document.getElementById('verdictText');
const scoreFill = document.getElementById('scoreFill');
const scoreValue = document.getElementById('scoreValue');
const confidenceValue = document.getElementById('confidenceValue');
const explainList = document.getElementById('explainList');

function logLine(text, cls) {
  return new Promise(resolve => {
    const el = document.createElement('div');
    if (cls) el.classList.add(cls);
    el.textContent = text;
    liveLog.appendChild(el);
    setTimeout(resolve, 220);
  });
}

async function runScan(url) {
  scanBtn.disabled = true;
  resultGrid.hidden = true;
  emptyState.hidden = true;
  liveLog.innerHTML = '';

  await logLine(`> scanning target: ${url}`);
  await logLine('> checking keyword patterns...');
  await logLine('> checking URL structure & encoding tricks...');
  await logLine('> evaluating protocol & domain composition...');

  const result = analyzeUrl(url);

  if (result.score >= 60) {
    await logLine('> ALERT: high-risk indicators found.', 'log-bad');
  } else if (result.score >= 25) {
    await logLine('> NOTICE: some risk indicators found.', 'log-warn');
  } else {
    await logLine('> scan complete: no major risk indicators found.');
  }

  renderResult(result);
  scanBtn.disabled = false;
}

function renderResult(result) {
  verdictBadge.className = 'verdict-badge ' + result.verdictClass;
  verdictIcon.textContent = result.icon;
  verdictText.textContent = result.verdict;

  scoreValue.textContent = result.score;
  scoreFill.style.width = result.score + '%';

  confidenceValue.textContent = result.confidence + '%';

  explainList.innerHTML = '';
  result.reasons.forEach(r => {
    const li = document.createElement('li');
    li.textContent = r;
    explainList.appendChild(li);
  });

  resultGrid.hidden = false;
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const url = input.value.trim();
  if (!url) return;
  runScan(url);
});