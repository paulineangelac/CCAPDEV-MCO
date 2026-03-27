const userSearch = document.getElementById("userSearch");
const resultsContainer = document.getElementById("userSearchResults");

async function searchUser() {
    if (!userSearch || !resultsContainer) return;

    const query = userSearch.value.trim();

    if (!query) {
        resultsContainer.innerHTML = "";
        resultsContainer.style.display = "none";
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

function displayResults(users) {
    if (!resultsContainer) return;

    resultsContainer.innerHTML = "";

    if (users.length === 0) {
        resultsContainer.innerHTML = `<div class="resultItem">No users found</div>`;
        resultsContainer.style.display = "block";
        return;
    }

    users.forEach(user => {
        resultsContainer.innerHTML += `
            <a href="/searchUser?username=${user.username}" class="text-decoration-none">
                <div class="resultItem">
                    ${user.fname} ${user.lname}
                </div>
            </a>
        `;
    });

    resultsContainer.style.display = "block";
}

if (userSearch) {
    userSearch.addEventListener("input", searchUser);
}

document.addEventListener("click", (event) => {
    if (!userSearch || !resultsContainer) return;

    const clickedInput = userSearch.contains(event.target);
    const clickedResults = resultsContainer.contains(event.target);

    if (!clickedInput && !clickedResults) {
        resultsContainer.style.display = "none";
    }
});

window.searchUser = searchUser;