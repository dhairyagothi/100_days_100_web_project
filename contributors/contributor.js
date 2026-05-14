/* ============================================
   CONTRIBUTORS PAGE — JS (Self-contained)
   ============================================ */

const REPO_OWNER = "dhairyagothi";
const REPO_NAME = "100_days_100_web_project";

/* ---------- THEME ---------- */
function initTheme() {
    const btn = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');
    if (!btn) return;
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
        document.body.classList.add('light-mode');
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        document.body.classList.remove('light-mode');
    }
    btn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-mode');
        icon.classList.replace(isLight ? 'fa-moon' : 'fa-sun', isLight ? 'fa-sun' : 'fa-moon');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
}



/* ---------- SCROLL TOP ---------- */
function initScrollTop() {
    const btn = document.getElementById('scrollTop');
    if (!btn) return;
    addEventListener('scroll', () => btn.classList.toggle('show', scrollY > 400));
    btn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---------- ANIMATED COUNTER ---------- */
function animateCount(id, target) {
    const el = document.getElementById(id);
    if (!el || target <= 0) { if (el) el.textContent = '0'; return; }
    let cur = 0;
    const step = Math.max(1, Math.ceil(target / 50));
    const iv = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(iv); }
        el.textContent = cur.toLocaleString();
    }, 30);
}

/* ---------- GITHUB STATS ---------- */
async function fetchStats() {
    try {
        const [rr, pr] = await Promise.all([
            fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`),
            fetch(`https://api.github.com/search/issues?q=repo:${REPO_OWNER}/${REPO_NAME}+type:pr+state:open`)
        ]);
        if (!rr.ok || !pr.ok) throw new Error('fail');
        const rd = await rr.json(), pd = await pr.json();
        animateCount('starCount', rd.stargazers_count);
        animateCount('forkCount', rd.forks_count);
        animateCount('issueCount', rd.open_issues_count - pd.total_count);
        animateCount('prCount', pd.total_count);
    } catch (e) { console.error('Stats:', e); }
}

/* ---------- CONTRIBUTORS ---------- */
async function fetchContributors() {
    const grid = document.getElementById('contributors');
    const sub = document.getElementById('contribSub');
    const countEl = document.getElementById('contributorCount');

    try {
        const res = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contributors?per_page=100`
        );
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();

        if (countEl) animateCount('contributorCount', data.length);
        if (sub) sub.textContent = `${data.length} contributors and counting`;

        // Total commits
        const totalCommits = data.reduce((sum, c) => sum + c.contributions, 0);
        animateCount('totalCommits', totalCommits);

        grid.innerHTML = '';
        data.forEach(c => {
            const card = document.createElement('div');
            card.className = 'contrib-card';
            card.innerHTML = `
                <img class="contrib-avatar" src="${c.avatar_url}" alt="${c.login}" loading="lazy">
                <div class="contrib-info">
                    <div class="contrib-name">${c.login}</div>
                    <div class="contrib-commits">${c.contributions} <span>commits</span></div>
                </div>
                <a href="${c.html_url}" target="_blank" class="contrib-link">
                    <i class="fab fa-github"></i> Profile
                </a>
            `;
            grid.appendChild(card);
        });
    } catch (e) {
        console.error('Contributors:', e);
        if (grid) grid.innerHTML = `<p style="color:var(--text-muted)">Failed to load contributors.</p>`;
    }
}

/* ---------- STARGAZERS ---------- */
async function fetchStargazers() {
    const wrap = document.getElementById('stargazers');
    if (!wrap) return;

    try {
        const res = await fetch(
            `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/stargazers?per_page=100`
        );
        if (!res.ok) throw new Error('Failed');
        const data = await res.json();
        wrap.innerHTML = '';
        data.forEach(s => {
            const a = document.createElement('a');
            a.href = s.html_url;
            a.target = '_blank';
            a.className = 'sg-item';
            a.title = s.login;
            a.innerHTML = `<img src="${s.avatar_url}" alt="${s.login}" loading="lazy">`;
            wrap.appendChild(a);
        });
    } catch (e) {
        console.error('Stargazers:', e);
    }
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initScrollTop();
    fetchStats();
    fetchContributors();
    fetchStargazers();
    initScene();
});

/* ---------- THREE.JS BACKGROUND ---------- */
function initScene() {
    const canvas = document.getElementById('three-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    const starGeo = new THREE.BufferGeometry();
    const starCount = 800;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        starPos[i*3] = (Math.random() - 0.5) * 100;
        starPos[i*3+1] = (Math.random() - 0.5) * 100;
        starPos[i*3+2] = (Math.random() - 0.5) * 100;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.2 });
    const stars = new THREE.Points(starGeo, starMat);
    mainGroup.add(stars);

    const gridCount = 40;
    const gridGeo = new THREE.PlaneGeometry(100, 100, gridCount, gridCount);
    const gridMat = new THREE.MeshBasicMaterial({ 
        color: 0x6366f1, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.05,
        side: THREE.DoubleSide
    });
    const grid = new THREE.Mesh(gridGeo, gridMat);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -6;
    mainGroup.add(grid);

    camera.position.z = 15;

    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => {
        mx = (e.clientX / innerWidth - 0.5);
        my = (e.clientY / innerHeight - 0.5);
    });

    (function loop() {
        requestAnimationFrame(loop);
        const t = Date.now() * 0.0005;

        const pos = grid.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const z = Math.sin(x * 0.15 + t) * 1.0 + Math.cos(y * 0.15 + t) * 1.0;
            pos.setZ(i, z);
        }
        pos.needsUpdate = true;

        mainGroup.rotation.y += (mx * 0.03 - mainGroup.rotation.y) * 0.05;
        mainGroup.rotation.x += (my * 0.03 - mainGroup.rotation.x) * 0.05;
        stars.rotation.y += 0.0001;

        renderer.render(scene, camera);
    })();

    addEventListener('resize', () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
    });
}
