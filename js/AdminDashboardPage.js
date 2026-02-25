/**
 * AdminDashboardSearch.js
 * -----------------------
 * This script implements a live search/filter feature for laboratory technicians
 * displayed on the Admin Dashboard.
 *
 * Behavior:
 * - When the admin types in the search input field, the list of lab tech cards
 *   is filtered in real time.
 * - Matching cards remain visible, while non-matching cards are hidden.
 *
 * Features:
 * - Case-insensitive search
 * - Instant feedback (no page reload)
 * - Works on all text inside the lab tech card (name, email, phone)
 */

/**
 * ELEMENT SELECTION
 * -----------------
 * Select the search input field and all lab tech cards on the page.
 */
const searchInput = document.getElementById("searchLabTech"); // Input field for searching lab techs
const labTechCards = document.querySelectorAll(".labtech-card"); // All displayed lab tech cards

/**
 * EVENT LISTENER: keyup
 * ---------------------
 * Listen for user input in the search field. Fires each time a key is released.
 */
searchInput.addEventListener("keyup", function () {
    const searchValue = searchInput.value.toLowerCase(); // Get the current search value and convert to lowercase for case-sensitive matching

    // Loop through all the lab tech cards
    labTechCards.forEach(card => {
        const text = card.innerText.toLowerCase(); //  Get all visible text inside the card and convert to lowercase

        // Checks if card contains search string
        if (text.includes(searchValue)) {
            card.style.display = ""; // Display card if it matches
        } else {
            card.style.display = "none"; // Hide card 
        }
    });
});
