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

// ─── Fetch — ipinfo.io (HTTPS ✓, free ✓, no key needed) ──
async function fetchIPData(query = '') {
  clearError();
  loader.classList.add('active');
  results.classList.remove('visible');

  // ipinfo.io: own IP → /json, specific IP → /{ip}/json
  const url = query
    ? `https://ipinfo.io/${encodeURIComponent(query)}/json`
    : `https://ipinfo.io/json`;

  try {
    const res  = await fetch(url);
    if (!res.ok) throw new Error(`Server returned ${res.status}`);
    const data = await res.json();

    // ipinfo returns { bogon: true } for private/reserved IPs
    if (data.bogon) throw new Error('Private / reserved IP address.');
    if (data.error) throw new Error(data.error.message || 'Lookup failed.');

    renderData(data);
  } catch (err) {
    setError(err.message || 'Failed to fetch. Please try again.');
  } finally {
    loader.classList.remove('active');
  }
}

// ─── Render ───────────────────────────────────────────────
// ipinfo response shape:
// { ip, city, region, country, loc:"lat,lon", org:"AS#### Name", postal, timezone, hostname }
let tickInterval = null;

function renderData(d) {
  // IP & version
  ipValue.textContent = d.ip || '—';
  ipType.textContent  = detectIPVersion(d.ip || '');

  // Location — ipinfo uses country code (US, IN…), show as-is
  locationEl.textContent = [d.city, d.country].filter(Boolean).join(', ') || '—';
  regionEl.textContent   = d.region || '—';

  // Timezone + live clock
  const tz = d.timezone || '';
  timezoneEl.textContent  = tz || '—';
  localTimeEl.textContent = tz ? `Local: ${getLocalTime(tz)}` : '—';

  if (tickInterval) clearInterval(tickInterval);
  if (tz) {
    tickInterval = setInterval(() => {
      localTimeEl.textContent = `Local: ${getLocalTime(tz)}`;
    }, 1000);
  }

  // org field = "AS15169 Google LLC"
  const orgRaw  = d.org || '';
  const asnMatch = orgRaw.match(/^(AS\d+)\s*(.*)/);
  ispEl.textContent = asnMatch ? asnMatch[2] || orgRaw : orgRaw || '—';
  orgEl.textContent = d.hostname || '—';

  // Coordinates — loc = "37.4056,-122.0775"
  const [latStr, lonStr] = (d.loc || ',').split(',');
  const latNum = parseFloat(latStr);
  const lonNum = parseFloat(lonStr);
  latEl.textContent = !isNaN(latNum) ? `${latNum.toFixed(5)}° N` : '—';
  lonEl.textContent = !isNaN(lonNum) ? `${lonNum.toFixed(5)}° E` : '—';

  // Extra strip
  postalEl.textContent      = d.postal   || '—';
  countryCodeEl.textContent = d.country  || '—';
  asnEl.textContent         = asnMatch   ? asnMatch[1] : '—';
  mobileEl.textContent      = '— N/A';
  proxyEl.textContent       = '— N/A';
  mobileEl.style.color      = 'var(--muted)';
  proxyEl.style.color       = 'var(--muted)';

  // Map
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