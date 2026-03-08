/*
   STUDENTDASHBOARDPAGE.JS
   Search bar behavior (Enter key + button click)

    Note:
   - Sidebar uses Bootstrap Offcanvas already
   - Logout currently uses anchor redirect
*/

const userSearch = document.getElementById("userSearch");

// SEARCH BEHAVIOUR 
// pressing enter in the search input triggers the same action as clicking the search button.
userSearch.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchUser();
    }
});
// Phase 1 placeholder: redirects to ViewProfilePage
// Phase 2 TO DO: replace with actual user search + results dropdown/list
function searchUser() {
    window.location.href = "../src/ViewProfilePage.html";
}

async function loadDashboardInformation(){
    try{
        const response = await fetch('/get-user');
        const userData = await response.json();

        if(userData.loggedIn){
            //updates top right profile name and type based on the current session's information
            document.getElementById("fullname").textContent = `${userData.lname}, ${userData.fname}`;
            document.getElementById("type").textContent = `${userData.status}`;
            //updates the sidebar popup
            document.getElementById("sidebar-fullname").textContent = `${userData.lname}, ${userData.fname}`;
            document.getElementById("sidebar-usertype").textContent = `${userData.status}`;

            //generates the list of current reservations for the user

        }

    }catch(error){
        console.log("MongoDB Error:", error.message);
    }
}
async function loadRecommendedRoom(){
    try{
        const response = await fetch('/rooms');
        const roomData = await response.json();

        if(roomData){
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
    }catch(error){
        console.log("MongoDB Error:", error.message);
    }
}


window.onload = loadDashboardInformation;
window.onload = loadRecommendedRoom;
