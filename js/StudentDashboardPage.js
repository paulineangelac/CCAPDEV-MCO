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

