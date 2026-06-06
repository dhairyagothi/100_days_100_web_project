// ===== CART =====
const cartIcon = document.querySelector('#cart-icon');
const cart = document.querySelector('#cart');
const cartClose = document.querySelector('#cart-close');

cartIcon.addEventListener('click', () => cart.classList.add('open'));
cartClose.addEventListener('click', () => cart.classList.remove('open'));

document.addEventListener('DOMContentLoaded', init);

function init() {
  bindCart();
  animateCards();
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

function bindCart() {
  document.querySelectorAll('.cart-remove').forEach(b => b.addEventListener('click', removeItem));
  document.querySelectorAll('.cart-quantity').forEach(i => i.addEventListener('change', changeQty));
  document.querySelectorAll('.qty-minus').forEach(b => b.addEventListener('click', decQty));
  document.querySelectorAll('.qty-plus').forEach(b => b.addEventListener('click', incQty));
  document.querySelectorAll('.card-add').forEach(b => b.addEventListener('click', addCart));
  updateTotal();
}

function removeItem() {
  if (!confirm('Remove this item?')) return;
  const title = this.parentElement.querySelector('.cart-shoe-title').textContent;
  itemList = itemList.filter(el => el.title !== title);
  this.parentElement.remove();
  bindCart();
}

function changeQty() {
  if (isNaN(this.value) || this.value < 1) this.value = 1;
  bindCart();
}

let itemList=[];
let wishlist = [];

//Add Cart
function toggleWishlist() {
  const card = this.closest('.shoe-box');
  const title = card.querySelector('.shoe-title').textContent;

  if (wishlist.includes(title)) {
    wishlist = wishlist.filter(item => item !== title);
    this.classList.remove('active');
  } else {
    wishlist.push(title);
    this.classList.add('active');
  }

  updateWishlistCount();
}
function updateWishlistCount() {
  const count = document.querySelector('#wishlist-count');

  count.textContent = wishlist.length;

  if (wishlist.length === 0) {
    count.style.display = 'none';
  } else {
    count.style.display = 'block';
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

  if (itemList.some(el => el.title === title)) {
    alert('Already in cart');
    return;
updateTotal();
}


//Remove Item
function removeItem(){
  if(confirm('Are Your Sure to Remove')){
    let title=this.parentElement.querySelector('.cart-shoe-title').innerHTML;
    itemList=itemList.filter(el=>el.title!=title);
    localStorage.setItem("cartItems", JSON.stringify(itemList));
    this.parentElement.remove();
    loadContent();
  }
}

//Change Quantity
function changeQty(){
  if(isNaN(this.value) || this.value<1){
    this.value=1;
  }
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
  } else {
    wishlist.push(title);
    this.classList.add('active');
  }

  updateWishlistCount();
}
function updateWishlistCount() {
  const count = document.querySelector('#wishlist-count');

  count.textContent = wishlist.length;

  if (wishlist.length === 0) {
    count.style.display = 'none';
  } else {
    count.style.display = 'block';
  }
}
function addCart(){
  let shoe=this.parentElement;
  let title=shoe.querySelector('.shoe-title').innerHTML;
  let price=shoe.querySelector('.shoe-price').innerHTML;
  let imgSrc=shoe.querySelector('.shoe-img').src;
document.addEventListener('DOMContentLoaded', init);

function init() {
  bindCart();
  animateCards();
}

function bindCart() {
  document.querySelectorAll('.cart-remove').forEach(b => b.addEventListener('click', removeItem));
  document.querySelectorAll('.cart-quantity').forEach(i => i.addEventListener('change', changeQty));
  document.querySelectorAll('.qty-minus').forEach(b => b.addEventListener('click', decQty));
  document.querySelectorAll('.qty-plus').forEach(b => b.addEventListener('click', incQty));
  document.querySelectorAll('.card-add').forEach(b => b.addEventListener('click', addCart));
  updateTotal();
}

function removeItem() {
  if (!confirm('Remove this item?')) return;
  const title = this.parentElement.querySelector('.cart-shoe-title').textContent;
  itemList = itemList.filter(el => el.title !== title);
  this.parentElement.remove();
  bindCart();
}

function changeQty() {
  if (isNaN(this.value) || this.value < 1) this.value = 1;
  bindCart();
}

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
  alert("Product Already added in Cart");
  return;
  }else{
  itemList.push(newProduct);
  localStorage.setItem("cartItems", JSON.stringify(itemList));
  if (itemList.some(el => el.title === title)) {
    alert('Already in cart');
    return;
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
  }
}

//Change Quantity
function changeQty(){
  if(isNaN(this.value) || this.value<1){
    this.value=1;
  }
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
  }

  updateWishlistCount();
}
function updateWishlistCount() {
  const count = document.querySelector('#wishlist-count');

  count.textContent = wishlist.length;

  if (wishlist.length === 0) {
    count.style.display = 'none';
  } else {
    count.style.display = 'block';
  }
}
function addCart(){
  let shoe=this.parentElement;
  let title=shoe.querySelector('.shoe-title').innerHTML;
  let price=shoe.querySelector('.shoe-price').innerHTML;
  let imgSrc=shoe.querySelector('.shoe-img').src;
document.addEventListener('DOMContentLoaded', init);

function init() {
  bindCart();
  animateCards();
}

function bindCart() {
  document.querySelectorAll('.cart-remove').forEach(b => b.addEventListener('click', removeItem));
  document.querySelectorAll('.cart-quantity').forEach(i => i.addEventListener('change', changeQty));
  document.querySelectorAll('.qty-minus').forEach(b => b.addEventListener('click', decQty));
  document.querySelectorAll('.qty-plus').forEach(b => b.addEventListener('click', incQty));
  document.querySelectorAll('.card-add').forEach(b => b.addEventListener('click', addCart));
  updateTotal();
}

function removeItem() {
  if (!confirm('Remove this item?')) return;
  const title = this.parentElement.querySelector('.cart-shoe-title').textContent;
  itemList = itemList.filter(el => el.title !== title);
  this.parentElement.remove();
  bindCart();
}

function changeQty() {
  if (isNaN(this.value) || this.value < 1) this.value = 1;
  bindCart();
}

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
/* ===========================
   AEROSTRIDE — index.js
   Full E-Commerce Functionality
   =========================== */

// ===== STATE =====
let cartItems = []; // [{ id, title, price, imgSrc, qty }]

// ===== DOM REFS =====
const header = document.getElementById("header");
const cartEl = document.getElementById("cart");
const cartOverlay = document.getElementById("cart-overlay");
const cartContent = document.getElementById("cart-content");
const cartEmpty = document.getElementById("cart-empty");
const cartFooter = document.getElementById("cart-footer");
const cartCountEl = document.getElementById("cart-count");
const cartItemLabel = document.getElementById("cart-item-label");
const cartSubtotal = document.getElementById("cart-subtotal");
const cartTotalPrice = document.getElementById("cart-total-price");

// ===== HELPERS =====
function fmt(n) {
  return "Rs." + Number(n).toLocaleString("en-IN");
}

function showToast(msg, isError = false) {
  const toast = document.getElementById("toast");
  document.getElementById("toast-msg").textContent = msg;
  toast.style.borderColor = isError ? "#ef4444" : "var(--green)";
  toast.querySelector("svg").style.color = isError ? "#ef4444" : "var(--green)";
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3200);
}

function openModal(overlay, modal) {
  overlay.classList.add("active");
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal(overlay, modal) {
  overlay.classList.remove("active");
  modal.classList.remove("active");
  if (!cartEl.classList.contains("open")) {
    document.body.style.overflow = "";
  }
}

// ===== NAVBAR SCROLL =====
window.addEventListener(
  "scroll",
  () => {
    header.style.borderBottomColor =
      window.scrollY > 20
        ? "rgba(255,255,255,0.08)"
        : "rgba(255,255,255,0.04)";
  },
  { passive: true }
);

// ===== THEME =====
const themeBtn = document.getElementById("theme-toggle");
const sunIcon = document.getElementById("sun-icon");
const moonIcon = document.getElementById("moon-icon");

function applyTheme(light) {
  document.body.classList.toggle("light", light);
  sunIcon.style.display = light ? "block" : "none";
  moonIcon.style.display = light ? "none" : "block";
  localStorage.setItem("aero-theme", light ? "light" : "dark");
}

(function initTheme() {
  const saved = localStorage.getItem("aero-theme");
  applyTheme(saved === "light");
})();

themeBtn.addEventListener("click", () => {
  applyTheme(!document.body.classList.contains("light"));
});

// ===== CART OPEN / CLOSE =====
document.getElementById("cart-icon").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

function openCart() {
  cartEl.classList.add("open");
  cartOverlay.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartEl.classList.remove("open");
  cartOverlay.classList.remove("active");
  document.body.style.overflow = "";
}

// ===== CART RENDER =====
function renderCart() {
  const existingItems = cartContent.querySelectorAll(".cart-item");
  existingItems.forEach((el) => el.remove());

  if (cartItems.length === 0) {
    cartEmpty.style.display = "flex";
    cartFooter.style.display = "none";
    cartCountEl.textContent = "0";
    cartItemLabel.textContent = "0 items";
    return;
  }

  cartEmpty.style.display = "none";
  cartFooter.style.display = "flex";

  cartItems.forEach((item) => {
    const el = createCartItemEl(item);
    cartContent.appendChild(el);
  });

  updateCartTotals();
}

function createCartItemEl(item) {
  const div = document.createElement("div");
  div.className = "cart-item";
  div.dataset.id = item.id;
  div.innerHTML = `
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

  div.querySelector(".item-minus").addEventListener("click", () => changeQty(item.id, -1));
  div.querySelector(".item-plus").addEventListener("click", () => changeQty(item.id, +1));
  div.querySelector(".cart-item-remove").addEventListener("click", () => removeCartItem(item.id));

  return div;
}

function updateCartTotals() {
  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cartItems.reduce((s, i) => s + i.qty, 0);

  cartSubtotal.textContent = fmt(total);
  cartTotalPrice.textContent = fmt(total);
  cartCountEl.textContent = count;
  cartItemLabel.textContent = `${cartItems.length} item${cartItems.length !== 1 ? "s" : ""}`;

  cartCountEl.classList.remove("bounce");
  void cartCountEl.offsetWidth;
  cartCountEl.classList.add("bounce");
}

// ===== ADD TO CART =====
function addToCart(title, price, imgSrc, qty = 1) {
  const id = title.toLowerCase().replace(/\s+/g, "-");
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

// ===== CHANGE QTY =====
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

// ===== REMOVE CART ITEM =====
function removeCartItem(id) {
  cartItems = cartItems.filter((i) => i.id !== id);
  renderCart();
  showToast("Item removed from cart");
}

// ===== CLEAR CART =====
document.getElementById("clear-cart-btn").addEventListener("click", () => {
  if (!cartItems.length) return;
  if (confirm("Clear all items from cart?")) {
    cartItems = [];
    renderCart();
    showToast("Cart cleared");
  }
});

// ===== ADD TO CART BUTTONS (product cards) =====
document.querySelectorAll(".card-add").forEach((btn) => {
  btn.addEventListener("click", function () {
    const title = this.dataset.title;
    const price = this.dataset.price;
    const img = this.dataset.img;

    this.classList.add("added");
    const origHTML = this.innerHTML;
    this.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    setTimeout(() => {
      this.classList.remove("added");
      this.innerHTML = origHTML;
    }, 1200);

    addToCart(title, price, img);
  });
});

// ===== CHECKOUT =====
const checkoutBtn = document.getElementById("checkout-btn");
const checkoutOverlay = document.getElementById("checkout-overlay");
const checkoutModal = document.getElementById("checkout-modal");
const checkoutClose = document.getElementById("checkout-close");
const submitOrderBtn = document.getElementById("submit-order-btn");

checkoutBtn.addEventListener("click", () => {
  openCheckoutModal();
});

checkoutClose.addEventListener("click", () =>
  closeModal(checkoutOverlay, checkoutModal)
);
checkoutOverlay.addEventListener("click", () =>
  closeModal(checkoutOverlay, checkoutModal)
);

function openCheckoutModal() {
  const list = document.getElementById("checkout-items-list");
  list.innerHTML = "";
  cartItems.forEach((item) => {
    const row = document.createElement("div");
    row.className = "checkout-item-row";
    row.innerHTML = `
      <img src="${item.imgSrc}" alt="${item.title}" />
      <span class="ci-name">${item.title}</span>
      <span class="ci-qty">×${item.qty}</span>
      <span class="ci-price">${fmt(item.price * item.qty)}</span>
    `;
    list.appendChild(row);
  });

  const grand = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  document.getElementById("checkout-grand-total").textContent = fmt(grand);

  openModal(checkoutOverlay, checkoutModal);
}

submitOrderBtn.addEventListener("click", () => {
  const name = document.getElementById("co-name").value.trim();
  const email = document.getElementById("co-email").value.trim();
  const phone = document.getElementById("co-phone").value.trim();
  const address = document.getElementById("co-address").value.trim();
  const payment = document.getElementById("co-payment").value;

  if (!name || !email || !phone || !address || !payment) {
    showToast("Please fill in all fields", true);
    return;
  }

  const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRx.test(email)) {
    showToast("Please enter a valid email", true);
    return;
  }

  submitOrderBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Order Placed!</span>`;
  submitOrderBtn.style.background = "var(--green)";

  setTimeout(() => {
    closeModal(checkoutOverlay, checkoutModal);
    cartItems = [];
    renderCart();
    closeCart();

    ["co-name", "co-email", "co-phone", "co-address", "co-payment"].forEach(
      (id) => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      }
    );

    submitOrderBtn.innerHTML = `<span>Place Order</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
    submitOrderBtn.style.background = "";

    showToast("🎉 Order placed successfully! Thank you, " + name + "!");
  }, 1200);
});

// ===== SEARCH =====
const searchBtn = document.getElementById("search-btn");
const searchOverlay = document.getElementById("search-overlay");
const searchModal = document.getElementById("search-modal");
const searchClose = document.getElementById("search-close");
const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

searchBtn.addEventListener("click", () => {
  openModal(searchOverlay, searchModal);
  setTimeout(() => searchInput.focus(), 100);
});
searchClose.addEventListener("click", () => {
  closeModal(searchOverlay, searchModal);
  searchInput.value = "";
  searchResults.innerHTML = "";
});
searchOverlay.addEventListener("click", () => {
  closeModal(searchOverlay, searchModal);
  searchInput.value = "";
  searchResults.innerHTML = "";
});

searchInput.addEventListener("input", function () {
  const q = this.value.trim().toLowerCase();
  if (!q) {
    searchResults.innerHTML = "";
    return;
  }

  const cards = document.querySelectorAll(".card");
  const matched = [];
  cards.forEach((card) => {
    const name = card.dataset.name || "";
    const price = card.dataset.price || "";
    const img = card.querySelector(".card-img");
    if (name.toLowerCase().includes(q)) {
      matched.push({ name, price, imgSrc: img ? img.src : "" });
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
    .join("");

  searchResults.querySelectorAll(".search-result-item").forEach((item) => {
    item.addEventListener("click", () => {
      addToCart(item.dataset.name, item.dataset.price, item.dataset.img);
      closeModal(searchOverlay, searchModal);
      searchInput.value = "";
      searchResults.innerHTML = "";
    });
  });
});

// ===== PROFILE =====
const profileBtn = document.getElementById("profile-btn");
const profileOverlay = document.getElementById("profile-overlay");
const profileModal = document.getElementById("profile-modal");
const profileClose = document.getElementById("profile-close");

profileBtn.addEventListener("click", () =>
  openModal(profileOverlay, profileModal)
);
profileClose.addEventListener("click", () =>
  closeModal(profileOverlay, profileModal)
);
profileOverlay.addEventListener("click", () =>
  closeModal(profileOverlay, profileModal)
);

document.querySelectorAll(".ptab").forEach((tab) => {
  tab.addEventListener("click", function () {
    document.querySelectorAll(".ptab").forEach((t) => t.classList.remove("active"));
    this.classList.add("active");
    const target = this.dataset.tab;
    document.getElementById("login-tab").classList.toggle("hidden", target !== "login");
    document.getElementById("signup-tab").classList.toggle("hidden", target !== "signup");
  });
});

// ===== QUICK VIEW =====
const qvOverlay = document.getElementById("qv-overlay");
const qvModal = document.getElementById("qv-modal");
const qvClose = document.getElementById("qv-close");

let qvCurrentName = "";
let qvCurrentPrice = 0;
let qvCurrentImg = "";
let qvQty = 1;

document.querySelectorAll(".btn-quick-view").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    qvCurrentName = btn.dataset.name;
    qvCurrentPrice = Number(btn.dataset.price);
    qvCurrentImg = btn.dataset.img;
    qvQty = 1;

    document.getElementById("qv-img").src = qvCurrentImg;
    document.getElementById("qv-name").textContent = qvCurrentName;
    document.getElementById("qv-price").textContent = fmt(qvCurrentPrice);
    document.getElementById("qv-qty").textContent = qvQty;

    openModal(qvOverlay, qvModal);
  });
});

qvClose.addEventListener("click", () => closeModal(qvOverlay, qvModal));
qvOverlay.addEventListener("click", () => closeModal(qvOverlay, qvModal));

document.getElementById("qv-minus").addEventListener("click", () => {
  if (qvQty > 1) {
    qvQty--;
    document.getElementById("qv-qty").textContent = qvQty;
  }
});
document.getElementById("qv-plus").addEventListener("click", () => {
  qvQty++;
  document.getElementById("qv-qty").textContent = qvQty;
});

document.getElementById("qv-add-btn").addEventListener("click", () => {
  addToCart(qvCurrentName, qvCurrentPrice, qvCurrentImg, qvQty);
  closeModal(qvOverlay, qvModal);
});

// ===== FILTER & SORT =====
let activeFilter = "all";

document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
    activeFilter = this.dataset.filter;
    applyFilterSort();
  });
});

document.getElementById("sort-select").addEventListener("change", applyFilterSort);

function applyFilterSort() {
  const sortVal = document.getElementById("sort-select").value;
  const cards = Array.from(document.querySelectorAll(".card"));
  const grid = document.getElementById("grid");

  let visible = cards.filter((card) => {
    if (activeFilter === "all") return true;
    return card.dataset.category === activeFilter;
  });

  if (sortVal === "price-asc") {
    visible.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
  } else if (sortVal === "price-desc") {
    visible.sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price));
  } else if (sortVal === "name-asc") {
    visible.sort((a, b) =>
      (a.dataset.name || "").localeCompare(b.dataset.name || "")
    );
  }

  const noResults = document.getElementById("no-results");

  cards.forEach((c) => {
    c.style.display = "none";
    c.classList.remove("visible");
  });

const buyBtn = document.querySelector('.btn-buy');
const checkoutModal = document.querySelector('.checkout-modal');
const closeCheckout = document.querySelector('.close-checkout');
const submitOrder = document.querySelector('#submit-order');

buyBtn.addEventListener('click', () => {
  checkoutModal.style.display = 'flex';
});

closeCheckout.addEventListener('click', () => {
  checkoutModal.style.display = 'none';
});

submitOrder.addEventListener('click', () => {

  const fullName = document.querySelector('#full-name').value;
  const address = document.querySelector('#address').value;
  const phone = document.querySelector('#phone').value;
  const payment = document.querySelector('#payment-method').value;

  if(fullName === '' || address === '' || phone === '' || payment === ''){
    alert('Please fill all fields');
    return;
  }

  alert('Order placed successfully!');
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
const submitOrder = document.querySelector('#submit-order');
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
  if (!visible.length) {
    noResults.style.display = "block";
    return;
  }

  noResults.style.display = "none";

  visible.forEach((card, i) => {
    card.style.display = "flex";
    grid.appendChild(card);
    setTimeout(() => card.classList.add("visible"), 40 * i);
  });
}

// ===== HERO SLIDER =====
let current = 0;
const slides = document.querySelectorAll(".slide");
const dotBox = document.getElementById("slider-dots");
let sliderInterval;

if (slides.length) {
  slides.forEach((_, i) => {
    const d = document.createElement("button");
    d.className = "dot" + (i === 0 ? " active" : "");
    d.setAttribute("aria-label", `Slide ${i + 1}`);
    d.addEventListener("click", () => goSlide(i));
    dotBox.appendChild(d);
  });

  sliderInterval = setInterval(nextSlide, 3500);

  const sliderEl = document.getElementById("slider");
  sliderEl.addEventListener("mouseenter", () => clearInterval(sliderInterval));
  sliderEl.addEventListener("mouseleave", () => {
    sliderInterval = setInterval(nextSlide, 3500);
  });

  let touchStartX = 0;
  sliderEl.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true }
  );
  sliderEl.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? nextSlide() : prevSlide();
  });

  document.getElementById("slider-prev").addEventListener("click", prevSlide);
  document.getElementById("slider-next").addEventListener("click", nextSlide);
}

function goSlide(i) {
  slides[current].classList.remove("active");
  document.querySelectorAll(".dot")[current]?.classList.remove("active");
  current = (i + slides.length) % slides.length;
  slides[current].classList.add("active");
  document.querySelectorAll(".dot")[current]?.classList.add("active");
}
function nextSlide() {
  goSlide(current + 1);
}
function prevSlide() {
  goSlide(current - 1);
}

// ===== CARD STAGGER ANIMATION =====
function animateCards() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const cards = entry.target.querySelectorAll(".card");
          cards.forEach((c, i) => {
            setTimeout(() => c.classList.add("visible"), 60 * i);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05 }
  );

  const grid = document.getElementById("grid");
  if (grid) observer.observe(grid);
}

// ===== KEYBOARD ACCESSIBILITY =====
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    [
      [cartOverlay, cartEl],
      [searchOverlay, searchModal],
      [checkoutOverlay, checkoutModal],
      [profileOverlay, profileModal],
      [qvOverlay, qvModal],
    ].forEach(([overlay, modal]) => {
      if (overlay.classList.contains("active")) {
        if (modal === cartEl) closeCart();
        else closeModal(overlay, modal);
      }
    });
  }

  if (e.key === "ArrowRight" && document.activeElement.closest("#slider"))
    nextSlide();
  if (e.key === "ArrowLeft" && document.activeElement.closest("#slider"))
    prevSlide();
});

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  animateCards();

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });
});
