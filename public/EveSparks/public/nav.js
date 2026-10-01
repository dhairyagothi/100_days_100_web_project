/**
 * nav.js — injects shared header & footer into every page
 * Each page calls: injectNav('ACTIVE_PAGE_ID')
 * Active page IDs: home | categories | corporate | social | package | budget | services | offers
 */

function injectNav(activePage) {
  const links = [
    { id:'home',      href:'index.html',            label:'Home' },
    { id:'categories',href:'categories.html',        label:'Categories',
      sub:[
        {href:'categories.html#decoration', label:'Decoration'},
        {href:'categories.html#event',      label:'Event Type'},
        {href:'categories.html#catering',   label:'Catering'},
        {href:'categories.html#photo',      label:'Photography'},
      ]
    },
    { id:'corporate', href:'corporate-events.html',  label:'Corporate Events',
      sub:[
        {href:'corporate-events.html#seminars',     label:'Seminars'},
        {href:'corporate-events.html#conferences',  label:'Conferences'},
        {href:'corporate-events.html#product-launch',label:'Product Launch'},
      ]
    },
    { id:'social',    href:'social-events.html',     label:'Social Events',
      sub:[
        {href:'social-events.html#birthday', label:'Birthday Parties'},
        {href:'social-events.html#wedding',  label:'Weddings'},
        {href:'social-events.html#concert',  label:'Concerts'},
      ]
    },
    { id:'package',   href:'complete-package.html',  label:'Complete Package' },
    { id:'budget',    href:'budget-planner.html',    label:'Budget Planner' },
    { id:'services',  href:'other-services.html',    label:'Other Services' },
    { id:'offers',    href:'hot-offers.html',        label:'Hot Offers 🔥' },
  ];

  const desktopNav = links.map(l => {
    const active = l.id === activePage ? 'active' : '';
    const sub = l.sub ? `<div class="dropdown">${l.sub.map(s=>`<a href="${s.href}">${s.label}</a>`).join('')}</div>` : '';
    return `<div class="nav-item"><a href="${l.href}" class="nav-link ${active}">${l.label}</a>${sub}</div>`;
  }).join('');

  const mobileNav = links.map(l =>
    `<a href="${l.href}" class="mobile-nav-link">${l.label}</a>`
  ).join('');

  const header = `
  <div class="announce-bar">
    🎉 &nbsp;ORGANISE YOUR EVENT WITH US &nbsp;|&nbsp; Book your first event and get <strong>extra discount!</strong>
  </div>
  <header class="site-header">
    <div class="header-inner">
      <a href="index.html" class="brand"><img src="image/evesparks.png" alt="EveSparks" /></a>
      <div class="search-wrap">
        <input type="text" placeholder="Search for services..." />
        <button aria-label="Search"><i class="bi bi-search"></i></button>
      </div>
      <div class="header-actions">
        <button class="hdr-btn theme-btn" id="themeBtn"><i class="bi bi-moon-fill"></i></button>
        <button class="hdr-btn"><i class="bi bi-person-circle"></i></button>
        <button class="hdr-btn"><i class="bi bi-heart"></i><span class="badge">5</span></button>
        <button class="hdr-btn"><i class="bi bi-cart3"></i><span class="badge">0</span></button>
      </div>
    </div>
    <div class="mobile-bar">
      <a href="index.html" class="brand"><img src="image/evesparks.png" alt="EveSparks" style="height:38px" /></a>
      <div style="display:flex;gap:6px">
        <button class="hdr-btn theme-btn" id="themeBtn"><i class="bi bi-moon-fill"></i></button>
        <button class="hdr-btn" id="hamburger"><i class="bi bi-list" style="font-size:1.7rem"></i></button>
      </div>
    </div>
    <nav class="navbar-strip">
      <div class="navbar-inner">${desktopNav}</div>
    </nav>
  </header>
  <div class="drawer-overlay" id="drawerOverlay"></div>
  <nav class="mobile-drawer" id="mobileDrawer">
    <div class="drawer-header">
      <span style="font-weight:800;font-size:1.1rem;color:var(--accent)">EveSparks</span>
      <button class="drawer-close" id="drawerClose"><i class="bi bi-x-lg"></i></button>
    </div>
    ${mobileNav}
  </nav>`;

  const footer = `
  <footer class="site-footer">
    <div class="footer-inner">
      <div class="footer-col">
        <img src="image/evesparks.png" alt="EveSparks" style="height:44px;margin-bottom:14px" />
        <p style="font-size:.84rem;line-height:1.7;margin-bottom:12px">Your trusted partner for unforgettable events in Bhopal &amp; beyond.</p>
        <div class="social-row">
          <a href="#" class="social-icon"><i class="bi bi-facebook"></i></a>
          <a href="#" class="social-icon"><i class="bi bi-twitter-x"></i></a>
          <a href="#" class="social-icon"><i class="bi bi-instagram"></i></a>
          <a href="#" class="social-icon"><i class="bi bi-linkedin"></i></a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Categories</h4>
        <a href="categories.html#decoration">Decoration</a>
        <a href="categories.html#catering">Catering</a>
        <a href="categories.html#photo">Photography</a>
        <a href="categories.html#event">Event Type</a>
      </div>
      <div class="footer-col">
        <h4>Events</h4>
        <a href="social-events.html#wedding">Weddings</a>
        <a href="social-events.html#birthday">Birthday Parties</a>
        <a href="corporate-events.html">Corporate Events</a>
        <a href="social-events.html#concert">Concerts</a>
      </div>
      <div class="footer-col">
        <h4>Services</h4>
        <a href="complete-package.html">Complete Package</a>
        <a href="budget-planner.html">Budget Planner</a>
        <a href="hot-offers.html">Hot Offers</a>
        <a href="other-services.html">Other Services</a>
      </div>
      <div class="footer-col">
        <h4>Contact</h4>
        <a href="#">📍 123, XYZ Road, Bhopal MP</a>
        <a href="tel:+919424065768">📞 +91 94240 65768</a>
        <a href="mailto:evesparks@gmail.com">✉️ evesparks@gmail.com</a>
        <a href="#">🕘 Mon–Sat: 9AM–8PM</a>
      </div>
    </div>
    <div class="footer-bottom">
      <img src="image/payment.png" alt="Payment" style="height:28px;margin:0 auto 12px;opacity:.7" />
      <p>Copyright © <a href="index.html">EveSparks</a> 2024. All rights reserved.</p>
    </div>
  </footer>`;

  document.getElementById('nav-placeholder').innerHTML  = header;
  document.getElementById('foot-placeholder').innerHTML = footer;

  /* Tell main.js that nav was injected, then wire up all interactive bits */
  window._navJsInjected = true;
  if (typeof initPageScripts === 'function') initPageScripts();
}
