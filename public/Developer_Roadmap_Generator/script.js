// Developer Roadmap Generator
(function(){
  const DATA_KEY = 'devRoadmap.v1';
  const THEME_KEY = 'devRoadmap.theme';

  const careers = {
    frontend: {
      title:'Frontend Developer',
      stages:[
        {id:'fundamentals',title:'Fundamentals',desc:'HTML, CSS, JS basics',tasks:['HTML5 semantics','CSS layout & Flexbox','Vanilla JS DOM','Responsive design']},
        {id:'tooling',title:'Tooling',desc:'Build tools & versioning',tasks:['Git & GitHub','NPM','Bundlers (Vite/Rollup)','ESLint/Prettier']},
        {id:'frameworks',title:'Frameworks',desc:'Modern frameworks & patterns',tasks:['React or Vue','State management','Routing','Accessibility']},
        {id:'advanced',title:'Advanced',desc:'Performance & testing',tasks:['Performance optimization','Unit/integration tests','Progressive Web Apps','Component design systems']}
      ]
    },
    backend:{
      title:'Backend Developer',
      stages:[
        {id:'basics',title:'Basics',desc:'Server fundamentals',tasks:['HTTP & REST','Node.js runtime','Databases (SQL/NoSQL)','Authentication basics']},
        {id:'apidesign',title:'API Design',desc:'Design and security',tasks:['Express/Koa','Error handling','Input validation','Rate limiting & CORS']},
        {id:'scale',title:'Scale',desc:'Scaling & infra',tasks:['Caching & queues','Horizontal scaling','CI/CD','Monitoring & logging']}
      ]
    },
    fullstack:{
      title:'Full Stack Developer',
      stages:[
        {id:'client',title:'Client',desc:'Frontend mastery',tasks:['SPA frameworks','State management','Client testing','Optimization']},
        {id:'server',title:'Server',desc:'Backend mastery',tasks:['APIs & GraphQL','Auth & sessions','Database modeling','Background jobs']},
        {id:'deploy',title:'Deploy',desc:'Deploy & observability',tasks:['Containers & Docker','Cloud basics','CI/CD pipelines','Observability']}
      ]
    },
    aiml:{
      title:'AI / ML Engineer',
      stages:[
        {id:'mlfound',title:'ML Foundations',desc:'Math & core concepts',tasks:['Linear algebra & calculus','Probability & stats','Python for ML','Data preprocessing']},
        {id:'models',title:'Models',desc:'Modeling and evaluation',tasks:['Supervised learning','Neural networks','Evaluation metrics','Overfitting & regularization']},
        {id:'deployment',title:'Deployment',desc:'Productionize models',tasks:['Model serving','MLOps basics','Model monitoring','Data pipelines']}
      ]
    },
    security:{
      title:'Cybersecurity',
      stages:[
        {id:'found',title:'Foundations',desc:'Security basics',tasks:['Networking basics','Common vulnerabilities (OWASP)','Linux fundamentals','Cryptography basics']},
        {id:'ops',title:'Security Ops',desc:'Operations and tooling',tasks:['Secure config','Incident response','SIEM & logging','Penetration testing basics']}
      ]
    }
  };

  // DOM refs
  const careerSelect = document.getElementById('careerSelect');
  const roadmapContainer = document.getElementById('roadmapContainer');
  const searchInput = document.getElementById('searchInput');
  const progressText = document.getElementById('progressText');
  const progressBar = document.querySelector('.progress-fill');
  const resetBtn = document.getElementById('resetProgress');
  const toastEl = document.getElementById('toast');
  const themeToggle = document.getElementById('themeToggle');

  let state = loadState();

  function loadState(){
    try{
      const raw = localStorage.getItem(DATA_KEY);
      return raw?JSON.parse(raw):{completed:{}};
    }catch(e){return {completed:{}}}
  }
  function saveState(){ localStorage.setItem(DATA_KEY,JSON.stringify(state)); }

  function init(){
    // populate career select
    Object.keys(careers).forEach(key=>{
      const opt = document.createElement('option'); opt.value=key; opt.textContent=careers[key].title;
      careerSelect.appendChild(opt);
    });
    // default
    if(!careerSelect.value) careerSelect.value = 'frontend';

    // theme
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    applyTheme(savedTheme);

    bind();
    render();
  }

  function bind(){
    careerSelect.addEventListener('change',()=>{ render(); toast('Career changed'); });
    searchInput.addEventListener('input',debounce(render,200));
    resetBtn.addEventListener('click',handleReset);
    themeToggle.addEventListener('click',toggleTheme);
    roadmapContainer.addEventListener('click',handleClick);
  }

  function handleReset(){
    if(!confirm('Reset all progress for this career?')) return;
    const career = careerSelect.value;
    // remove completed tasks for career
    Object.keys(state.completed).forEach(k=>{ if(k.startsWith(career+'|')) delete state.completed[k]; });
    saveState(); render(); toast('Progress reset');
  }

  function handleClick(e){
    if(e.target.matches('.expand-btn')){
      const target = e.target.closest('.card'); target.classList.toggle('collapsed');
      e.target.textContent = target.classList.contains('collapsed')? 'Expand' : 'Collapse';
      return;
    }
    if(e.target.matches('input[type="checkbox"]')){
      const key = e.target.dataset.key; if(!key) return;
      state.completed[key] = e.target.checked;
      saveState(); updateProgress(); toast('Progress saved');
    }
  }

  function render(){
    const careerKey = careerSelect.value;
    const career = careers[careerKey];
    roadmapContainer.innerHTML = '';
    if(!career) return;
    const q = searchInput.value.trim().toLowerCase();

    career.stages.forEach(stage=>{
      // filter by search
      const tasks = stage.tasks.filter(t=> t.toLowerCase().includes(q) || stage.title.toLowerCase().includes(q) || stage.desc.toLowerCase().includes(q));
      if(q && tasks.length===0) return;

      const card = document.createElement('article'); card.className='card';
      const header = document.createElement('div'); header.className='stage';
      const h = document.createElement('h3'); h.textContent = stage.title;
      const d = document.createElement('div'); d.className='muted'; d.textContent = stage.desc;
      header.appendChild(h); header.appendChild(d);
      card.appendChild(header);

      const expand = document.createElement('button'); expand.className='expand-btn'; expand.textContent='Collapse'; expand.setAttribute('aria-expanded','true');
      header.appendChild(expand);

      const tasksWrap = document.createElement('div'); tasksWrap.className='tasks';
      tasks.forEach((t,idx)=>{
        const id = `${careerKey}|${stage.id}|${idx}`;
        const row = document.createElement('label'); row.className='task'; row.setAttribute('for', id);
        const cb = document.createElement('input'); cb.type='checkbox'; cb.id=id; cb.dataset.key=id; cb.checked = !!state.completed[id];
        const span = document.createElement('span'); span.textContent = t; span.className='muted';
        row.appendChild(cb); row.appendChild(span); tasksWrap.appendChild(row);
      });
      card.appendChild(tasksWrap);
      roadmapContainer.appendChild(card);
    });

    updateProgress();
  }

  function updateProgress(){
    const careerKey = careerSelect.value; const career = careers[careerKey];
    let total=0,done=0;
    career.stages.forEach((s,si)=>{ s.tasks.forEach((t,ti)=>{ total++; const key=`${careerKey}|${s.id}|${ti}`; if(state.completed[key]) done++; }) });
    const pct = total?Math.round(done/total*100):0;
    progressText.textContent = pct + '%'; progressBar.style.width = pct+'%'; document.querySelector('.progress-bar').setAttribute('aria-valuenow',pct);
  }

  function toast(msg,timeout=1800){
    toastEl.textContent = msg; toastEl.classList.add('show'); setTimeout(()=>toastEl.classList.remove('show'),timeout);
  }

  function applyTheme(t){
    document.documentElement.setAttribute('data-theme', t==='dark'?'dark':'');
    localStorage.setItem(THEME_KEY, t);
    themeToggle.setAttribute('aria-pressed', t==='dark');
  }
  function toggleTheme(){ const cur = localStorage.getItem(THEME_KEY) || 'light'; applyTheme(cur==='dark'?'light':'dark'); }

  // small debounce
  function debounce(fn,ms){let t; return function(){clearTimeout(t); t=setTimeout(()=>fn.apply(this,arguments),ms)}}

  // initial restore: ensure any saved completed keys exist
  init();
})();
