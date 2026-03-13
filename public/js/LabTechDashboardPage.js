const userSearch = document.getElementById("userSearch");
const resultsContainer = document.getElementById("userSearchResults");

// USER SEARCH behavior
userSearch.addEventListener("input", searchUser);

async function searchUser() {
    const query = userSearch.value.trim(); // get whatever user types in the search bar

    if (!query) {
        resultsContainer.innerHTML = "";
        return;
    }

    try {
        const response = await fetch(`/search-users?q=${encodeURIComponent(query)}`);
        const users = await response.json();

        displayResults(users);
    } catch (error) {
        console.log("Search error:", error.message);
    }
}

// user search dropdown
function displayResults(users) {
    resultsContainer.innerHTML = "";

    if (users.length == 0) {
        resultsContainer.innerHTML = "<div>No users found</div>";
        return;
    }

    users.forEach(user => {
        resultsContainer.innerHTML += `
        <div class="resultItem" onclick="viewProfile('${user.username}')">
            ${user.fname} ${user.lname}
        </div>
        `;
    });
}

function loadDashboardInformation() {
    loadRecommendedRoom();
}
async function loadRecommendedRoom() {
    try {
        const response = await fetch('/rooms-with-stats');
        const roomData = await response.json();

        if (roomData) {
            const labList = document.getElementById('lab-list');
            let roomListHTML = '';
            roomData.forEach(room => {
                roomListHTML += `
                    <div class="booking-card">
                        <div class="booking-header">
                            <span class="booking-lab">${room.roomNumber}</span>
                        </div>
                        <br>
                        <div class="booking-footer">
                            <a href="/LabTechEditReservation" class="btn-details">Edit Reservations</a>
                            <button class="btn-disabled" disabled>Remove Reservation</button>
                            <a href="/LabTechReservationPage" class="btn-details">Make Reservation</a>
                            <button class="btn-details" onclick="showDetails('${room.roomNumber}')">Details</button>
                        </div>
                    </div>
                `;
            });
            labList.innerHTML = roomListHTML;
        }
    } catch (error) {
        console.log("MongoDB Error:", error.message);
    }
}

async function showDetails(roomNumber) {
    try {
        const response = await fetch(`/room-details/${encodeURIComponent(roomNumber)}`);
        const data = await response.json();

        // update modal header
        const bookedCount = data.slotDetails.reduce((acc, slot) => acc + slot.bookedSeats.length, 0);
        document.getElementById('modalRoomTitle').textContent = 
            `${data.roomNumber} — ${bookedCount}/${data.totalSeats} seats booked`;

        // build time slot list
        let slotHTML = '';
        data.slotDetails.forEach(slot => {
            const seatsText = slot.bookedSeats.length > 0 
                ? `Seats taken: ${slot.bookedSeats.join(', ')}` 
                : 'No reservations';
            slotHTML += `
                <div class="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
                    <span class="fw-bold">${slot.time}</span>
                    <span class="muted">${seatsText}</span>
                </div>
            `;
        });
        document.getElementById('modalSlotList').innerHTML = slotHTML;

        // open the modal
        const modal = new bootstrap.Modal(document.getElementById('timeModal'));
        modal.show();

    } catch (error) {
        console.log("Error loading room details:", error.message);
    }
}



window.onload = loadDashboardInformation;

