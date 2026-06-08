/* ===========================
   AEROSTRIDE — index.js (Fixed)
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
  // ===== STATE =====
  let cartItems = [];
  let wishlist = [];
  let currentSlide = 0;
  let sliderInterval;
  let qvQty = 1;
  let qvCurrent = { name: '', price: 0, img: '' };
  let activeFilter = 'all';

  // ===== DOM REFS =====
  const header = document.getElementById('header');
  const cartEl = document.getElementById('cart');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartContent = document.getElementById('cart-content');
  const cartEmpty = document.getElementById('cart-empty');
  const cartFooter = document.getElementById('cart-footer');
  const cartCountEl = document.getElementById('cart-count');
  const cartItemLabel = document.getElementById('cart-item-label');
  const cartSubtotal = document.getElementById('cart-subtotal');
  const cartTotalPrice = document.getElementById('cart-total-price');

  const checkoutOverlay = document.getElementById('checkout-overlay');
  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutClose = document.getElementById('checkout-close');
  const checkoutBtn = document.getElementById('checkout-btn');
  const submitOrderBtn = document.getElementById('submit-order-btn');

  const searchOverlay = document.getElementById('search-overlay');
  const searchModal = document.getElementById('search-modal');
  const searchClose = document.getElementById('search-close');
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  const searchBtn = document.getElementById('search-btn');

  const profileOverlay = document.getElementById('profile-overlay');
  const profileModal = document.getElementById('profile-modal');
  const profileClose = document.getElementById('profile-close');
  const profileBtn = document.getElementById('profile-btn');

  const qvOverlay = document.getElementById('qv-overlay');
  const qvModal = document.getElementById('qv-modal');
  const qvClose = document.getElementById('qv-close');

  const themeBtn = document.getElementById('theme-toggle');
  const sunIcon = document.getElementById('sun-icon');
  const moonIcon = document.getElementById('moon-icon');

  const toastEl = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');

  const grid = document.getElementById('grid');
  const noResults = document.getElementById('no-results');

  // ===== HELPERS =====
  const fmt = (n) => 'Rs.' + Number(n).toLocaleString('en-IN');

  function showToast(msg, isError = false) {
    toastMsg.textContent = msg;
    toastEl.style.borderColor = isError ? '#ef4444' : 'var(--green)';
    toastEl.querySelector('svg').style.color = isError ? '#ef4444' : 'var(--green)';
    toastEl.classList.add('show');
    setTimeout(() => toastEl.classList.remove('show'), 3200);
  }

  function openModal(overlay, modal) {
    overlay.classList.add('active');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(overlay, modal) {
    overlay.classList.remove('active');
    modal.classList.remove('active');
    if (!cartEl.classList.contains('open')) {
      document.body.style.overflow = '';
    }
  }

  // ===== NAVBAR SCROLL =====
  window.addEventListener('scroll', () => {
    if (header) {
      header.style.borderBottomColor = window.scrollY > 20 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)';
    }
  }, { passive: true });

  // ===== THEME =====
  function applyTheme(light) {
    document.body.classList.toggle('light', light);
    if (sunIcon) sunIcon.style.display = light ? 'block' : 'none';
    if (moonIcon) moonIcon.style.display = light ? 'none' : 'block';
    localStorage.setItem('aero-theme', light ? 'light' : 'dark');
  }

  (function initTheme() {
    const saved = localStorage.getItem('aero-theme');
    applyTheme(saved === 'light');
  })();

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      applyTheme(!document.body.classList.contains('light'));
    });
  }

  // ===== CART =====
  function openCart() {
    cartEl.classList.add('open');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartEl.classList.remove('open');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.getElementById('cart-icon').addEventListener('click', openCart);
  document.getElementById('cart-close').addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  function renderCart() {
    cartContent.querySelectorAll('.cart-item').forEach((el) => el.remove());

    if (cartItems.length === 0) {
      cartEmpty.style.display = 'flex';
      cartFooter.style.display = 'none';
      cartCountEl.textContent = '0';
      cartItemLabel.textContent = '0 items';
      return;
    }

    cartEmpty.style.display = 'none';
    cartFooter.style.display = 'flex';

    cartItems.forEach((item) => {
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.dataset.id = item.id;
      el.innerHTML = `
        <img src="${item.imgSrc}" class="cart-item-img" alt="${item.title}" />
        <div class="cart-item-info">
          <div class="cart-item-name">${item.title}</div>
          <div class="cart-item-unit">${fmt(item.price)} each</div>
          <div class="qty-stepper" style="display:inline-flex;margin-top:6px;">
            <button class="qty-btn item-minus" data-id="${item.id}">−</button>
            <span class="qty-display">${item.qty}</span>
            <button class="qty-btn item-plus" data-id="${item.id}">+</button>
          </div>
        </div>
        <div class="cart-item-controls">
          <span class="cart-item-total">${fmt(item.price * item.qty)}</span>
          <button class="cart-item-remove" data-id="${item.id}" aria-label="Remove ${item.title}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      `;
      el.querySelector('.item-minus').addEventListener('click', () => changeQty(item.id, -1));
      el.querySelector('.item-plus').addEventListener('click', () => changeQty(item.id, +1));
      el.querySelector('.cart-item-remove').addEventListener('click', () => removeCartItem(item.id));
      cartContent.appendChild(el);
    });

    updateCartTotals();
  }

  function updateCartTotals() {
    const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
    const count = cartItems.reduce((s, i) => s + i.qty, 0);
    cartSubtotal.textContent = fmt(total);
    cartTotalPrice.textContent = fmt(total);
    cartCountEl.textContent = count;
    cartItemLabel.textContent = `${cartItems.length} item${cartItems.length !== 1 ? 's' : ''}`;

    cartCountEl.classList.remove('bounce');
    void cartCountEl.offsetWidth;
    cartCountEl.classList.add('bounce');
  }

  function addToCart(title, price, imgSrc, qty = 1) {
    const id = title.toLowerCase().replace(/\s+/g, '-');
    const existing = cartItems.find((i) => i.id === id);
    if (existing) {
      existing.qty += qty;
      showToast(`${title} quantity updated`);
    } else {
      cartItems.push({ id, title, price: Number(price), imgSrc, qty });
      showToast(`${title} added to cart`);
    }
    renderCart();
    openCart();
  }

  function changeQty(id, delta) {
    const item = cartItems.find((i) => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      removeCartItem(id);
      return;
    }
    renderCart();
  }

  function removeCartItem(id) {
    cartItems = cartItems.filter((i) => i.id !== id);
    renderCart();
    showToast('Item removed from cart');
  }

  document.getElementById('clear-cart-btn').addEventListener('click', () => {
    if (!cartItems.length) return;
    if (confirm('Clear all items from cart?')) {
      cartItems = [];
      renderCart();
      showToast('Cart cleared');
    }
  });

  // Card add buttons
  document.querySelectorAll('.card-add').forEach((btn) => {
    btn.addEventListener('click', function () {
      const title = this.dataset.title;
      const price = this.dataset.price;
      const img = this.dataset.img;
      this.classList.add('added');
      const origHTML = this.innerHTML;
      this.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
      setTimeout(() => {
        this.classList.remove('added');
        this.innerHTML = origHTML;
      }, 1200);
      addToCart(title, price, img);
    });
  });

  // Wishlist buttons
  document.querySelectorAll('.card-wishlist').forEach((btn) => {
    btn.addEventListener('click', function () {
      const title = this.dataset.title;
      if (wishlist.includes(title)) {
        wishlist = wishlist.filter((t) => t !== title);
        this.classList.remove('active');
        showToast('Removed from wishlist');
      } else {
        wishlist.push(title);
        this.classList.add('active');
        showToast('Added to wishlist');
      }
      updateWishlistCount();
    });
  });

  function updateWishlistCount() {
    const badge = document.getElementById('wishlist-count');
    if (badge) {
      badge.textContent = wishlist.length;
      badge.style.display = wishlist.length ? 'flex' : 'none';
    }
  }

  // ===== CHECKOUT =====
  function openCheckoutModal() {
    const list = document.getElementById('checkout-items-list');
    list.innerHTML = '';
    cartItems.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'checkout-item-row';
      row.innerHTML = `
        <img src="${item.imgSrc}" alt="${item.title}" />
        <span class="ci-name">${item.title}</span>
        <span class="ci-qty">${item.qty}</span>
        <span class="ci-price">${fmt(item.price * item.qty)}</span>
      `;
      list.appendChild(row);
    });
    const grand = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
    document.getElementById('checkout-grand-total').textContent = fmt(grand);
    openModal(checkoutOverlay, checkoutModal);
  }

  checkoutBtn.addEventListener('click', openCheckoutModal);
  checkoutClose.addEventListener('click', () => closeModal(checkoutOverlay, checkoutModal));
  checkoutOverlay.addEventListener('click', () => closeModal(checkoutOverlay, checkoutModal));

  submitOrderBtn.addEventListener('click', () => {
    const name = document.getElementById('co-name').value.trim();
    const email = document.getElementById('co-email').value.trim();
    const phone = document.getElementById('co-phone').value.trim();
    const address = document.getElementById('co-address').value.trim();
    const payment = document.getElementById('co-payment').value;

    if (!name || !email || !phone || !address || !payment) {
      showToast('Please fill in all fields', true);
      return;
    }
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email)) {
      showToast('Please enter a valid email', true);
      return;
    }

    submitOrderBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Order Placed!</span>`;
    submitOrderBtn.style.background = 'var(--green)';

    setTimeout(() => {
      closeModal(checkoutOverlay, checkoutModal);
      cartItems = [];
      renderCart();
      closeCart();
      ['co-name', 'co-email', 'co-phone', 'co-address', 'co-payment'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
      submitOrderBtn.innerHTML = `<span>Place Order</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
      submitOrderBtn.style.background = '';
      showToast(`🎉 Order placed successfully! Thank you, ${name}!`);
    }, 1200);
  });

  // ===== SEARCH =====
  function escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  searchBtn.addEventListener('click', () => {
    openModal(searchOverlay, searchModal);
    setTimeout(() => searchInput.focus(), 100);
  });
  searchClose.addEventListener('click', () => {
    closeModal(searchOverlay, searchModal);
    searchInput.value = '';
    searchResults.innerHTML = '';
  });
  searchOverlay.addEventListener('click', () => {
    closeModal(searchOverlay, searchModal);
    searchInput.value = '';
    searchResults.innerHTML = '';
  });

  searchInput.addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    if (!q) {
      searchResults.innerHTML = '';
      return;
    }
    const cards = document.querySelectorAll('.card');
    const matched = [];
    cards.forEach((card) => {
      const name = card.dataset.name || '';
      const price = card.dataset.price || '';
      const img = card.querySelector('.card-img');
      if (name.toLowerCase().includes(q)) {
        matched.push({ name, price, imgSrc: img ? img.src : '' });
      }
    });
    if (!matched.length) {
      searchResults.innerHTML = `<div class="search-no-result">No shoes found for "${escapeHTML(q)}"</div>`;
      return;
    }
    searchResults.innerHTML = matched
      .map(
        (r) => `
      <div class="search-result-item" data-name="${escapeHTML(r.name)}" data-price="${r.price}" data-img="${escapeHTML(r.imgSrc)}">
        <img src="${escapeHTML(r.imgSrc)}" alt="${escapeHTML(r.name)}" />
        <div class="search-result-info">
          <div class="search-result-name">${escapeHTML(r.name)}</div>
          <div class="search-result-price">${fmt(r.price)}</div>
        </div>
      </div>
    `
      )
      .join('');

    searchResults.querySelectorAll('.search-result-item').forEach((item) => {
      item.addEventListener('click', () => {
        addToCart(item.dataset.name, item.dataset.price, item.dataset.img);
        closeModal(searchOverlay, searchModal);
        searchInput.value = '';
        searchResults.innerHTML = '';
      });
    });
  });

  // ===== PROFILE =====
  profileBtn.addEventListener('click', () => openModal(profileOverlay, profileModal));
  profileClose.addEventListener('click', () => closeModal(profileOverlay, profileModal));
  profileOverlay.addEventListener('click', () => closeModal(profileOverlay, profileModal));

  document.querySelectorAll('.ptab').forEach((tab) => {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.ptab').forEach((t) => t.classList.remove('active'));
      this.classList.add('active');
      const target = this.dataset.tab;
      document.getElementById('login-tab').classList.toggle('hidden', target !== 'login');
      document.getElementById('signup-tab').classList.toggle('hidden', target !== 'signup');
    });
  });

  // ===== QUICK VIEW =====
  document.querySelectorAll('.btn-quick-view').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      qvCurrent.name = btn.dataset.name;
      qvCurrent.price = Number(btn.dataset.price);
      qvCurrent.img = btn.dataset.img;
      qvQty = 1;
      document.getElementById('qv-img').src = qvCurrent.img;
      document.getElementById('qv-name').textContent = qvCurrent.name;
      document.getElementById('qv-price').textContent = fmt(qvCurrent.price);
      document.getElementById('qv-qty').textContent = qvQty;
      openModal(qvOverlay, qvModal);
    });
  });

  qvClose.addEventListener('click', () => closeModal(qvOverlay, qvModal));
  qvOverlay.addEventListener('click', () => closeModal(qvOverlay, qvModal));

  document.getElementById('qv-minus').addEventListener('click', () => {
    if (qvQty > 1) {
      qvQty--;
      document.getElementById('qv-qty').textContent = qvQty;
    }
  });
  document.getElementById('qv-plus').addEventListener('click', () => {
    qvQty++;
    document.getElementById('qv-qty').textContent = qvQty;
  });
  document.getElementById('qv-add-btn').addEventListener('click', () => {
    addToCart(qvCurrent.name, qvCurrent.price, qvCurrent.img, qvQty);
    closeModal(qvOverlay, qvModal);
  });

  // ===== FILTER & SORT =====
  document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      this.classList.add('active');
      activeFilter = this.dataset.filter;
      applyFilterSort();
    });
  });
  document.getElementById('sort-select').addEventListener('change', applyFilterSort);

  function applyFilterSort() {
    const sortVal = document.getElementById('sort-select').value;
    const cards = Array.from(document.querySelectorAll('.card'));
    let visible = cards.filter((card) => {
      if (activeFilter === 'all') return true;
      return card.dataset.category === activeFilter;
    });
    if (sortVal === 'price-asc') {
      visible.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
    } else if (sortVal === 'price-desc') {
      visible.sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price));
    } else if (sortVal === 'name-asc') {
      visible.sort((a, b) => (a.dataset.name || '').localeCompare(b.dataset.name || ''));
    }
    cards.forEach((c) => {
      c.style.display = 'none';
      c.classList.remove('visible');
    });
    if (!visible.length) {
      noResults.style.display = 'block';
      return;
    }
    noResults.style.display = 'none';
    visible.forEach((card, i) => {
      card.style.display = 'flex';
      grid.appendChild(card);
      setTimeout(() => card.classList.add('visible'), 40 * i);
    });
  }

  // ===== HERO SLIDER =====
  const slides = document.querySelectorAll('.slide');
  const dotBox = document.getElementById('slider-dots');
  if (slides.length) {
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Slide ${i + 1}`);
      d.addEventListener('click', () => goSlide(i));
      dotBox.appendChild(d);
    });
    sliderInterval = setInterval(nextSlide, 3500);
    const sliderEl = document.getElementById('slider');
    sliderEl.addEventListener('mouseenter', () => clearInterval(sliderInterval));
    sliderEl.addEventListener('mouseleave', () => {
      sliderInterval = setInterval(nextSlide, 3500);
    });
    let touchStartX = 0;
    sliderEl.addEventListener(
      'touchstart',
      (e) => {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true }
    );
    sliderEl.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) dx < 0 ? nextSlide() : prevSlide();
    });
    document.getElementById('slider-prev').addEventListener('click', prevSlide);
    document.getElementById('slider-next').addEventListener('click', nextSlide);
  }

  function goSlide(i) {
    slides[currentSlide].classList.remove('active');
    document.querySelectorAll('.dot')[currentSlide]?.classList.remove('active');
    currentSlide = (i + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    document.querySelectorAll('.dot')[currentSlide]?.classList.add('active');
  }
  function nextSlide() {
    goSlide(currentSlide + 1);
  }
  function prevSlide() {
    goSlide(currentSlide - 1);
  }

  // ===== CARD STAGGER ANIMATION =====
  function animateCards() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = entry.target.querySelectorAll('.card');
            cards.forEach((c, i) => {
              setTimeout(() => c.classList.add('visible'), 60 * i);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );
    if (grid) observer.observe(grid);
  }

  // ===== KEYBOARD ACCESSIBILITY =====
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      [
        [cartOverlay, cartEl],
        [searchOverlay, searchModal],
        [checkoutOverlay, checkoutModal],
        [profileOverlay, profileModal],
        [qvOverlay, qvModal],
      ].forEach(([overlay, modal]) => {
        if (overlay.classList.contains('active')) {
          if (modal === cartEl) closeCart();
          else closeModal(overlay, modal);
        }
      });
    }
    if (e.key === 'ArrowRight' && document.activeElement.closest('#slider')) nextSlide();
    if (e.key === 'ArrowLeft' && document.activeElement.closest('#slider')) prevSlide();
  });

  // ===== INIT =====
  renderCart();
  animateCards();

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
});