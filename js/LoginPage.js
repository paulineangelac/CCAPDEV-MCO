/* Login Form Functionality */
const loginForm = document.querySelector('form');
const usernameForm = document.getElementById('username');
loginForm.addEventListener('submit', function(event){
    event.preventDefault();
    const username = usernameForm.value;
     
    if(username === "admin")window.location.href = 'AdminDashboardPage.html';
    if(username === "labtech")window.location.href = 'LabTechDashboardPage.html';
    window.location.href = 'StudentDashboardPage.html';
})

/* End of Login Form Functionality */

