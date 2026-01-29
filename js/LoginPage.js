const records=[
    {name: 'John Doe', bookings:[{room: 'Goks 304A', time: '08:00 AM', date: '2024-11-15'}], status:'Student'},
    {name: 'Mary Jane', bookings:[], status:'Admin'}
]

localStorage.setItem('allRecords', JSON.stringify(records));

const rooms = ['Goks 304A', 'Goks 304B', 'Goks 306A', 'Goks 306B', 'Andrew 1904'];
localStorage.setItem('allRooms', JSON.stringify(rooms));
/* Login Form Functionality */
const loginForm = document.querySelector('form');

loginForm.addEventListener('submit', function(event){
    event.preventDefault();

    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if(records.some(record => record.name === user) && pass === 'admin123'){
        window.location.href = 'Student-Dashboard.html';
    }
    else{
        alert('Invalid username or password');
        loginForm.reset();
    }
})

/* End of Login Form Functionality */

