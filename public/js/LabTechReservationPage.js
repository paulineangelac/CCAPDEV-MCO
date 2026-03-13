const isEditPage = window.location.pathname === '/LabTechEditReservation';

const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");
const labSelect = document.getElementById('lab-select');
const timeSelect = document.getElementById('time-select');
const seatGrid = document.getElementById('seatGrid');

let selectedSeat = null;

// ─── RESERVATION PAGE ─────────────────────────────────────────────────────────
if (!isEditPage) {

    const seatSelect = document.getElementById('seat-select');

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
        const selectedRoom = labSelect.value;
        if (!selectedRoom) { alert("Please select a laboratory."); return; }

        try {
            const response = await fetch(`/rooms/${selectedRoom}`);
            const roomData = await response.json();

            let innerListGridSeat = '';
            roomData.seatNumbers.forEach(seat => {
                innerListGridSeat += `<button type="button" class="lab-seat" disabled>${seat.number}</button>`;
            });
            seatGrid.innerHTML = innerListGridSeat;

            let innerListSeat = '<option value="">--Select a Seat--</option>';
            roomData.seatNumbers.forEach(seat => {
                innerListSeat += `<option value="${seat.number}">${seat.number}</option>`;
            });
            seatSelect.innerHTML = innerListSeat;

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
        const roomNumber = labSelect.value;
        const date = document.getElementById('date-select').value;
        const time = timeSelect.value;

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

// ─── EDIT PAGE ────────────────────────────────────────────────────────────────
} else {

    const seatSelect = document.getElementById('seat-select');
    let currentBookingId = null;
    let studentBookings = [];

    document.getElementById('username-select').addEventListener('change', async () => {
        const username = document.getElementById('username-select').value;
        if (!username) { resetEditSelectors(); return; }

        try {
            const response = await fetch(`/get-student-bookings?username=${username}`);
            studentBookings = await response.json();

            if (studentBookings.length === 0) {
                alert("This student has no existing bookings.");
                resetEditSelectors();
                return;
            }

            const uniqueRooms = [...new Set(studentBookings.map(b => b.roomNumber))];
            let labHTML = '<option value="">Select Laboratory</option>';
            uniqueRooms.forEach(room => {
                labHTML += `<option value="${room}">${room}</option>`;
            });
            labSelect.innerHTML = labHTML;

            const params = new URLSearchParams(window.location.search);
            const preselectedRoom = params.get('roomNumber');
            if (preselectedRoom && uniqueRooms.includes(preselectedRoom)) {
                labSelect.value = preselectedRoom;
                labSelect.dispatchEvent(new Event('change'));
            }

            document.getElementById('date-select').value = '';
            timeSelect.innerHTML = '<option value="">Select Time</option>';
            seatGrid.innerHTML = '';

        } catch (error) {
            console.log(error);
        }
    });

    labSelect.addEventListener('change', () => {
        const roomNumber = labSelect.value;
        if (!roomNumber) return;

        const roomBookings = studentBookings.filter(b => b.roomNumber === roomNumber);
        const uniqueDates = [...new Set(roomBookings.map(b => b.date))];
        const dateSelect = document.getElementById('date-select');
        dateSelect.setAttribute('data-valid-dates', JSON.stringify(uniqueDates));

        dateSelect.value = '';
        timeSelect.innerHTML = '<option value="">Select Time</option>';
        seatGrid.innerHTML = '';
    });

    document.getElementById('date-select').addEventListener('change', () => {
        const roomNumber = labSelect.value;
        const dateSelect = document.getElementById('date-select');
        const date = dateSelect.value;
        if (!roomNumber || !date) return;

        const validDates = JSON.parse(dateSelect.getAttribute('data-valid-dates') || '[]');
        if (!validDates.includes(date)) {
            alert("This student has no booking on the selected date for this lab.");
            dateSelect.value = '';
            timeSelect.innerHTML = '<option value="">Select Time</option>';
            return;
        }

        const validBookings = studentBookings.filter(b => b.roomNumber === roomNumber && b.date === date);
        let timeHTML = '<option value="">Select Time</option>';
        validBookings.forEach(b => {
            timeHTML += `<option value="${b.time}">${b.time}</option>`;
        });
        timeSelect.innerHTML = timeHTML;
    });

    document.getElementById('findSeatsBtn').addEventListener('click', async () => {
        const username = document.getElementById('username-select').value;
        const roomNumber = labSelect.value;
        const date = document.getElementById('date-select').value;
        const time = timeSelect.value;

        if (!username) { alert("Please select a student."); return; }
        if (!roomNumber) { alert("Please select a laboratory."); return; }
        if (!date) { alert("Please select a date."); return; }
        if (!time) { alert("Please select a time."); return; }

        try {
            const allResponse = await fetch(`/rooms/${roomNumber}`);
            const roomData = await allResponse.json();

            const bookingResponse = await fetch(
                `/get-booking?username=${username}&roomNumber=${roomNumber}&date=${date}&time=${encodeURIComponent(time)}`
            );
            const booking = await bookingResponse.json();

            if (!booking) {
                alert("No existing booking found for this student at the selected room, date, and time.");
                return;
            }

            currentBookingId = booking._id;
            const studentCurrentSeat = booking.seat;

            const bookedResponse = await fetch(`/room-details/${roomNumber}`);
            const roomDetails = await bookedResponse.json();
            const slotData = roomDetails.slotDetails.find(s => s.time === time);
            const bookedSeats = slotData
                ? slotData.bookedSeats.filter(s => s !== studentCurrentSeat)
                : [];

            // build seat grid
            let gridHTML = '';
            let seatOptHTML = '<option value="">--Select a Seat--</option>';
            roomData.seatNumbers.forEach(seat => {
                if (seat.number === studentCurrentSeat) {
                    gridHTML += `<button type="button" class="lab-seat is-current">${seat.number}</button>`;
                } else if (bookedSeats.includes(seat.number)) {
                    gridHTML += `<button type="button" class="lab-seat is-reserved" disabled>${seat.number}</button>`;
                } else {
                    gridHTML += `<button type="button" class="lab-seat">${seat.number}</button>`;
                    seatOptHTML += `<option value="${seat.number}">${seat.number}</option>`;
                }
            });
            seatGrid.innerHTML = gridHTML;
            seatSelect.innerHTML = seatOptHTML;



            // sync seat dropdown -> grid
            seatSelect.addEventListener('change', (e) => {
                const val = e.target.value;
                seatGrid.querySelectorAll('.lab-seat').forEach(s => {
                    s.classList.remove('is-selected');
                    if (s.textContent === val) s.classList.add('is-selected');
                });
                selectedSeat = seatGrid.querySelector('.lab-seat.is-selected');
                confirmBtn.disabled = !selectedSeat;
            });

            // seat grid click -> sync dropdown
            seatGrid.querySelectorAll('.lab-seat:not(.is-reserved):not(.is-current)').forEach(btn => {
                btn.addEventListener('click', () => {
                    seatGrid.querySelectorAll('.lab-seat').forEach(s => s.classList.remove('is-selected'));
                    btn.classList.add('is-selected');
                    selectedSeat = btn;
                    seatSelect.value = btn.textContent;
                    confirmBtn.disabled = false;
                });
            });

        } catch (error) {
            console.log(error);
        }
    });

    confirmBtn.addEventListener("click", async () => {
        if (!selectedSeat) { alert("Please select a seat."); return; }
        if (!currentBookingId) { alert("No booking found to update."); return; }

        const formData = new URLSearchParams();
        formData.append('bookingId', currentBookingId);
        formData.append('seat', selectedSeat.textContent);

        const response = await fetch('/labtech-edit-reserve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        });

        const html = await response.text();
        document.open();
        document.write(html);
        document.close();
    });

    function resetEditSelectors() {
        studentBookings = [];
        labSelect.innerHTML = '<option value="">Select Laboratory</option>';
        document.getElementById('date-select').value = '';
        timeSelect.innerHTML = '<option value="">Select Time</option>';
        seatGrid.innerHTML = '';
        seatSelect.innerHTML = '<option value="">--Select a Seat--</option>';
        confirmBtn.disabled = true;
        selectedSeat = null;
        currentBookingId = null;
    }
}

// ─── SHARED ───────────────────────────────────────────────────────────────────
cancelBtn.addEventListener("click", function () {
    window.location.href = "/LabTechDashboardPage";
});

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

window.onload = async function () {
    await loadUsernames();
}
