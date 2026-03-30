let currentBookingId = null;


function isWithin10Minutes(timeStr) {
    const now = new Date();
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const reservationMinutes = hours * 60 + minutes;
    const nowMinutes = now.getHours() * 60 + now.getMinutes();

    return nowMinutes >= reservationMinutes && nowMinutes <= reservationMinutes + 10;
}

// load students on page load
async function loadStudents() {
    const res = await fetch('/get-todays-bookings');
    const bookings = await res.json();

    const eligible = bookings.filter(b => isWithin10Minutes(b.time));

    const select = document.getElementById('student-select');
    select.innerHTML = '<option value="">-- Select a Student --</option>';
    eligible.forEach(b => {
        select.innerHTML += `<option value="${b._id}">${b.username} - ${b.roomNumber} - ${b.time}</option>`;
    });

    // store for later
    select.dataset.bookings = JSON.stringify(eligible);
}

// when student is selected, load their dates
document.getElementById('student-select').addEventListener('change', function () {
    const bookings = JSON.parse(this.dataset.bookings || '[]');
    const selected = bookings.find(b => b._id === this.value);

    if (selected) {
        document.getElementById('date-select').value = selected.date;
        document.getElementById('lab-display').value = selected.roomNumber;
        document.getElementById('seat-display').value = selected.seat;
        document.getElementById('deleteBtn').disabled = false;
        currentBookingId = selected._id;
    } else {
        document.getElementById('date-select').value = '';
        document.getElementById('lab-display').value = '';
        document.getElementById('seat-display').value = '';
        document.getElementById('deleteBtn').disabled = true;
        currentBookingId = null;
    }
});

// delete button
document.getElementById('deleteBtn').addEventListener('click', async function () {
    if (!currentBookingId) return;
    if (!confirm('Are you sure you want to delete this reservation?')) return;

    const res = await fetch(`/cancel/${currentBookingId}`, { method: 'POST' });
    if (res.ok) {
        alert('Reservation deleted successfully.');
        window.location.href = '/labtechdashboard-page';
    } else {
        alert('Something went wrong.');
    }
});

document.getElementById('cancelBtn').addEventListener('click', function() {
    window.location.href = '/labtechdashboard-page';
});

window.addEventListener('load', loadStudents);