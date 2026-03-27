const displaySeat = document.getElementById("displaySeat");
const confirmBtn = document.getElementById("confirmBtn");
const labSelect = document.getElementById("lab-select");
const seatSelect = document.getElementById("seat-select");
const timeSelect = document.getElementById("time-select");
const seatGrid = document.getElementById("seatGrid");

let selectedSeat = null;

function showMessage(message, type = 'danger') {
    const messageBox = document.getElementById('reservationMessage');
    if (!messageBox) return;

    messageBox.className = `alert alert-${type} mb-3`;
    messageBox.textContent = message;
    messageBox.classList.remove('d-none');
}

function hideMessage() {
    const messageBox = document.getElementById('reservationMessage');
    if (!messageBox) return;

    messageBox.textContent = '';
    messageBox.className = 'alert d-none mb-3';
}

function updateConfirmButton() {
    const hasRoom = labSelect.value !== '';
    const hasSeat = seatSelect.value !== '';
    const hasTime = timeSelect.value !== '';

    confirmBtn.disabled = !(hasRoom && hasSeat && hasTime);
}

function renderSeatGrid(roomData) {
    seatGrid.innerHTML = '';

    if (!roomData || !roomData.seatNumbers) return;

    roomData.seatNumbers.forEach(seat => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'lab-seat';
        button.textContent = seat.number;
        button.dataset.seat = seat.number;

        button.addEventListener('click', () => {
            document.querySelectorAll('.lab-seat').forEach(btn => {
                btn.classList.remove('is-selected');
            });

            button.classList.add('is-selected');
            selectedSeat = seat.number;
            seatSelect.value = seat.number;

            if (displaySeat) {
                displaySeat.textContent = seat.number;
            }

            populateTimeOptions(roomData, seat.number);
            updateConfirmButton();
            hideMessage();
        });

        seatGrid.appendChild(button);
    });
}

function populateSeatOptions(roomData) {
    let innerListSeat = '<option value="">--Select a Seat--</option>';

    if (!roomData || !roomData.seatNumbers) {
        seatSelect.innerHTML = innerListSeat;
        return;
    }

    roomData.seatNumbers.forEach(seat => {
        innerListSeat += `<option value="${seat.number}">${seat.number}</option>`;
    });

    seatSelect.innerHTML = innerListSeat;
}

function populateTimeOptions(roomData, selectedSeatNumber) {
    let innerListTime = '<option value="">--Select a Time--</option>';

    if (!roomData || !roomData.seatNumbers || !selectedSeatNumber) {
        timeSelect.innerHTML = innerListTime;
        return;
    }

    const seat = roomData.seatNumbers.find(seat => seat.number === selectedSeatNumber);

    if (seat && seat.slots) {
        seat.slots.forEach(slot => {
            innerListTime += `<option value="${slot.time}">${slot.time}</option>`;
        });
    }

    timeSelect.innerHTML = innerListTime;
}

labSelect.addEventListener('change', async (event) => {
    const selectedRoom = event.target.value;

    selectedSeat = null;
    if (displaySeat) {
        displaySeat.textContent = "—";
    }

    seatSelect.innerHTML = '<option value="">--Select a Seat--</option>';
    timeSelect.innerHTML = '<option value="">--Select a Time--</option>';
    seatGrid.innerHTML = '';
    confirmBtn.disabled = true;
    hideMessage();

    if (!selectedRoom) return;

    try {
        const response = await fetch(`/rooms/${selectedRoom}`);
        const roomData = await response.json();

        populateSeatOptions(roomData);
        renderSeatGrid(roomData);
    } catch (error) {
        console.log(error);
        showMessage('Failed to load room data.');
    }
});

seatSelect.addEventListener('change', async (event) => {
    const selectedRoom = labSelect.value;
    const selectedSeatNumber = event.target.value;

    if (displaySeat) {
        displaySeat.textContent = selectedSeatNumber || "—";
    }

    document.querySelectorAll('.lab-seat').forEach(btn => {
        btn.classList.toggle('is-selected', btn.dataset.seat === selectedSeatNumber);
    });

    selectedSeat = selectedSeatNumber || null;
    hideMessage();

    if (!selectedRoom) {
        updateConfirmButton();
        return;
    }

    try {
        const response = await fetch(`/rooms/${selectedRoom}`);
        const roomData = await response.json();
        populateTimeOptions(roomData, selectedSeatNumber);
        updateConfirmButton();
    } catch (error) {
        console.log(error);
        showMessage('Failed to load time slots.');
    }
});

timeSelect.addEventListener('change', () => {
    hideMessage();
    updateConfirmButton();
});

async function loadDashboardInformation() {
    try {
        const response = await fetch('/get-user');
        const userData = await response.json();

        if (userData.loggedIn) {
            document.getElementById("fullname").textContent = `${userData.lname}, ${userData.fname}`;
            document.getElementById("type").textContent = `${userData.status}`;
            document.getElementById("sidebar-fullname").textContent = `${userData.lname}, ${userData.fname}`;
            document.getElementById("sidebar-usertype").textContent = `${userData.status}`;

            loadRecommendedRoom();
        }
    } catch (error) {
        console.log("MongoDB Error:", error.message);
    }
}

window.onload = loadDashboardInformation;