(() => {
  if (!window.medAuth) {
    return;
  }

  const formatRole = (role) => {
    if (!role) return "";
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const formatName = (user) => {
    if (!user) return "Guest";
    if (user.role === "doctor") {
      return user.name.startsWith("Dr.") ? user.name : `Dr. ${user.name}`;
    }
    return user.name;
  };

  const applyRoleVisibility = (user) => {
    const role = user ? user.role : null;

    document.querySelectorAll("[data-role]").forEach((element) => {
      const roles = element
        .getAttribute("data-role")
        .split(",")
        .map((value) => value.trim());

      const canView = role && roles.includes(role);
      element.classList.toggle("is-role-hidden", !canView);
    });

    document.querySelectorAll("[data-role-fallback]").forEach((element) => {
      const roles = element
        .getAttribute("data-role-fallback")
        .split(",")
        .map((value) => value.trim());

      const showFallback = role && !roles.includes(role);
      element.classList.toggle("is-role-hidden", !showFallback);
    });
  };

  const updateBadges = (user) => {
    const badge = document.getElementById("userBadge");
    const nameEl = document.getElementById("userBadgeName");
    const roleEl = document.getElementById("userBadgeRole");
    const avatarEl = document.getElementById("userAvatar");

    if (badge && user) {
      badge.classList.remove("hidden");
    }

    if (badge && !user) {
      badge.classList.add("hidden");
    }

    if (nameEl) {
      nameEl.textContent = user ? formatName(user) : "Guest";
    }

    if (roleEl) {
      roleEl.textContent = user ? `Role: ${formatRole(user.role)}` : "Role: --";
    }

    if (avatarEl) {
      avatarEl.textContent =
        user && user.role === "doctor" ? "\uD83E\uDE7A" : "\uD83D\uDC64";
    }
  };

  const updateWelcome = (user) => {
    const welcomeEl = document.getElementById("welcomeMessage");
    if (!welcomeEl) return;

    if (user) {
      welcomeEl.textContent = `Welcome Back, ${formatName(user)}`;
    } else {
      welcomeEl.textContent = "Welcome to MedConsult";
    }
  };

  const updateActions = (user) => {
    const loginTrigger = document.getElementById("loginTrigger");
    const logoutBtn = document.getElementById("logoutBtn");

    if (loginTrigger) {
      loginTrigger.classList.toggle("is-role-hidden", !!user);
    }

    if (logoutBtn) {
      logoutBtn.classList.toggle("is-role-hidden", !user);
    }
  };

  const initDoctorControls = () => {
    const toggle = document.getElementById("availabilityToggle");
    const status = document.getElementById("availabilityStatus");

    if (!toggle || !status) return;

    let available = false;

    toggle.addEventListener("click", () => {
      available = !available;
      status.textContent = available
        ? "Currently: Available"
        : "Currently: Offline";
      toggle.textContent = available ? "Set Offline" : "Set Available";
    });
  };

  const updateUI = () => {
    const user = window.medAuth.getCurrentUser();
    applyRoleVisibility(user);
    updateBadges(user);
    updateWelcome(user);
    updateActions(user);
  };

  document.addEventListener("DOMContentLoaded", () => {
    updateUI();
    initDoctorControls();
  });

  document.addEventListener("auth:changed", () => {
    updateUI();
  });
})();
