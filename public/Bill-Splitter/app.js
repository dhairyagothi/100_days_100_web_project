/* ================================
   SplitWise Pro — app.js
   Features: Equal/Unequal/Items split,
   Tip, Dark Mode, Named Participants,
   Settlement Logic, History, PDF, QR
================================ */

const $ = id => document.getElementById(id);
const CURRENCY = '₹';

/* ============================================================
   DARK MODE
============================================================ */
const darkToggle = $('darkModeToggle');
const applyTheme = (dark) => {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  localStorage.setItem('swp-dark', dark ? '1' : '0');
};
const isDark = () => localStorage.getItem('swp-dark') === '1';
applyTheme(isDark());
darkToggle.addEventListener('click', () => applyTheme(!isDark()));

/* ============================================================
   TAB SWITCHING
============================================================ */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(tc => tc.classList.remove('active'));
    tab.classList.add('active');
    $('tab-' + tab.dataset.tab).classList.add('active');
  });
});

/* ============================================================
   TIP PRESET BUTTONS (scoped per tab)
============================================================ */
document.querySelectorAll('.tip-presets').forEach(group => {
  const tipInput = group.previousElementSibling?.querySelector('input[type="number"]') ||
                   group.closest('.card').querySelector('[id$="-tip"]');
  group.querySelectorAll('.tip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      group.querySelectorAll('.tip-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (tipInput) tipInput.value = btn.dataset.tip;
    });
  });
});

/* helper: sync tip preset active state when input typed manually */
document.querySelectorAll('[id$="-tip"]').forEach(tipInput => {
  tipInput.addEventListener('input', () => {
    const parent = tipInput.closest('.card');
    if (!parent) return;
    parent.querySelectorAll('.tip-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tip == tipInput.value);
    });
  });
});

/* ============================================================
   PARTICIPANT HELPERS
============================================================ */
function addParticipantTag(container, name = '') {
  const div = document.createElement('div');
  div.className = 'participant-tag';
  div.innerHTML = `<input type="text" placeholder="Name" value="${name}" /><button class="remove-p">×</button>`;
  div.querySelector('.remove-p').addEventListener('click', () => div.remove());
  container.appendChild(div);
}

function addParticipantRow(container, name = '') {
  const div = document.createElement('div');
  div.className = 'participant-row';
  div.innerHTML = `
    <input type="text" placeholder="Name" value="${name}" class="p-name" />
    <div class="input-prefix sm"><span>${CURRENCY}</span><input type="number" placeholder="0.00" class="p-amount" min="0" step="0.01" /></div>
    <button class="remove-p">×</button>`;
  div.querySelector('.remove-p').addEventListener('click', () => div.remove());
  container.appendChild(div);
  updateUqRemain();
}

function getParticipantNames(container, selector = 'input[type="text"]') {
  return [...container.querySelectorAll(selector)].map(i => i.value.trim() || 'Person').filter(Boolean);
}

/* Wire existing remove buttons */
document.querySelectorAll('.remove-p').forEach(btn => {
  btn.addEventListener('click', () => btn.closest('.participant-tag, .participant-row')?.remove());
});

$('eq-add-p').addEventListener('click', () => addParticipantTag($('eq-participants')));
$('uq-add-p').addEventListener('click', () => {
  addParticipantRow($('uq-participants'));
  refreshItemSharers();
});
$('it-add-p').addEventListener('click', () => {
  addParticipantTag($('it-participants'));
  refreshItemSharers();
});

/* ============================================================
   EQUAL SPLIT
============================================================ */
$('eq-calc').addEventListener('click', () => {
  const bill = parseFloat($('eq-bill').value) || 0;
  const tipPct = parseFloat($('eq-tip').value) || 0;
  const names = getParticipantNames($('eq-participants'));
  if (!bill || !names.length) return alert('Please enter a bill amount and at least one participant.');

  const tip = bill * tipPct / 100;
  const total = bill + tip;
  const per = total / names.length;

  $('eq-subtotal').textContent = fmt(bill);
  $('eq-tip-amt').textContent = fmt(tip);
  $('eq-total').textContent = fmt(total);
  $('eq-per-person').textContent = fmt(per);

  const bd = $('eq-breakdown');
  bd.innerHTML = '';
  names.forEach(name => {
    const d = document.createElement('div');
    d.className = 'breakdown-item';
    d.innerHTML = `<span class="breakdown-name">${name}</span><span class="breakdown-amt">${fmt(per)}</span>`;
    bd.appendChild(d);
  });

  $('eq-results').style.display = 'block';
  $('eq-results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  // Store for save/export
  window._eqResult = { type: 'Equal Split', bill, tip, total, per, names, tipPct };
});

/* ============================================================
   UNEQUAL SPLIT + SETTLEMENT LOGIC
============================================================ */
function updateUqRemain() {
  const bill = parseFloat($('uq-bill').value) || 0;
  const tipPct = parseFloat($('uq-tip').value) || 0;
  const total = bill + bill * tipPct / 100;
  const entered = [...$('uq-participants').querySelectorAll('.p-amount')]
    .reduce((s, i) => s + (parseFloat(i.value) || 0), 0);
  const remain = total - entered;
  const info = $('uq-settle-info');
  if (total > 0) {
    info.style.display = 'block';
    $('uq-remain-label').textContent = remain > 0.005
      ? `⚠️ Unassigned: ${fmt(remain)} remaining`
      : remain < -0.005
      ? `⚠️ Over by ${fmt(Math.abs(remain))}`
      : `✅ Fully assigned`;
  } else {
    info.style.display = 'none';
  }
}

$('uq-bill').addEventListener('input', updateUqRemain);
$('uq-tip').addEventListener('input', updateUqRemain);
$('uq-participants').addEventListener('input', updateUqRemain);

$('uq-calc').addEventListener('click', () => {
  const bill = parseFloat($('uq-bill').value) || 0;
  const tipPct = parseFloat($('uq-tip').value) || 0;
  const total = bill + bill * tipPct / 100;
  if (!bill) return alert('Please enter a bill amount.');

  const rows = [...$('uq-participants').querySelectorAll('.participant-row')];
  if (!rows.length) return alert('Add at least one participant.');

  const participants = rows.map(r => ({
    name: r.querySelector('.p-name')?.value.trim() || 'Person',
    paid: parseFloat(r.querySelector('.p-amount')?.value) || 0
  }));

  // Tip proportional to what each owes
  const sumPaid = participants.reduce((s, p) => s + p.paid, 0);
  const people = participants.map(p => ({
    name: p.name,
    owes: sumPaid > 0 ? (p.paid / sumPaid) * total : total / participants.length
  }));

  // Settlement: simplify debts
  const settlements = settleDebts(people.map(p => ({ name: p.name, balance: p.paid - p.owes })));

  const sl = $('uq-settlement');
  sl.innerHTML = '';
  if (settlements.length === 0) {
    sl.innerHTML = `<div class="breakdown-item"><span>Everyone is square! ✅</span></div>`;
  } else {
    settlements.forEach(s => {
      const d = document.createElement('div');
      d.className = 'settle-row';
      d.innerHTML = `
        <span class="settle-from">${s.from}</span>
        <span class="settle-arrow">pays →</span>
        <span class="settle-to">${s.to}</span>
        <span class="settle-amt">${fmt(s.amount)}</span>`;
      sl.appendChild(d);
    });
  }

  $('uq-results').style.display = 'block';
  $('uq-results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  window._uqResult = { type: 'Custom Split', bill, tipPct, total, settlements, people };
});

/* ============================================================
   SETTLEMENT ALGORITHM (simplify debts)
============================================================ */
function settleDebts(balances) {
  const creditors = [], debtors = [];
  balances.forEach(b => {
    if (b.balance > 0.005) creditors.push({ ...b });
    else if (b.balance < -0.005) debtors.push({ ...b, balance: Math.abs(b.balance) });
  });
  const txns = [];
  while (creditors.length && debtors.length) {
    const c = creditors[0], d = debtors[0];
    const amount = Math.min(c.balance, d.balance);
    txns.push({ from: d.name, to: c.name, amount: +amount.toFixed(2) });
    c.balance -= amount;
    d.balance -= amount;
    if (c.balance < 0.005) creditors.shift();
    if (d.balance < 0.005) debtors.shift();
  }
  return txns;
}

/* ============================================================
   ITEMS SPLIT
============================================================ */
function getItParticipants() {
  return [...$('it-participants').querySelectorAll('input[type="text"]')]
    .map(i => i.value.trim() || 'Person');
}

function addItem() {
  const names = getItParticipants();
  const div = document.createElement('div');
  div.className = 'item-row';
  const sharers = names.map(n => `
    <label class="sharer-check">
      <input type="checkbox" checked data-name="${n}" />
      ${n}
    </label>`).join('');

  div.innerHTML = `
    <div class="item-row-header">
      <input type="text" placeholder="Item name" class="item-name" />
      <div class="input-prefix sm"><span>${CURRENCY}</span><input type="number" placeholder="0.00" class="item-price" min="0" step="0.01" /></div>
      <button class="remove-p">×</button>
    </div>
    <div class="item-sharers">${sharers}</div>`;

  div.querySelector('.remove-p').addEventListener('click', () => div.remove());
  div.querySelectorAll('.sharer-check').forEach(lbl => {
    lbl.classList.add('checked');
    lbl.querySelector('input').addEventListener('change', (e) => {
      lbl.classList.toggle('checked', e.target.checked);
    });
  });

  $('it-items').appendChild(div);
}

function refreshItemSharers() {
  // When participants change, rebuild all item sharer lists
  const names = getItParticipants();
  $('it-items').querySelectorAll('.item-row').forEach(row => {
    const existing = {};
    row.querySelectorAll('.sharer-check').forEach(lbl => {
      existing[lbl.querySelector('input').dataset.name] = lbl.classList.contains('checked');
    });
    const sharers = names.map(n => {
      const isChecked = existing[n] !== false;
      return `<label class="sharer-check ${isChecked ? 'checked' : ''}">
        <input type="checkbox" ${isChecked ? 'checked' : ''} data-name="${n}" />${n}</label>`;
    }).join('');
    row.querySelector('.item-sharers').innerHTML = sharers;
    row.querySelectorAll('.sharer-check').forEach(lbl => {
      lbl.querySelector('input').addEventListener('change', (e) => {
        lbl.classList.toggle('checked', e.target.checked);
      });
    });
  });
}

$('it-add-item').addEventListener('click', addItem);
$('it-participants').addEventListener('change', refreshItemSharers);

// Add 2 default items
addItem(); addItem();

$('it-calc').addEventListener('click', () => {
  const names = getItParticipants();
  const tipPct = parseFloat($('it-tip').value) || 0;

  const items = [...$('it-items').querySelectorAll('.item-row')].map(row => {
    const name = row.querySelector('.item-name').value.trim() || 'Item';
    const price = parseFloat(row.querySelector('.item-price').value) || 0;
    const sharers = [...row.querySelectorAll('.sharer-check.checked input')].map(i => i.dataset.name);
    return { name, price, sharers };
  }).filter(i => i.price > 0);

  if (!items.length) return alert('Add at least one item with a price.');

  // Calculate per person
  const totals = {};
  names.forEach(n => totals[n] = { items: [], subtotal: 0 });

  items.forEach(item => {
    if (!item.sharers.length) return;
    const share = item.price / item.sharers.length;
    item.sharers.forEach(n => {
      if (!totals[n]) totals[n] = { items: [], subtotal: 0 };
      totals[n].items.push({ name: item.name, amount: share });
      totals[n].subtotal += share;
    });
  });

  // Apply tip proportionally
  const grandSubtotal = Object.values(totals).reduce((s, p) => s + p.subtotal, 0);
  const tipTotal = grandSubtotal * tipPct / 100;
  Object.keys(totals).forEach(n => {
    const tipShare = grandSubtotal > 0 ? (totals[n].subtotal / grandSubtotal) * tipTotal : 0;
    totals[n].total = totals[n].subtotal + tipShare;
    totals[n].tipShare = tipShare;
  });

  // Render per-person cards
  const bd = $('it-breakdown');
  bd.innerHTML = '';
  Object.entries(totals).forEach(([name, data]) => {
    if (!data.items.length) return;
    const card = document.createElement('div');
    card.className = 'ppi-card';
    const itemsHtml = data.items.map(i =>
      `<div class="ppi-item"><span>${i.name}</span><span>${fmt(i.amount)}</span></div>`
    ).join('');
    const tipHtml = data.tipShare > 0
      ? `<div class="ppi-item"><span>Tip (${tipPct}%)</span><span>${fmt(data.tipShare)}</span></div>` : '';
    card.innerHTML = `
      <div class="ppi-header">
        <span class="ppi-name">${name}</span>
        <span class="ppi-total">${fmt(data.total)}</span>
      </div>
      <div class="ppi-items">${itemsHtml}${tipHtml}</div>`;
    bd.appendChild(card);
  });

  // Settlement
  const balances = Object.entries(totals).map(([name, data]) => ({ name, balance: -data.total }));
  // Assume one "payer" covers everything and others pay them back
  const maxPayer = Object.entries(totals).reduce((a, b) => b[1].total > a[1].total ? b : a);
  const settlements = [];
  Object.entries(totals).forEach(([name, data]) => {
    if (name !== maxPayer[0] && data.total > 0.005) {
      settlements.push({ from: name, to: maxPayer[0], amount: +data.total.toFixed(2) });
    }
  });

  const sl = $('it-settlement');
  sl.innerHTML = `<h3 class="section-title" style="margin-top:0">💸 Settlement</h3>`;
  if (!settlements.length) {
    sl.innerHTML += `<div class="breakdown-item"><span>Only one person! ✅</span></div>`;
  } else {
    settlements.forEach(s => {
      const d = document.createElement('div');
      d.className = 'settle-row';
      d.innerHTML = `
        <span class="settle-from">${s.from}</span>
        <span class="settle-arrow">pays →</span>
        <span class="settle-to">${s.to}</span>
        <span class="settle-amt">${fmt(s.amount)}</span>`;
      sl.appendChild(d);
    });
  }

  $('it-results').style.display = 'block';
  $('it-results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  window._itResult = { type: 'Items Split', items, totals, settlements, tipPct };
});

/* ============================================================
   FORMATTING HELPER
============================================================ */
function fmt(n) {
  return CURRENCY + (n || 0).toFixed(2);
}

/* ============================================================
   HISTORY (localStorage)
============================================================ */
const HISTORY_KEY = 'swp-history';

function getHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; }
  catch { return []; }
}

function saveHistory(entry) {
  const hist = getHistory();
  hist.unshift({ ...entry, id: Date.now(), date: new Date().toLocaleDateString() });
  if (hist.length > 30) hist.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
  renderHistory();
}

function renderHistory() {
  const list = $('historyList');
  const hist = getHistory();
  if (!hist.length) {
    list.innerHTML = `<div class="empty-history">No splits saved yet.<br>Hit 💾 Save after a calculation!</div>`;
    return;
  }
  list.innerHTML = '';
  hist.forEach(h => {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
      <div class="history-meta">
        <span class="history-type">${h.type}</span>
        <span class="history-date">${h.date}</span>
      </div>
      <div class="history-title">${h.summary || 'Split'}</div>
      <div class="history-sub">${h.detail || ''}</div>`;
    list.appendChild(item);
  });
}

$('historyToggle').addEventListener('click', () => {
  renderHistory();
  $('historyDrawer').classList.add('open');
  $('drawerOverlay').classList.add('open');
});

$('closeDrawer').addEventListener('click', closeDrawer);
$('drawerOverlay').addEventListener('click', closeDrawer);
function closeDrawer() {
  $('historyDrawer').classList.remove('open');
  $('drawerOverlay').classList.remove('open');
}

$('clearHistory').addEventListener('click', () => {
  if (confirm('Clear all history?')) {
    localStorage.removeItem(HISTORY_KEY);
    renderHistory();
  }
});

/* ============================================================
   SAVE BUTTONS
============================================================ */
$('eq-save').addEventListener('click', () => {
  const r = window._eqResult;
  if (!r) return;
  saveHistory({ type: r.type, summary: `Total ${fmt(r.total)} ÷ ${r.names.length} people`, detail: `Each pays ${fmt(r.per)}` });
  $('eq-save').textContent = '✅ Saved!';
  setTimeout(() => $('eq-save').textContent = '💾 Save', 2000);
});

$('uq-save').addEventListener('click', () => {
  const r = window._uqResult;
  if (!r) return;
  saveHistory({ type: r.type, summary: `Total ${fmt(r.total)}`, detail: `${r.settlements.length} settlement(s)` });
  $('uq-save').textContent = '✅ Saved!';
  setTimeout(() => $('uq-save').textContent = '💾 Save', 2000);
});

$('it-save').addEventListener('click', () => {
  const r = window._itResult;
  if (!r) return;
  saveHistory({ type: r.type, summary: `${r.items.length} items`, detail: `${r.settlements.length} settlement(s)` });
  $('it-save').textContent = '✅ Saved!';
  setTimeout(() => $('it-save').textContent = '💾 Save', 2000);
});

/* ============================================================
   PDF EXPORT
============================================================ */
function generatePDF(title, lines) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const margin = 20;
  let y = margin;

  // Header
  doc.setFillColor(192, 57, 43);
  doc.rect(0, 0, 210, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('SplitWise Pro', margin, 16);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }), 210 - margin, 16, { align: 'right' });
  y = 40;

  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(title, margin, y);
  y += 10;

  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, 210 - margin, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  lines.forEach(line => {
    if (y > 270) { doc.addPage(); y = 20; }
    if (line.type === 'header') {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(192, 57, 43);
      doc.text(line.text, margin, y);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.setTextColor(30, 30, 30);
      y += 8;
    } else if (line.type === 'row') {
      doc.text(line.left, margin, y);
      doc.text(line.right, 210 - margin, y, { align: 'right' });
      y += 7;
    } else if (line.type === 'divider') {
      doc.setDrawColor(220, 220, 220);
      doc.line(margin, y, 210 - margin, y);
      y += 5;
    } else {
      doc.text(line.text || '', margin, y);
      y += 7;
    }
  });

  // Footer
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('Generated by SplitWise Pro', 105, 290, { align: 'center' });

  doc.save(`splitwise-${Date.now()}.pdf`);
}

$('eq-pdf').addEventListener('click', () => {
  const r = window._eqResult;
  if (!r) return;
  const lines = [
    { type: 'header', text: 'Bill Summary' },
    { type: 'row', left: 'Subtotal', right: fmt(r.bill) },
    { type: 'row', left: `Tip (${r.tipPct}%)`, right: fmt(r.tip) },
    { type: 'row', left: 'Grand Total', right: fmt(r.total) },
    { type: 'divider' },
    { type: 'header', text: 'Per Person Breakdown' },
    ...r.names.map(n => ({ type: 'row', left: n, right: fmt(r.per) }))
  ];
  generatePDF('Equal Split Summary', lines);
});

$('uq-pdf').addEventListener('click', () => {
  const r = window._uqResult;
  if (!r) return;
  const lines = [
    { type: 'header', text: 'Bill Summary' },
    { type: 'row', left: 'Total Bill', right: fmt(r.total) },
    { type: 'divider' },
    { type: 'header', text: 'Settlement — Who Owes Whom' },
    ...(r.settlements.length
      ? r.settlements.map(s => ({ type: 'row', left: `${s.from} → ${s.to}`, right: fmt(s.amount) }))
      : [{ type: 'text', text: 'Everyone is square!' }])
  ];
  generatePDF('Custom Split Summary', lines);
});

$('it-pdf').addEventListener('click', () => {
  const r = window._itResult;
  if (!r) return;
  const lines = [
    { type: 'header', text: 'Items' },
    ...r.items.map(i => ({ type: 'row', left: `${i.name} (${i.sharers.join(', ')})`, right: fmt(i.price) })),
    { type: 'divider' },
    { type: 'header', text: 'Per Person' },
    ...Object.entries(r.totals).filter(([, d]) => d.total > 0).map(([n, d]) => ({ type: 'row', left: n, right: fmt(d.total) })),
    { type: 'divider' },
    { type: 'header', text: 'Settlement' },
    ...(r.settlements.length
      ? r.settlements.map(s => ({ type: 'row', left: `${s.from} → ${s.to}`, right: fmt(s.amount) }))
      : [{ type: 'text', text: 'Only one person!' }])
  ];
  generatePDF('Items Split Summary', lines);
});

/* ============================================================
   QR SHARE
============================================================ */
function showQR(summaryText) {
  $('qrcode').innerHTML = '';
  // Encode summary as data URI (works offline, no server needed)
  const encoded = encodeURIComponent(summaryText);
  const url = `https://splitwise-pro.share/?data=${encoded.slice(0, 800)}`;
  $('qr-url-text').textContent = summaryText.slice(0, 120) + (summaryText.length > 120 ? '…' : '');
  try {
    new QRCode($('qrcode'), {
      text: url,
      width: 220, height: 220,
      colorDark: '#1a1714',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M
    });
  } catch (e) {
    $('qrcode').innerHTML = '<p style="color:red;font-size:12px">QR lib not loaded</p>';
  }
  $('qrModalOverlay').classList.add('open');
}

$('closeQr').addEventListener('click', () => $('qrModalOverlay').classList.remove('open'));
$('qrModalOverlay').addEventListener('click', e => {
  if (e.target === $('qrModalOverlay')) $('qrModalOverlay').classList.remove('open');
});

$('eq-qr').addEventListener('click', () => {
  const r = window._eqResult;
  if (!r) return;
  const text = `SplitWise Pro - Equal Split\nTotal: ${fmt(r.total)}\nPeople: ${r.names.join(', ')}\nEach pays: ${fmt(r.per)}`;
  showQR(text);
});

$('uq-qr').addEventListener('click', () => {
  const r = window._uqResult;
  if (!r) return;
  const lines = r.settlements.map(s => `${s.from} → ${s.to}: ${fmt(s.amount)}`).join('\n');
  showQR(`SplitWise Pro - Custom Split\nTotal: ${fmt(r.total)}\n\nSettlement:\n${lines || 'All square!'}`);
});

$('it-qr').addEventListener('click', () => {
  const r = window._itResult;
  if (!r) return;
  const perPerson = Object.entries(r.totals)
    .filter(([, d]) => d.total > 0)
    .map(([n, d]) => `${n}: ${fmt(d.total)}`).join('\n');
  showQR(`SplitWise Pro - Items Split\n\nPer Person:\n${perPerson}`);
});