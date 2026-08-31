const menuToggle = document.querySelector('.menu-toggle');
const mobileDrawer = document.querySelector('.mobile-drawer');
const overlayMenu = document.querySelector('.overlay-menu');

function toggleMenu() {
  menuToggle.classList.toggle('active');
  mobileDrawer.classList.toggle('active');
  overlayMenu.classList.toggle('active');
  menuToggle.setAttribute('aria-expanded', menuToggle.classList.contains('active'));
}

menuToggle.addEventListener('click', toggleMenu);
overlayMenu.addEventListener('click', toggleMenu);
document.querySelectorAll('.mobile-drawer a').forEach(link => link.addEventListener('click', toggleMenu));
