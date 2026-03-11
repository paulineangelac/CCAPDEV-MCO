const seats = document.querySelectorAll(".lab-seat:not(.is-reserved)");
const displaySeat = document.getElementById("displaySeat");
const confirmBtn = document.getElementById("confirmBtn");
const usernameInput = document.getElementById("first-name");
const studentSelect = document.getElementById("choose-student");
const cancelBtn = document.getElementById("cancelBtn");

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

confirmBtn.addEventListener("click", function(){
    let studentName = "";
    let message = "";
    
    // Check which page we're on by checking which element exists
    if (usernameInput) {
        // Reservation page
        studentName = usernameInput.value.trim();
        if (!studentName) {
            alert("Please enter a username.");
            return;
        }
        message = `You have reserved seat ${selectedSeat.textContent} for user ${studentName}.`;
    } else if (studentSelect) {
        // Edit reservation page
        studentName = studentSelect.value;
        message = `Changed seat for ${studentName} to ${selectedSeat.textContent}.`;
    }
    
    alert(message);
    window.location.href = "LabTechDashboardPage.html";
});

cancelBtn.addEventListener("click", function(){
    window.location.href = "LabTechDashboardPage.html";
});