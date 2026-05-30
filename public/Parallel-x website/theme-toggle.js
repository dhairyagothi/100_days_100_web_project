(function(){
  const KEY = 'site_theme';
  function setTheme(theme){
    try{ document.documentElement.setAttribute('data-theme', theme); localStorage.setItem(KEY, theme);}catch(e){}
    updateToggleIcons(theme);
  }
  function toggleTheme(){
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(cur === 'light' ? 'dark' : 'light');
  }
  function updateToggleIcons(theme){
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.innerText = theme === 'dark' ? '☀️' : '🌙';
      btn.setAttribute('aria-pressed', theme === 'dark');
    });
  }
  // initialize
  const saved = localStorage.getItem(KEY) || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(saved);
  // attach listeners
  document.addEventListener('click', (e)=>{
    const t = e.target.closest && e.target.closest('.theme-toggle');
    if(t){ toggleTheme(); }
  });
  // expose for debugging
  window.__setSiteTheme = setTheme;
})();
