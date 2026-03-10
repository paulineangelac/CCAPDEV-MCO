// read url to return the user profile to load 
function getUserProfile() {
    const params = new URLSearchParams(window.location.search);
    return params.get("username");
}
// TODO: fetch user data and display it
async function loadUserProfile() {

}