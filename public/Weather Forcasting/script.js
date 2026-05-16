/* ============================================================
   WEATHERNOW – script.js (Redesigned)
   ============================================================ */

'use strict';

/* ── API Config ── */
const API_OPTIONS = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '2c06e2f780msh3f81c0245629ba6p19a960jsn5eff9cb95a57',
    'X-RapidAPI-Host': 'weather-by-api-ninjas.p.rapidapi.com',
  },
};

/* ── DOM refs ── */
const $  = (id) => document.getElementById(id);

const cityNameEl   = $('cityName');
const emptyState   = $('emptyState');
const errorState   = $('errorState');
const loadingState = $('loadingState');
const weatherResult = $('weatherResult');

/* ── Navbar hamburger ── */
const hamburger = $('hamburger');
const mobileNav = $('mobileNav');

hamburger.addEventListener('click', () => {
  const open = hamburger.classList.toggle('open');
  mobileNav.classList.toggle('open', open);
  mobileNav.setAttribute('aria-hidden', !open);
  hamburger.setAttribute('aria-expanded', open);
});

/* ── Search handlers ── */
function handleSearch(e) {
  e.preventDefault();
  const input = e.target.querySelector('input[type="search"]');
  const city  = input.value.trim();
  if (!city) return;
  getWeather(city);
}

// Desktop submit button (old id="submit" kept for backward compat)
const submitBtn = $('submit');
if (submitBtn) {
  submitBtn.closest('form')?.addEventListener('submit', handleSearch);
}

/* ── State helpers ── */
function showState(state) {
  [emptyState, errorState, loadingState, weatherResult].forEach(el => {
    if (!el) return;
    el.hidden = true;
    el.removeAttribute('style');
  });
  if (state) state.hidden = false;
}

/* ── Format unix timestamp to HH:MM AM/PM ── */
function formatTime(unix) {
  if (!unix || isNaN(unix)) return '–';
  const d = new Date(unix * 1000);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

/* ── Fetch & display weather ── */
function getWeather(city) {
  showState(loadingState);

  fetch('https://weather-by-api-ninjas.p.rapidapi.com/v1/weather?city=' + encodeURIComponent(city), API_OPTIONS)
    .then(res => {
      if (!res.ok) throw new Error('Network error');
      return res.json();
    })
    .then(data => {
      if (!data || Object.keys(data).length === 0) throw new Error('No data');
      renderWeather(city, data);
    })
    .catch(err => {
      console.error(err);
      showState(errorState);
    });
}

function renderWeather(city, d) {
  // City name
  cityNameEl.textContent = city.charAt(0).toUpperCase() + city.slice(1);

  // Temperature card
  setText('temp',     d.temp     !== undefined ? d.temp + ' °C'     : '–');
  setText('temp2',    d.temp     !== undefined ? d.temp              : '–');
  setText('min_temp', d.min_temp !== undefined ? d.min_temp + ' °C' : '–');
  setText('max_temp', d.max_temp !== undefined ? d.max_temp + ' °C' : '–');

  // Humidity card
  setText('humidity',     d.humidity     !== undefined ? d.humidity + ' %'    : '–');
  setText('humidity2',    d.humidity     !== undefined ? d.humidity             : '–');
  setText('feels_like',   d.feels_like   !== undefined ? d.feels_like + ' °C' : '–');
  setText('wind_degrees', d.wind_degrees !== undefined ? d.wind_degrees + '°'  : '–');

  // Wind & Sun card
  setText('wind_speed',  d.wind_speed !== undefined ? d.wind_speed + ' km/h' : '–');
  setText('wind_speed2', d.wind_speed !== undefined ? d.wind_speed             : '–');
  setText('sunrise',     formatTime(d.sunrise));
  setText('sunset',      formatTime(d.sunset));

  showState(weatherResult);

  // Scroll results into view gently
  weatherResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function setText(id, val) {
  const el = $(id);
  if (el) el.textContent = val;
}
