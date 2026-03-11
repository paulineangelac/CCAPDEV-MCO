const signUpButton = document.getElementById('submitButton');

signUpButton.addEventListener('submit', function(event){
    event.preventDefault();
    window.location.href='LoginPage.html';
})