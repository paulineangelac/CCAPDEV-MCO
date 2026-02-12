const seats = document.querySelectorAll(".lab-seat:not(.is-reserved)");
const displaySeat = document.getElementById("displaySeat");
const confirmBtn = document.getElementById("confirmBtn");

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

        // select new seat
        seat.classList.add("is-selected");
        selectedSeat = seat;

        displaySeat.textContent = seat.textContent;
        confirmBtn.disabled = false;
    });
});