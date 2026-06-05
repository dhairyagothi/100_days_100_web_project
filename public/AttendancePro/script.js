let data = JSON.parse(localStorage.getItem('att_v5')) || { subjects: [], logs: [] };

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

        let goalStatus = "";
        if (neededFromRemaining > remaining) {
            goalStatus = `<span style="color:var(--danger)"><b>Impossible</b><br>Max possible: ${(((s.p + remaining)/s.total)*100).toFixed(1)}%</span>`;
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

    data.logs.slice(-15).reverse().forEach(log => {
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

window.onclick = function(event) {
    let modal = document.getElementById('addModal');
    if (event.target === modal) {
        closeModal();
    }
}

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
            target: parseFloat(target)
        });
        render();
        closeModal();
    }
}

function updateTotal(i, val) { data.subjects[i].total = parseInt(val); render(); }

function update(i, field, val) {
    if (val === -1 && data.subjects[i][field] === 0) return;
    data.subjects[i][field] += val;
    data.logs.push({ sub: data.subjects[i].name, type: (field==='p'?'P':'A') + (val>0?'+':'-'), date: new Date().toLocaleTimeString() });
    render();
}

function removeSub(i) { if(confirm("Delete?")) { data.subjects.splice(i, 1); render(); } }

render();