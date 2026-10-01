/**
 * CSV export utility
 */

export function downloadCSV(columns, rows, filename = 'query_result.csv') {
  if (!columns || !rows || rows.length === 0) return;

  const escape = (val) => {
    if (val === null || val === undefined) return '';
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const header = columns.map(escape).join(',');
  const body = rows.map((row) => columns.map((col) => escape(row[col])).join(',')).join('\n');
  const csv = header + '\n' + body;

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
