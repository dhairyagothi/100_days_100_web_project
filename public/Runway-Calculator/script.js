/* ============================================================
   VARIABLES
   ============================================================ */
:root {
  --bg:        #0d0f18;
  --bg2:       #13161f;
  --bg3:       #1a1d2e;
  --surface:   #1e2235;
  --surface2:  #252941;
  --border:    #2e3355;
  --text:      #e2e8f0;
  --text2:     #94a3b8;
  --text3:     #64748b;

  --accent:    #6366f1;
  --accent2:   #818cf8;
  --accent-glow: #6366f130;

  --success:   #22c55e;
  --warning:   #f59e0b;
  --danger:    #ef4444;
  --info:      #38bdf8;

  --safe:      #22c55e;
  --caution:   #f59e0b;
  --critical:  #ef4444;

  --radius:    14px;
  --radius-sm: 8px;
  --radius-lg: 20px;
  --shadow:    0 4px 24px rgba(0,0,0,0.4);
  --shadow-lg: 0 8px 48px rgba(0,0,0,0.6);
  --transition: 0.25s ease;
  --font: 'Inter', system-ui, sans-serif;
}

[data-theme="light"] {
  --bg:      #f0f4ff;
  --bg2:     #e4e9f7;
  --bg3:     #d8dfee;
  --surface: #ffffff;
  --surface2:#f4f6fc;
  --border:  #dde3f0;
  --text:    #1e2235;
  --text2:   #4a5568;
  --text3:   #94a3b8;
  --shadow:  0 4px 24px rgba(0,0,0,0.08);
  --shadow-lg: 0 8px 48px rgba(0,0,0,0.12);
  --accent-glow: #6366f118;
}

/* ============================================================
   RESET
   ============================================================ */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  min-height: 100vh;
  overflow-x: hidden;
  transition: background var(--transition), color var(--transition);
}

/* ============================================================
   BACKGROUND
   ============================================================ */
.bg-animation {
  position: fixed; inset: 0;
  pointer-events: none; z-index: 0; overflow: hidden;
}
.bg-circle {
  position: absolute; border-radius: 50%;
  filter: blur(90px); opacity: 0.13;
  animation: floatBg 20s ease-in-out infinite alternate;
}
.c1 { width: 500px; height: 500px; background: var(--accent);  top: -150px; left: -100px; animation-duration: 22s; }
.c2 { width: 400px; height: 400px; background: var(--success); bottom: -80px; right: -80px; animation-duration: 26s; animation-delay: -6s; }
.c3 { width: 350px; height: 350px; background: var(--warning); top: 45%; left: 42%; animation-duration: 24s; animation-delay: -12s; }
@keyframes floatBg {
  0%   { transform: translate(0,0) scale(1); }
  100% { transform: translate(40px,40px) scale(1.12); }
}

/* ============================================================
   NAVBAR
   ============================================================ */
.navbar {
  position: sticky; top: 0; z-index: 100;
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 32px;
  background: rgba(13,15,24,0.85);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
  transition: background var(--transition);
}
[data-theme="light"] .navbar { background: rgba(240,244,255,0.88); }
.nav-brand {
  display: flex; align-items: center; gap: 10px;
  font-weight: 800; font-size: 1.1rem;
}
.brand-icon { font-size: 1.3rem; }
.nav-actions { display: flex; gap: 10px; }
.btn-icon {
  width: 38px; height: 38px; border-radius: var(--radius-sm);
  border: 1px solid var(--border); background: var(--surface);
  color: var(--text2); cursor: pointer; font-size: 0.9rem;
  display: flex; align-items: center; justify-content: center;
  transition: all var(--transition);
}
.btn-icon:hover { background: var(--accent); color: #fff; border-color: var(--accent); transform: translateY(-2px); }

/* ============================================================
   CONTAINER
   ============================================================ */
.container {
  position: relative; z-index: 1;
  max-width: 1400px; margin: 0 auto;
  padding: 32px 24px 64px;
}

/* ============================================================
   HERO
   ============================================================ */
.hero { text-align: center; margin-bottom: 28px; }
.hero-title {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 800; letter-spacing: -0.02em;
}
.gradient-text {
  background: linear-gradient(135deg, var(--accent), var(--success), var(--warning));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.hero-sub { color: var(--text2); margin-top: 10px; font-size: 1rem; }

/* ============================================================
   HEALTH BANNER
   ============================================================ */
.health-banner {
  display: flex; align-items: center; gap: 16px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 18px 22px;
  margin-bottom: 24px; transition: all var(--transition);
}
.health-banner.safe     { border-color: var(--safe);     background: #22c55e0a; }
.health-banner.caution  { border-color: var(--caution);  background: #f59e0b0a; }
.health-banner.critical { border-color: var(--critical); background: #ef44440a; }

.health-icon { font-size: 1.8rem; flex-shrink: 0; }
.health-info { flex: 1; }
.health-title { font-weight: 700; font-size: 0.95rem; margin-bottom: 3px; }
.health-sub   { font-size: 0.8rem; color: var(--text2); }
.health-runway {
  font-size: 1.8rem; font-weight: 800;
  color: var(--accent); flex-shrink: 0;
}

/* ============================================================
   STATS ROW
   ============================================================ */
.stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px,1fr));
  gap: 16px; margin-bottom: 28px;
}
.stat-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 18px 20px;
  display: flex; align-items: center; gap: 14px;
  transition: transform var(--transition);
}
.stat-card:hover { transform: translateY(-3px); box-shadow: var(--shadow); }
.stat-icon    { font-size: 1.4rem; }
.runway-icon  { color: var(--accent); }
.burn-icon    { color: var(--danger); }
.cash-icon    { color: var(--success); }
.end-icon     { color: var(--warning); }
.stat-value   { font-size: 1.3rem; font-weight: 800; line-height: 1.1; }
.stat-label   { color: var(--text2); font-size: 0.78rem; margin-top: 2px; }

/* ============================================================
   MAIN GRID
   ============================================================ */
.main-grid {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 24px; align-items: start;
}
@media (max-width: 1024px) { .main-grid { grid-template-columns: 1fr; } }

/* ============================================================
   CARD
   ============================================================ */
.card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 22px;
  box-shadow: var(--shadow); margin-bottom: 20px;
}
.card:last-child { margin-bottom: 0; }
.card-header {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 18px; padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
}
.card-header i  { color: var(--accent); font-size: 0.95rem; }
.card-header h2 { font-size: 0.95rem; font-weight: 700; flex: 1; }

/* ============================================================
   FORM
   ============================================================ */
.form-group { margin-bottom: 16px; }
label {
  display: block; font-size: 0.78rem; font-weight: 600;
  color: var(--text2); text-transform: uppercase;
  letter-spacing: 0.05em; margin-bottom: 7px;
}
input[type="number"] {
  width: 100%; padding: 10px 14px;
  background: var(--bg2); border: 1px solid var(--border);
  border-radius: var(--radius-sm); color: var(--text);
  font-family: var(--font); font-size: 0.92rem; outline: none;
  transition: border-color var(--transition), box-shadow var(--transition);
  appearance: none; -moz-appearance: textfield;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; }
input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}

.input-prefix-wrap { position: relative; }
.prefix {
  position: absolute; left: 12px; top: 50%;
  transform: translateY(-50%); color: var(--text3);
  font-size: 0.88rem; font-weight: 600; pointer-events: none;
}
.input-prefix-wrap input { padding-left: 28px; }

/* ============================================================
   EXPENSE LIST
   ============================================================ */
.expense-list { display: flex; flex-direction: column; gap: 14px; margin-bottom: 16px; }
.expense-item { display: flex; align-items: center; gap: 12px; }
.expense-icon {
  width: 38px; height: 38px; border-radius: 10px;
  background: var(--bg3); display: flex; align-items: center;
  justify-content: center; font-size: 1.1rem; flex-shrink: 0;
}
.expense-info { flex: 1; }
.expense-info label { margin-bottom: 5px; }

.total-burn-row {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 14px; background: var(--bg2);
  border: 1px solid var(--border); border-radius: var(--radius-sm);
  font-size: 0.88rem; font-weight: 600; color: var(--text2);
}
.total-burn-val { font-weight: 800; color: var(--danger); font-size: 1rem; }

/* ============================================================
   HEADCOUNT & FUNDING
   ============================================================ */
.headcount-result {
  margin-top: 4px; padding: 12px 14px;
  background: var(--bg2); border: 1px solid var(--border);
  border-radius: var(--radius-sm); font-size: 0.85rem;
  color: var(--text2); line-height: 1.6;
}
.headcount-result strong { color: var(--danger); }

.funding-result { display: flex; flex-direction: column; gap: 10px; }
.fr-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 14px; background: var(--bg2);
  border: 1px solid var(--border); border-radius: var(--radius-sm);
  font-size: 0.85rem; color: var(--text2);
}
.fr-item strong { color: var(--accent); font-size: 0.95rem; font-weight: 800; }

/* ============================================================
   SCENARIO CARD
   ============================================================ */
.scenario-tabs {
  display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap;
}
.scenario-tab {
  flex: 1; padding: 9px 8px; border-radius: var(--radius-sm);
  border: 1px solid var(--border); background: var(--bg2);
  color: var(--text2); font-size: 0.8rem; font-weight: 600;
  cursor: pointer; text-align: center; min-width: 90px;
  transition: all var(--transition);
}
.scenario-tab:hover { border-color: var(--accent); color: var(--accent); }
.scenario-tab.active { background: var(--accent); border-color: var(--accent); color: #fff; }

.scenario-desc {
  font-size: 0.82rem; color: var(--text2); margin-bottom: 16px;
  padding: 10px 12px; background: var(--bg2);
  border: 1px solid var(--border); border-radius: var(--radius-sm);
}

.scenario-compare { display: flex; gap: 10px; }
.sc-item {
  flex: 1; padding: 14px 10px; border-radius: var(--radius-sm);
  border: 1px solid var(--border); text-align: center;
  transition: all var(--transition);
}
.sc-label { font-size: 0.72rem; color: var(--text2); margin-bottom: 6px; font-weight: 600; }
.sc-val   { font-size: 1.2rem; font-weight: 800; }
.realistic-sc  { border-color: var(--accent);  }
.realistic-sc  .sc-val { color: var(--accent); }
.optimistic-sc { border-color: var(--success); background: #22c55e08; }
.optimistic-sc .sc-val { color: var(--success); }
.pessimistic-sc{ border-color: var(--danger);  background: #ef444408; }
.pessimistic-sc .sc-val { color: var(--danger); }

/* ============================================================
   CHART
   ============================================================ */
.chart-scenario-label {
  font-size: 0.75rem; font-weight: 700;
  background: var(--accent-glow); color: var(--accent2);
  padding: 2px 10px; border-radius: 99px;
  border: 1px solid var(--accent);
}
.chart-wrap { position: relative; min-height: 220px; }
canvas { width: 100% !important; }
.chart-empty {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 10px; color: var(--text3); font-size: 0.88rem;
}
.chart-empty i { font-size: 2rem; }
.chart-empty.hidden { display: none; }

/* ============================================================
   EXPENSE BREAKDOWN
   ============================================================ */
.expense-breakdown { display: flex; flex-direction: column; gap: 12px; }
.eb-row { display: flex; align-items: center; gap: 10px; }
.eb-icon  { font-size: 1rem; flex-shrink: 0; width: 22px; text-align: center; }
.eb-name  { min-width: 120px; font-size: 0.8rem; color: var(--text2); }
.eb-bar-wrap { flex: 1; background: var(--bg3); border-radius: 99px; height: 7px; overflow: hidden; }
.eb-bar   { height: 100%; border-radius: 99px; transition: width 0.8s ease; }
.eb-amount{ font-size: 0.78rem; font-weight: 700; color: var(--text2); min-width: 70px; text-align: right; }
.eb-pct   { font-size: 0.72rem; color: var(--text3); min-width: 36px; text-align: right; }
.eb-empty { color: var(--text3); font-size: 0.85rem; text-align: center; padding: 16px 0; }

/* ============================================================
   TABLE
   ============================================================ */
.table-wrap { overflow-x: auto; }
table {
  width: 100%; border-collapse: collapse; font-size: 0.82rem;
}
thead th {
  padding: 10px 12px; text-align: left;
  background: var(--bg2); color: var(--text2);
  font-weight: 700; font-size: 0.75rem;
  text-transform: uppercase; letter-spacing: 0.05em;
  border-bottom: 1px solid var(--border);
}
tbody td {
  padding: 10px 12px; border-bottom: 1px solid var(--border);
  color: var(--text2); vertical-align: middle;
}
tbody tr:last-child td { border-bottom: none; }
tbody tr:hover td { background: var(--bg2); }
tbody tr.danger-row td { background: #ef444408; }
tbody tr.danger-row td:first-child { color: var(--danger); font-weight: 700; }
.table-empty { text-align: center; color: var(--text3); padding: 28px; }
.positive { color: var(--success); font-weight: 700; }
.negative { color: var(--danger);  font-weight: 700; }
.neutral  { color: var(--warning); font-weight: 700; }

/* ============================================================
   TOAST
   ============================================================ */
.toast {
  position: fixed; bottom: 28px; right: 28px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 14px 20px;
  display: flex; align-items: center; gap: 10px;
  font-size: 0.88rem; font-weight: 600;
  box-shadow: var(--shadow-lg); z-index: 2000;
  transform: translateY(80px); opacity: 0;
  transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
}
.toast.show    { transform: translateY(0); opacity: 1; }
.toast.success .toast-icon { color: var(--success); }
.toast.error   .toast-icon { color: var(--danger);  }
.toast.info    .toast-icon { color: var(--accent);  }

/* ============================================================
   SCROLLBAR
   ============================================================ */
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: var(--accent); }

/* ============================================================
   RESPONSIVE
   ============================================================ */
@media (max-width: 768px) {
  .container  { padding: 20px 14px 48px; }
  .navbar     { padding: 12px 16px; }
  .stats-row  { grid-template-columns: 1fr 1fr; gap: 12px; }
  .card       { padding: 18px 16px; }
  .scenario-compare { flex-direction: column; }
  .health-runway    { display: none; }
}
@media (max-width: 480px) {
  .stats-row  { grid-template-columns: 1fr 1fr; }
  .hero-title { font-size: 1.6rem; }
}