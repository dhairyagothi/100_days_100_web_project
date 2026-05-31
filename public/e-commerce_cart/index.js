/* Consolidated cart + wishlist + search + UI script
   - cart panel (add/remove/qty/total)
   - wishlist toggle + count
   - product search filter
   - quick-view modal
   - checkout modal (basic validation)
   - clear cart button
   - dark-mode toggle (persisted)
*/

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const cartPanel = document.getElementById('cart-panel');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartBody = document.getElementById('cart-body');
  const cartEmpty = document.getElementById('cart-empty');
  const cartBadge = document.getElementById('cart-badge');
  const cartPillCount = document.querySelector('.cart-pill-count');
  const wishlistCountEl = document.getElementById('wishlist-count');
  const openCartBtn = document.getElementById('open-cart');
  const cartCloseBtn = document.getElementById('cart-close');
  const noProductsMessage = document.getElementById('no-products-message');

  let itemList = [];
  let wishlist = [];

  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    Object.assign(t.style, {
      position: 'fixed',
      right: '20px',
      bottom: '20px',
      background: '#222',
      color: '#fff',
      padding: '10px 14px',
      borderRadius: '8px',
      zIndex: 99999,
      opacity: 0,
      transition: 'opacity .18s',
    });
    document.body.appendChild(t);
    requestAnimationFrame(() => (t.style.opacity = '1'));
    setTimeout(() => {
      t.style.opacity = '0';
      setTimeout(() => t.remove(), 200);
    }, 2500);
  }

  function openCart() {
    cartPanel && cartPanel.classList.add('active');
    cartOverlay && cartOverlay.classList.add('active');
  }
  function closeCart() {
    cartPanel && cartPanel.classList.remove('active');
    cartOverlay && cartOverlay.classList.remove('active');
  }

  if (openCartBtn) openCartBtn.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  function cartRowHTML(title, price, img) {
    return `
      <img src="${img}" class="cart-img">
      <div class="detail-box">
        <div class="cart-shoe-title">${title}</div>
        <div class="price-box">
          <span class="cart-price">${price}</span>
          <span class="cart-amt">${price}</span>
        </div>
        <div class="qty-stepper">
          <button class="qty-btn qty-down" type="button">−</button>
          <input type="number" class="cart-quantity" value="1" min="1">
          <button class="qty-btn qty-up" type="button">+</button>
        </div>
      </div>
      <button class="cart-remove" title="Remove">✕</button>`;
  }

  function bindRow(row) {
    const qtyInput = row.querySelector('.cart-quantity');
    const down = row.querySelector('.qty-down');
    const up = row.querySelector('.qty-up');
    const remove = row.querySelector('.cart-remove');

    if (down)
      down.addEventListener('click', () => {
        let v = parseInt(qtyInput.value) || 1;
        if (v > 1) {
          qtyInput.value = v - 1;
          updateUI();
        }
      });
    if (up)
      up.addEventListener('click', () => {
        qtyInput.value = (parseInt(qtyInput.value) || 1) + 1;
        updateUI();
      });
    if (qtyInput)
      qtyInput.addEventListener('change', () => {
        if (!qtyInput.value || qtyInput.value < 1) qtyInput.value = 1;
        updateUI();
      });
    if (remove)
      remove.addEventListener('click', () => {
        const title = row.dataset.title;
        itemList = itemList.filter((i) => i.title !== title);
        row.remove();
        updateUI();
        showToast('Removed from cart');
      });
  }

  function updateUI() {
    let total = 0;
    document.querySelectorAll('.cart-box').forEach((row) => {
      const priceStr =
        (row.querySelector('.cart-price') && row.querySelector('.cart-price').textContent) || '0';
      const price = parseFloat(priceStr.toString().replace(/Rs\.?\s*/i, '')) || 0;
      const qty = parseInt(row.querySelector('.cart-quantity').value) || 1;
      const sub = price * qty;
      const amt = row.querySelector('.cart-amt');
      if (amt) amt.textContent = 'Rs.' + sub;
      total += sub;
    });

    const totalPriceEl = document.getElementById('total-price');
    if (totalPriceEl) totalPriceEl.textContent = 'Rs.' + total;

    const count = itemList.length;
    document.querySelectorAll('.cart-count').forEach((el) => {
      el.textContent = count;
      el.style.display = count ? 'block' : 'none';
    });
    if (cartPillCount) {
      cartPillCount.textContent = count;
      cartPillCount.style.display = count ? 'inline-flex' : 'none';
    }
    if (cartBadge) {
      cartBadge.textContent = count;
       cartBadge.style.display = count ? 'inline-block' : 'none';
    }
    if (cartEmpty) cartEmpty.style.display = count ? 'none' : 'flex';
  }

  function addItemToCart(title, price, img) {
    if (itemList.find((i) => i.title === title)) {
      alert('Already in cart!');
      return;
    }

    itemList.push({ title, price, img });

    const row = document.createElement('div');
    row.className = 'cart-box';
    row.dataset.title = title;
    row.innerHTML = cartRowHTML(title, price, img);

    cartBody.appendChild(row);
    bindRow(row);
    updateUI();
    openCart();
    showToast('Added to cart');
  }

  function addToCartHandler(e) {
    const btn = e.currentTarget;
    const box = btn.closest('.shoe-box');
    if (!box) return;
    const title = box.querySelector('.shoe-title')?.textContent || 'Product';
    const price = box.querySelector('.shoe-price')?.textContent || '0';
    const img = box.querySelector('.shoe-img')?.src || '';

    addItemToCart(title, price, img);
  }

  // wishlist
  function toggleWishlist(e) {
    const btn = e.currentTarget;
    const card = btn.closest('.shoe-box');
    if (!card) return;
    const title =
      (card.querySelector('.shoe-title') && card.querySelector('.shoe-title').textContent) ||
      'Product';
    if (wishlist.includes(title)) {
      wishlist = wishlist.filter((i) => i !== title);
      btn.classList.remove('active');
      showToast('Removed from wishlist');
    } else {
      wishlist.push(title);
      btn.classList.add('active');
      showToast('Added to wishlist');
    }
    updateWishlistCount();
  }
  function updateWishlistCount() {
    if (!wishlistCountEl) return;
    wishlistCountEl.textContent = wishlist.length;
    wishlistCountEl.style.display = wishlist.length ? 'block' : 'none';
  }

  function getRatingMarkup(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;

    const stars = Array.from({ length: 5 }, (_, index) => {
      if (index < fullStars) {
        return '<span class="star full" aria-hidden="true">★</span>';
      }
      if (index === fullStars && hasHalfStar) {
        return '<span class="star half" aria-hidden="true">★</span>';
      }
      return '<span class="star" aria-hidden="true">★</span>';
    }).join('');

    return `
      <div class="product-rating" aria-label="${rating} out of 5 stars">
        <span class="rating-stars">${stars}</span>
        <span class="rating-value">${rating.toFixed(1)}</span>
      </div>
    `;
  }

  function injectProductRatings() {
    const ratings = [4.9, 4.7, 4.6, 4.5, 4.8, 4.4, 4.9, 4.5];
    document.querySelectorAll('.shoe-box').forEach((box, index) => {
      const shoeInfo = box.querySelector('.shoe-info');
      if (!shoeInfo || shoeInfo.querySelector('.product-rating')) return;
      const rating = ratings[index % ratings.length];
      shoeInfo.insertAdjacentHTML('afterbegin', getRatingMarkup(rating));
    });
  }

  // attach product handlers
  document
    .querySelectorAll('.add-cart')
    .forEach((b) => b.addEventListener('click', addToCartHandler));
  document
    .querySelectorAll('.wishlist-btn')
    .forEach((b) => b.addEventListener('click', toggleWishlist));

  injectProductRatings();

  // SEARCH (filter visible products)
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      const products = document.querySelectorAll('.shoe-box');
      let found = false;
      products.forEach((p) => {
        const title = (
          (p.querySelector('.shoe-title') && p.querySelector('.shoe-title').textContent) ||
          ''
        ).toLowerCase();
        if (!q || title.includes(q)) {
          p.style.display = '';
          found = true;
        } else {
          p.style.display = 'none';
        }
      });
      if (noProductsMessage) noProductsMessage.style.display = found ? 'none' : 'block';
    });
  }

  // QUICK VIEW
  const quickViewModal = document.querySelector('.quick-view-modal');
  const quickViewImg = document.getElementById('quick-view-img');
  const quickViewTitle = document.getElementById('quick-view-title');
  const quickViewPrice = document.getElementById('quick-view-price');
  const quickViewCartBtn = document.getElementById('quick-view-cart-btn');
  const closeQuickView = document.querySelector('.close-quick-view');

  document.querySelectorAll('.shoe-img').forEach((img) =>
    img.addEventListener('click', () => {
      const box = img.closest('.shoe-box');
      if (!box) return;

      const title = box.querySelector('.shoe-title')?.textContent || '';
      const price = box.querySelector('.shoe-price')?.textContent || '';

      quickViewImg.src = img.src;
      quickViewTitle.textContent = title;
      quickViewPrice.textContent = price;

      if (quickViewCartBtn) {
        quickViewCartBtn.onclick = () => addItemToCart(title, price, img.src);
      }

      if (quickViewModal) quickViewModal.style.display = 'flex';
    })
  );
  if (closeQuickView)
    closeQuickView.addEventListener('click', () => (quickViewModal.style.display = 'none'));
  window.addEventListener('click', (e) => {
    if (e.target === quickViewModal) quickViewModal.style.display = 'none';
  });

  // CHECKOUT modal
  const buyBtns = document.querySelectorAll('.btn-buy');
  const checkoutModal = document.querySelector('.checkout-modal');
  const closeCheckout = document.querySelector('.close-checkout');
  const submitOrder = document.getElementById('submit-order');

  buyBtns.forEach((b) =>
    b.addEventListener('click', () => {
      if (checkoutModal) checkoutModal.style.display = 'flex';
    })
  );
  if (closeCheckout)
    closeCheckout.addEventListener(
      'click',
      () => checkoutModal && (checkoutModal.style.display = 'none')
    );
  if (submitOrder)
    submitOrder.addEventListener('click', () => {
      const fullName =
        document.getElementById('full-name') && document.getElementById('full-name').value.trim();
      const address =
        document.getElementById('address') && document.getElementById('address').value.trim();
      const phone =
        document.getElementById('phone') && document.getElementById('phone').value.trim();
      const payment =
        document.getElementById('payment-method') &&
        document.getElementById('payment-method').value;
      if (!fullName || !address || !phone || !payment) {
        showToast('Please fill all fields');
        return;
      }
      showToast('Order placed successfully!');
      if (checkoutModal) checkoutModal.style.display = 'none';
    });

  // CLEAR CART
  const clearCartBtn = document.querySelector('.clear-cart-btn');
  if (clearCartBtn)
    clearCartBtn.addEventListener('click', () => {
      if (cartBody) cartBody.innerHTML = '';
      itemList = [];
      updateUI();
      showToast('Cart cleared');
    });

  // DARK MODE
  const darkModeBtn = document.querySelector('#dark-mode-btn');
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    if (darkModeBtn) darkModeBtn.innerText = '☀';
  }
  if (darkModeBtn)
    darkModeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        darkModeBtn.innerText = '☀';
      } else {
        localStorage.setItem('theme', 'light');
        darkModeBtn.innerText = '🌙';
      }
    });

  // initial UI
  updateUI();
  updateWishlistCount();
});
