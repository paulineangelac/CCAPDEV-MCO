let currentBookingId = null;

// load students on page load
async function loadStudents() {
    const res = await fetch('/get-all-users');
    const users = await res.json();
    const select = document.getElementById('student-select');
    users.forEach(user => {
        select.innerHTML += `<option value="${user.username}">${user.fname} ${user.lname} (${user.username})</option>`;
    });
}

// when student is selected, load their dates
document.getElementById('student-select').addEventListener('change', async function () {
    const username = this.value;
    resetFrom('date');

    if (!username) return;

    const res = await fetch(`/get-student-bookings?username=${username}`);
    const bookings = await res.json();

    const dateSelect = document.getElementById('date-select');
    dateSelect.innerHTML = '<option value="">-- Select a Date --</option>';

    // get unique dates
    const dates = [...new Set(bookings.map(b => b.date))];
    dates.forEach(date => {
        dateSelect.innerHTML += `<option value="${date}">${date}</option>`;
    });
    dateSelect.disabled = false;

    // store bookings for later
    dateSelect.dataset.bookings = JSON.stringify(bookings);
});

// when date is selected, load times
document.getElementById('date-select').addEventListener('change', function () {
    const selectedDate = this.value;
    resetFrom('time');

    if (!selectedDate) return;

    const bookings = JSON.parse(this.dataset.bookings || '[]');
    const filtered = bookings.filter(b => b.date === selectedDate);

    const timeSelect = document.getElementById('time-select');
    timeSelect.innerHTML = '<option value="">-- Select a Time --</option>';
    filtered.forEach(b => {
        timeSelect.innerHTML += `<option value="${b._id}">${b.time}</option>`;
    });
    timeSelect.disabled = false;
});

// when time is selected, autofill lab and seat
document.getElementById('time-select').addEventListener('change', function () {
    const bookingId = this.value;
    resetFrom('details');

    if (!bookingId) return;

    const bookings = JSON.parse(document.getElementById('date-select').dataset.bookings || '[]');
    const booking = bookings.find(b => b._id === bookingId);

    if (booking) {
        document.getElementById('lab-display').value = booking.roomNumber;
        document.getElementById('seat-display').value = booking.seat;
        document.getElementById('deleteBtn').disabled = false;
        currentBookingId = bookingId;
    }
});

// delete button
document.getElementById('deleteBtn').addEventListener('click', async function () {
    if (!currentBookingId) return;
    if (!confirm('Are you sure you want to delete this reservation?')) return;

    const res = await fetch(`/cancel/${currentBookingId}`, { method: 'POST' });
    if (res.ok) {
        alert('Reservation deleted successfully.');
        window.location.reload();
    } else {
        alert('Something went wrong.');
    }
});

// reset helper
function resetFrom(level) {
    if (level === 'date') {
        const dateSelect = document.getElementById('date-select');
        dateSelect.innerHTML = '<option value="">-- Select a Date --</option>';
        dateSelect.disabled = true;
    }
    if (level === 'date' || level === 'time') {
        const timeSelect = document.getElementById('time-select');
        timeSelect.innerHTML = '<option value="">-- Select a Time --</option>';
        timeSelect.disabled = true;
    }
    if (level === 'date' || level === 'time' || level === 'details') {
        document.getElementById('lab-display').value = '';
        document.getElementById('seat-display').value = '';
        document.getElementById('deleteBtn').disabled = true;
        currentBookingId = null;
    }
}

document.getElementById('cancelBtn').addEventListener('click', function() {
    window.location.href = '/labtechdashboard-page';
});

window.addEventListener('load', loadStudents);