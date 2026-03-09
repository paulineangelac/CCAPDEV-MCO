const userSearch = document.getElementById("userSearch");

// SEARCH BEHAVIOUR 
// pressing enter in the search input triggers the same action as clicking the search button.
userSearch.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchUser();
    }
});

async function searchUser() {
    const query = userSearch.value.trim(); // get whatever user types in the search bar

    if (!query) return;

    try {
        const response = await fetch(`/search-users?q=${encodeURIComponent(query)}`);
        const users = await response.json();

        console.log(users);
    } catch (error) {
        console.log("Search error:", error.message);
    }
}

async function loadDashboardInformation() {
    try {
        const response = await fetch('/get-user');
        const userData = await response.json();

        if (userData.loggedIn) {
            //updates top right profile name and type based on the current session's information
            document.getElementById("fullname").textContent = `${userData.lname}, ${userData.fname}`;
            document.getElementById("type").textContent = `${userData.status}`;
            //updates the sidebar popup
            document.getElementById("sidebar-fullname").textContent = `${userData.lname}, ${userData.fname}`;
            document.getElementById("sidebar-usertype").textContent = `${userData.status}`;

            //generates the list of current reservations for the user
            loadRecommendedRoom();
        }

    } catch (error) {
        console.log("MongoDB Error:", error.message);
    }
}
async function loadRecommendedRoom() {
    try {
        const response = await fetch('/rooms');
        const roomData = await response.json();

        if (roomData) {
            const recoDiv = document.getElementById('recommended-rooms');
            let roomListHTML = '';
            roomData.forEach(room => {
                roomListHTML += `
                    <a href="ReservationPage.html" class="lab-card ui-card">
                        <div class="lab-card__info">
                            <span class="lab-name">${room.roomNumber}</span>
                            <span class="lab-status small">${room.seatNumbers.length} Seats Available</span>
                        </div>
                        <span class="chevron">→</span>
                    </a>
                `;
            });
            recoDiv.innerHTML = roomListHTML;
        }
    } catch (error) {
        console.log("MongoDB Error:", error.message);
    }
}


window.onload = loadDashboardInformation;

