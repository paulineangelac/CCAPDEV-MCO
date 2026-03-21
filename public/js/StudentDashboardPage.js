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
        // Pass the username as a query parameter in the href
        resultsContainer.innerHTML += `
        <a href="/searchUser?username=${user.username}" class="text-decoration-none">
            <div class="resultItem">
                ${user.fname} ${user.lname}
            </div>
        </a>
        `;
    });
}





window.onload = loadDashboardInformation;

