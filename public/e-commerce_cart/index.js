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
  }

  itemList.push({ title, price, imgSrc, removeSrc });
  const el = document.createElement('div');
  el.innerHTML = cartProduct(title, price, imgSrc, removeSrc);
  document.querySelector('.cart-content').append(el);
  bindCart();
}

function cartProduct(title, price, imgSrc, removeSrc) {
  return `
  <div class="cart-box">
    <img src="${imgSrc}" class="cart-img"/>
    <div class="detail-box">
      <div class="cart-shoe-title">${title}</div>
      <div class="price-box">
        <div class="cart-price">${price}</div>
        <div class="cart-amt">${price}</div>
      </div>
      <div class="qty-stepper">
        <button class="qty-btn qty-minus" type="button">–</button>
        <input type="text" inputmode="numeric" value="1" class="cart-quantity"/>
        <button class="qty-btn qty-plus" type="button">+</button>
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

document.getElementById('search-close').addEventListener('click', () => {
  searchModal.style.display = 'none';
});

document.getElementById('search-input').addEventListener('input', function() {
  const query = this.value.toLowerCase();
  const results = document.getElementById('search-results');
  if (!query) { results.innerHTML = ''; return; }
  const cards = [...document.querySelectorAll('.card-title')];
  const matched = cards.filter(c => c.textContent.toLowerCase().includes(query));
  results.innerHTML = matched.length
    ? matched.map(c => `<div style="padding:0.5rem 0;border-bottom:1px solid #333;">${c.textContent}</div>`).join('')
    : '<div>No results found.</div>';
});

// ===== PROFILE =====
const profileBtn = document.querySelector('.nav-icon[aria-label="Profile"]');

const profileModal = document.createElement('div');
profileModal.id = 'profile-modal';
profileModal.style.cssText = `
  display:none; position:fixed; top:0; left:0; width:100%; height:100%;
  background:rgba(0,0,0,0.7); z-index:9999; justify-content:center; align-items:center;
`;
profileModal.innerHTML = `
  <div style="background:#1a1a1a; padding:2rem; border-radius:12px; width:90%; max-width:400px; position:relative; color:#fff;">
    <button id="profile-close" style="position:absolute;top:1rem;right:1rem;background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer;">✕</button>
    <h2 style="margin-bottom:1.5rem;">Login</h2>
    <input type="text" placeholder="Username" style="width:100%;padding:0.8rem;border-radius:8px;border:none;margin-bottom:1rem;font-size:1rem;outline:none;"/>
    <input type="password" placeholder="Password" style="width:100%;padding:0.8rem;border-radius:8px;border:none;margin-bottom:1rem;font-size:1rem;outline:none;"/>
    <button style="width:100%;padding:0.8rem;background:#2ed573;border:none;border-radius:8px;font-size:1rem;font-weight:700;cursor:pointer;">Login</button>
  </div>
`;
document.body.appendChild(profileModal);

if (profileBtn) {
  profileBtn.addEventListener('click', () => {
    profileModal.style.display = 'flex';
  });
}

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
});
