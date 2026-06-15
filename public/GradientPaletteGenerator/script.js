/**
 * Gradient Palette Generator
 * A tool to create, preview, copy, and save CSS gradients.
 * Built with vanilla JavaScript — no frameworks.
 */

// ===== State =====
const state = {
  type: "linear",
  angle: 135,
  colors: ["#6366f1", "#ec4899"],
  maxColors: 5,
};

// ===== DOM References =====
const dom = {
  previewBox: document.getElementById("preview-box"),
  cssOutput: document.getElementById("css-output"),
  angleSlider: document.getElementById("angle-slider"),
  angleValue: document.getElementById("angle-value"),
  colorStops: document.getElementById("color-stops"),
  btnRandom: document.getElementById("btn-random"),
  btnCopy: document.getElementById("btn-copy"),
  btnSave: document.getElementById("btn-save"),
  btnAddColor: document.getElementById("btn-add-color"),
  btnClearAll: document.getElementById("btn-clear-all"),
  savedGrid: document.getElementById("saved-grid"),
  savedEmpty: document.getElementById("saved-empty"),
  controlAngle: document.getElementById("control-angle"),
  toast: document.getElementById("toast"),
  toastText: document.getElementById("toast-text"),
  toggleBtns: document.querySelectorAll(".toggle-btn"),
  colorPicker: null,
  copyClipboard: document.getElementById("copy-clipboard"),
};

const modal = {
  root: document.getElementById("confirm-modal"),
  title: document.getElementById("modal-title"),
  message: document.getElementById("modal-message"),
  cancel: document.getElementById("modal-cancel"),
  confirm: document.getElementById("modal-confirm"),
};

// ===== Utility Functions =====

/**
 * Generate a random hex color
 * @returns {string} Random hex color string
 */
const randomColor = () => {
  const hex = Math.floor(Math.random() * 16777215).toString(16);
  return `#${hex.padStart(6, "0")}`;
};

/**
 * Generate a random integer between min and max (inclusive)
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Build the CSS gradient string from current state
 * @returns {string} CSS gradient value
 */
const buildGradientCSS = () => {
  const colorList = state.colors.join(", ");

  switch (state.type) {
    case "linear":
      return `linear-gradient(${state.angle}deg, ${colorList})`;
    case "radial":
      return `radial-gradient(circle, ${colorList})`;
    case "conic":
      return `conic-gradient(from ${state.angle}deg, ${colorList})`;
    default:
      return `linear-gradient(${state.angle}deg, ${colorList})`;
  }
};

/**
 * Show a toast notification
 * @param {string} message
 */
const showToast = (message) => {
  try {
    dom.toastText.textContent = message;
    dom.toast.classList.add("toast--visible");

    setTimeout(() => {
      dom.toast.classList.remove("toast--visible");
    }, 2500);
  } catch (err) {
    console.error("Toast error:", err);
  }
};

// ===== Rendering Functions =====

/** Update the gradient preview and CSS output */
const updatePreview = () => {
  const gradient = buildGradientCSS();
  dom.previewBox.style.background = gradient;
  dom.cssOutput.textContent = `background: ${gradient};`;

  // Show/hide angle control based on type
  if (state.type === "radial") {
    dom.controlAngle.style.display = "none";
  } else {
    dom.controlAngle.style.display = "block";
    const label = state.type === "conic" ? "Start Angle" : "Angle";
    dom.controlAngle.querySelector(".control-label").innerHTML =
      `${label}: <span class="control-value" id="angle-value">${state.angle}°</span>`;
  }
};

/** Render color stop inputs dynamically */
const renderColorStops = () => {
  dom.colorStops.innerHTML = "";

  state.colors.forEach((color, index) => {
    const stop = document.createElement("div");
    stop.className = "color-stop";
    stop.dataset.index = index;

    const input = document.createElement("input");
    input.type = "color";
    input.className = "color-input";
    input.id = `color-${index + 1}`;
    input.value = color;
    input.setAttribute("aria-label", `Color ${index + 1}`);

    const hex = document.createElement("span");
    hex.className = "color-hex";
    hex.id = `hex-${index + 1}`;
    hex.textContent = color;

    stop.appendChild(input);
    stop.appendChild(hex);

    // Add remove button if more than 2 colors
    if (state.colors.length > 2) {
      const removeBtn = document.createElement("button");
      removeBtn.className = "color-stop__remove";
      removeBtn.type = "button";
      removeBtn.textContent = "✕";
      removeBtn.setAttribute("aria-label", `Remove color ${index + 1}`);
      removeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        removeColor(index);
      });
      stop.appendChild(removeBtn);
    }

    // Color change listener
    input.addEventListener("input", (e) => {
      state.colors[index] = e.target.value;
      hex.textContent = e.target.value;
      updatePreview();
    });

    dom.colorStops.appendChild(stop);
  });

  // Show/hide add button based on max colors
  dom.btnAddColor.style.display =
    state.colors.length >= state.maxColors ? "none" : "inline-flex";
};

// ===== Color Management =====

/** Add a new random color stop */
const addColor = () => {
  if (state.colors.length >= state.maxColors) {
    showToast(`Maximum ${state.maxColors} colors allowed`);
    return;
  }

  // open color picker
  dom.colorPicker.click();

  const handlePick = (e) => {
    const color = e.target.value;

    state.colors.push(color);
    renderColorStops();
    updatePreview();

    showToast("Color added! 🎨");

    dom.colorPicker.removeEventListener("input", handlePick);
  };

  dom.colorPicker.addEventListener("input", handlePick);
};

/**
 * Remove a color stop by index
 * @param {number} index
 */
const removeColor = (index) => {
  if (state.colors.length <= 2) {
    showToast("Minimum 2 colors required");
    return;
  }
  state.colors.splice(index, 1);
  renderColorStops();
  updatePreview();
};

// ===== Gradient Type Toggle =====

/** Set the active gradient type */
const setGradientType = (type) => {
  state.type = type;

  dom.toggleBtns.forEach((btn) => {
    const isActive = btn.dataset.type === type;
    btn.classList.toggle("toggle-btn--active", isActive);
    btn.setAttribute("aria-checked", isActive.toString());
  });

  updatePreview();
};

// ===== Randomize =====

/** Generate a completely random gradient */
const randomizeGradient = () => {
  const numColors = randomInt(2, 4);
  state.colors = Array.from({ length: numColors }, () => randomColor());
  state.angle = randomInt(0, 360);
  state.type = ["linear", "radial", "conic"][randomInt(0, 2)];

  // Update angle slider
  dom.angleSlider.value = state.angle;

  // Update type toggle
  setGradientType(state.type);

  renderColorStops();
  updatePreview();
  showToast("New gradient generated! 🎨");
};

// ===== Copy to Clipboard =====

/** Copy the current CSS gradient code to clipboard */
const copyCSS = async () => {
  const css = `background: ${buildGradientCSS()};`;

  try {
    await navigator.clipboard.writeText(css);
    showToast("CSS copied to clipboard! 📋");
  } catch (err) {
    // Fallback for older browsers
    try {
      const textarea = document.createElement("textarea");
      textarea.value = css;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      showToast("CSS copied to clipboard! 📋");
    } catch (fallbackErr) {
      showToast("Failed to copy. Please copy manually.");
      console.error("Copy failed:", fallbackErr);
    }
  }
};

//copy clipboard button listener
dom.copyClipboard.addEventListener("click", copyCSS);

// ===== LocalStorage: Save / Load / Delete =====

const STORAGE_KEY = "gradient-palette-saved";

/**
 * Load saved gradients from localStorage
 * @returns {Array} Array of saved gradient objects
 */
const loadSaved = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error("Error loading saved gradients:", err);
    return [];
  }
};

/**
 * Persist saved gradients to localStorage
 * @param {Array} gradients
 */
const persistSaved = (gradients) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gradients));
  } catch (err) {
    console.error("Error saving gradients:", err);
    showToast("Failed to save — storage may be full");
  }
};

/** Save the current gradient to favorites */
const saveGradient = () => {
  const saved = loadSaved();
  const css = buildGradientCSS();

  const alreadyExists = saved.some(
    (gradient) => gradient.css === css
  );

  if (alreadyExists) {
    showToast('This gradient is already saved');
    return;
  }

  const gradient = {
    id: Date.now(),
    type: state.type,
    angle: state.angle,
    colors: [...state.colors],
    css,
  };

  saved.unshift(gradient);

  if (saved.length > 20) {
    saved.pop();
  }

  persistSaved(saved);
  renderSavedGrid();
  showToast('Gradient saved! 💾');
};

/**
 * Delete a saved gradient by ID
 * @param {number} id
 */
const deleteSaved = (id) => {
  const saved = loadSaved().filter((g) => g.id !== id);
  showConfirmModal({
    title: "Clear this gradient?",
    message: `This will permanently delete this saved gradient.`,
    onConfirm: () => {
      persistSaved(saved);
      renderSavedGrid();
      showToast("Gradient deleted");
    },
  });
};

/** Clear all saved gradients */
const clearAllSaved = () => {
  const saved = loadSaved();

  if (saved.length === 0) {
    showToast("Nothing to clear");
    return;
  }

  showConfirmModal({
    title: "Clear all gradients?",
    message: `This will permanently delete ${saved.length} saved gradients.`,
    onConfirm: () => {
      persistSaved([]);
      renderSavedGrid();
      showToast("All gradients cleared");
    },
  });
};

/**
 * Apply a saved gradient to the editor
 * @param {object} gradient
 */
const applySaved = (gradient) => {
  state.type = gradient.type;
  state.angle = gradient.angle;
  state.colors = [...gradient.colors];

  dom.angleSlider.value = state.angle;
  setGradientType(state.type);
  renderColorStops();
  updatePreview();
  showToast("Gradient loaded! ✨");

  // Scroll to top
  window.scrollTo({ top: 0, behavior: "smooth" });
};

/** Render the saved gradients grid */
const renderSavedGrid = () => {
  const saved = loadSaved();

  if (saved.length === 0) {
    dom.savedGrid.innerHTML = "";
    dom.savedEmpty.style.display = "block";
    dom.savedGrid.appendChild(dom.savedEmpty);
    return;
  }

  dom.savedEmpty.style.display = "none";
  dom.savedGrid.innerHTML = "";

  saved.forEach((gradient) => {
    const item = document.createElement("div");
    item.className = "saved-item";
    item.style.background = gradient.css;
    item.setAttribute("aria-label", "Saved gradient");

    const overlay = document.createElement("div");
    overlay.className = "saved-item__overlay";

    const applyBtn = document.createElement("button");
    applyBtn.className = "saved-item__btn";
    applyBtn.type = "button";
    applyBtn.textContent = "✓";
    applyBtn.setAttribute("aria-label", "Apply gradient");
    applyBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      applySaved(gradient);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "saved-item__btn";
    deleteBtn.type = "button";
    deleteBtn.textContent = "✕";
    deleteBtn.setAttribute("aria-label", "Delete gradient");
    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteSaved(gradient.id);
    });

    overlay.appendChild(applyBtn);
    overlay.appendChild(deleteBtn);
    item.appendChild(overlay);
    dom.savedGrid.appendChild(item);
  });
};

const showConfirmModal = ({ title, message, onConfirm }) => {
  modal.title.textContent = title || "Confirm Action";
  modal.message.textContent = message || "";

  modal.root.classList.remove("hidden");

  const closeModal = () => {
    modal.root.classList.add("hidden");
    modal.confirm.removeEventListener("click", handleConfirm);
    modal.cancel.removeEventListener("click", closeModal);
    modal.overlay.removeEventListener("click", closeModal);
    document.removeEventListener("keydown", handleEsc);
  };

  const handleConfirm = () => {
    closeModal();
    onConfirm?.();
  };

  const handleEsc = (e) => {
    if (e.code === "Escape") closeModal();
  };

  // IMPORTANT: cache overlay once (add this in DOM refs)
  modal.overlay = modal.root.querySelector(".modal__overlay");

  modal.confirm.addEventListener("click", handleConfirm);
  modal.cancel.addEventListener("click", closeModal);
  modal.overlay.addEventListener("click", closeModal);
  document.addEventListener("keydown", handleEsc);
};

// ===== Event Listeners =====

/** Initialize all event listeners */
const initListeners = () => {
  // Angle slider
  dom.angleSlider.addEventListener("input", (e) => {
    state.angle = parseInt(e.target.value, 10);
    updatePreview();
  });

  // Type toggle buttons
  dom.toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      setGradientType(btn.dataset.type);
    });
  });

  // Action buttons
  dom.btnRandom.addEventListener("click", randomizeGradient);
  dom.btnCopy.addEventListener("click", copyCSS);
  dom.btnSave.addEventListener("click", saveGradient);
  dom.btnAddColor.addEventListener("click", addColor);
  dom.btnClearAll.addEventListener("click", clearAllSaved);
  dom.colorPicker = document.createElement("input");
  dom.colorPicker.type = "color";
  dom.colorPicker.style.display = "none";
  document.body.appendChild(dom.colorPicker);

  // Keyboard shortcut: Space for random
  document.addEventListener("keydown", (e) => {
    // Don't trigger shortcuts when typing in inputs
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    if (e.code === "Space") {
      e.preventDefault();
      randomizeGradient();
    } else if (e.code === "KeyC" && !e.ctrlKey && !e.metaKey) {
      copyCSS();
    } else if (e.code === "KeyS" && !e.ctrlKey && !e.metaKey) {
      saveGradient();
    }
  });
};

// ===== Initialize App =====

const init = () => {
  try {
    renderColorStops();
    updatePreview();
    renderSavedGrid();
    initListeners();
  } catch (err) {
    console.error("Initialization error:", err);
  }
};

// Start the app when DOM is ready
document.addEventListener("DOMContentLoaded", init);
