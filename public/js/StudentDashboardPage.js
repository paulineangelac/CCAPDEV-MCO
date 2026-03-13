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

// redirect to user profile
function viewProfile(username) {
    window.location.href = `/ViewProfilePage.html?username=${username}`;
}


function loadDashboardInformation() {
    loadRecommendedRoom();
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
                    <a href="ReservationPage.hbs" class="lab-card ui-card">
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

