const logoutForm = document.querySelector('form')

logoutForm.addEventListener('submit', function(event){
    event.preventDefault();
    console.log("im here")
    logout();
})

/* End of Logout Functionality */

function logout() {
    localStorage.clear();
    window.location.href = 'LoginPage.html';
}
/* End of Logout Functionality */