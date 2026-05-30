// ChronoSphere - script.js
// Modular vanilla JS controlling timeline rendering, filtering, interactions and animations

const state = {
  events: [],
  nodes: [],
  filters: {categories: new Set(), eras: new Set(), importance: new Set()},
  search: ''
};

// Utility: fetch local JSON and initialize
async function init(){
  try{
    const res = await fetch('events.json');
    state.events = await res.json();
    state.events.sort((a,b)=>b.year - a.year);
    extractFilterOptions();
    renderFilters();
    renderTimeline();
    initUI();
    initParticles();
    initHero();
  }catch(err){
    console.error('Failed to load events.json',err);
  }
}

// Extract categories/eras present
function extractFilterOptions(){
  const cats = new Set();
  const eras = new Set();
  state.events.forEach(e=>{cats.add(e.category); eras.add(e.era);});
  state.allCategories = [...cats];
  state.allEras = [...eras];
}

// Render filter chips
function renderFilters(){
  const catSelect = document.getElementById('categoryFilter');
  const eraSelect = document.getElementById('eraFilter');
  const impSelect = document.getElementById('importanceFilter');

  catSelect.innerHTML = '<option value="">All categories</option>' + state.allCategories.sort().map(c => `<option value="${c}">${c}</option>`).join('');
  eraSelect.innerHTML = '<option value="">All eras</option>' + state.allEras.map(e => `<option value="${e}">${e}</option>`).join('');
  impSelect.innerHTML = '<option value="">All importances</option>' + [1,2,3,4,5].map(i => `<option value="${i}">${i}</option>`).join('');

  buildCustomDropdown(catSelect, 'All categories', 'categories');
  buildCustomDropdown(eraSelect, 'All eras', 'eras');
  buildCustomDropdown(impSelect, 'All importances', 'importance');
}

function buildCustomDropdown(selectEl, placeholder, filterKey){
  const wrapper = document.createElement('div'); wrapper.className = 'custom-dropdown';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'dropdown-toggle';
  button.setAttribute('aria-haspopup', 'listbox');
  button.setAttribute('aria-expanded', 'false');
  const valueEl = document.createElement('span'); valueEl.className = 'dropdown-value';
  valueEl.textContent = placeholder;
  const arrow = document.createElement('span'); arrow.className = 'dropdown-arrow';
  button.append(valueEl, arrow);

  const menu = document.createElement('ul');
  menu.className = 'dropdown-menu';
  menu.setAttribute('role', 'listbox');

  wrapper.append(button, menu);
  selectEl.parentNode.insertBefore(wrapper, selectEl);
  wrapper.appendChild(selectEl);
  selectEl.hidden = true;

  const options = Array.from(selectEl.options).map(opt => ({value: opt.value, label: opt.text}));
  options.forEach(opt => {
    const item = document.createElement('li');
    item.className = 'dropdown-item';
    item.textContent = opt.label;
    item.dataset.value = opt.value;
    item.setAttribute('role', 'option');
    item.addEventListener('click', () => {
      const selectedLabel = opt.label;
      valueEl.textContent = selectedLabel;
      selectEl.value = opt.value;
      wrapper.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
      setFilterValue(filterKey, opt.value);
      highlightDropdownItem(menu, opt.value);
    });
    menu.appendChild(item);
  });

  button.addEventListener('click', e => {
    e.stopPropagation();
    const open = !wrapper.classList.contains('open');
    document.querySelectorAll('.custom-dropdown.open').forEach(dd => {
      if(dd !== wrapper) dd.classList.remove('open');
    });
    wrapper.classList.toggle('open', open);
    button.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', () => {
    wrapper.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
  });

  highlightDropdownItem(menu, selectEl.value);
}

function setFilterValue(filterKey, value){
  const set = state.filters[filterKey];
  set.clear();
  if(value) set.add(value);
  applyFilters();
}

function highlightDropdownItem(menu, value){
  menu.querySelectorAll('.dropdown-item').forEach(item => {
    item.classList.toggle('active', item.dataset.value === value);
  });
}

function toggleFilter(group, value, btn){
  const set = state.filters[group];
  if(set.has(value)){ set.delete(value); btn.classList.remove('active'); }
  else{ set.add(value); btn.classList.add('active'); }
  applyFilters();
}

// Create timeline DOM
function renderTimeline(){
  const container = document.getElementById('timelineContainer');
  container.innerHTML='';
  const frag = document.createDocumentFragment();
  // reset nodes to avoid duplication on re-render
  state.nodes = [];
  state.events.forEach((ev, idx)=>{
    const card = createCard(ev, idx);
    // alternate sides for premium timeline layout
    card.classList.add(idx % 2 === 0 ? 'side-left' : 'side-right');
    frag.appendChild(card);
    state.nodes.push({ev,el:card});
  });
  container.appendChild(frag);
  observeCards();
}

// Card markup
function createCard(ev, idx){
  const card = document.createElement('article');
  card.className='card';
  card.tabIndex=0;
  card.dataset.year = ev.year;
  card.dataset.era = ev.era;
  card.setAttribute('role','article');

  const thumb = document.createElement('div'); thumb.className='thumb';
  const img = document.createElement('img'); img.alt = ev.title; img.loading='lazy'; img.src = ev.image || 'images/default.svg';
  thumb.appendChild(img);

  const content = document.createElement('div'); content.className='content';
  const meta = document.createElement('div'); meta.className='meta';
  const year = document.createElement('div'); year.className='year'; year.textContent = formatYear(ev.year);
  const badge = document.createElement('div'); badge.className='badge'; badge.textContent = ev.category;
  meta.appendChild(year); meta.appendChild(badge);

  const title = document.createElement('div'); title.className='title'; title.textContent = ev.title;
  const desc = document.createElement('div'); desc.className='desc'; desc.textContent = ev.description;
  const imp = document.createElement('div'); imp.className='importance'; imp.textContent = 'Importance: ' + ev.importance;

  content.appendChild(meta); content.appendChild(title); content.appendChild(desc); content.appendChild(imp);

  card.appendChild(thumb);
  const preview = document.createElement('div'); preview.className = 'card-preview';
  const previewInfo = document.createElement('div'); previewInfo.className = 'preview-info';
  previewInfo.innerHTML = `
    <div class="preview-meta">
      <span><strong>Era:</strong> ${ev.era}</span>
      <span><strong>Category:</strong> ${ev.category}</span>
      <span><strong>Importance:</strong> ${ev.importance}</span>
    </div>
    <div class="preview-extra">${ev.description}</div>
    <div class="preview-detail">A pivotal moment in ${ev.category.toLowerCase()} that helped shape the ${ev.era.toLowerCase()} era. This event still influences history, society, and future innovation.</div>
  `;
  preview.appendChild(previewInfo);
  card.appendChild(content);
  card.appendChild(preview);

  // mark important badges
  if(ev.importance >= 4) badge.classList.add('important');

  // Tilt effect
  card.addEventListener('mousemove',e=>{
    const r = card.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width/2)) / r.width;
    const dy = (e.clientY - (r.top + r.height/2)) / r.height;
    card.style.transform = `translateY(-6px) perspective(900px) rotateX(${dy*6}deg) rotateY(${dx*12}deg) scale(1.01)`;
  });
  card.addEventListener('mouseleave',()=>{ card.style.transform = ''; });

  // click to open inspector
  card.addEventListener('click', ()=> openInspector(ev));

  return card;
}

function formatYear(y){
  return y < 0 ? `${Math.abs(y)} BCE` : `${y} CE`;
}

// Intersection observer to animate and update sticky year
let observer;
function observeCards(){
  const options = {root: null, rootMargin: '0px', threshold: [0.25,0.5,0.9]};
  observer = new IntersectionObserver(onIntersect, options);
  document.querySelectorAll('.card').forEach((node,i)=>{ node.dataset.index = i; observer.observe(node); });
}

function onIntersect(entries){
  const sticky = document.getElementById('stickyYear');
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
    }
    if(entry.intersectionRatio > 0.45){
      sticky.textContent = entry.target.dataset.year < 0 ? `${Math.abs(entry.target.dataset.year)} BCE` : `${entry.target.dataset.year} CE`;
      document.body.className = '';
      const era = entry.target.dataset.era || 'Modern';
      document.body.classList.add('era-' + era.replace(/\s+/g,'-'));
    }
  });
}

// Filters & search: efficient toggling
function applyFilters(){
  const q = state.search.trim().toLowerCase();
  const cats = state.filters.categories;
  const eras = state.filters.eras;
  const imps = state.filters.importance;

  state.nodes.forEach(({ev,el})=>{
    let visible = true;
    if(cats.size && !cats.has(ev.category)) visible = false;
    if(eras.size && !eras.has(ev.era)) visible = false;
    if(imps.size && !imps.has(String(ev.importance))) visible = false;
    if(q){
      const hay = (ev.title + ' ' + ev.description + ' ' + ev.category + ' ' + ev.era).toLowerCase();
      if(!hay.includes(q)) visible = false;
    }
    el.style.display = visible ? '' : 'none';
  });
}

// UI wiring
function initUI(){
  const search = document.getElementById('search');
  const startBtn = document.getElementById('startBtn');
  const inspectorClose = document.getElementById('inspectorClose');
  const aboutLink = document.getElementById('aboutLink');
  const aboutClose = document.getElementById('aboutClose');
  const aboutModal = document.getElementById('aboutModal');

  if(inspectorClose) inspectorClose.addEventListener('click', closeInspector);
  if(aboutLink) aboutLink.addEventListener('click', openAboutModal);
  if(aboutClose) aboutClose.addEventListener('click', closeAboutModal);
  if(aboutModal) aboutModal.addEventListener('click', e => { if(e.target === aboutModal) closeAboutModal(); });

  search.addEventListener('input', e=>{ state.search = e.target.value; applyFilters(); });

  startBtn.addEventListener('click',()=>{
    const first = document.querySelector('.card'); if(first) first.scrollIntoView({behavior:'smooth',block:'center'});
  });

  keyboardNav();
}

// Inspector: show details in right-side panel
function openInspector(ev){
  const panel = document.getElementById('inspector');
  if(!panel) return;
  document.getElementById('inspectorImg').src = ev.image || 'images/default.svg';
  document.getElementById('inspectorTitle').textContent = ev.title;
  document.getElementById('inspectorYear').textContent = formatYear(ev.year);
  document.getElementById('inspectorBadge').textContent = ev.category;
  document.getElementById('inspectorDesc').textContent = ev.description;
  document.getElementById('inspectorImportance').textContent = 'Importance: ' + ev.importance;
  panel.setAttribute('aria-hidden','false'); panel.focus();
}

function closeInspector(){
  const panel = document.getElementById('inspector'); if(!panel) return; panel.setAttribute('aria-hidden','true');
}

function openAboutModal(e){
  if(e) e.preventDefault();
  const modal = document.getElementById('aboutModal'); if(!modal) return;
  modal.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
}

function closeAboutModal(){
  const modal = document.getElementById('aboutModal'); if(!modal) return;
  modal.setAttribute('aria-hidden','true');
  document.body.classList.remove('modal-open');
}

// close inspector or about modal on Esc
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape'){ closeInspector(); closeAboutModal(); } });

function findNearestEventByYear(year){
  let best = null; let bestDiff = Infinity;
  state.nodes.forEach(n=>{
    const d = Math.abs(n.ev.year - year);
    if(d < bestDiff){ best = n; bestDiff = d; }
  });
  return best;
}

// Simple keyboard navigation
function keyboardNav(){
  document.addEventListener('keydown',e=>{
    const focus = document.activeElement;
    if(e.key === 'ArrowDown' || e.key === 'j'){
      e.preventDefault(); if(focus && focus.classList.contains('card')){ focus.nextElementSibling?.focus(); } else { document.querySelector('.card')?.focus(); }
    }
    if(e.key === 'ArrowUp' || e.key === 'k'){
      e.preventDefault(); if(focus && focus.classList.contains('card')){ focus.previousElementSibling?.focus(); }
    }
  });
}

// Global mouse parallax for visible cards — subtle, premium feel
document.addEventListener('mousemove', (e)=>{
  const cx = window.innerWidth/2, cy = window.innerHeight/2;
  const dx = (e.clientX - cx) / cx; const dy = (e.clientY - cy) / cy;
  document.querySelectorAll('.card').forEach((card, i)=>{
    const depth = (i % 8) * 0.35; // subtle per-card depth
    const rx = dx * depth * 6; const ry = dy * depth * -6;
    card.style.transform = `translateY(${ -6 - (depth/2) }px) perspective(900px) rotateX(${ry}deg) rotateY(${rx}deg) scale(${1 + depth*0.001})`;
  });
});

// Particle background - improved starfield with mouse influence and era-aware color
function initParticles(){
  const canvas = document.getElementById('particles');
  const section = document.querySelector('.timeline-section');
  canvas.style.position='absolute'; canvas.style.left='0'; canvas.style.top='0'; canvas.style.zIndex='0';
  function resize(){ canvas.width = section.clientWidth; canvas.height = Math.max(240, section.clientHeight); }
  window.addEventListener('resize', resize); resize();
  const ctx = canvas.getContext('2d');
  const accent = getComputedStyle(document.body).getPropertyValue('--accent') || '#7afcff';
  const count = Math.min(260, Math.floor((canvas.width*canvas.height)/10000));
  const stars = Array.from({length:count}).map(()=>({x:Math.random()*canvas.width,y:Math.random()*canvas.height,r:Math.random()*1.8 + 0.2,alpha:Math.random()*0.8+0.1, vx:(Math.random()-0.5)*0.3, vy:(Math.random()-0.5)*0.3, baseR:Math.random()*1.6+0.2}));

  let mx = canvas.width/2, my = canvas.height/2;
  document.addEventListener('mousemove', (e)=>{ const r = canvas.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    stars.forEach(s=>{
      // soft attraction to mouse for subtle depth
      const dx = (mx - s.x) * 0.0007; const dy = (my - s.y) * 0.0007;
      s.vx += dx; s.vy += dy; s.vx *= 0.985; s.vy *= 0.985; s.x += s.vx; s.y += s.vy;
      s.alpha += (Math.random()-0.5)*0.02; if(s.alpha<0.03) s.alpha=0.03; if(s.alpha>1) s.alpha=1;
      ctx.beginPath(); ctx.globalAlpha = s.alpha; ctx.fillStyle = accent.trim(); ctx.arc(s.x,s.y,s.baseR,0,Math.PI*2); ctx.fill();
      if(s.x < -20) s.x = canvas.width + 20; if(s.x > canvas.width + 20) s.x = -20; if(s.y < -20) s.y = canvas.height + 20; if(s.y > canvas.height + 20) s.y = -20;
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// Hero animated background mini-canvas
function initHero(){
  const cnv = document.getElementById('hero-canvas');
  const ctx = cnv.getContext('2d');
  function resize(){ cnv.width = cnv.clientWidth; cnv.height = cnv.clientHeight; }
  window.addEventListener('resize', resize); resize();
  let t=0; function loop(){
    t+=0.01; ctx.clearRect(0,0,cnv.width,cnv.height);
    for(let i=0;i<40;i++){ const x = (Math.sin(t + i) * 0.5 + 0.5) * cnv.width; const y = (Math.cos(t*0.9 + i) * 0.5 + 0.5) * cnv.height; ctx.fillStyle = `rgba(122,252,255,${0.02 + (i%5)/60})`; ctx.beginPath(); ctx.ellipse(x,y,120,40,Math.sin(t+i),0,Math.PI*2); ctx.fill(); }
    requestAnimationFrame(loop);
  }
  loop();
}

// Start
init();
