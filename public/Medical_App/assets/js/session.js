(() => {
  const STORAGE_KEYS = {
    users: "users",
    currentUser: "currentUser",
    remember: "rememberSession",
    sessionActive: "sessionActive",
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const getUsers = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.users)) || [];
    } catch (error) {
      return [];
    }
  };

  const saveUsers = (users) => {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
  };

  const getCurrentUser = () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.currentUser));
    } catch (error) {
      return null;
    }
  };

  const setCurrentUser = (user, remember) => {
    localStorage.setItem(STORAGE_KEYS.currentUser, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.remember, remember ? "true" : "false");

    if (remember) {
      sessionStorage.removeItem(STORAGE_KEYS.sessionActive);
    } else {
      sessionStorage.setItem(STORAGE_KEYS.sessionActive, "true");
    }
  };

  const clearCurrentUser = () => {
    localStorage.removeItem(STORAGE_KEYS.currentUser);
    localStorage.removeItem(STORAGE_KEYS.remember);
    sessionStorage.removeItem(STORAGE_KEYS.sessionActive);
  };

  const encodePassword = (password) => {
    // Demo-only encoding. Real apps must hash passwords server-side (e.g., bcrypt).
    return btoa(password);
  };

  const notifyAuthChange = () => {
    document.dispatchEvent(
      new CustomEvent("auth:changed", {
        detail: { user: getCurrentUser() },
      }),
    );
  };

  const applyAuthGuard = () => {
    const overlay = document.getElementById("authOverlay");
    const appShell = document.getElementById("appShell");
    const currentUser = getCurrentUser();

    const remember = localStorage.getItem(STORAGE_KEYS.remember) === "true";
    const sessionActive =
      sessionStorage.getItem(STORAGE_KEYS.sessionActive) === "true";

    const allowSession = currentUser && (remember || sessionActive);

    if (!allowSession) {
      clearCurrentUser();
      document.body.classList.add("auth-locked");
      if (overlay) {
        overlay.classList.add("is-open");
        overlay.setAttribute("aria-hidden", "false");
      }
      if (appShell) {
        appShell.setAttribute("aria-hidden", "true");
      }
    } else {
      document.body.classList.remove("auth-locked");
      if (overlay) {
        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
      }
      if (appShell) {
        appShell.removeAttribute("aria-hidden");
      }
    }

    notifyAuthChange();
  };

  const logout = () => {
    clearCurrentUser();
    applyAuthGuard();
    if (typeof showToast === "function") {
      showToast("Logged out successfully", "success");
    }
  };

  window.medAuth = {
    getUsers,
    saveUsers,
    getCurrentUser,
    setCurrentUser,
    clearCurrentUser,
    encodePassword,
    applyAuthGuard,
    notifyAuthChange,
    emailPattern,
    logout,
  };

  document.addEventListener("DOMContentLoaded", () => {
    applyAuthGuard();

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", logout);
    }
  });
})();
