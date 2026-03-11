/**
 * navbarScroll.js
 * ----------------
 * This script changes the appearance of the navbar when the user scrolls down.
 * 
 * Behavior:
 * - When the page loads, it selects the navbar element with class `.navbar-custom`.
 * - While the user scrolls:
 *      - If the scroll position is greater than 50px, a CSS class `scrolled` is added.
 *      - If the scroll position is 50px or less, the class is removed.
 * 
 * Purpose:
 * - Allows background color change, shadow appearance, size adjustments.
 * - Improves UX by making the navbar more visible after scrolling.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Select the navbar element that will change style on scroll
  const navbar = document.querySelector('.navbar-custom');

  // Listen for scroll events
  window.addEventListener('scroll', () => {
    //Checks how far the page has scrolled
    if (window.scrollY > 50) { 
      navbar.classList.add('scrolled'); // Adds class that triggers scrolled styling in CSS
    } else {
      navbar.classList.remove('scrolled'); // Removes class when near the top of the page
    }
});
});
