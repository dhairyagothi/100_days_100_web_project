/**
 * Lightweight SQL parser for educational visualization.
 * Supports: SELECT, FROM, JOIN, WHERE, GROUP BY, HAVING, ORDER BY, LIMIT
 */

const KEYWORDS = new Set([
  'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL',
  'OUTER', 'ON', 'GROUP', 'BY', 'HAVING', 'ORDER', 'ASC', 'DESC',
  'LIMIT', 'AS', 'AND', 'OR', 'NOT', 'NULL', 'IS', 'IN', 'LIKE',
  'BETWEEN', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
]);

export function parseSQL(sql) {
  const tokens = tokenize(sql);
  if (tokens.length === 0) throw new Error('Empty query');

  let pos = 0;

  function peek() { return tokens[pos]; }
  function consume(expected) {
    const t = tokens[pos];
    if (!t) throw new Error(`Expected ${expected}, got end of query`);
    if (expected && t.value.toUpperCase() !== expected.toUpperCase() && t.type !== expected) {
      throw new Error(`Expected ${expected}, got '${t.value}' at position ${t.pos}`);
    }
    pos++;
    return t;
  }
  function match(...values) {
    const t = peek();
    if (!t) return false;
    return values.some((v) => t.value.toUpperCase() === v.toUpperCase());
  }
  function matchType(type) {
    return peek()?.type === type;
  }

  // SELECT [DISTINCT] columns
  consume('SELECT');
  let distinct = false;
  if (match('DISTINCT')) {
    distinct = true;
    consume('DISTINCT');
  }
  const columns = parseColumnList();

  // FROM table [alias]
  consume('FROM');
  const from = parseTableRef();

  // JOINs
  const joins = [];
  while (match('JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL')) {
    joins.push(parseJoin());
  }

  // WHERE
  let where = null;
  if (match('WHERE')) {
    consume('WHERE');
    where = parseCondition();
  }

  // GROUP BY
  let groupBy = null;
  if (match('GROUP')) {
    consume('GROUP');
    consume('BY');
    groupBy = parseGroupByList();
  }

  // HAVING
  let having = null;
  if (match('HAVING')) {
    consume('HAVING');
    having = parseCondition();
  }

  // ORDER BY
  let orderBy = null;
  if (match('ORDER')) {
    consume('ORDER');
    consume('BY');
    orderBy = parseOrderByList();
  }

  // LIMIT
  let limit = null;
  if (match('LIMIT')) {
    consume('LIMIT');
    limit = parseInt(consume().value, 10);
    if (isNaN(limit)) throw new Error('Invalid LIMIT value');
  }

  if (pos < tokens.length) {
    throw new Error(`Unexpected token '${tokens[pos].value}' at position ${tokens[pos].pos}`);
  }

  return { type: 'SELECT', distinct, columns, from, joins, where, groupBy, having, orderBy, limit };

  function parseColumnList() {
    const cols = [];
    do {
      cols.push(parseColumn());
    } while (match(',') && (consume(','), true));
    return cols;
  }

  function parseColumn() {
    if (match('*')) {
      consume('*');
      return { type: 'star', table: null };
    }

    const expr = parseExpression();
    let alias = null;
    if (match('AS')) {
      consume('AS');
      alias = consume('IDENTIFIER').value;
    } else if (peek()?.type === 'IDENTIFIER' && !KEYWORDS.has(peek().value.toUpperCase())) {
      const next = peek();
      const after = tokens[pos + 1];
      if (after && after.value === ',') {
        // not alias
      } else if (after && ['FROM', 'WHERE', 'GROUP', 'ORDER', 'LIMIT', 'HAVING', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL'].includes(after.value.toUpperCase())) {
        alias = next.value;
        pos++;
      } else if (!after || after.value === ',') {
        // single identifier expression
      } else if (next && expr.type === 'column') {
        alias = next.value;
        pos++;
      }
    }
    return { ...expr, alias };
  }

  function parseExpression() {
    return parseOr();
  }

  function parseOr() {
    let left = parseAnd();
    while (match('OR')) {
      consume('OR');
      left = { type: 'binary', operator: 'OR', left, right: parseAnd() };
    }
    return left;
  }

  function parseAnd() {
    let left = parseComparison();
    while (match('AND')) {
      consume('AND');
      left = { type: 'binary', operator: 'AND', left, right: parseComparison() };
    }
    return left;
  }

  function parseComparison() {
    let left = parsePrimary();

    if (match('IS')) {
      consume('IS');
      const not = match('NOT') ? (consume('NOT'), true) : false;
      if (match('NULL')) {
        consume('NULL');
        return { type: 'isNull', column: left, not };
      }
    }

    if (['=', '!=', '<>', '<', '>', '<=', '>='].includes(peek()?.value)) {
      const op = consume().value;
      const right = parsePrimary();
      return { type: 'comparison', operator: op, left, right };
    }

    if (match('IN')) {
      consume('IN');
      consume('(');
      const values = [];
      do {
        values.push(parsePrimary());
      } while (match(',') && (consume(','), true));
      consume(')');
      return { type: 'in', column: left, values };
    }

    if (match('LIKE')) {
      consume('LIKE');
      const pattern = parsePrimary();
      return { type: 'like', column: left, pattern };
    }

    if (match('BETWEEN')) {
      consume('BETWEEN');
      const low = parsePrimary();
      consume('AND');
      const high = parsePrimary();
      return { type: 'between', column: left, low, high };
    }

    return left;
  }

  function parsePrimary() {
    if (match('(')) {
      consume('(');
      const expr = parseExpression();
      consume(')');
      return expr;
    }

    if (matchType('NUMBER')) {
      return { type: 'literal', value: parseFloat(consume().value) };
    }

    if (matchType('STRING')) {
      return { type: 'literal', value: consume().value.slice(1, -1) };
    }

    if (match('NULL')) {
      consume('NULL');
      return { type: 'literal', value: null };
    }

    if (['COUNT', 'SUM', 'AVG', 'MIN', 'MAX'].includes(peek()?.value.toUpperCase())) {
      const fn = consume().value.toUpperCase();
      consume('(');
      let arg;
      if (match('*')) {
        consume('*');
        arg = { type: 'star' };
      } else {
        arg = parseExpression();
      }
      consume(')');
      return { type: 'aggregate', function: fn, argument: arg };
    }

    // Column reference
    const parts = [];
    parts.push(consume('IDENTIFIER').value);
    while (match('.')) {
      consume('.');
      parts.push(consume('IDENTIFIER').value);
    }
    if (parts.length === 2) {
      return { type: 'column', table: parts[0], name: parts[1] };
    }
    return { type: 'column', table: null, name: parts[0] };
  }

  function parseTableRef() {
    const name = consume('IDENTIFIER').value;
    let alias = null;
    if (peek() && peek().type === 'IDENTIFIER' && !KEYWORDS.has(peek().value.toUpperCase()) &&
        !['JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'WHERE', 'GROUP', 'ORDER', 'LIMIT', 'ON'].includes(peek().value.toUpperCase())) {
      alias = consume('IDENTIFIER').value;
    }
    return { name, alias: alias || name };
  }

  function parseJoin() {
    let joinType = 'INNER';
    if (match('INNER')) {
      consume('INNER');
      joinType = 'INNER';
    } else if (match('LEFT')) {
      consume('LEFT');
      joinType = 'LEFT';
      if (match('OUTER')) consume('OUTER');
    } else if (match('RIGHT')) {
      consume('RIGHT');
      joinType = 'RIGHT';
      if (match('OUTER')) consume('OUTER');
    } else if (match('FULL')) {
      consume('FULL');
      if (match('OUTER')) consume('OUTER');
      joinType = 'FULL OUTER';
    }
    consume('JOIN');
    const table = parseTableRef();
    consume('ON');
    const condition = parseCondition();
    return { type: joinType, table, condition };
  }

  function parseCondition() {
    return parseExpression();
  }

  function parseGroupByList() {
    const cols = [];
    do {
      cols.push(parseExpression());
    } while (match(',') && (consume(','), true));
    return cols;
  }

  function parseOrderByList() {
    const cols = [];
    do {
      const expr = parseExpression();
      let direction = 'ASC';
      if (match('ASC')) consume('ASC');
      else if (match('DESC')) { consume('DESC'); direction = 'DESC'; }
      cols.push({ ...expr, direction });
    } while (match(',') && (consume(','), true));
    return cols;
  }
}

function tokenize(sql) {
  const tokens = [];
  let i = 0;

  while (i < sql.length) {
    // Skip whitespace
    if (/\s/.test(sql[i])) { i++; continue; }

    // Comments
    if (sql[i] === '-' && sql[i + 1] === '-') {
      while (i < sql.length && sql[i] !== '\n') i++;
      continue;
    }

    // Strings
    if (sql[i] === "'") {
      let str = "'";
      i++;
      while (i < sql.length && sql[i] !== "'") {
        str += sql[i++];
      }
      if (i < sql.length) { str += "'"; i++; }
      tokens.push({ type: 'STRING', value: str, pos: i });
      continue;
    }

    // Numbers
    if (/[0-9]/.test(sql[i]) || (sql[i] === '.' && /[0-9]/.test(sql[i + 1]))) {
      let num = '';
      while (i < sql.length && /[0-9.]/.test(sql[i])) num += sql[i++];
      tokens.push({ type: 'NUMBER', value: num, pos: i });
      continue;
    }

    // Operators and punctuation
    const twoChar = sql.slice(i, i + 2);
    if (['<=', '>=', '!=', '<>'].includes(twoChar)) {
      tokens.push({ type: 'OPERATOR', value: twoChar, pos: i });
      i += 2;
      continue;
    }
    if (['=', '<', '>', '(', ')', ',', '.', '*', ';'].includes(sql[i])) {
      tokens.push({ type: sql[i] === '*' ? 'STAR' : 'OPERATOR', value: sql[i], pos: i });
      i++;
      continue;
    }

    // Identifiers and keywords
    if (/[a-zA-Z_]/.test(sql[i])) {
      let id = '';
      while (i < sql.length && /[a-zA-Z0-9_]/.test(sql[i])) id += sql[i++];
      const upper = id.toUpperCase();
      if (sql[i] === '(' && ['COUNT', 'SUM', 'AVG', 'MIN', 'MAX'].includes(upper)) {
        tokens.push({ type: 'IDENTIFIER', value: id, pos: i });
      } else if (KEYWORDS.has(upper)) {
        tokens.push({ type: 'KEYWORD', value: upper, pos: i });
      } else {
        tokens.push({ type: 'IDENTIFIER', value: id, pos: i });
      }
      continue;
    }

    throw new Error(`Unexpected character '${sql[i]}' at position ${i}`);
  }

  return tokens.filter((t) => t.value !== ';');
}

export function highlightSQL(sql) {
  const keywords = /\b(SELECT|FROM|WHERE|JOIN|INNER|LEFT|RIGHT|FULL|OUTER|ON|GROUP|BY|HAVING|ORDER|ASC|DESC|LIMIT|AS|AND|OR|NOT|NULL|IS|IN|LIKE|BETWEEN|DISTINCT|COUNT|SUM|AVG|MIN|MAX)\b/gi;
  const strings = /('[^']*')/g;
  const numbers = /\b(\d+\.?\d*)\b/g;
  const comments = /(--[^\n]*)/g;

  let escaped = sql
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  escaped = escaped.replace(comments, '<span class="hl-comment">$1</span>');
  escaped = escaped.replace(strings, '<span class="hl-string">$1</span>');
  escaped = escaped.replace(keywords, '<span class="hl-keyword">$1</span>');
  escaped = escaped.replace(numbers, '<span class="hl-number">$1</span>');

  return escaped;
}
