const btnCart = document.querySelector('#cart-icon');
const cart = document.querySelector('.cart');
const btnClose = document.querySelector('#cart-close');

// State Variables
let itemList = [];
let orderHistory = [];

// DOM Elements
const btnHome = document.querySelector('#btn-home');
const btnSearch = document.querySelector('#btn-search');
const btnProfile = document.querySelector('#btn-profile');
const searchOverlay = document.querySelector('#search-overlay');
const searchInput = document.querySelector('#search-input');
const searchCloseBtn = document.querySelector('#search-close-btn');

const profileDrawer = document.querySelector('#profile-drawer');
const profileCloseBtn = document.querySelector('#profile-drawer-close');
const orderHistoryList = document.querySelector('#order-history-list');

const quickViewModal = document.querySelector('#quick-view-modal');
const quickViewClose = document.querySelector('#quick-view-close');
const qvImage = document.querySelector('#qv-image');
const qvTitle = document.querySelector('#qv-title');
const qvPrice = document.querySelector('#qv-price');
const qvDesc = document.querySelector('#qv-desc');
const qvSizesContainer = document.querySelector('#qv-sizes-container');
const qvAddCartBtn = document.querySelector('#qv-add-cart-btn');

const checkoutModal = document.querySelector('#checkout-modal');
const checkoutClose = document.querySelector('#checkout-close');
const receiptItemsContainer = document.querySelector('#receipt-items-container');
const receiptSubtotal = document.querySelector('#receipt-subtotal');
const receiptTax = document.querySelector('#receipt-tax');
const receiptTotal = document.querySelector('#receipt-total');
const btnConfirmOrder = document.querySelector('#btn-confirm-order');

const toastContainer = document.querySelector('#toast-container');

// Event Listeners for Cart open/close
btnCart.addEventListener('click', () => {
  cart.classList.add('cart-active');
  closeOtherDrawers();
});

btnClose.addEventListener('click', () => {
  cart.classList.remove('cart-active');
});

// Run Init
document.addEventListener('DOMContentLoaded', init);

function init() {
  loadContentEvents();
  setupNavigationEvents();
  setupProductCardEvents();
  setupQuickViewEvents();
  setupCheckoutEvents();
}

function closeOtherDrawers() {
  profileDrawer.classList.remove('active');
  searchOverlay.classList.remove('active');
}

// ----------------------------------------------------
// Toast Notification Helper
// ----------------------------------------------------
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  let icon = 'ℹ️';
  if (type === 'success') icon = '✅';
  if (type === 'warning') icon = '⚠️';
  
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  toastContainer.appendChild(toast);
  
  // Remove toast after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ----------------------------------------------------
// Navigation & Overlay Features
// ----------------------------------------------------
function setupNavigationEvents() {
  // Smooth scroll home or window scroll to top
  btnHome.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Scrolling to home', 'info');
    closeOtherDrawers();
    cart.classList.remove('cart-active');
  });

  // Search Toggle
  btnSearch.addEventListener('click', () => {
    searchOverlay.classList.toggle('active');
    if (searchOverlay.classList.contains('active')) {
      closeOtherDrawers();
      searchOverlay.classList.add('active'); // re-ensure
      cart.classList.remove('cart-active');
      setTimeout(() => searchInput.focus(), 100);
    }
  });

  searchCloseBtn.addEventListener('click', () => {
    searchOverlay.classList.remove('active');
    searchInput.value = '';
    filterProducts();
  });

  searchInput.addEventListener('input', filterProducts);

  // Profile Drawer Toggle
  btnProfile.addEventListener('click', () => {
    profileDrawer.classList.toggle('active');
    if (profileDrawer.classList.contains('active')) {
      closeOtherDrawers();
      cart.classList.remove('cart-active');
    }
  });

  profileCloseBtn.addEventListener('click', () => {
    profileDrawer.classList.remove('active');
  });

  // Close modals when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === quickViewModal) {
      quickViewModal.classList.remove('active');
    }
    if (e.target === checkoutModal) {
      checkoutModal.classList.remove('active');
    }
  });
}

// ----------------------------------------------------
// Sizing & Click Handling for Shoe Cards
// ----------------------------------------------------
function setupProductCardEvents() {
  // Sizing option pill click handlers on shoe cards
  document.querySelectorAll('.size-options').forEach(group => {
    group.addEventListener('click', (e) => {
      if (e.target.classList.contains('size-opt')) {
        const parent = e.target.parentElement;
        parent.querySelectorAll('.size-opt').forEach(opt => opt.classList.remove('active'));
        e.target.classList.add('active');
      }
    });
  });

  // Hover animations or size checks could go here
}

// ----------------------------------------------------
// Product Filter Logic
// ----------------------------------------------------
function filterProducts() {
  const query = searchInput.value.toLowerCase().trim();
  const shoes = document.querySelectorAll('.shoe-box');
  let matchedCount = 0;

  shoes.forEach(shoe => {
    const title = shoe.querySelector('.shoe-title').textContent.toLowerCase();
    const matches = title.includes(query);
    if (matches) {
      shoe.style.display = 'flex';
      matchedCount++;
    } else {
      shoe.style.display = 'none';
    }
  });
}

// ----------------------------------------------------
// Core Cart Operations
// ----------------------------------------------------
function loadContentEvents() {
  // Remove buttons
  let btnRemove = document.querySelectorAll('.cart-remove');
  btnRemove.forEach((btn) => {
    btn.onclick = removeItem;
  });

  // Quantity control inputs & buttons
  let cartBoxes = document.querySelectorAll('.cart-box');
  cartBoxes.forEach((box) => {
    const btnMinus = box.querySelector('.qty-minus');
    const btnPlus = box.querySelector('.qty-plus');
    const qtyInput = box.querySelector('.cart-qty-input');

    if (btnMinus) {
      btnMinus.onclick = () => {
        let val = parseInt(qtyInput.value) || 1;
        if (val > 1) {
          qtyInput.value = val - 1;
          updateCartQuantityState(box, val - 1);
        }
      };
    }

    if (btnPlus) {
      btnPlus.onclick = () => {
        let val = parseInt(qtyInput.value) || 1;
        qtyInput.value = val + 1;
        updateCartQuantityState(box, val + 1);
      };
    }
  });

  // Adding item to Cart
  let addCartButtons = document.querySelectorAll('.add-cart');
  addCartButtons.forEach((btn) => {
    btn.onclick = addCartFromCard;
  });

  updateTotal();
}

function updateCartQuantityState(cartBox, newVal) {
  const title = cartBox.querySelector('.cart-shoe-title').innerHTML;
  // find matching item size details as well to update correctly
  const sizeText = cartBox.querySelector('.cart-shoe-size').textContent;
  const size = sizeText.replace('Size: ', '').trim();

  let item = itemList.find(el => el.title === title && el.size === size);
  if (item) {
    item.qty = newVal;
  }
  updateTotal();
}

// Remove Item from Cart
function removeItem() {
  if (confirm('Are you sure you want to remove this item?')) {
    const box = this.parentElement;
    const title = box.querySelector('.cart-shoe-title').innerHTML;
    const sizeText = box.querySelector('.cart-shoe-size').textContent;
    const size = sizeText.replace('Size: ', '').trim();

    itemList = itemList.filter(el => !(el.title === title && el.size === size));
    box.remove();
    showToast(`${title} (Size: ${size}) removed from cart`, 'info');
    loadContentEvents();
  }
}

// Add to Cart from Product Card
function addCartFromCard(e) {
  e.stopPropagation();
  const shoe = this.closest('.shoe-box');
  const title = shoe.querySelector('.shoe-title').innerHTML;
  const price = shoe.querySelector('.shoe-price').innerHTML;
  const imgSrc = shoe.querySelector('.shoe-img').src;
  const remove_shoe = shoe.querySelector('.remove_icon').src;

  // Sizing
  const sizeElement = shoe.querySelector('.size-opt.active');
  if (!sizeElement) {
    showToast('Please select a size first', 'warning');
    return;
  }
  const size = sizeElement.dataset.size;

  executeAddToCart(title, price, imgSrc, remove_shoe, size);
}

// Core Cart Add Function
function executeAddToCart(title, price, imgSrc, remove_shoe, size) {
  // Check duplicate (match title and size!)
  const duplicate = itemList.find(el => el.title === title && el.size === size);
  if (duplicate) {
    showToast(`Product already added in size ${size}!`, 'warning');
    return;
  }

  const newItem = { title, price, imgSrc, remove_shoe, size, qty: 1 };
  itemList.push(newItem);

  const cartBasket = document.querySelector('.cart-content');
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = createCartProduct(title, price, imgSrc, remove_shoe, size);
  cartBasket.append(tempDiv.firstElementChild);

  // Cart Badge Pulse
  const cartIconContainer = document.querySelector('.box');
  cartIconContainer.classList.add('cart-pulse');
  setTimeout(() => cartIconContainer.classList.remove('cart-pulse'), 400);

  showToast(`Added ${title} (Size: ${size}) to cart`, 'success');
  loadContentEvents();
}

function createCartProduct(title, price, imgSrc, remove_shoe, size) {
  return `
  <div class="cart-box">
    <img src="${imgSrc}" class="cart-img" alt="Shoe">
    <div class="detail-box">
      <div class="cart-shoe-title">${title}</div>
      <div class="cart-shoe-size" style="font-size: 0.8rem; color: #777; margin-top: 2px;">Size: ${size}</div>
      <div class="price-box">
        <div class="cart-price">${price}</div>
        <div class="cart-amt">${price}</div>
      </div>
      <div class="cart-qty-container">
        <button class="qty-btn qty-minus">-</button>
        <input type="text" value="1" class="cart-qty-input" readonly>
        <button class="qty-btn qty-plus">+</button>
      </div>
    </div>
    <ion-icon name="trash" class="cart-remove"><img src="${remove_shoe}" style="width:10px" alt="Remove"></ion-icon>
  </div>
  `;
}

function updateTotal() {
  const cartItems = document.querySelectorAll('.cart-box');
  const totalValue = document.querySelector('.total-price');

  let total = 0;

  cartItems.forEach(product => {
    const priceElement = product.querySelector('.cart-price');
    const price = parseFloat(priceElement.innerHTML.replace("Rs.", ""));
    const qtyInput = product.querySelector('.cart-qty-input');
    const qty = parseInt(qtyInput.value) || 1;
    
    const lineTotal = price * qty;
    total += lineTotal;
    product.querySelector('.cart-amt').innerText = "Rs." + lineTotal;
  });

  totalValue.innerHTML = 'Rs.' + total;

  // Add Product Count in Cart Icon
  const cartCount = document.querySelector('.cart-count');
  // Sum of quantities
  let count = itemList.reduce((sum, item) => sum + item.qty, 0);
  cartCount.innerHTML = count;

  if (count === 0) {
    cartCount.style.display = 'none';
  } else {
    cartCount.style.display = 'block';
  }
}

// ----------------------------------------------------
// Product Quick-View Popup Features
// ----------------------------------------------------
let qvActiveProduct = {};

function setupQuickViewEvents() {
  // Attach quick-view to each card click
  document.querySelectorAll('.shoe-box').forEach(card => {
    // When clicking the card itself (image/details), show Quick View
    const trigger = card.querySelector('.quick-view-btn');
    const imgTrigger = card.querySelector('.shoe-img');

    const openQV = (e) => {
      e.stopPropagation();
      const title = card.querySelector('.shoe-title').innerHTML;
      const price = card.querySelector('.shoe-price').innerHTML;
      const imgSrc = card.querySelector('.shoe-img').src;
      const desc = card.dataset.desc || "A premium high-performance sneaker designed for sports, style, and complete daily durability.";
      const remove_shoe = card.querySelector('.remove_icon').src;
      
      // Get the currently selected size on card as default
      const currentSelectedSize = card.querySelector('.size-opt.active').dataset.size;

      qvActiveProduct = { title, price, imgSrc, remove_shoe, desc };
      
      // Load details into Modal
      qvImage.src = imgSrc;
      qvTitle.innerHTML = title;
      qvPrice.innerHTML = price;
      qvDesc.innerHTML = desc;

      // Reset modal sizes
      qvSizesContainer.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.size === currentSelectedSize) {
          btn.classList.add('active');
        }
      });

      quickViewModal.classList.add('active');
    };

    if (trigger) trigger.onclick = openQV;
    if (imgTrigger) imgTrigger.onclick = openQV;
  });

  // Close Quick View
  quickViewClose.addEventListener('click', () => {
    quickViewModal.classList.remove('active');
  });

  // Size selections inside Quick View
  qvSizesContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('size-btn')) {
      qvSizesContainer.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
      e.target.classList.add('active');
    }
  });

  // Add to cart inside Quick View
  qvAddCartBtn.addEventListener('click', () => {
    const sizeBtn = qvSizesContainer.querySelector('.size-btn.active');
    if (!sizeBtn) {
      showToast('Please select a size first', 'warning');
      return;
    }
    const size = sizeBtn.dataset.size;
    executeAddToCart(qvActiveProduct.title, qvActiveProduct.price, qvActiveProduct.imgSrc, qvActiveProduct.remove_shoe, size);
    quickViewModal.classList.remove('active');
  });
}

// ----------------------------------------------------
// Place Order / Checkout Features
// ----------------------------------------------------
function setupCheckoutEvents() {
  const btnBuy = document.querySelector('.btn-buy');

  // Trigger Checkout Modal
  btnBuy.addEventListener('click', () => {
    if (itemList.length === 0) {
      showToast('Your cart is empty! Add shoes before checking out.', 'warning');
      return;
    }

    // Build Receipt Listing
    receiptItemsContainer.innerHTML = '';
    let subtotal = 0;

    itemList.forEach(item => {
      const itemPrice = parseFloat(item.price.replace("Rs.", ""));
      const lineTotal = itemPrice * item.qty;
      subtotal += lineTotal;

      const row = document.createElement('div');
      row.className = 'receipt-item-row';
      row.innerHTML = `
        <span class="receipt-item-name">${item.title} (Size: ${item.size}) x${item.qty}</span>
        <span class="receipt-item-price">Rs.${lineTotal}</span>
      `;
      receiptItemsContainer.appendChild(row);
    });

    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + tax;

    receiptSubtotal.innerHTML = `Rs.${subtotal}`;
    receiptTax.innerHTML = `Rs.${tax}`;
    receiptTotal.innerHTML = `Rs.${total}`;

    // Close other drawers & show Modal
    cart.classList.remove('cart-active');
    checkoutModal.classList.add('active');
  });

  checkoutClose.addEventListener('click', () => {
    checkoutModal.classList.remove('active');
  });

  // Confirm Order Placing
  btnConfirmOrder.addEventListener('click', () => {
    const addressInput = document.querySelector('#checkout-address');
    const address = addressInput.value.trim();
    if (address === '') {
      showToast('Please provide a valid delivery address', 'warning');
      return;
    }

    // Save order in history
    const orderId = 'AS-' + Math.floor(100000 + Math.random() * 900000);
    const orderDate = new Date().toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const itemsSummary = itemList.map(item => `${item.title} (Sz: ${item.size}) x${item.qty}`).join(', ');
    const totalVal = receiptTotal.textContent;

    const newOrder = { orderId, date: orderDate, items: itemsSummary, total: totalVal, address };
    orderHistory.unshift(newOrder);

    // Refresh profile order history UI
    renderOrderHistory();

    // Success Toast & Cleanup
    showToast(`Order ${orderId} placed successfully!`, 'success');
    
    // Clear Cart
    itemList = [];
    document.querySelector('.cart-content').innerHTML = '';
    updateTotal();

    // Close Modals
    checkoutModal.classList.remove('active');
  });
}

// ----------------------------------------------------
// Settle User Order History
// ----------------------------------------------------
function renderOrderHistory() {
  if (orderHistory.length === 0) {
    orderHistoryList.innerHTML = `<p class="no-orders">No orders placed yet.</p>`;
    return;
  }

  orderHistoryList.innerHTML = '';
  orderHistory.forEach(order => {
    const card = document.createElement('div');
    card.className = 'order-history-card';
    card.innerHTML = `
      <div class="order-history-header">
        <span>Order: ${order.orderId}</span>
        <span>${order.date}</span>
      </div>
      <div class="order-history-details">
        <p style="margin: 2px 0;"><strong>Items:</strong> ${order.items}</p>
        <p style="margin: 2px 0; font-size:0.8rem; color:#666;"><strong>To:</strong> ${order.address}</p>
      </div>
      <div class="order-history-total">Paid: ${order.total}</div>
    `;
    orderHistoryList.appendChild(card);
  });
}
