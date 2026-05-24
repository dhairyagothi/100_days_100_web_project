'use strict';

// ─── DOM Refs ─────────────────────────────────────────────
const ipInput       = document.getElementById('ipInput');
const searchBtn     = document.getElementById('searchBtn');
const errorMsg      = document.getElementById('errorMsg');
const results       = document.getElementById('results');
const loader        = document.getElementById('loader');

const ipValue       = document.getElementById('ipValue');
const ipType        = document.getElementById('ipType');
const locationEl    = document.getElementById('location');
const regionEl      = document.getElementById('region');
const timezoneEl    = document.getElementById('timezone');
const localTimeEl   = document.getElementById('localTime');
const ispEl         = document.getElementById('isp');
const orgEl         = document.getElementById('org');
const latEl         = document.getElementById('lat');
const lonEl         = document.getElementById('lon');
const postalEl      = document.getElementById('postal');
const countryCodeEl = document.getElementById('countryCode');
const asnEl         = document.getElementById('asn');
const mobileEl      = document.getElementById('mobile');
const proxyEl       = document.getElementById('proxy');
const mapFrame      = document.getElementById('mapFrame');
const mapCoords     = document.getElementById('mapCoords');

document.querySelectorAll('.info-card').forEach((card, i) => {
  card.style.setProperty('--index', i);
});

// ─── Helpers ──────────────────────────────────────────────
function setError(msg) { errorMsg.textContent = msg; }
function clearError()  { errorMsg.textContent = ''; }

function isValidIP(str) {
  const ipv4 = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6  = /^[0-9a-fA-F:]+$/;
  if (ipv4.test(str)) return str.split('.').every(n => +n >= 0 && +n <= 255);
  return ipv6.test(str) && str.includes(':');
}

function isValidDomain(str) {
  return /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/.test(str);
}

function getLocalTime(tz) {
  try {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: tz,
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
  } catch { return 'N/A'; }
}

function detectIPVersion(ip) {
  if (!ip) return '';
  if (ip.includes(':')) return 'IPv6';
  if (/^\d+\.\d+\.\d+\.\d+$/.test(ip)) return 'IPv4';
  return '';
}

function updateMap(latitude, longitude) {
  const d = 0.3;
  mapFrame.src = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - d},${latitude - d},${longitude + d},${latitude + d}&layer=mapnik&marker=${latitude},${longitude}`;
  mapCoords.textContent = `${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°`;
}

// ─── Step 1: Resolve domain → IP via Google DNS over HTTPS ─
async function resolveDomain(domain) {
  const res  = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`);
  if (!res.ok) throw new Error('DNS lookup failed.');
  const data = await res.json();
  // Status 0 = NOERROR
  if (data.Status !== 0 || !data.Answer?.length) {
    throw new Error(`Could not resolve domain: ${domain}`);
  }
  // Pick first A record
  const record = data.Answer.find(r => r.type === 1);
  if (!record) throw new Error(`No A record found for: ${domain}`);
  return record.data; // returns the IP string
}

// ─── Step 2: Lookup IP via ipinfo.io ──────────────────────
async function fetchIPData(query = '') {
  clearError();
  loader.classList.add('active');
  results.classList.remove('visible');

  try {
    let ip = query;

    // If it's a domain, resolve it to an IP first
    if (query && !isValidIP(query) && isValidDomain(query)) {
      ipType.textContent = `Resolving ${query}…`;
      ip = await resolveDomain(query);
    }

    const url = ip
      ? `https://ipinfo.io/${encodeURIComponent(ip)}/json`
      : `https://ipinfo.io/json`;

    const res  = await fetch(url);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const data = await res.json();

    if (data.bogon) throw new Error('Private / reserved IP address.');
    if (data.error) throw new Error(data.error.message || 'Lookup failed.');

    // Attach the original domain as hostname if searched by domain
    if (query && isValidDomain(query)) data.hostname = query;

    renderData(data);

  } catch (err) {
    setError(err.message || 'Failed to fetch. Please try again.');
  } finally {
    loader.classList.remove('active');
  }
}

// ─── Render ───────────────────────────────────────────────
let tickInterval = null;

function renderData(d) {
  ipValue.textContent = d.ip || '—';
  ipType.textContent  = detectIPVersion(d.ip || '');

  locationEl.textContent = [d.city, d.country].filter(Boolean).join(', ') || '—';
  regionEl.textContent   = d.region || '—';

  const tz = d.timezone || '';
  timezoneEl.textContent  = tz || '—';
  localTimeEl.textContent = tz ? `Local: ${getLocalTime(tz)}` : '—';

  if (tickInterval) clearInterval(tickInterval);
  if (tz) {
    tickInterval = setInterval(() => {
      localTimeEl.textContent = `Local: ${getLocalTime(tz)}`;
    }, 1000);
  }

  const orgRaw   = d.org || '';
  const asnMatch = orgRaw.match(/^(AS\d+)\s*(.*)/);
  ispEl.textContent = asnMatch ? asnMatch[2] || orgRaw : orgRaw || '—';
  orgEl.textContent = d.hostname || '—';

  const [latStr, lonStr] = (d.loc || ',').split(',');
  const latNum = parseFloat(latStr);
  const lonNum = parseFloat(lonStr);
  latEl.textContent = !isNaN(latNum) ? `${latNum.toFixed(5)}° N` : '—';
  lonEl.textContent = !isNaN(lonNum) ? `${lonNum.toFixed(5)}° E` : '—';

  postalEl.textContent      = d.postal  || '—';
  countryCodeEl.textContent = d.country || '—';
  asnEl.textContent         = asnMatch  ? asnMatch[1] : '—';
  mobileEl.textContent      = '— N/A';
  proxyEl.textContent       = '— N/A';
  mobileEl.style.color      = 'var(--muted)';
  proxyEl.style.color       = 'var(--muted)';

  if (!isNaN(latNum) && !isNaN(lonNum)) updateMap(latNum, lonNum);

  results.classList.add('visible');
}

// ─── Events ───────────────────────────────────────────────
searchBtn.addEventListener('click', handleSearch);
ipInput.addEventListener('keydown', e => { if (e.key === 'Enter') handleSearch(); });

function handleSearch() {
  const val = ipInput.value.trim();
  if (!val) { fetchIPData(''); return; }
  if (!isValidIP(val) && !isValidDomain(val)) {
    setError('Enter a valid IPv4 / IPv6 address or domain name.');
    return;
  }
  fetchIPData(val);
}

// ─── Boot ─────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => fetchIPData(''));