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