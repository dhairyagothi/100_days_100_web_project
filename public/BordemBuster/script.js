document.addEventListener('DOMContentLoaded', () => {

  let cat = '', budget = '', group = 0, saved = [], last = null, busy = false;

  const loaderMsgs = [
    'Scanning the universe…',
    'Consulting the oracle…',
    'Checking the fun index…',
    'Asking your future self…',
    'Vibes incoming…',
  ];

  const fallback = [
    { activity: 'Learn how to juggle with 3 balls', type: 'recreational', participants: 1, price: 0 },
    { activity: 'Write a short story set in your city', type: 'education', participants: 1, price: 0 },
    { activity: "Cook a recipe from a country you've never visited", type: 'cooking', participants: 1, price: 0.2 },
    { activity: 'Go for a 30-minute walk and take 5 photos', type: 'relaxation', participants: 1, price: 0 },
    { activity: 'Learn 10 words in a new language', type: 'education', participants: 1, price: 0 },
    { activity: 'Sketch a portrait of someone nearby', type: 'recreational', participants: 1, price: 0 },
    { activity: "Call a friend you haven't spoken to in a while", type: 'social', participants: 2, price: 0 },
    { activity: 'Build something out of cardboard', type: 'diy', participants: 1, price: 0 },
    { activity: 'Donate clothes you no longer wear', type: 'charity', participants: 1, price: 0 },
    { activity: 'Learn a new chord on guitar or piano', type: 'music', participants: 1, price: 0 },
    { activity: 'Organize your desktop and files', type: 'busywork', participants: 1, price: 0 },
    { activity: 'Play a board game with someone', type: 'social', participants: 2, price: 0.1 },
    { activity: 'Watch a documentary on a topic you know nothing about', type: 'education', participants: 1, price: 0 },
    { activity: 'Try meditating for 10 minutes', type: 'relaxation', participants: 1, price: 0 },
    { activity: 'Bake cookies from scratch', type: 'cooking', participants: 1, price: 0.2 },
    { activity: 'Repot a houseplant or start a small herb garden', type: 'diy', participants: 1, price: 0.3 },
    { activity: 'Volunteer at a local community event', type: 'charity', participants: 1, price: 0 },
    { activity: 'Create a playlist for a specific mood', type: 'music', participants: 1, price: 0 },
    { activity: 'Do a 30-minute home workout', type: 'recreational', participants: 1, price: 0 },
    { activity: 'Write a letter to your future self', type: 'education', participants: 1, price: 0 },
    { activity: 'Host a movie night with friends', type: 'social', participants: 4, price: 0.1 },
    { activity: 'Try a new recipe from a different cuisine', type: 'cooking', participants: 2, price: 0.3 },
    { activity: 'Make a vision board for your goals', type: 'busywork', participants: 1, price: 0.1 },
    { activity: 'Go stargazing and identify 5 constellations', type: 'relaxation', participants: 2, price: 0 },
    { activity: "Fix something that's been broken around the house", type: 'diy', participants: 1, price: 0.2 },
  ];

  const G = id => document.getElementById(id);

  function showV(v) {
    ['v-idle', 'v-load', 'v-result', 'v-err'].forEach(x =>
      G(x).classList.toggle('hidden', x !== v)
    );
  }

  function getLocal() {
    let pool = fallback;
    if (cat)              pool = pool.filter(a => a.type === cat);
    if (group > 0)        pool = pool.filter(a => a.participants <= group);
    if (budget === 'free')     pool = pool.filter(a => a.price === 0);
    else if (budget === 'cheap')    pool = pool.filter(a => a.price > 0 && a.price <= 0.4);
    else if (budget === 'expensive') pool = pool.filter(a => a.price > 0.4);
    if (!pool.length) pool = fallback;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function renderActivity(data) {
    last = data.activity;
    G('r-type').textContent = data.type.charAt(0).toUpperCase() + data.type.slice(1);

    const actEl = G('r-act');
    actEl.style.animation = 'none';
    actEl.offsetHeight;
    actEl.style.animation = '';
    actEl.textContent = data.activity;

    const tags = G('r-tags');
    tags.innerHTML = '';
    [
      data.participants === 1 ? 'Solo' : `${data.participants} people`,
      data.price === 0 ? 'Free' : data.price <= 0.4 ? 'Cheap' : 'Pricey'
    ].forEach(t => {
      const s = document.createElement('span');
      s.className = 'r-tag';
      s.textContent = t;
      tags.appendChild(s);
    });

    showV('v-result');
    G('again-btn').classList.remove('hidden');
    G('save-btn').classList.remove('hidden');
  }

  async function go() {
    if (busy) return;
    busy = true;

    G('go-btn').disabled = true;
    G('go-lbl').textContent = 'Finding…';
    G('again-btn').classList.add('hidden');
    G('save-btn').classList.add('hidden');
    G('save-btn').classList.remove('ok');
    G('save-btn').innerHTML = '<i class="ti ti-bookmark" aria-hidden="true"></i> Save';
    G('spin-txt').textContent = loaderMsgs[Math.floor(Math.random() * loaderMsgs.length)];
    showV('v-load');

    let url = 'https://www.boredapi.com/api/activity?';
    if (cat)              url += `type=${encodeURIComponent(cat)}&`;
    if (group)            url += `participants=${group}&`;
    if (budget === 'free')     url += 'price=0.0&';
    else if (budget === 'cheap')    url += 'minprice=0.1&maxprice=0.4&';
    else if (budget === 'expensive') url += 'minprice=0.5&maxprice=1.0&';

    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 5000);
      const res = await fetch(url, { signal: ctrl.signal });
      clearTimeout(timer);
      const data = await res.json();
      renderActivity(data.error ? getLocal() : data);
    } catch {
      renderActivity(getLocal());
    } finally {
      busy = false;
      G('go-btn').disabled = false;
      G('go-lbl').textContent = 'Find my activity';
    }
  }

  // ── Event listeners ──
  G('cat-grid').addEventListener('click', e => {
    const b = e.target.closest('.cat-btn');
    if (!b) return;
    document.querySelectorAll('.cat-btn').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    cat = b.dataset.val;
  });

  G('budget-list').addEventListener('click', e => {
    const b = e.target.closest('.b-row');
    if (!b) return;
    document.querySelectorAll('.b-row').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    budget = b.dataset.val;
  });

  G('size-btns').addEventListener('click', e => {
    const b = e.target.closest('.sz-btn');
    if (!b) return;
    document.querySelectorAll('.sz-btn').forEach(x => x.classList.remove('on'));
    b.classList.add('on');
    group = parseInt(b.dataset.val) || 0;
  });

  G('go-btn').addEventListener('click', go);
  G('again-btn').addEventListener('click', go);

  G('save-btn').addEventListener('click', () => {
    if (!last || saved.includes(last)) return;
    saved.push(last);
    G('saved-lbl').textContent = `Saved · ${saved.length}`;
    renderSaved();
    const btn = G('save-btn');
    btn.classList.add('ok');
    btn.innerHTML = '<i class="ti ti-check" aria-hidden="true"></i> Saved!';
    setTimeout(() => {
      btn.classList.remove('ok');
      btn.innerHTML = '<i class="ti ti-bookmark" aria-hidden="true"></i> Save';
    }, 2000);
  });

  G('saved-toggle').addEventListener('click', () => {
    const p = G('saved-panel');
    p.classList.toggle('hidden');
    if (!p.classList.contains('hidden')) renderSaved();
  });

  G('sp-close').addEventListener('click', () => G('saved-panel').classList.add('hidden'));

  G('sp-body').addEventListener('click', e => {
    const b = e.target.closest('.sp-del');
    if (!b) return;
    saved.splice(parseInt(b.dataset.i), 1);
    G('saved-lbl').textContent = `Saved · ${saved.length}`;
    renderSaved();
  });

  function renderSaved() {
    const body = G('sp-body');
    if (!saved.length) {
      body.innerHTML = '<div class="sp-empty">Nothing saved yet.</div>';
      return;
    }
    const list = document.createElement('div');
    list.className = 'sp-list';
    saved.forEach((item, i) => {
      const row = document.createElement('div');
      row.className = 'sp-item';
      row.innerHTML = `<span>${item}</span><button class="sp-del" data-i="${i}" aria-label="Remove"><i class="ti ti-x" aria-hidden="true"></i></button>`;
      list.appendChild(row);
    });
    body.innerHTML = '';
    body.appendChild(list);
  }

  showV('v-idle');
});
