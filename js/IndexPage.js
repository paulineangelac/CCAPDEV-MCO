// navbarScroll.js
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar-custom');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) { // adjust threshold if needed
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
});
