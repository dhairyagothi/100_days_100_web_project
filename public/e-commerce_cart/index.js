// ===== CART =====
const cartIcon = document.querySelector('#cart-icon');
const cart = document.querySelector('#cart');
const cartClose = document.querySelector('#cart-close');

cartIcon.addEventListener('click', () => cart.classList.add('open'));
cartClose.addEventListener('click', () => cart.classList.remove('open'));

document.addEventListener('DOMContentLoaded',loadshoe);

function loadshoe(){

  itemList.forEach((product) => {

    let newProductElement = createCartProduct(
      product.title,
      product.price,
      product.imgSrc,
      product.remove_shoe
    );

    let element = document.createElement('div');
    element.innerHTML = newProductElement;

    let cartBasket = document.querySelector('.cart-content');
    cartBasket.append(element);
  });

  loadContent();
}

function loadContent(){
  //Remove shoe Items From Cart
  let btnRemove=document.querySelectorAll('.cart-remove');
  btnRemove.forEach((btn)=>{
    btn.addEventListener('click',removeItem);
  });

  //Product Item Change Event
  let qtyElements=document.querySelectorAll('.cart-quantity');
  qtyElements.forEach((input)=>{
    input.addEventListener('change',changeQty);
  });

  // Product Cart
let cartBtns = document.querySelectorAll('.add-cart');

cartBtns.forEach((btn) => {
  btn.addEventListener('click', addCart);
});

// Wishlist Buttons
let wishlistBtns = document.querySelectorAll('.wishlist-btn');

wishlistBtns.forEach((btn) => {
  btn.addEventListener('click', toggleWishlist);
});
updateTotal();
}
function showToast(message){

  const toast = document.createElement('div');

  toast.classList.add('toast');

  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 100);

  setTimeout(() => {
    toast.classList.remove('show');

    setTimeout(() => {
      toast.remove();
    }, 400);

  }, 3000);
}


//Remove Item
function removeItem(){
  if(confirm('Are Your Sure to Remove')){
    let title=this.parentElement.querySelector('.cart-shoe-title').innerHTML;
    itemList=itemList.filter(el=>el.title!=title);
    localStorage.setItem("cartItems", JSON.stringify(itemList));
    this.parentElement.remove();
    showToast("Product removed from cart");
    loadContent();
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
  this.classList.add('animate');

setTimeout(() => {
  this.classList.remove('animate');
}, 200);
  localStorage.setItem("cartItems", JSON.stringify(itemList));
  loadContent();
}

let itemList = JSON.parse(localStorage.getItem("cartItems")) || [];
let wishlist = [];

//Add Cart
function toggleWishlist() {
  const card = this.closest('.shoe-box');
  const title = card.querySelector('.shoe-title').textContent;

  if (wishlist.includes(title)) {
    wishlist = wishlist.filter(item => item !== title);
    this.classList.remove('active');
    showToast("Removed from wishlist");
  } else {
    wishlist.push(title);
    this.classList.add('active');
    showToast("Added to wishlist");
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
}
function addCart(){
  let shoe=this.parentElement;
  let title=shoe.querySelector('.shoe-title').innerHTML;
  let price=shoe.querySelector('.shoe-price').innerHTML;
  let imgSrc=shoe.querySelector('.shoe-img').src;
function decQty() {
  const input = this.parentElement.querySelector('.cart-quantity');
  const v = parseInt(input.value) || 1;
  if (v > 1) input.value = v - 1;
  bindCart();
}

function incQty() {
  const input = this.parentElement.querySelector('.cart-quantity');
  const v = parseInt(input.value) || 1;
  input.value = v + 1;
  bindCart();
}

let itemList = [];

function addCart() {
  const card = this.closest('.card');
  const title = card.querySelector('.card-title').textContent;
  const raw = card.querySelector('.card-price').textContent;
  const price = raw.replace(/,/g, '');
  const imgSrc = card.querySelector('.card-img').src;
  const removeSrc = card.querySelector('.card-remove').src;

 //Check Product already Exist in Cart
  if(itemList.find((el)=>el.title==newProduct.title)){
  showToast("Product already added to cart");
  return;
  }else{
  itemList.push(newProduct);
  showToast("Product added to cart");
  localStorage.setItem("cartItems", JSON.stringify(itemList));
  if (itemList.some(el => el.title === title)) {
    alert('Already in cart');
    return;
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
    </div>
    <ion-icon name="trash" class="cart-remove"><img src="${removeSrc}" style="width:10px"/></ion-icon>
  </div>`;
}

function updateTotal() {
  let total = 0;
  document.querySelectorAll('.cart-box').forEach(box => {
    const p = parseFloat(box.querySelector('.cart-price').textContent.replace(/Rs\.?/g, '').replace(/,/g, ''));
    const q = parseInt(box.querySelector('.cart-quantity').value) || 1;
    total += p * q;
    box.querySelector('.cart-amt').textContent = 'Rs.' + (p * q);
  });
  document.querySelector('.cart-total-price').textContent = 'Rs.' + total;

  const count = document.querySelector('.cart-count');
  const n = itemList.length;
  count.textContent = n;
  count.style.display = n === 0 ? 'none' : 'block';
}

// ===== CARD STAGGER =====
function animateCards() {
  document.querySelectorAll('.card').forEach((c, i) => {
    setTimeout(() => c.classList.add('visible'), 60 * (i + 1));
  });
}

// ===== SLIDER =====
let current = 0;
const slides = document.querySelectorAll('.slide');
const dotBox = document.querySelector('#slider-dots');

if (slides.length) {
  slides.forEach((_, i) => {
    const d = document.createElement('div');
    d.className = 'dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => goSlide(i));
    dotBox.appendChild(d);
  });
}

function goSlide(i) {
  slides.forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
  slides[i].classList.add('active');
  document.querySelectorAll('.dot')[i].classList.add('active');
  current = i;
}

totalValue.classList.add('updated');

setTimeout(() => {
  totalValue.classList.remove('updated');
}, 300);

function nextSlide() { goSlide((current + 1) % slides.length); }

let interval = setInterval(nextSlide, 3000);

const slider = document.querySelector('#slider');
if (slider) {
  slider.addEventListener('mouseenter', () => clearInterval(interval));
  slider.addEventListener('mouseleave', () => { interval = setInterval(nextSlide, 3000); });
}

// ===== THEME =====
const toggle = document.querySelector('#theme-toggle');
const sun = document.querySelector('#sun-icon');
const moon = document.querySelector('#moon-icon');

function apply(dark) {
  document.body.classList.toggle('dark-mode', dark);
  sun.style.display = dark ? 'block' : 'none';
  moon.style.display = dark ? 'none' : 'block';
  localStorage.setItem('aero-theme', dark ? 'dark' : 'light');
}

if (toggle) {
  apply(localStorage.getItem('aero-theme') === 'dark');
  toggle.addEventListener('click', () => apply(!document.body.classList.contains('dark-mode')));
}

// ===== SEARCH =====
const searchBtn = document.querySelector('.nav-icon[aria-label="Search"]');

const searchModal = document.createElement('div');
searchModal.id = 'search-modal';
searchModal.style.cssText = `
  display:none; position:fixed; top:0; left:0; width:100%; height:100%;
  background:rgba(0,0,0,0.7); z-index:9999; justify-content:center; align-items:flex-start; padding-top:80px;
`;
searchModal.innerHTML = `
  <div style="background:#1a1a1a; padding:2rem; border-radius:12px; width:90%; max-width:500px; position:relative;">
    <button id="search-close" style="position:absolute;top:1rem;right:1rem;background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer;">✕</button>
    <input id="search-input" type="text" placeholder="Search shoes..." style="width:100%;padding:0.8rem 1rem;border-radius:8px;border:none;font-size:1rem;outline:none;"/>
    <div id="search-results" style="margin-top:1rem;color:#fff;"></div>
  </div>
`;
document.body.appendChild(searchModal);

if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    searchModal.style.display = 'flex';
    document.getElementById('search-input').focus();
  });
}
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

  const fullName = document.querySelector('#full-name').value;
  const address = document.querySelector('#address').value;
  const phone = document.querySelector('#phone').value;
  const payment = document.querySelector('#payment-method').value;

  if(fullName === '' || address === '' || phone === '' || payment === ''){
    showToast('Please fill all fields');
    return;
  }

  showToast('Order placed successfully!');

  checkoutModal.style.display = 'none';
});
const searchInput = document.querySelector('#search-input');

searchInput.addEventListener('keyup', () => {

  const searchValue = searchInput.value.toLowerCase();

  const products = document.querySelectorAll('.shoe-box');

  let matchFound = false;

  products.forEach((product) => {

    const title = product
      .querySelector('.shoe-title')
      .textContent
      .toLowerCase();

    if(title.includes(searchValue)){

      product.style.display = 'block';
      matchFound = true;

    } else {

      product.style.display = 'none';

    }

  });

  const noProductsMessage =
    document.querySelector('#no-products-message');

  if(matchFound){
    noProductsMessage.style.display = 'none';
  } else {
    noProductsMessage.style.display = 'block';
  }

});
const clearCartBtn = document.querySelector('.clear-cart-btn');
clearCartBtn.addEventListener('click', () => {

  const cartContent = document.querySelector('.cart-content');

  cartContent.innerHTML = '';

  itemList = [];

  localStorage.removeItem("cartItems");

  updateTotal();

  showToast("Cart cleared");

});
// Dark Mode

const darkModeBtn = document.querySelector('#dark-mode-btn');

if(localStorage.getItem("theme") === "dark"){
  document.body.classList.add('dark-mode');

  if(darkModeBtn){
    darkModeBtn.innerText = "☀";
  }
}

if(darkModeBtn){

  darkModeBtn.addEventListener('click', () => {

    document.body.classList.toggle('dark-mode');

    if(document.body.classList.contains('dark-mode')){

      localStorage.setItem("theme", "dark");

      darkModeBtn.innerText = "☀";

    } else {

      localStorage.setItem("theme", "light");

      darkModeBtn.innerText = "🌙";

    }

  });

}
// Quick View Popup

const quickViewModal =
  document.querySelector('.quick-view-modal');

const quickViewImg =
  document.querySelector('#quick-view-img');

const quickViewTitle =
  document.querySelector('#quick-view-title');

const quickViewPrice =
  document.querySelector('#quick-view-price');

const closeQuickView =
  document.querySelector('.close-quick-view');

const quickViewImages =
  document.querySelectorAll('.shoe-img');

quickViewImages.forEach((image) => {

  image.addEventListener('click', () => {

    const shoeBox = image.closest('.shoe-box');

    const title =
      shoeBox.querySelector('.shoe-title').innerText;

    const price =
      shoeBox.querySelector('.shoe-price').innerText;

    const imgSrc = image.src;

    quickViewImg.src = imgSrc;

    quickViewTitle.innerText = title;

    quickViewPrice.innerText = price;

    quickViewModal.style.display = 'flex';

  });

});

closeQuickView.addEventListener('click', () => {

  quickViewModal.style.display = 'none';

});

window.addEventListener('click', (e) => {

  if(e.target === quickViewModal){

    quickViewModal.style.display = 'none';

  }

});
document.getElementById('profile-close').addEventListener('click', () => {
  profileModal.style.display = 'none';
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
