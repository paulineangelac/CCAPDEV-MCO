const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");
const seatGrid = document.getElementById('seatGrid');

let selectedSeat = null;
let allBookings = [];
let currentBookingId = null;

async function loadUsernames() {
    try {
        const response = await fetch('/get-all-users');
        const users = await response.json();
        const select = document.getElementById('username-select');
        users.forEach(user => {
            select.innerHTML += `<option value="${user.username}">${user.fname} ${user.lname}</option>`;
        });
    } catch (error) {
        console.log("Error loading users:", error.message);
    }
}

document.getElementById('username-select').addEventListener('change', async function () {
    const username = this.value;
    if (!username) return;

    const res = await fetch(`/get-student-bookings?username=${username}`);
    allBookings = await res.json();

    const labSelect = document.getElementById('lab-select');
    labSelect.innerHTML = '<option value="">Select Laboratory</option>';
    allBookings.forEach(b => {
        labSelect.innerHTML += `<option value="${b.roomNumber}">${b.roomNumber}</option>`;
    });

    document.getElementById('date-select').innerHTML = '<option value="">Select Date</option>';
    document.getElementById('time-select').innerHTML = '<option value="">Select Time</option>';
    seatGrid.innerHTML = '';
    confirmBtn.disabled = true;
});

document.getElementById('lab-select').addEventListener('change', function () {
    const selectedLab = this.value;
    if (!selectedLab) return;

    const filtered = allBookings.filter(b => b.roomNumber === selectedLab);
    const dateSelect = document.getElementById('date-select');
    dateSelect.innerHTML = '<option value="">Select Date</option>';
    filtered.forEach(b => {
        dateSelect.innerHTML += `<option value="${b.date}">${b.date}</option>`;
    });

    document.getElementById('time-select').innerHTML = '<option value="">Select Time</option>';
    seatGrid.innerHTML = '';
    confirmBtn.disabled = true;
});

document.getElementById('date-select').addEventListener('change', function () {
    const selectedLab = document.getElementById('lab-select').value;
    const selectedDate = this.value;
    if (!selectedDate) return;

    const filtered = allBookings.filter(b => b.roomNumber === selectedLab && b.date === selectedDate);
    const timeSelect = document.getElementById('time-select');
    timeSelect.innerHTML = '<option value="">Select Time</option>';
    filtered.forEach(b => {
        timeSelect.innerHTML += `<option value="${b.time}" data-id="${b._id}">${b.time}</option>`;
    });

    seatGrid.innerHTML = '';
    confirmBtn.disabled = true;
});

document.getElementById('findSeatsBtn').addEventListener('click', async () => {
    const selectedRoom = document.getElementById('lab-select').value;
    const selectedDate = document.getElementById('date-select').value;
    const selectedTime = document.getElementById('time-select').value;
    if (!selectedRoom) { alert("Please select a laboratory."); return; }
    if (!selectedDate) { alert("Please select a date."); return; }
    if (!selectedTime) { alert("Please select a time."); return; }

    const timeOption = document.querySelector(`#time-select option[value="${selectedTime}"]`);
    currentBookingId = timeOption ? timeOption.dataset.id : null;

    try {
        const response = await fetch(`/rooms/${selectedRoom}`);
        const roomData = await response.json();

        const currentBooking = allBookings.find(b => b._id === currentBookingId);
        const previousSeat = currentBooking ? currentBooking.seat : null;

        const resResponse = await fetch(`/get-reserved-seats?roomNumber=${selectedRoom}&date=${selectedDate}&time=${selectedTime}`);
        const reservedSeats = await resResponse.json();

        let innerListGridSeat = '';
        roomData.seatNumbers.forEach(seat => {
            if (seat.number === previousSeat) {
                innerListGridSeat += `<button type="button" class="lab-seat is-previous" disabled>${seat.number}</button>`;
            } else if (reservedSeats.includes(seat.number)) {
                innerListGridSeat += `<button type="button" class="lab-seat is-reserved" disabled>${seat.number}</button>`;
            } else {
                innerListGridSeat += `<button type="button" class="lab-seat">${seat.number}</button>`;
            }
        });
        
        seatGrid.innerHTML = innerListGridSeat;

        document.querySelectorAll('.lab-seat').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.lab-seat').forEach(s => s.classList.remove('is-selected'));
                btn.classList.add('is-selected');
                selectedSeat = btn;
                confirmBtn.disabled = false;
            });
        });

        document.getElementById('displayLab').textContent = selectedRoom;
        document.getElementById('displayDate').textContent = selectedDate;
        document.getElementById('displayTime').textContent = selectedTime;

        let innerListSeat = '<option value="">--Select a Seat--</option>';
        roomData.seatNumbers.forEach(seat => {
            innerListSeat += `<option value="${seat.number}">${seat.number}</option>`;
        });
        document.getElementById('seat-select').innerHTML = innerListSeat;

        document.getElementById('seat-select').addEventListener('change', (event) => {
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
    if (!currentBookingId) { alert("Could not find the original booking."); return; }
    if (!selectedSeat) { alert("Please select a seat."); return; }

    const roomNumber = document.getElementById('lab-select').value;
    const date = document.getElementById('date-select').value;
    const time = document.getElementById('time-select').value;

    const formData = new URLSearchParams();
    formData.append('roomNumber', roomNumber);
    formData.append('seat', selectedSeat.textContent);
    formData.append('date', date);
    formData.append('time', time);

    const response = await fetch(`/edit/${currentBookingId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
    });

    if (response.ok || response.redirected) {
        alert('Reservation updated successfully!');
        window.location.href = '/labtechdashboard-page';
    } else {
        alert('Something went wrong.');
    }
});

cancelBtn.addEventListener("click", function () {
    window.location.href = "/labtechdashboard-page";
});

window.onload = function () {
    loadUsernames();
};