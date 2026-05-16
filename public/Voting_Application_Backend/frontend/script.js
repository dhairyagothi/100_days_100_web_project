const API_BASE = 'http://localhost:3000';

let token = localStorage.getItem('token');
let userData = null;

function showLoading(show) {
    document.getElementById('loadingOverlay').style.display = show ? 'flex' : 'none';
}

function showError(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.style.display = msg ? 'block' : 'none'; }
}

function showSuccess(id, msg) {
    const el = document.getElementById(id);
    if (el) { el.textContent = msg; el.style.display = msg ? 'block' : 'none'; }
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const page = document.getElementById('page-' + pageId);
    if (page) page.classList.add('active');
    window.scrollTo(0, 0);
}

function navigateTo(pageId) {
    if (pageId !== 'login' && pageId !== 'signup' && !token) {
        showPage('login');
        return;
    }
    showPage(pageId);
    if (pageId === 'home') loadHome();
    else if (pageId === 'candidates') loadCandidates();
    else if (pageId === 'results') loadResults();
    else if (pageId === 'profile') loadProfile();
    else if (pageId === 'admin') loadAdmin();
}

function updateNav() {
    const show = token ? 'inline-block' : 'none';
    ['navHome', 'navCandidates', 'navResults', 'navProfile', 'navLogout'].forEach(id => {
        document.getElementById(id).style.display = show;
    });
    document.getElementById('navAdmin').style.display = 'none';
    if (token && userData && userData.role === 'admin') {
        document.getElementById('navAdmin').style.display = 'inline-block';
    }
}

// ==================== AUTH ====================

async function handleLogin(e) {
    e.preventDefault();
    showError('loginError', '');
    showLoading(true);
    try {
        const res = await fetch(API_BASE + '/user/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                aadharCardNumber: parseInt(document.getElementById('loginAadhar').value),
                password: document.getElementById('loginPassword').value
            })
        });
        const data = await res.json();
        if (!res.ok) { showError('loginError', data.error || 'Login failed'); showLoading(false); return; }
        token = data.token;
        localStorage.setItem('token', token);
        await loadUserData();
        updateNav();
        navigateTo('home');
    } catch (err) {
        showError('loginError', 'Cannot connect to server. Make sure the backend is running.');
    }
    showLoading(false);
}

async function handleSignup(e) {
    e.preventDefault();
    showError('signupError', '');
    showLoading(true);
    try {
        const body = {
            name: document.getElementById('signupName').value,
            age: parseInt(document.getElementById('signupAge').value),
            aadharCardNumber: parseInt(document.getElementById('signupAadhar').value),
            address: document.getElementById('signupAddress').value,
            email: document.getElementById('signupEmail').value || undefined,
            mobile: document.getElementById('signupMobile').value || undefined,
            password: document.getElementById('signupPassword').value
        };
        const res = await fetch(API_BASE + '/user/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (!res.ok) { showError('signupError', data.error || 'Signup failed'); showLoading(false); return; }
        token = data.token;
        localStorage.setItem('token', token);
        await loadUserData();
        updateNav();
        navigateTo('home');
    } catch (err) {
        showError('signupError', 'Cannot connect to server.');
    }
    showLoading(false);
}

function logout() {
    token = null;
    userData = null;
    localStorage.removeItem('token');
    updateNav();
    showPage('login');
    document.getElementById('loginAadhar').value = '';
    document.getElementById('loginPassword').value = '';
}

async function loadUserData() {
    if (!token) return;
    try {
        const res = await fetch(API_BASE + '/user/profile', {
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!res.ok) { logout(); return; }
        const data = await res.json();
        userData = data.user;
    } catch (err) {
        console.error('Failed to load user data');
    }
}

// ==================== HOME ====================

async function loadHome() {
    if (!userData) await loadUserData();
    if (!userData) { navigateTo('login'); return; }
    document.getElementById('userName').textContent = userData.name;
    const statusEl = document.getElementById('voteStatus');
    const iconEl = document.getElementById('statusIcon');
    if (userData.isVoted) {
        statusEl.textContent = 'You have cast your vote';
        iconEl.className = 'status-icon voted';
        iconEl.innerHTML = '&#10003;';
    } else {
        statusEl.textContent = 'You have not voted yet';
        iconEl.className = 'status-icon not-voted';
        iconEl.innerHTML = '&#9888;';
    }
}

// ==================== CANDIDATES ====================

async function loadCandidates() {
    const list = document.getElementById('candidatesList');
    const msg = document.getElementById('voteMessage');
    msg.style.display = 'none';
    msg.className = 'vote-msg';
    showLoading(true);
    try {
        const res = await fetch(API_BASE + '/candidate');
        if (!res.ok) { list.innerHTML = '<p>Failed to load candidates.</p>'; showLoading(false); return; }
        const candidates = await res.json();
        if (candidates.length === 0) {
            list.innerHTML = '<p style="text-align:center;color:var(--text-muted)">No candidates available.</p>';
            showLoading(false);
            return;
        }
        list.innerHTML = candidates.map(c => `
            <div class="candidate-card">
                <div class="candidate-info">
                    <h3>${c.name}</h3>
                    <p>${c.party}</p>
                </div>
                <button class="btn-primary" onclick="castVote('${c._id}')" id="vote-${c._id}" ${userData && userData.isVoted ? 'disabled' : ''}>
                    ${userData && userData.isVoted ? 'Voted' : 'Vote'}
                </button>
            </div>
        `).join('');
    } catch (err) {
        list.innerHTML = '<p>Error loading candidates.</p>';
    }
    showLoading(false);
}

async function castVote(candidateId) {
    if (!token) { navigateTo('login'); return; }
    showLoading(true);
    try {
        const res = await fetch(API_BASE + '/candidate/vote/' + candidateId, {
            method: 'POST',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();
        const msg = document.getElementById('voteMessage');
        if (res.ok) {
            msg.textContent = 'Vote recorded successfully!';
            msg.className = 'vote-msg success';
            msg.style.display = 'block';
            document.querySelectorAll('.candidate-card .btn-primary').forEach(b => {
                b.disabled = true;
                b.textContent = 'Voted';
            });
            userData.isVoted = true;
        } else {
            msg.textContent = data.message || data.error || 'Voting failed';
            msg.className = 'vote-msg error';
            msg.style.display = 'block';
        }
    } catch (err) {
        const msg = document.getElementById('voteMessage');
        msg.textContent = 'Cannot connect to server.';
        msg.className = 'vote-msg error';
        msg.style.display = 'block';
    }
    showLoading(false);
}

// ==================== RESULTS ====================

async function loadResults() {
    const container = document.getElementById('resultsContainer');
    showLoading(true);
    try {
        const res = await fetch(API_BASE + '/candidate/vote/count');
        if (!res.ok) { container.innerHTML = '<p>Failed to load results.</p>'; showLoading(false); return; }
        const results = await res.json();
        if (results.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:var(--text-muted)">No votes cast yet.</p>';
            showLoading(false);
            return;
        }
        const maxCount = Math.max(...results.map(r => r.count), 1);
        container.innerHTML = results.map(r => `
            <div class="result-bar">
                <div class="result-bar-header">
                    <span class="party">${r.party}</span>
                    <span class="count">${r.count} vote${r.count !== 1 ? 's' : ''}</span>
                </div>
                <div class="result-track">
                    <div class="result-fill" style="width:${(r.count / maxCount) * 100}%"></div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = '<p>Error loading results.</p>';
    }
    showLoading(false);
}

// ==================== PROFILE ====================

async function loadProfile() {
    if (!userData) await loadUserData();
    if (!userData) { navigateTo('login'); return; }
    const card = document.getElementById('profileCard');
    card.innerHTML = `
        <div class="profile-field"><span class="field-label">Name</span><span class="field-value">${userData.name}</span></div>
        <div class="profile-field"><span class="field-label">Age</span><span class="field-value">${userData.age}</span></div>
        <div class="profile-field"><span class="field-label">Aadhar Number</span><span class="field-value">${userData.aadharCardNumber}</span></div>
        <div class="profile-field"><span class="field-label">Address</span><span class="field-value">${userData.address}</span></div>
        <div class="profile-field"><span class="field-label">Email</span><span class="field-value">${userData.email || 'N/A'}</span></div>
        <div class="profile-field"><span class="field-label">Mobile</span><span class="field-value">${userData.mobile || 'N/A'}</span></div>
        <div class="profile-field"><span class="field-label">Role</span><span class="field-value">${userData.role}</span></div>
        <div class="profile-field"><span class="field-label">Vote Status</span><span class="field-value">${userData.isVoted ? 'Voted' : 'Not voted'}</span></div>
    `;
}

async function handlePasswordChange(e) {
    e.preventDefault();
    showError('passwordError', '');
    showSuccess('passwordSuccess', '');
    showLoading(true);
    try {
        const res = await fetch(API_BASE + '/user/profile/password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                currentPassword: document.getElementById('currentPassword').value,
                newPassword: document.getElementById('newPassword').value
            })
        });
        const data = await res.json();
        if (res.ok) {
            showSuccess('passwordSuccess', 'Password updated successfully!');
            document.getElementById('currentPassword').value = '';
            document.getElementById('newPassword').value = '';
        } else {
            showError('passwordError', data.error || 'Password change failed');
        }
    } catch (err) {
        showError('passwordError', 'Cannot connect to server.');
    }
    showLoading(false);
}

// ==================== ADMIN ====================

async function loadAdmin() {
    if (!userData) await loadUserData();
    if (!userData || userData.role !== 'admin') {
        showPage('home');
        return;
    }
    await loadAdminCandidates();
}

async function loadAdminCandidates() {
    const list = document.getElementById('adminCandidatesList');
    showLoading(true);
    try {
        const res = await fetch(API_BASE + '/candidate');
        if (!res.ok) { list.innerHTML = '<p>Failed to load.</p>'; showLoading(false); return; }
        const candidates = await res.json();
        if (candidates.length === 0) {
            list.innerHTML = '<p style="color:var(--text-muted)">No candidates yet.</p>';
            showLoading(false);
            return;
        }
        list.innerHTML = candidates.map(c => `
            <div class="admin-candidate-item">
                <div class="info">
                    <span class="name">${c.name}</span>
                    <span class="party">${c.party}</span>
                </div>
                <div class="admin-actions">
                    <button class="btn-danger" onclick="deleteCandidate('${c._id}')">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (err) {
        document.getElementById('adminCandidatesList').innerHTML = '<p>Error loading.</p>';
    }
    showLoading(false);
}

async function handleAddCandidate(e) {
    e.preventDefault();
    showError('adminError', '');
    showSuccess('adminSuccess', '');
    showLoading(true);
    try {
        const body = {
            name: document.getElementById('candidateName').value,
            party: document.getElementById('candidateParty').value,
            age: parseInt(document.getElementById('candidateAge').value)
        };
        const res = await fetch(API_BASE + '/candidate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        if (res.ok) {
            showSuccess('adminSuccess', 'Candidate added successfully!');
            document.getElementById('candidateName').value = '';
            document.getElementById('candidateParty').value = '';
            document.getElementById('candidateAge').value = '';
            await loadAdminCandidates();
        } else {
            showError('adminError', data.message || data.error || 'Failed to add candidate');
        }
    } catch (err) {
        showError('adminError', 'Cannot connect to server.');
    }
    showLoading(false);
}

async function deleteCandidate(id) {
    if (!confirm('Delete this candidate?')) return;
    showLoading(true);
    try {
        const res = await fetch(API_BASE + '/candidate/' + id, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + token }
        });
        if (res.ok) {
            showSuccess('adminSuccess', 'Candidate deleted!');
            await loadAdminCandidates();
        } else {
            const data = await res.json();
            showError('adminError', data.message || data.error || 'Delete failed');
        }
    } catch (err) {
        showError('adminError', 'Cannot connect to server.');
    }
    showLoading(false);
}

// ==================== INIT ====================

document.addEventListener('DOMContentLoaded', async () => {
    if (token) {
        await loadUserData();
        updateNav();
        navigateTo('home');
    } else {
        showPage('login');
        updateNav();
    }
});
