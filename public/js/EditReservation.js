document.addEventListener('DOMContentLoaded', () => {
    const data = window.editReservationData || {};
    const booking = data.booking || {};
    const rooms = data.rooms || [];

    const labSelect = document.getElementById('lab-select');
    const seatSelect = document.getElementById('seat-select');
    const timeSelect = document.getElementById('time-select');
    const seatGrid = document.getElementById('seatGrid');

    if (timeSelect && booking.time) {
        timeSelect.value = booking.time;
    }

    function getSelectedRoom() {
        const selectedRoomNumber = labSelect.value;
        return rooms.find(room => room.roomNumber === selectedRoomNumber);
    }

    function populateSeatSelect(room, selectedSeat = '') {
        seatSelect.innerHTML = '';

        if (!room || !room.seatNumbers || room.seatNumbers.length === 0) {
            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = '--Select a Seat--';
            seatSelect.appendChild(emptyOption);
            return;
        }

        room.seatNumbers.forEach(seat => {
            const option = document.createElement('option');
            option.value = seat.number;
            option.textContent = seat.number;

            if (seat.number === selectedSeat) {
                option.selected = true;
            }

            seatSelect.appendChild(option);
        });
    }

    function renderSeatGrid(room, selectedSeat = '', previousSeat = '') {
        seatGrid.innerHTML = '';

        if (!room || !room.seatNumbers) return;

        room.seatNumbers.forEach(seat => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'lab-seat';
            button.dataset.seat = seat.number;
            button.textContent = seat.number;

            if (seat.number === previousSeat) {
                button.classList.add('is-current');
            }

            if (seat.number === selectedSeat) {
                button.classList.add('is-selected');
            }

            button.addEventListener('click', () => {
                seatSelect.value = seat.number;
                renderSeatGrid(room, seat.number, previousSeat);
            });

            seatGrid.appendChild(button);
        });
    }

    function refreshUI(useBookingSeatAsPrevious = false) {
        const room = getSelectedRoom();
        const selectedSeat = seatSelect.value || booking.seat || '';
        const previousSeat = useBookingSeatAsPrevious ? booking.seat : '';

        populateSeatSelect(room, selectedSeat);
        renderSeatGrid(room, selectedSeat, previousSeat);
    }

    if (labSelect.value === '') {
        labSelect.value = booking.roomNumber || '';
    }

    populateSeatSelect(getSelectedRoom(), booking.seat || '');
    renderSeatGrid(getSelectedRoom(), booking.seat || '', booking.seat || '');

    labSelect.addEventListener('change', () => {
        const room = getSelectedRoom();
        const firstSeat = room && room.seatNumbers && room.seatNumbers[0]
            ? room.seatNumbers[0].number
            : '';

        populateSeatSelect(room, firstSeat);
        renderSeatGrid(room, firstSeat, '');
    });

    seatSelect.addEventListener('change', () => {
        const room = getSelectedRoom();
        renderSeatGrid(room, seatSelect.value, booking.roomNumber === labSelect.value ? booking.seat : '');
    });
});