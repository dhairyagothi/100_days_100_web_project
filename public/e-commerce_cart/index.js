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
