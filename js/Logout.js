

const logoutForm = document.querySelector('form')

logoutForm.addEventListener('submit', function(event){
    event.preventDefault();
    logout();
})


/* Logout Functionality */
function logout() {
    window.location.href = 'LoginPage.html';
}
/* End of Logout Functionality */