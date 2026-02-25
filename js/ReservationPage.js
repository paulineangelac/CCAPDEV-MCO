
/* RESERVATIONPAGE.JS
   - Handles seat selection logic in the seat map
   - Updates "Selected Seat" display in the reservation sidebar
   - Enables/disables Confirm button
   - Redirects user after confirming reservation (Phase 1 placeholder)

   Phase 1:
   - Seat layout is hardcoded in HTML
   - Selection is handled purely on the frontend
   - No backend/database validation yet

*/

// Select all seats that are NOT reserved
// ".lab-seat:not(.is-reserved)" excludes disabled seats
const seats = document.querySelectorAll(".lab-seat:not(.is-reserved)");

// sidebar display elements
const displaySeat = document.getElementById("displaySeat");
const confirmBtn = document.getElementById("confirmBtn");

// Stores currently selected seat element
let selectedSeat = null;

seats.forEach(seat => {
    seat.addEventListener("click", function () {

        // if clicking the same seat deselect it
        if (selectedSeat === seat) {
            seat.classList.remove("is-selected");
            selectedSeat = null;
            displaySeat.textContent = "—";
            confirmBtn.disabled = true;
            return;
        }

        // remove selection from previous seat
        if (selectedSeat) {
            selectedSeat.classList.remove("is-selected");
        }

        // apply selection styling to clicked seat
        seat.classList.add("is-selected");
        selectedSeat = seat;

        // update sidebar display
        displaySeat.textContent = seat.textContent;

        // enable confirm button once a seat is selected
        confirmBtn.disabled = false;
    });
});

// Phase 1 placeholder to confirm reservation:
// - Shows alert confirmation
// - Redirects back to Student Dashboard
confirmBtn.addEventListener("click", function () {
    alert(`You have reserved seat ${selectedSeat.textContent}.`);
    window.location.href = "StudentDashboardPage.html";
});