document.addEventListener('DOMContentLoaded', () => {
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const sidebarOverlay = document.getElementById('sidebarOverlay');

  if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-expanded');
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', () => {
      document.body.classList.remove('sidebar-expanded');
    });
  }
});
