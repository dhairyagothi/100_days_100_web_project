/**
 * Renders data tables with row/column highlighting
 */

export function renderTables(container, tables, options = {}) {
  container.innerHTML = '';

  if (!tables || tables.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No data to display</p></div>';
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'viz-tables';

  for (const table of tables) {
    wrapper.appendChild(renderTableBlock(table, options));
  }

  // Show result table from JOIN if present
  if (options.resultTable) {
    wrapper.appendChild(renderTableBlock({ ...options.resultTable, badge: 'Result' }, options));
  }

  container.appendChild(wrapper);
}

function renderTableBlock(table, options) {
  const block = document.createElement('div');
  block.className = 'table-block';

  const header = document.createElement('div');
  header.className = 'table-block-header';

  const title = document.createElement('span');
  title.className = 'table-block-title';
  title.textContent = table.name;

  const badge = document.createElement('span');
  badge.className = 'table-block-badge' + (table.badge ? ' operation' : '');
  badge.textContent = table.badge || `${table.rows.length} row${table.rows.length !== 1 ? 's' : ''}`;

  header.appendChild(title);
  header.appendChild(badge);
  block.appendChild(header);

  block.appendChild(renderDataTable(table));
  return block;
}

export function renderDataTable(table) {
  const wrapper = document.createElement('div');
  wrapper.className = 'data-table-wrapper';

  const el = document.createElement('table');
  el.className = 'data-table';

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  const idxHeader = document.createElement('th');
  idxHeader.className = 'row-index';
  idxHeader.textContent = '#';
  headerRow.appendChild(idxHeader);

  for (const col of table.columns) {
    const th = document.createElement('th');
    th.textContent = col;
    if (table.highlightCols?.includes(col)) {
      th.classList.add('highlight-col');
    }
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  el.appendChild(thead);

  const tbody = document.createElement('tbody');
  for (let i = 0; i < table.rows.length; i++) {
    const row = table.rows[i];
    const tr = document.createElement('tr');

    if (table.highlightRows?.includes(i)) tr.classList.add('highlight-row');
    if (table.dimRows?.includes(i)) tr.classList.add('dim-row');
    if (table.removedRows?.includes(i)) tr.classList.add('removed-row');
    if (table.addedRows?.includes(i)) tr.classList.add('added-row');

    const idx = document.createElement('td');
    idx.className = 'row-index';
    idx.textContent = i + 1;
    tr.appendChild(idx);

    for (const col of table.columns) {
      const td = document.createElement('td');
      const val = row[col];
      if (val === null || val === undefined) {
        td.textContent = 'NULL';
        td.classList.add('null-value');
      } else {
        td.textContent = val;
      }
      if (table.highlightCols?.includes(col)) td.classList.add('highlight-col');
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  el.appendChild(tbody);
  wrapper.appendChild(el);
  return wrapper;
}

export function renderTablePreview(table) {
  return renderDataTable({
    name: table.name,
    columns: table.columns,
    rows: table.rows,
    highlightRows: table.rows.map((_, i) => i),
  });
}
