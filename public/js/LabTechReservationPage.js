const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");
const labSelect = document.getElementById('lab-select');
const seatSelect = document.getElementById('seat-select');
const timeSelect = document.getElementById('time-select');
const seatGrid = document.getElementById('seatGrid');

let selectedSeat = null;

labSelect.addEventListener('change', async (event) => {
    const selectedRoom = event.target.value;
    if (!selectedRoom) return;
    try {
        const response = await fetch(`/rooms/${selectedRoom}`);
        const roomData = await response.json();

        let innerListTime = '<option value="">Select Time</option>';
        roomData.seatNumbers[0].slots.forEach(slot => {
            innerListTime += `<option value="${slot.time}">${slot.time}</option>`;
        });
        timeSelect.innerHTML = innerListTime;
    } catch (error) {
        console.log(error);
    }
});

document.getElementById('findSeatsBtn').addEventListener('click', async () => {
    const selectedRoom = document.getElementById('lab-select').value;
    if (!selectedRoom) { alert("Please select a laboratory."); return; }

    try {
        const response = await fetch(`/rooms/${selectedRoom}`);
        const roomData = await response.json();

        // update seat grid (display only)
        let innerListGridSeat = '';
        roomData.seatNumbers.forEach(seat => {
            innerListGridSeat += `<button type="button" class="lab-seat" disabled>${seat.number}</button>`;
        });
        seatGrid.innerHTML = innerListGridSeat;

        document.getElementById('displayLab').textContent = roomNumber;
        document.getElementById('displayDate').textContent = date;
        document.getElementById('displayTime').textContent = time;

        // update seat dropdown
        let innerListSeat = '<option value="">--Select a Seat--</option>';
        roomData.seatNumbers.forEach(seat => {
            innerListSeat += `<option value="${seat.number}">${seat.number}</option>`;
        });
        seatSelect.innerHTML = innerListSeat;

        // sync seat dropdown -> grid highlight
        seatSelect.addEventListener('change', (event) => {
            const val = event.target.value;
            document.querySelectorAll(".lab-seat").forEach(s => {
                s.classList.remove("is-selected");
                if (s.textContent === val) s.classList.add("is-selected");
            });
            selectedSeat = document.querySelector(".lab-seat.is-selected");
            confirmBtn.disabled = !selectedSeat;
        });

    } catch (error) {
        console.log(error);
    }
});


confirmBtn.addEventListener("click", async function () {
    const studentUsername = document.getElementById('username-select').value;
    const roomNumber = document.getElementById('lab-select').value;
    const date = document.getElementById('date-select').value;
    const time = document.getElementById('time-select').value;

    if (!studentUsername) { alert("Please select a student."); return; }
    if (!selectedSeat) { alert("Please select a seat."); return; }
    if (!date) { alert("Please select a date."); return; }
    if (!time) { alert("Please select a time."); return; }

    const formData = new URLSearchParams();
    formData.append('username', studentUsername);
    formData.append('roomNumber', roomNumber);
    formData.append('seat', selectedSeat.textContent);
    formData.append('date', date);
    formData.append('time', time);

    const response = await fetch('/labtech-reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
    });

    const html = await response.text();
    document.open();
    document.write(html);
    document.close();
});

cancelBtn.addEventListener("click", function(){
    window.location.href = "/LabTechDashboardPage";
});

async function loadUsernames() {
    try {
        const response = await fetch('/get-all-users');
        const users = await response.json();

        const select = document.getElementById('username-select');
        users.forEach(user => {
            select.innerHTML += `
                <option value="${user.username}">${user.fname} ${user.lname}</option>
            `;
        });
    } catch (error) {
        console.log("Error loading users:", error.message);
    }
}

window.onload = function() {
    loadUsernames();
}