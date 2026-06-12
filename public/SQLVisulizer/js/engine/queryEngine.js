/**
 * Query execution engine — produces step-by-step visualization data
 */

import { getTable, cloneRows } from '../data/sampleData.js';

export function executeQuery(ast) {
  const steps = [];
  const aliasMap = buildAliasMap(ast);

  // Step 1: Load source table(s)
  const baseTable = getTable(ast.from.name);
  if (!baseTable) throw new Error(`Table '${ast.from.name}' not found`);

  let currentRows = cloneRows(baseTable.rows);
  let currentColumns = [...baseTable.columns];
  const tableLabel = ast.from.alias || ast.from.name;

  steps.push({
    operation: 'FROM',
    title: `Load table: ${ast.from.name}`,
    explanation: `The query starts by reading all rows from the <strong>${ast.from.name}</strong> table. This is the source data that subsequent operations will transform.`,
    tables: [{
      name: tableLabel,
      columns: currentColumns,
      rows: currentRows,
      highlightRows: currentRows.map((_, i) => i),
    }],
    joinInfo: null,
  });

  // JOIN steps
  for (const join of ast.joins) {
    const joinTable = getTable(join.table.name);
    if (!joinTable) throw new Error(`Table '${join.table.name}' not found`);

    const joinResult = performJoin(currentRows, currentColumns, tableLabel, joinTable, join, aliasMap);

    steps.push({
      operation: join.type,
      title: `${join.type} JOIN ${join.table.name}`,
      explanation: getJoinExplanation(join.type, ast.from.name, join.table.name, join.condition),
      tables: joinResult.previewTables,
      resultTable: {
        name: 'joined_result',
        columns: joinResult.columns,
        rows: joinResult.rows,
        highlightRows: joinResult.rows.map((_, i) => i),
        addedRows: joinResult.rows.map((_, i) => i),
      },
      joinInfo: joinResult.joinInfo,
    });

    currentRows = joinResult.rows;
    currentColumns = joinResult.columns;
  }

  // WHERE
  if (ast.where) {
    const evalResult = filterRows(currentRows, ast.where, currentColumns, aliasMap);
    steps.push({
      operation: 'WHERE',
      title: 'Filter rows (WHERE)',
      explanation: `The <strong>WHERE</strong> clause filters rows that don't match the condition. Matching rows are highlighted; dimmed rows will be removed.`,
      tables: [{
        name: 'filtered',
        columns: currentColumns,
        rows: currentRows,
        highlightRows: evalResult.matching,
        dimRows: evalResult.nonMatching,
        removedRows: evalResult.nonMatching,
      }],
    });
    currentRows = evalResult.filtered;
  }

  // GROUP BY
  if (ast.groupBy) {
    const groupResult = groupRows(currentRows, ast.groupBy, ast.columns, ast.having, currentColumns, aliasMap);
    steps.push({
      operation: 'GROUP BY',
      title: 'Group rows (GROUP BY)',
      explanation: `Rows are grouped by the specified columns. Aggregate functions compute summary values for each group.`,
      tables: [{
        name: 'grouped',
        columns: groupResult.columns,
        rows: groupResult.rows,
        highlightRows: groupResult.rows.map((_, i) => i),
        addedRows: groupResult.rows.map((_, i) => i),
      }],
      groupInfo: groupResult.groupInfo,
    });
    currentRows = groupResult.rows;
    currentColumns = groupResult.columns;
  } else if (ast.columns.some((c) => c.type === 'aggregate' || (c.type !== 'star' && needsAggregateCheck(ast)))) {
    // SELECT with aggregates but no GROUP BY - treat as single group
    const hasAgg = ast.columns.some((c) => c.type === 'aggregate');
    if (hasAgg && !ast.groupBy) {
      const aggResult = computeAggregates(currentRows, ast.columns, currentColumns, aliasMap);
      steps.push({
        operation: 'SELECT',
        title: 'Compute aggregates',
        explanation: `Aggregate functions like COUNT, SUM, AVG operate on all rows to produce a single summary row.`,
        tables: [{
          name: 'aggregated',
          columns: aggResult.columns,
          rows: aggResult.rows,
          highlightRows: [0],
        }],
      });
      currentRows = aggResult.rows;
      currentColumns = aggResult.columns;
    }
  }

  // SELECT projection (skip if GROUP BY already projected columns)
  const isAggOnly = ast.columns.every((c) => c.type === 'aggregate') && !ast.groupBy;
  if (!isAggOnly && !ast.groupBy) {
    const selectResult = projectColumns(currentRows, ast.columns, currentColumns, aliasMap, ast.distinct);
    const selectedColNames = selectResult.columns;

    steps.push({
      operation: 'SELECT',
      title: 'Project columns (SELECT)',
      explanation: ast.distinct
        ? `The <strong>SELECT</strong> clause picks specific columns and removes duplicate rows with <strong>DISTINCT</strong>.`
        : `The <strong>SELECT</strong> clause picks only the requested columns from the result set, discarding the rest.`,
      tables: [{
        name: 'projected',
        columns: selectedColNames,
        rows: selectResult.rows,
        highlightRows: selectResult.rows.map((_, i) => i),
        highlightCols: selectedColNames,
      }],
    });
    currentRows = selectResult.rows;
    currentColumns = selectedColNames;
  }

  // HAVING (after group by, if not already applied)
  // HAVING is handled inside groupRows when groupBy exists

  // ORDER BY
  if (ast.orderBy) {
    const sorted = sortRows(currentRows, ast.orderBy, currentColumns, aliasMap);
    const orderDesc = ast.orderBy.map((o) => {
      const col = resolveColName(o, currentColumns);
      return `${col} ${o.direction}`;
    }).join(', ');

    steps.push({
      operation: 'ORDER BY',
      title: 'Sort rows (ORDER BY)',
      explanation: `Rows are sorted by <strong>${orderDesc}</strong>. The order determines how results are displayed.`,
      tables: [{
        name: 'sorted',
        columns: currentColumns,
        rows: sorted,
        highlightRows: sorted.map((_, i) => i),
      }],
    });
    currentRows = sorted;
  }

  // LIMIT
  if (ast.limit !== null) {
    const limited = currentRows.slice(0, ast.limit);
    const removed = currentRows.slice(ast.limit).map((_, i) => i + ast.limit);

    steps.push({
      operation: 'LIMIT',
      title: `Limit to ${ast.limit} rows`,
      explanation: `The <strong>LIMIT</strong> clause restricts the output to the first ${ast.limit} rows. Extra rows are discarded.`,
      tables: [{
        name: 'final',
        columns: currentColumns,
        rows: limited,
        highlightRows: limited.map((_, i) => i),
        dimRows: [],
        removedRows: removed,
      }],
    });
    currentRows = limited;
  }

  // Final result step
  if (steps[steps.length - 1]?.operation !== 'LIMIT' && steps[steps.length - 1]?.operation !== 'SELECT' || steps.length === 1) {
    // add final if needed
  }

  steps.push({
    operation: 'RESULT',
    title: 'Final Result',
    explanation: `This is the final result set returned by the query — <strong>${currentRows.length}</strong> row${currentRows.length !== 1 ? 's' : ''} and <strong>${currentColumns.length}</strong> column${currentColumns.length !== 1 ? 's' : ''}.`,
    tables: [{
      name: 'result',
      columns: currentColumns,
      rows: currentRows,
      highlightRows: currentRows.map((_, i) => i),
    }],
    isFinal: true,
  });

  return steps;
}

function buildAliasMap(ast) {
  const map = { [ast.from.alias || ast.from.name]: ast.from.name };
  for (const join of ast.joins) {
    map[join.table.alias || join.table.name] = join.table.name;
  }
  return map;
}

function resolveColumn(col, row, columns, aliasMap) {
  if (col.type === 'literal') return col.value;
  if (col.type === 'column') {
    const name = col.name;
    if (col.table) {
      const realTable = aliasMap[col.table] || col.table;
      const prefix = realTable + '_';
      const prefixed = prefix + name;
      if (prefixed in row) return row[prefixed];
    }
    if (name in row) return row[name];
    // Search prefixed columns
    for (const key of Object.keys(row)) {
      if (key.endsWith('_' + name) || key === name) return row[key];
    }
    return undefined;
  }
  return undefined;
}

function resolveColName(col, columns) {
  if (col.alias) return col.alias;
  if (col.type === 'column') return col.name;
  if (col.name) return col.name;
  return String(col);
}

function evaluateHaving(condition, resultRow, sourceRows, allColumns, aliasMap, resultCols) {
  if (condition.type === 'binary') {
    const l = evaluateHaving(condition.left, resultRow, sourceRows, allColumns, aliasMap, resultCols);
    if (condition.operator === 'AND') {
      return l && evaluateHaving(condition.right, resultRow, sourceRows, allColumns, aliasMap, resultCols);
    }
    return l || evaluateHaving(condition.right, resultRow, sourceRows, allColumns, aliasMap, resultCols);
  }

  if (condition.type === 'comparison') {
    const leftVal = resolveHavingSide(condition.left, resultRow, sourceRows, allColumns, aliasMap, resultCols);
    const rightVal = resolveHavingSide(condition.right, resultRow, sourceRows, allColumns, aliasMap, resultCols);
    switch (condition.operator) {
      case '=': return leftVal == rightVal;
      case '!=':
      case '<>': return leftVal != rightVal;
      case '<': return leftVal < rightVal;
      case '>': return leftVal > rightVal;
      case '<=': return leftVal <= rightVal;
      case '>=': return leftVal >= rightVal;
      default: return false;
    }
  }

  return evaluateCondition(condition, resultRow, resultCols, aliasMap);
}

function resolveHavingSide(expr, resultRow, sourceRows, allColumns, aliasMap, resultCols) {
  if (expr.type === 'literal') return expr.value;
  if (expr.type === 'aggregate') return computeAggregate(expr, sourceRows, allColumns, aliasMap);
  if (expr.alias && expr.alias in resultRow) return resultRow[expr.alias];
  if (expr.type === 'column') {
    const name = expr.alias || expr.name;
    if (name in resultRow) return resultRow[name];
    return resolveColumn(expr, resultRow, resultCols, aliasMap);
  }
  return resolveColumn(expr, resultRow, resultCols, aliasMap);
}

function evaluateCondition(condition, row, columns, aliasMap) {
  if (condition.type === 'binary') {
    const l = evaluateCondition(condition.left, row, columns, aliasMap);
    if (condition.operator === 'AND') {
      return l && evaluateCondition(condition.right, row, columns, aliasMap);
    }
    return l || evaluateCondition(condition.right, row, columns, aliasMap);
  }

  if (condition.type === 'isNull') {
    const val = resolveColumn(condition.column, row, columns, aliasMap);
    return condition.not ? val !== null && val !== undefined : val === null || val === undefined;
  }

  if (condition.type === 'comparison') {
    const left = resolveColumn(condition.left, row, columns, aliasMap);
    const right = condition.type === 'comparison'
      ? (condition.right.type === 'literal' ? condition.right.value : resolveColumn(condition.right, row, columns, aliasMap))
      : resolveColumn(condition.right, row, columns, aliasMap);
    const r = condition.right.type === 'literal' ? condition.right.value : resolveColumn(condition.right, row, columns, aliasMap);

    switch (condition.operator) {
      case '=': return left == r;
      case '!=':
      case '<>': return left != r;
      case '<': return left < r;
      case '>': return left > r;
      case '<=': return left <= r;
      case '>=': return left >= r;
      default: return false;
    }
  }

  if (condition.type === 'in') {
    const val = resolveColumn(condition.column, row, columns, aliasMap);
    return condition.values.some((v) => {
      const cv = v.type === 'literal' ? v.value : resolveColumn(v, row, columns, aliasMap);
      return val == cv;
    });
  }

  if (condition.type === 'like') {
    const val = String(resolveColumn(condition.column, row, columns, aliasMap) || '');
    const pattern = condition.pattern.type === 'literal' ? condition.pattern.value : String(resolveColumn(condition.pattern, row, columns, aliasMap));
    const regex = new RegExp('^' + pattern.replace(/%/g, '.*').replace(/_/g, '.') + '$', 'i');
    return regex.test(val);
  }

  if (condition.type === 'between') {
    const val = resolveColumn(condition.column, row, columns, aliasMap);
    const low = condition.low.type === 'literal' ? condition.low.value : resolveColumn(condition.low, row, columns, aliasMap);
    const high = condition.high.type === 'literal' ? condition.high.value : resolveColumn(condition.high, row, columns, aliasMap);
    return val >= low && val <= high;
  }

  return true;
}

function filterRows(rows, condition, columns, aliasMap) {
  const matching = [];
  const nonMatching = [];
  const filtered = [];

  rows.forEach((row, i) => {
    if (evaluateCondition(condition, row, columns, aliasMap)) {
      matching.push(i);
      filtered.push(row);
    } else {
      nonMatching.push(i);
    }
  });

  return { matching, nonMatching, filtered };
}

function prefixRow(row, prefix, columns) {
  const result = {};
  for (const col of columns) {
    result[`${prefix}_${col}`] = row[col];
  }
  return result;
}

function getJoinKeys(condition) {
  if (condition.type === 'comparison' && condition.operator === '=') {
    const left = condition.left;
    const right = condition.right;
    return { left, right };
  }
  return null;
}

function performJoin(leftRows, leftCols, leftLabel, rightTable, join, aliasMap) {
  const rightRows = cloneRows(rightTable.rows);
  const rightLabel = join.table.alias || join.table.name;
  const rightPrefix = rightLabel;
  const leftPrefix = leftLabel;

  const keys = getJoinKeys(join.condition);
  const matches = [];
  const resultRows = [];
  const matchedRight = new Set();

  for (let li = 0; li < leftRows.length; li++) {
    const leftRow = leftRows[li];
    let hasMatch = false;

    for (let ri = 0; ri < rightRows.length; ri++) {
      const rightRow = rightRows[ri];
      const combined = { ...prefixRow(leftRow, leftPrefix, leftCols), ...prefixRow(rightRow, rightPrefix, rightTable.columns) };

      if (keys && evaluateCondition(join.condition, combined, [...leftCols, ...rightTable.columns], aliasMap)) {
        hasMatch = true;
        matchedRight.add(ri);
        resultRows.push(combined);
        matches.push({ leftIndex: li, rightIndex: ri, matched: true });
      }
    }

    if (!hasMatch && (join.type === 'LEFT' || join.type === 'FULL OUTER')) {
      const nullRight = {};
      for (const col of rightTable.columns) {
        nullRight[`${rightPrefix}_${col}`] = null;
      }
      resultRows.push({ ...prefixRow(leftRow, leftPrefix, leftCols), ...nullRight });
      matches.push({ leftIndex: li, rightIndex: -1, matched: false, side: 'left' });
    }
  }

  if (join.type === 'RIGHT' || join.type === 'FULL OUTER') {
    for (let ri = 0; ri < rightRows.length; ri++) {
      if (!matchedRight.has(ri)) {
        const nullLeft = {};
        for (const col of leftCols) {
          nullLeft[`${leftPrefix}_${col}`] = null;
        }
        resultRows.push({ ...nullLeft, ...prefixRow(rightRows[ri], rightPrefix, rightTable.columns) });
        matches.push({ leftIndex: -1, rightIndex: ri, matched: false, side: 'right' });
      }
    }
  }

  if (join.type === 'INNER') {
    // Only matched rows (already in resultRows)
  }

  if (join.type === 'RIGHT') {
    // Recompute for RIGHT JOIN
    resultRows.length = 0;
    matches.length = 0;
    matchedRight.clear();

    for (let li = 0; li < leftRows.length; li++) {
      for (let ri = 0; ri < rightRows.length; ri++) {
        const combined = {
          ...prefixRow(leftRows[li], leftPrefix, leftCols),
          ...prefixRow(rightRows[ri], rightPrefix, rightTable.columns),
        };
        if (keys && evaluateCondition(join.condition, combined, [...leftCols, ...rightTable.columns], aliasMap)) {
          matchedRight.add(ri);
          resultRows.push(combined);
          matches.push({ leftIndex: li, rightIndex: ri, matched: true });
        }
      }
    }
    for (let ri = 0; ri < rightRows.length; ri++) {
      if (!matchedRight.has(ri)) {
        const nullLeft = {};
        for (const col of leftCols) {
          nullLeft[`${leftPrefix}_${col}`] = null;
        }
        resultRows.push({ ...nullLeft, ...prefixRow(rightRows[ri], rightPrefix, rightTable.columns) });
        matches.push({ leftIndex: -1, rightIndex: ri, matched: false, side: 'right' });
      }
    }
  }

  const resultColumns = [
    ...leftCols.map((c) => `${leftPrefix}_${c}`),
    ...rightTable.columns.map((c) => `${rightPrefix}_${c}`),
  ];

  return {
    rows: resultRows,
    columns: resultColumns,
    previewTables: [
      {
        name: leftLabel,
        columns: leftCols,
        rows: leftRows,
        highlightRows: [...new Set(matches.filter((m) => m.leftIndex >= 0).map((m) => m.leftIndex))],
      },
      {
        name: rightLabel,
        columns: rightTable.columns,
        rows: rightRows,
        highlightRows: [...new Set(matches.filter((m) => m.rightIndex >= 0).map((m) => m.rightIndex))],
      },
    ],
    joinInfo: {
      type: join.type,
      leftTable: leftLabel,
      rightTable: rightLabel,
      leftCount: leftRows.length,
      rightCount: rightRows.length,
      resultCount: resultRows.length,
      matches,
      condition: join.condition,
    },
  };
}

function getJoinExplanation(type, leftName, rightName, condition) {
  const explanations = {
    'INNER': `An <strong>INNER JOIN</strong> returns only rows where there's a match in both <strong>${leftName}</strong> and <strong>${rightName}</strong>. Non-matching rows are excluded.`,
    'LEFT': `A <strong>LEFT JOIN</strong> keeps all rows from <strong>${leftName}</strong>. When no match exists in <strong>${rightName}</strong>, NULL values fill the right-side columns.`,
    'RIGHT': `A <strong>RIGHT JOIN</strong> keeps all rows from <strong>${rightName}</strong>. When no match exists in <strong>${leftName}</strong>, NULL values fill the left-side columns.`,
    'FULL OUTER': `A <strong>FULL OUTER JOIN</strong> keeps all rows from both tables. Unmatched rows from either side appear with NULLs on the missing side.`,
  };
  return explanations[type] || explanations['INNER'];
}

function projectColumns(rows, columns, allColumns, aliasMap, distinct) {
  if (columns.length === 1 && columns[0].type === 'star') {
    const resultCols = allColumns;
    let resultRows = rows.map((r) => {
      const out = {};
      for (const c of resultCols) out[c] = r[c];
      return out;
    });
    if (distinct) resultRows = deduplicate(resultRows);
    return { columns: resultCols, rows: resultRows };
  }

  const resultCols = [];
  const resultRows = rows.map((row) => {
    const out = {};
    for (const col of columns) {
      const name = col.alias || (col.type === 'column' ? col.name : col.function?.toLowerCase());
      resultCols.push(name);

      if (col.type === 'star') {
        for (const c of allColumns) out[c] = row[c];
      } else if (col.type === 'column') {
        out[name] = resolveColumn(col, row, allColumns, aliasMap);
      } else if (col.type === 'aggregate') {
        out[name] = computeAggregate(col, [row], allColumns, aliasMap);
      }
    }
    return out;
  });

  const uniqueCols = [...new Set(resultCols)];
  let finalRows = resultRows.map((r) => {
    const out = {};
    for (const c of uniqueCols) out[c] = r[c];
    return out;
  });

  if (distinct) finalRows = deduplicate(finalRows);

  return { columns: uniqueCols, rows: finalRows };
}

function deduplicate(rows) {
  const seen = new Set();
  return rows.filter((r) => {
    const key = JSON.stringify(r);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function computeAggregate(agg, rows, columns, aliasMap) {
  const fn = agg.function;
  const arg = agg.argument;

  if (fn === 'COUNT') {
    if (arg.type === 'star') return rows.length;
    return rows.filter((r) => {
      const v = resolveColumn(arg, r, columns, aliasMap);
      return v !== null && v !== undefined;
    }).length;
  }

  const values = rows.map((r) => resolveColumn(arg, r, columns, aliasMap)).filter((v) => v !== null && v !== undefined);

  switch (fn) {
    case 'SUM': return values.reduce((a, b) => a + Number(b), 0);
    case 'AVG': return values.length ? values.reduce((a, b) => a + Number(b), 0) / values.length : null;
    case 'MIN': return values.length ? Math.min(...values.map(Number)) : null;
    case 'MAX': return values.length ? Math.max(...values.map(Number)) : null;
    default: return null;
  }
}

function computeAggregates(rows, columns, allColumns, aliasMap) {
  const resultCols = [];
  const result = {};

  for (const col of columns) {
    const name = col.alias || col.function.toLowerCase();
    resultCols.push(name);
    result[name] = computeAggregate(col, rows, allColumns, aliasMap);
  }

  return { columns: resultCols, rows: [result] };
}

function groupRows(rows, groupByCols, selectCols, having, allColumns, aliasMap) {
  const groups = new Map();

  for (const row of rows) {
    const key = groupByCols.map((g) => resolveColumn(g, row, allColumns, aliasMap)).join('|');
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }

  const resultCols = [];
  const resultRows = [];
  const rowSources = [];

  for (const [, groupRowsArr] of groups) {
    const out = {};
    for (const g of groupByCols) {
      const name = resolveColName(g, allColumns);
      resultCols.push(name);
      out[name] = resolveColumn(g, groupRowsArr[0], allColumns, aliasMap);
    }
    for (const col of selectCols) {
      if (col.type === 'aggregate') {
        const name = col.alias || col.function.toLowerCase();
        if (!resultCols.includes(name)) resultCols.push(name);
        out[name] = computeAggregate(col, groupRowsArr, allColumns, aliasMap);
      }
    }
    resultRows.push(out);
    rowSources.push(groupRowsArr);
  }

  let filtered = resultRows;
  if (having) {
    filtered = resultRows.filter((row, idx) =>
      evaluateHaving(having, row, rowSources[idx], allColumns, aliasMap, resultCols)
    );
  }

  return {
    columns: [...new Set(resultCols)],
    rows: filtered,
    groupInfo: { groupCount: groups.size, resultCount: filtered.length },
  };
}

function sortRows(rows, orderBy, columns, aliasMap) {
  return [...rows].sort((a, b) => {
    for (const order of orderBy) {
      const colName = order.alias || order.name || resolveColName(order, columns);
      let aVal = a[colName] ?? resolveColumn(order, a, columns, aliasMap);
      let bVal = b[colName] ?? resolveColumn(order, b, columns, aliasMap);

      if (aVal === null || aVal === undefined) aVal = order.direction === 'ASC' ? Infinity : -Infinity;
      if (bVal === null || bVal === undefined) bVal = order.direction === 'ASC' ? Infinity : -Infinity;

      if (aVal < bVal) return order.direction === 'ASC' ? -1 : 1;
      if (aVal > bVal) return order.direction === 'ASC' ? 1 : -1;
    }
    return 0;
  });
}

function needsAggregateCheck(ast) {
  return ast.columns.some((c) => c.type === 'aggregate');
}

export function getFinalResult(steps) {
  const final = steps.find((s) => s.isFinal);
  if (!final) return null;
  const table = final.tables[0];
  return { columns: table.columns, rows: table.rows };
}
