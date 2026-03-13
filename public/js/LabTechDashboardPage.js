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

function viewProfile(username) {
    window.location.href = `/ViewProfilePage?username=${username}`;
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
        }

    } catch (error) {
        console.log("MongoDB Error:", error.message);
    }
}

window.onload = loadDashboardInformation;

