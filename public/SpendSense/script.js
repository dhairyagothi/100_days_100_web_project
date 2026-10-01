// ── State ──
  let transactions = JSON.parse(localStorage.getItem('spendsense_txs') || '[]');
  let currentType = 'income';
  let currentFilter = 'all';
  // Theme Toggle
const savedTheme = localStorage.getItem('spendsense_theme') || 'dark';

if (savedTheme === 'light') {
  document.body.classList.add('light-theme');
}

function toggleTheme() {
  document.body.classList.toggle('light-theme');

  const isLight = document.body.classList.contains('light-theme');

  localStorage.setItem(
    'spendsense_theme',
    isLight ? 'light' : 'dark'
  );

  document.getElementById('themeToggle').textContent =
    isLight ? '☀️' : '🌙';
}

  const CAT_ICONS = {
    salary:'💼', food:'🍔', transport:'🚗',
    shopping:'🛍️', bills:'💡', health:'❤️', other:'📦'
  };
  const CAT_COLORS = {
    salary:'#6affcb', food:'#ffb86a', transport:'#6aaaff',
    shopping:'#ff6a9b', bills:'#7c6aff', health:'#ff9a6a', other:'#8c8ca0'
  };

  // ── Init ──
  function init() {
    const now = new Date();
    document.getElementById('todayDate').textContent = now.toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
    document.getElementById('todayDay').textContent = now.toLocaleDateString('en-IN',{weekday:'long'});
    document.getElementById('dateInput').value = now.toISOString().split('T')[0];
    const toggleBtn = document.getElementById('themeToggle');

toggleBtn.textContent =
  document.body.classList.contains('light-theme')
    ? '☀️'
    : '🌙';

toggleBtn.addEventListener('click', toggleTheme);
    render();
  }

  // ── Type Toggle ──
  function setType(t) {
    currentType = t;
    document.getElementById('incomeBtn').classList.toggle('active', t==='income');
    document.getElementById('expenseBtn').classList.toggle('active', t==='expense');
    const cat = document.getElementById('catInput');
    if(t==='income') {
      cat.value = 'salary';
    } else {
      if(cat.value==='salary') cat.value = 'food';
    }
  }

  function setFilter(f, el) {
    currentFilter = f;
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    el.classList.add('active');
    renderList();
  }

  // ── Add ──
  function addTransaction() {
    const desc   = document.getElementById('descInput').value.trim();
    const amount = parseFloat(document.getElementById('amountInput').value);
    const cat    = document.getElementById('catInput').value;
    const date   = document.getElementById('dateInput').value;

    if(!desc)   return showToast('⚠️ Please enter a description', 'error');
    if(!amount || amount<=0) return showToast('⚠️ Please enter a valid amount', 'error');

    transactions.unshift({ id: Date.now(), desc, amount, cat, date, type: currentType });
    save();
    render();

    document.getElementById('descInput').value = '';
    document.getElementById('amountInput').value = '';
    showToast('✅ Transaction added!', 'success');
  }

  function deleteTransaction(id) {
    transactions = transactions.filter(t=>t.id!==id);
    save();
    render();
    showToast('🗑 Deleted', '');
  }

  function clearAll() {
    if(!transactions.length) return;
    if(confirm('Clear all transactions?')) {
      transactions = [];
      save();
      render();
      showToast('🗑 All cleared', '');
    }
  }

  function save() {
    localStorage.setItem('spendsense_txs', JSON.stringify(transactions));
  }

  // ── Render ──
  function render() {
    renderSummary();
    renderList();
    renderBarChart();
    renderDonut();
    renderStats();
  }

  function renderSummary() {
    const income  = transactions.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
    const expense = transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
    const bal     = income - expense;
    document.getElementById('totalIncome').textContent  = fmt(income);
    document.getElementById('totalExpense').textContent = fmt(expense);
    const el = document.getElementById('netBalance');
    el.textContent = fmt(Math.abs(bal));
    el.style.color = bal>=0 ? 'var(--accent3)' : 'var(--accent2)';
    if(bal<0) el.textContent = '−' + el.textContent;
  }

  function renderList() {
    const list = document.getElementById('txList');
    const filtered = currentFilter==='all' ? transactions : transactions.filter(t=>t.type===currentFilter);
    if(!filtered.length) {
      list.innerHTML = '<div class="empty-state"><div>💸</div>No transactions yet</div>';
      return;
    }
    list.innerHTML = filtered.map(t=>`
      <div class="tx-item">
        <div class="tx-icon ${t.type} cat-${t.cat}">${CAT_ICONS[t.cat]||'📦'}</div>
        <div class="tx-info">
          <div class="tx-name">${esc(t.desc)}</div>
          <div class="tx-meta">${t.cat} · ${fmtDate(t.date)}</div>
        </div>
        <div class="tx-amount ${t.type}">${t.type==='income'?'+':'−'}${fmt(t.amount)}</div>
        <button class="tx-del" onclick="deleteTransaction(${t.id})" title="Delete" aria-label="Delete transaction: ${esc(t.desc)}">✕</button>
      </div>
    `).join('');
  }

  function renderBarChart() {
    const chart = document.getElementById('barChart');
    const months = getLast6Months();
    const maxVal = Math.max(...months.flatMap(m=>[m.income,m.expense]),1);

    chart.innerHTML = months.map(m=>{
      const ih = Math.max((m.income /maxVal)*80,m.income>0?3:0);
      const eh = Math.max((m.expense/maxVal)*80,m.expense>0?3:0);
      return `
        <div class="bar-col" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:.2rem;">
          <div style="display:flex;gap:2px;align-items:flex-end;height:82px;">
            <div class="bar income-bar" style="width:12px;height:${ih}px;" title="Income: ${fmt(m.income)}"></div>
            <div class="bar expense-bar" style="width:12px;height:${eh}px;" title="Expense: ${fmt(m.expense)}"></div>
          </div>
          <div class="bar-label">${m.label}</div>
        </div>`;
    }).join('');
  }

  function renderDonut() {
    const expenses = transactions.filter(t=>t.type==='expense');
    const total = expenses.reduce((s,t)=>s+t.amount,0);
    const svg = document.getElementById('donutSvg');
    const legend = document.getElementById('donutLegend');

    if(!total) {
      svg.innerHTML = '<circle cx="60" cy="60" r="48" fill="none" stroke="var(--border)" stroke-width="18"/>';
      legend.innerHTML = '<div style="color:var(--muted);font-size:.75rem;">No expenses yet</div>';
      return;
    }

    const cats = {};
    expenses.forEach(t=>{ cats[t.cat]=(cats[t.cat]||0)+t.amount; });
    const sorted = Object.entries(cats).sort((a,b)=>b[1]-a[1]);

    const r=48, cx=60, cy=60, circ=2*Math.PI*r;
    let offset=0;
    let circles = '<circle cx="60" cy="60" r="48" fill="none" stroke="var(--border)" stroke-width="18"/>';
    sorted.forEach(([cat,val])=>{
      const pct=val/total;
      const dash=pct*circ;
      const gap=circ-dash;
      circles+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${CAT_COLORS[cat]||'#888'}"
        stroke-width="18" stroke-dasharray="${dash} ${gap}"
        stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})"/>`;
      offset+=dash;
    });
    svg.innerHTML=circles;

    legend.innerHTML=sorted.slice(0,5).map(([cat,val])=>`
      <div class="legend-item">
        <div class="legend-dot" style="background:${CAT_COLORS[cat]||'#888'}"></div>
        <span style="color:var(--muted)">${CAT_ICONS[cat]} ${cat}</span>
        <span style="margin-left:auto;font-weight:600">${fmt(val)}</span>
      </div>`).join('');
  }

  function renderStats() {
    const exp = transactions.filter(t=>t.type==='expense');
    const inc = transactions.filter(t=>t.type==='income');
    const totalExp = exp.reduce((s,t)=>s+t.amount,0);
    const totalInc = inc.reduce((s,t)=>s+t.amount,0);
    const biggest = exp.length ? Math.max(...exp.map(t=>t.amount)) : 0;
    const avg = exp.length ? totalExp/exp.length : 0;
    const savings = totalInc ? Math.max(0,((totalInc-totalExp)/totalInc*100)) : 0;

    document.getElementById('biggestExpense').textContent = fmt(biggest);
    document.getElementById('avgExpense').textContent     = fmt(avg);
    document.getElementById('totalEntries').textContent   = transactions.length;
    document.getElementById('savingsRate').textContent    = savings.toFixed(0)+'%';
  }

  // ── Helpers ──
  function getLast6Months() {
    const months=[];
    for(let i=5;i>=0;i--) {
      const d=new Date(); d.setMonth(d.getMonth()-i);
      const key=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
      const label=d.toLocaleDateString('en',{month:'short'});
      const income=transactions.filter(t=>t.type==='income'&&t.date.startsWith(key)).reduce((s,t)=>s+t.amount,0);
      const expense=transactions.filter(t=>t.type==='expense'&&t.date.startsWith(key)).reduce((s,t)=>s+t.amount,0);
      months.push({label,income,expense});
    }
    return months;
  }

  function fmt(n) { return '₹'+Number(n).toLocaleString('en-IN',{minimumFractionDigits:0,maximumFractionDigits:0}); }
  function fmtDate(d) { return new Date(d+'T00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short'}); }
  function esc(s) { return s.replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c])); }

  let toastTimer;
  function showToast(msg, type) {
    const t=document.getElementById('toast');
    t.textContent=msg;
    t.className='toast show '+(type||'');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(()=>t.className='toast',2500);
  }

  init();