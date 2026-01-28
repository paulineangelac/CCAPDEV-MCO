const loginForm = document.querySelector('form');

loginForm.addEventListener('submit', function(event){
    event.preventDefault();

    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;


    if(user === 'admin' && pass === 'admin123'){
        console.log('Login successful');
        window.location.href = 'Student-Dashboard.html';
    }
    else{
        alert('Invalid username or password');
        loginForm.reset();
    }
})