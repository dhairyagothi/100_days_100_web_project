/**
 * Interactive JOIN diagram visualizer
 */

export function renderJoinDiagram(container, joinInfo, stepIndex) {
  if (!joinInfo) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  container.classList.remove('hidden');

  const { type, leftTable, rightTable, leftCount, rightCount, resultCount, matches } = joinInfo;

  const inner = document.createElement('div');
  inner.className = 'join-diagram-inner';

  // Left table box
  inner.appendChild(createTableBox(leftTable, leftCount, true));

  // Connector
  const connector = document.createElement('div');
  connector.className = 'join-connector';
  connector.innerHTML = `
    <span class="join-type-badge">${type}</span>
    <span class="join-arrow">⟷</span>
    <span style="font-size:0.6875rem;color:var(--text-muted)">${resultCount} rows</span>
  `;
  inner.appendChild(connector);

  // Right table box
  inner.appendChild(createTableBox(rightTable, rightCount, true));

  // Match details (show subset for animation effect)
  if (matches && matches.length > 0) {
    const matchList = document.createElement('div');
    matchList.className = 'join-matches';
    matchList.style.width = '100%';

    const visibleMatches = matches.slice(0, Math.min(matches.length, 6 + stepIndex));
    for (const m of visibleMatches) {
      const row = document.createElement('div');
      if (m.matched) {
        row.className = 'join-match-row matching';
        row.textContent = `Row ${m.leftIndex + 1} ↔ Row ${m.rightIndex + 1} — matched`;
      } else if (m.side === 'left') {
        row.className = 'join-match-row no-match-left';
        row.textContent = `Row ${m.leftIndex + 1} — no match (NULL on right)`;
      } else {
        row.className = 'join-match-row no-match-right';
        row.textContent = `Row ${m.rightIndex + 1} — no match (NULL on left)`;
      }
      matchList.appendChild(row);
    }

    if (matches.length > visibleMatches.length) {
      const more = document.createElement('div');
      more.style.cssText = 'font-size:0.6875rem;color:var(--text-muted);text-align:center;padding:0.25rem';
      more.textContent = `+ ${matches.length - visibleMatches.length} more matches`;
      matchList.appendChild(more);
    }

    inner.appendChild(matchList);
  }

  container.innerHTML = '';
  container.appendChild(inner);
}

function createTableBox(name, count, highlight) {
  const box = document.createElement('div');
  box.className = 'join-table-box' + (highlight ? ' highlight' : '');
  box.innerHTML = `
    <div class="table-name">${name}</div>
    <div class="row-count">${count} rows</div>
  `;
  return box;
}

export function hideJoinDiagram(container) {
  container.classList.add('hidden');
  container.innerHTML = '';
}
