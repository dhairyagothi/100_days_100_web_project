let data = JSON.parse(localStorage.getItem('att_v5')) || {
  subjects: [],
  logs: [],
};

function render() {
  const body = document.getElementById('attendance-body');
  const logBox = document.getElementById('history-log');
  body.innerHTML = '';
  logBox.innerHTML = '';

  data.subjects.forEach((s, i) => {
    const targetPct = s.target || 80;
    const targetDec = targetPct / 100;

    const conducted = s.p + s.a;
    const remaining = s.total - conducted;
    const currentPct = conducted === 0 ? 0 : ((s.p / conducted) * 100).toFixed(1);

    const neededTotal = Math.ceil(targetDec * s.total);
    const neededFromRemaining = Math.max(0, neededTotal - s.p);

    let goalStatus = '';
    if (neededFromRemaining > remaining) {
      goalStatus = `<span style="color:var(--danger)"><b>Impossible</b><br>Max possible: ${(((s.p + remaining) / s.total) * 100).toFixed(1)}%</span>`;
    } else {
      goalStatus = `Attend <b>${neededFromRemaining}</b> more<br><small>out of ${remaining} left</small>`;
    }

    body.innerHTML += `
            <tr>
                <td><b>${s.name}</b></td>
                <td><input type="number" value="${s.total}" onchange="updateTotal(${i}, this.value)" style="width:50px"></td>
                <td>
                    <div class="counter-group">
                        <button class="btn btn-dec" onclick="update(${i}, 'p', -1)">-</button>
                        <span>${s.p}</span>
                        <button class="btn btn-inc" onclick="update(${i}, 'p', 1)">+</button>
                    </div>
                </td>
                <td>
                    <div class="counter-group">
                        <button class="btn btn-dec" onclick="update(${i}, 'a', -1)">-</button>
                        <span>${s.a}</span>
                        <button class="btn btn-inc" onclick="update(${i}, 'a', 1)">+</button>
                    </div>
                </td>
                <td style="color:${parseFloat(currentPct) < targetPct ? 'var(--danger)' : 'var(--success)'}; font-weight:bold">${currentPct}%</td>
                <td>${goalStatus}</td>
                <td><button class="btn" style="color:#94a3b8; background: transparent;" onclick="removeSub(${i})">&times;</button></td>
            </tr>`;
  });

  data.logs.slice(-15).reverse().forEach((log) => {
    logBox.innerHTML += `<div class="history-item"><span><b>${log.sub}</b></span><span>${log.type}</span></div>`;
  });

  localStorage.setItem('att_v5', JSON.stringify(data));
}

function openModal() {
  document.getElementById('addModal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('addModal').style.display = 'none';
  document.getElementById('newSubjectForm').reset();
}

window.onclick = function (event) {
  let modal = document.getElementById('addModal');
  if (event.target === modal) {
    closeModal();
  }
};

function addSubject(event) {
  event.preventDefault();

  const name = document.getElementById('subName').value;
  const total = document.getElementById('subTotal').value;
  const target = document.getElementById('subTarget').value;

  if (name && total && target) {
    data.subjects.push({
      name: name,
      p: 0,
      a: 0,
      total: parseInt(total),
      target: parseFloat(target),
    });
    render();
    closeModal();
  }
}

function updateTotal(i, val) {
  const subject = data.subjects[i];
  const conducted = subject.p + subject.a;
  subject.total = Math.max(parseInt(val) || 1, conducted);
  render();
}

function update(i, field, val) {
  const subject = data.subjects[i];

  if (val === -1 && subject[field] === 0) return;

  const conducted = subject.p + subject.a;

  if (val === 1 && conducted >= subject.total) {
    alert("Total classes limit reached.");
    return;
  }

  subject[field] += val;

  data.logs.push({
    sub: subject.name,
    type: (field === 'p' ? 'P' : 'A') + (val > 0 ? '+' : '-'),
    date: new Date().toLocaleTimeString()
  });

  render();
}

function removeSub(i) {
  if (confirm('Delete?')) {
    data.subjects.splice(i, 1);
    render();
  }
}

// ========== NEW FEATURES: EXPORT, IMPORT, PRINT ==========

// 1. EXPORT CSV
function exportCSV() {
  if (data.subjects.length === 0) {
    alert('No data to export!');
    return;
  }

  // Create CSV header
  let csv = 'Subject,Total Classes,Present,Absent,Attendance %,Target %\n';

  // Add data rows
  data.subjects.forEach(s => {
    const conducted = s.p + s.a;
    const pct = conducted === 0 ? 0 : ((s.p / conducted) * 100).toFixed(1);
    csv += `"${s.name}",${s.total},${s.p},${s.a},${pct},${s.target || 80}\n`;
  });

  // Add history log (optional section)
  csv += '\nHistory Log\n';
  csv += 'Subject,Action,Time\n';
  data.logs.forEach(log => {
    csv += `"${log.sub}",${log.type},${log.date}\n`;
  });

  // Download file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `attendance_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 2. IMPORT CSV
function importCSV(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const text = e.target.result;
      const lines = text.split('\n');
      
      // Find where subject data starts (skip header)
      let startIndex = 0;
      for (let i = 0; i < Math.min(lines.length, 5); i++) {
        if (lines[i].includes('Subject') && lines[i].includes('Total Classes')) {
          startIndex = i + 1;
          break;
        }
      }

      // Parse subjects
      let importedCount = 0;
      const subjects = [];
      
      for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        // Check if it's the history section
        if (line.includes('History Log') || line.includes('Subject,Action,Time')) {
          break;
        }

        // Parse CSV line (handle quoted fields)
        const values = parseCSVLine(line);
        if (values.length >= 5) {
          const name = values[0].replace(/^"|"$/g, '').trim();
          const total = parseInt(values[1]);
          const present = parseInt(values[2]);
          const absent = parseInt(values[3]);
          
          if (name && !isNaN(total) && !isNaN(present) && !isNaN(absent)) {
            subjects.push({
              name: name,
              total: total,
              p: present,
              a: absent,
              target: values.length > 5 ? parseFloat(values[5]) || 80 : 80
            });
            importedCount++;
          }
        }
      }

      if (subjects.length === 0) {
        alert('No valid subjects found in CSV file!');
        return;
      }

      // Confirm import
      if (data.subjects.length > 0) {
        if (!confirm(`This will replace all ${data.subjects.length} existing subjects with ${subjects.length} subjects from CSV. Continue?`)) {
          return;
        }
      }

      // Replace data
      data.subjects = subjects;
      data.logs = []; // Clear logs on import
      render();
      
      alert(`Successfully imported ${importedCount} subjects!`);
      
    } catch (error) {
      alert('Error importing CSV: ' + error.message);
      console.error(error);
    }
  };
  
  reader.readAsText(file);
  event.target.value = ''; // Reset file input
}

// Helper: Parse CSV line (handles quoted fields)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

// 3. PRINT REPORT
function printReport() {
  if (data.subjects.length === 0) {
    alert('No data to print!');
    return;
  }

  // Create print window
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  // Calculate summary stats
  let totalClasses = 0;
  let totalPresent = 0;
  let subjectsAtRisk = 0;
  
  data.subjects.forEach(s => {
    const conducted = s.p + s.a;
    totalClasses += conducted;
    totalPresent += s.p;
    const pct = conducted === 0 ? 0 : (s.p/conducted * 100);
    if (pct < (s.target || 80)) subjectsAtRisk++;
  });
  
  const overallPct = totalClasses === 0 ? 0 : (totalPresent/totalClasses * 100);
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Build HTML content
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Attendance Report</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1e293b; }
        h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .date { color: #64748b; font-size: 0.9rem; }
        .summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 30px; }
        .summary-card { background: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; }
        .summary-card h3 { margin: 0; font-size: 0.9rem; color: #64748b; }
        .summary-card .value { font-size: 1.8rem; font-weight: bold; margin-top: 5px; }
        .value.green { color: #16a34a; }
        .value.red { color: #dc2626; }
        .value.blue { color: #2563eb; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #f1f5f9; padding: 12px; text-align: left; font-weight: 600; }
        td { padding: 10px; border-bottom: 1px solid #e2e8f0; }
        .pct-green { color: #16a34a; font-weight: bold; }
        .pct-red { color: #dc2626; font-weight: bold; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #94a3b8; font-size: 0.8rem; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>📊 Attendance Report</h1>
        <div class="date">${currentDate}</div>
      </div>
      
      <div class="summary">
        <div class="summary-card">
          <h3>Total Subjects</h3>
          <div class="value blue">${data.subjects.length}</div>
        </div>
        <div class="summary-card">
          <h3>Overall Attendance</h3>
          <div class="value ${overallPct >= 75 ? 'green' : 'red'}">${overallPct.toFixed(1)}%</div>
        </div>
        <div class="summary-card">
          <h3>Total Classes</h3>
          <div class="value blue">${totalClasses}</div>
        </div>
        <div class="summary-card">
          <h3>Subjects at Risk</h3>
          <div class="value red">${subjectsAtRisk}</div>
        </div>
      </div>
      
      <h3>Subject-wise Attendance</h3>
      <table>
        <thead>
          <tr>
            <th>Subject</th>
            <th>Total</th>
            <th>Present</th>
            <th>Absent</th>
            <th>Attendance %</th>
            <th>Target %</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
  `;

  // Add subject rows
  data.subjects.forEach(s => {
    const conducted = s.p + s.a;
    const pct = conducted === 0 ? 0 : (s.p/conducted * 100);
    const target = s.target || 80;
    const status = pct >= target ? '✅ On Track' : '⚠️ At Risk';
    const color = pct >= target ? 'pct-green' : 'pct-red';
    
    html += `
      <tr>
        <td><b>${s.name}</b></td>
        <td>${s.total}</td>
        <td>${s.p}</td>
        <td>${s.a}</td>
        <td class="${color}">${pct.toFixed(1)}%</td>
        <td>${target}%</td>
        <td>${status}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
      
      <div class="footer">
        <p>Generated on ${currentDate} | Attendance Pro Report</p>
      </div>
      
      <div class="no-print" style="margin-top: 20px; text-align: center;">
        <button onclick="window.print()" style="padding: 10px 30px; background: #2563eb; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem;">🖨️ Print</button>
        <button onclick="window.close()" style="padding: 10px 30px; background: #94a3b8; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem; margin-left: 10px;">Close</button>
      </div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

render();