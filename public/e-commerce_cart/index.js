<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", () => {
  // Elements
  const cartPanel = document.getElementById("cart-panel");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartBody = document.getElementById("cart-body");
  const cartEmpty = document.getElementById("cart-empty");
  const cartBadge = document.getElementById("cart-badge");
  const cartPillCount = document.querySelector(".cart-pill-count");
  const wishlistCountEl = document.getElementById("wishlist-count");
  const openCartBtn = document.getElementById("open-cart");
  const cartCloseBtn = document.getElementById("cart-close");
  const noProductsMessage = document.getElementById("no-products-message");
=======
/* ===========================
   AEROSTRIDE — index.js
   Full E-Commerce Functionality
   =========================== */
>>>>>>> 36ee3a455b60a328b5c69b168da900508aced8eb

// ===== STATE =====
let cartItems = []; // [{ id, title, price, imgSrc, qty }]

<<<<<<< HEAD
  function showToast(msg) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    Object.assign(t.style, {
      position: "fixed",
      right: "20px",
      bottom: "20px",
      background: "#222",
      color: "#fff",
      padding: "10px 14px",
      borderRadius: "8px",
      zIndex: 99999,
      opacity: 0,
      transition: "opacity .18s",
    });
    document.body.appendChild(t);
    requestAnimationFrame(() => (t.style.opacity = "1"));
    setTimeout(() => {
      t.style.opacity = "0";
      setTimeout(() => t.remove(), 200);
    }, 2500);
  }

  function openCart() {
    cartPanel && cartPanel.classList.add("active");
    cartOverlay && cartOverlay.classList.add("active");
  }

  function closeCart() {
    cartPanel && cartPanel.classList.remove("active");
    cartOverlay && cartOverlay.classList.remove("active");
  }

  if (openCartBtn) openCartBtn.addEventListener("click", openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

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
    const qtyInput = row.querySelector(".cart-quantity");
    const down = row.querySelector(".qty-down");
    const up = row.querySelector(".qty-up");
    const remove = row.querySelector(".cart-remove");

    if (down)
      down.addEventListener("click", () => {
        let v = parseInt(qtyInput.value) || 1;
        if (v > 1) {
          qtyInput.value = v - 1;
          updateUI();
        }
      });
    if (up)
      up.addEventListener("click", () => {
        qtyInput.value = (parseInt(qtyInput.value) || 1) + 1;
        updateUI();
      });
    if (qtyInput)
      qtyInput.addEventListener("change", () => {
        if (!qtyInput.value || qtyInput.value < 1) qtyInput.value = 1;
        updateUI();
      });
    if (remove)
      remove.addEventListener("click", () => {
        const title = row.dataset.title;
        itemList = itemList.filter((i) => i.title !== title);
        row.remove();
        updateUI();
        showToast("Removed from cart");
      });
  }

  function updateUI() {
    let total = 0;
    document.querySelectorAll(".cart-box").forEach((row) => {
      const priceStr =
        (row.querySelector(".cart-price") &&
          row.querySelector(".cart-price").textContent) ||
        "0";
      const price =
        parseFloat(priceStr.toString().replace(/Rs\.?\s*/i, "")) || 0;
      const qty = parseInt(row.querySelector(".cart-quantity").value) || 1;
      const sub = price * qty;
      const amt = row.querySelector(".cart-amt");
      if (amt) amt.textContent = "Rs." + sub;
      total += sub;
    });

    const totalPriceEl = document.getElementById("total-price");
    if (totalPriceEl) totalPriceEl.textContent = "Rs." + total;

    const count = itemList.length;
    document.querySelectorAll(".cart-count").forEach((el) => {
      el.textContent = count;
      el.style.display = count ? "block" : "none";
    });
    if (cartPillCount) {
      cartPillCount.textContent = count;
      cartPillCount.style.display = count ? "inline-flex" : "none";
    }
    if (cartBadge) {
      cartBadge.textContent = count;
      cartBadge.style.display = count ? "inline-block" : "none";
    }
    if (cartEmpty) cartEmpty.style.display = count ? "none" : "flex";
  }

  function addItemToCart(title, price, img) {
    if (itemList.find((i) => i.title === title)) {
      showToast("Already in cart!");
      return;
    }

    itemList.push({ title, price, img });
    localStorage.setItem("cartItems", JSON.stringify(itemList));

    const row = document.createElement("div");
    row.className = "cart-box";
    row.dataset.title = title;
    row.innerHTML = cartRowHTML(title, price, img);

    cartBody.appendChild(row);
    bindRow(row);
    updateUI();
    openCart();
    showToast("Added to cart");
  }

  function addToCartHandler(e) {
    const btn = e.currentTarget;
    const box = btn.closest(".shoe-box");
    if (!box) return;
    const title = box.querySelector(".shoe-title")?.textContent || "Product";
    const price = box.querySelector(".shoe-price")?.textContent || "0";
    const img = box.querySelector(".shoe-img")?.src || "";
    addItemToCart(title, price, img);
  }

  function updateWishlistCount() {
    if (!wishlistCountEl) return;
    wishlistCountEl.textContent = wishlist.length;
    wishlistCountEl.style.display = wishlist.length ? "block" : "none";
  }

  function toggleWishlist(e) {
    const btn = e.currentTarget;
    const card = btn.closest(".shoe-box");
    if (!card) return;
    const title =
      (card.querySelector(".shoe-title") &&
        card.querySelector(".shoe-title").textContent) ||
      "Product";
    if (wishlist.includes(title)) {
      wishlist = wishlist.filter((i) => i !== title);
      btn.classList.remove("active");
      showToast("Removed from wishlist");
    } else {
      wishlist.push(title);
      btn.classList.add("active");
      showToast("Added to wishlist");
    }
    updateWishlistCount();
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
    }).join("");

    return `
      <div class="product-rating" aria-label="${rating} out of 5 stars">
        <span class="rating-stars">${stars}</span>
        <span class="rating-value">${rating.toFixed(1)}</span>
      </div>
    `;
  }

  function injectProductRatings() {
    const ratings = [4.9, 4.7, 4.6, 4.5, 4.8, 4.4, 4.9, 4.5];
    document.querySelectorAll(".shoe-box").forEach((box, index) => {
      const shoeInfo = box.querySelector(".shoe-info");
      if (!shoeInfo || shoeInfo.querySelector(".product-rating")) return;
      const rating = ratings[index % ratings.length];
      shoeInfo.insertAdjacentHTML("afterbegin", getRatingMarkup(rating));
    });
  }

  // Attach product handlers
  document
    .querySelectorAll(".add-cart")
    .forEach((b) => b.addEventListener("click", addToCartHandler));
  document
    .querySelectorAll(".wishlist-btn")
    .forEach((b) => b.addEventListener("click", toggleWishlist));

  injectProductRatings();

  // SEARCH (filter visible products)
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.trim().toLowerCase();
      const products = document.querySelectorAll(".shoe-box");
      let found = false;
      products.forEach((p) => {
        const title = (
          (p.querySelector(".shoe-title") &&
            p.querySelector(".shoe-title").textContent) ||
          ""
        ).toLowerCase();
        if (!q || title.includes(q)) {
          p.style.display = "";
          found = true;
        } else {
          p.style.display = "none";
        }
      });
      if (noProductsMessage)
        noProductsMessage.style.display = found ? "none" : "block";
    });
  }

  // QUICK VIEW
  const quickViewModal = document.querySelector(".quick-view-modal");
  const quickViewImg = document.getElementById("quick-view-img");
  const quickViewTitle = document.getElementById("quick-view-title");
  const quickViewPrice = document.getElementById("quick-view-price");
  const quickViewCartBtn = document.getElementById("quick-view-cart-btn");
  const closeQuickView = document.querySelector(".close-quick-view");

  document.querySelectorAll(".shoe-img").forEach((img) =>
    img.addEventListener("click", () => {
      const box = img.closest(".shoe-box");
      if (!box) return;

      const title = box.querySelector(".shoe-title")?.textContent || "";
      const price = box.querySelector(".shoe-price")?.textContent || "";

      quickViewImg.src = img.src;
      quickViewTitle.textContent = title;
      quickViewPrice.textContent = price;

      if (quickViewCartBtn) {
        quickViewCartBtn.onclick = () => addItemToCart(title, price, img.src);
      }

      if (quickViewModal) quickViewModal.style.display = "flex";
    }),
  );
  if (closeQuickView)
    closeQuickView.addEventListener(
      "click",
      () => (quickViewModal.style.display = "none"),
    );
  window.addEventListener("click", (e) => {
    if (e.target === quickViewModal) quickViewModal.style.display = "none";
  });

  // CHECKOUT modal
  const buyBtns = document.querySelectorAll(".btn-buy");
  const checkoutModal = document.querySelector(".checkout-modal");
  const closeCheckout = document.querySelector(".close-checkout");
  const submitOrder = document.getElementById("submit-order");

  buyBtns.forEach((b) =>
    b.addEventListener("click", () => {
      if (checkoutModal) checkoutModal.style.display = "flex";
    }),
  );
  if (closeCheckout)
    closeCheckout.addEventListener(
      "click",
      () => checkoutModal && (checkoutModal.style.display = "none"),
    );
  if (submitOrder)
    submitOrder.addEventListener("click", () => {
      const fullName =
        document.getElementById("full-name") &&
        document.getElementById("full-name").value.trim();
      const address =
        document.getElementById("address") &&
        document.getElementById("address").value.trim();
      const phone =
        document.getElementById("phone") &&
        document.getElementById("phone").value.trim();
      const payment =
        document.getElementById("payment-method") &&
        document.getElementById("payment-method").value;
      if (!fullName || !address || !phone || !payment) {
        showToast("Please fill all fields");
        return;
      }
      showToast("Order placed successfully!");
      if (checkoutModal) checkoutModal.style.display = "none";
    });

  // CLEAR CART
  const clearCartBtn = document.querySelector(".clear-cart-btn");
  if (clearCartBtn)
    clearCartBtn.addEventListener("click", () => {
      if (cartBody) cartBody.innerHTML = "";
      itemList = [];
      localStorage.removeItem("cartItems");
      updateUI();
      showToast("Cart cleared");
    });

  // DARK MODE
  const darkModeBtn = document.querySelector("#dark-mode-btn");
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    if (darkModeBtn) darkModeBtn.innerText = "☀";
  }
  if (darkModeBtn)
    darkModeBtn.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        darkModeBtn.innerText = "☀";
      } else {
        localStorage.setItem("theme", "light");
        darkModeBtn.innerText = "🌙";
=======
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
      window.scrollY > 20 ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)";
  },
  { passive: true },
);

// ===== THEME =====
const themeBtn = document.getElementById("theme-toggle");
const sunIcon = document.getElementById("sun-icon");
const moonIcon = document.getElementById("moon-icon");

function applyTheme(light) {
  document.body.classList.toggle("light", light);
  sunIcon.style.display = light ? "none" : "none";
  moonIcon.style.display = light ? "none" : "block";
  sunIcon.style.display = light ? "block" : "none";
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
  // Clear existing items (except the empty state)
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

  div
    .querySelector(".item-minus")
    .addEventListener("click", () => changeQty(item.id, -1));
  div
    .querySelector(".item-plus")
    .addEventListener("click", () => changeQty(item.id, +1));
  div
    .querySelector(".cart-item-remove")
    .addEventListener("click", () => removeCartItem(item.id));

  return div;
}

function updateCartTotals() {
  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cartItems.reduce((s, i) => s + i.qty, 0);

  cartSubtotal.textContent = fmt(total);
  cartTotalPrice.textContent = fmt(total);
  cartCountEl.textContent = count;
  cartItemLabel.textContent = `${cartItems.length} item${cartItems.length !== 1 ? "s" : ""}`;

  // Badge animation
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

    // Visual feedback
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
  closeModal(checkoutOverlay, checkoutModal),
);
checkoutOverlay.addEventListener("click", () =>
  closeModal(checkoutOverlay, checkoutModal),
);

function openCheckoutModal() {
  // Populate order summary
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

  // Simulate order
  submitOrderBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Order Placed!</span>`;
  submitOrderBtn.style.background = "var(--green)";

  setTimeout(() => {
    closeModal(checkoutOverlay, checkoutModal);
    cartItems = [];
    renderCart();
    closeCart();

    // Reset form
    ["co-name", "co-email", "co-phone", "co-address", "co-payment"].forEach(
      (id) => {
        const el = document.getElementById(id);
        if (el) el.value = "";
      },
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

// Security: escape HTML to prevent XSS
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
    <div class="search-result-item" data-name="${escapeHTML(r.name)}" data-price="${r.price}" data-img="${r.imgSrc}">
      <img src="${escapeHTML(r.imgSrc)}" alt="${escapeHTML(r.name)}" />
      <div class="search-result-info">
        <div class="search-result-name">${escapeHTML(r.name)}</div>
        <div class="search-result-price">${fmt(r.price)}</div>
      </div>
    </div>
  `,
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
  openModal(profileOverlay, profileModal),
);
profileClose.addEventListener("click", () =>
  closeModal(profileOverlay, profileModal),
);
profileOverlay.addEventListener("click", () =>
  closeModal(profileOverlay, profileModal),
);

document.querySelectorAll(".ptab").forEach((tab) => {
  tab.addEventListener("click", function () {
    document
      .querySelectorAll(".ptab")
      .forEach((t) => t.classList.remove("active"));
    this.classList.add("active");
    const target = this.dataset.tab;
    document
      .getElementById("login-tab")
      .classList.toggle("hidden", target !== "login");
    document
      .getElementById("signup-tab")
      .classList.toggle("hidden", target !== "signup");
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
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    this.classList.add("active");
    activeFilter = this.dataset.filter;
    applyFilterSort();
  });
});

document
  .getElementById("sort-select")
  .addEventListener("change", applyFilterSort);

function applyFilterSort() {
  const sortVal = document.getElementById("sort-select").value;
  const cards = Array.from(document.querySelectorAll(".card"));
  const grid = document.getElementById("grid");

  let visible = cards.filter((card) => {
    if (activeFilter === "all") return true;
    return card.dataset.category === activeFilter;
  });

  // Sort
  if (sortVal === "price-asc") {
    visible.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
  } else if (sortVal === "price-desc") {
    visible.sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price));
  } else if (sortVal === "name-asc") {
    visible.sort((a, b) =>
      (a.dataset.name || "").localeCompare(b.dataset.name || ""),
    );
  }

  const noResults = document.getElementById("no-results");

  // Show/hide and reorder
  cards.forEach((c) => {
    c.style.display = "none";
    c.classList.remove("visible");
  });

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

  // Touch support
  let touchStartX = 0;
  sliderEl.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
    },
    { passive: true },
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
    { threshold: 0.05 },
  );

  const grid = document.getElementById("grid");
  if (grid) observer.observe(grid);
}

// ===== KEYBOARD ACCESSIBILITY =====
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    // Close any open modal
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
>>>>>>> 36ee3a455b60a328b5c69b168da900508aced8eb
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

  // Smooth scroll for nav anchor links
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
