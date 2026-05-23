let itemCount = 0;

const today = new Date().toISOString().split('T')[0];
const due = new Date();
due.setDate(due.getDate() + 30);

document.getElementById('inv-date').value = today;
document.getElementById('due-date').value = due.toISOString().split('T')[0];
document.getElementById('inv-no').value = 'INV-' + Date.now().toString().slice(-6);

addItem();
addItem();
addItem();

document.getElementById('btn-add-item').addEventListener('click', () => addItem());
document.getElementById('btn-generate').addEventListener('click', generateInvoice);
document.getElementById('btn-clear').addEventListener('click', clearAll);
document.getElementById('btn-print').addEventListener('click', () => window.print());
document.getElementById('btn-pdf').addEventListener('click', () => window.print());
document.getElementById('btn-back').addEventListener('click', goBack);

function addItem(desc = '', qty = 1, price = '') {
  itemCount++;
  const id = 'item-' + itemCount;

  const div = document.createElement('div');
  div.className = 'item-entry';
  div.id = id;

  div.innerHTML = `
    <input type="text" placeholder="Service or product description" value="${desc}" />
    <input type="number" value="${qty}" min="0" step="0.01" placeholder="1" />
    <input type="number" value="${price}" min="0" step="0.01" placeholder="0.00" />
    <button class="btn-remove" title="Remove row">×</button>
  `;

  div.querySelector('.btn-remove').addEventListener('click', () => removeItem(id));

  document.getElementById('items-list').appendChild(div);
}

function removeItem(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function getItems() {
  return [...document.querySelectorAll('#items-list .item-entry')]
    .map(row => {
      const inputs = row.querySelectorAll('input');
      return {
        desc: inputs[0].value.trim(),
        qty: parseFloat(inputs[1].value) || 0,
        price: parseFloat(inputs[2].value) || 0
      };
    })
    .filter(i => i.desc || i.price);
}

function formatCurrency(n) {
  return '₹' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function generateInvoice() {
  const items = getItems();
  if (!items.length) {
    alert('Add at least one item.');
    return;
  }

  const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
  const discountRate = parseFloat(document.getElementById('discount-rate').value) || 0;
  const taxRate = parseFloat(document.getElementById('tax-rate').value) || 0;
  const discountAmt = subtotal * discountRate / 100;
  const taxable = subtotal - discountAmt;
  const taxAmt = taxable * taxRate / 100;
  const total = taxable + taxAmt;

  document.getElementById('out-company').textContent =
    document.getElementById('from-name').value || 'Your Company';
  document.getElementById('out-from-detail').textContent =
    document.getElementById('from-detail').value;
  document.getElementById('out-inv-no').textContent =
    document.getElementById('inv-no').value;
  document.getElementById('out-date').textContent =
    document.getElementById('inv-date').value;
  document.getElementById('out-due').textContent =
    document.getElementById('due-date').value;

  document.getElementById('out-client-name').textContent =
    document.getElementById('client-name').value || 'Client';
  document.getElementById('out-client-detail').textContent =
    document.getElementById('client-detail').value;

  document.getElementById('out-notes').textContent =
    document.getElementById('notes').value || '—';

  const tbody = document.getElementById('out-items');
  tbody.innerHTML = items.map(i => `
    <tr>
      <td>${i.desc}</td>
      <td>${i.qty}</td>
      <td>${formatCurrency(i.price)}</td>
      <td>${formatCurrency(i.qty * i.price)}</td>
    </tr>
  `).join('');

  document.getElementById('out-subtotal').textContent = formatCurrency(subtotal);

  const discountRow = document.getElementById('discount-row');
  if (discountRate > 0) {
    discountRow.classList.remove('hidden');
    document.getElementById('out-discount').textContent =
      `-${formatCurrency(discountAmt)} (${discountRate}%)`;
  } else {
    discountRow.classList.add('hidden');
  }

  const taxRowOut = document.getElementById('tax-row-out');
  if (taxRate > 0) {
    taxRowOut.classList.remove('hidden');
    document.getElementById('out-tax').textContent =
      `+${formatCurrency(taxAmt)} (${taxRate}%)`;
  } else {
    taxRowOut.classList.add('hidden');
  }

  document.getElementById('out-total').textContent = formatCurrency(total);

  document.getElementById('builder').style.display = 'none';
  document.getElementById('invoice-preview').style.display = 'block';
  document.getElementById('print-bar').style.display = 'flex';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack() {
  document.getElementById('builder').style.display = 'block';
  document.getElementById('invoice-preview').style.display = 'none';
  document.getElementById('print-bar').style.display = 'none';
}

function clearAll() {
  if (!confirm('Clear all fields?')) return;

  ['from-name', 'from-detail', 'client-name', 'client-detail', 'notes'].forEach(id => {
    document.getElementById(id).value = '';
  });

  document.getElementById('items-list').innerHTML = '';
  document.getElementById('tax-rate').value = 0;
  document.getElementById('discount-rate').value = 0;
  document.getElementById('inv-no').value = 'INV-' + Date.now().toString().slice(-6);
  document.getElementById('inv-date').value = today;
  itemCount = 0;

  addItem();
  addItem();
  addItem();
}