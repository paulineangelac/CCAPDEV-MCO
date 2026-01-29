
const StoredAccounts = localStorage.getItem('allRecords');
const records = JSON.parse(StoredAccounts);
console.log(records);

const storedRooms = localStorage.getItem('allRooms');
const rooms = JSON.parse(storedRooms);
console.log(rooms);

const username = localStorage.getItem('logedInUser');
console.log(username);


/* Populate Room Options */
const element = document.getElementById('lab-select');

rooms.forEach(room =>{
    const option = document.createElement('option');
    option.textContent = room;
    option.value = room;
    option.id = room;
    element.appendChild(option);
})

function displayBooking(user){

    const bookings = document.getElementById('booking-list');
    document.getElementById('booking-list').innerHTML = '';

    const userRecord = records.find(record => record.name === user);
    if(userRecord && userRecord.bookings){

        userRecord.bookings.forEach(booking =>{
        const bookingRoom = document.createElement('div');
        bookingRoom.classList.add('bookings-div');
        bookingRoom.innerHTML = `
        <h3><a>${booking.room}</a></h3>
        <p>${booking.time}</p>
        <p>${booking.date}</p>
        
        `;
        bookings.appendChild(bookingRoom);
        })
    }else{
        const bookingRoom = document.createElement('div');
        bookingRoom.innerHTML=`<p class="muted">You have no upcoming reservations! Use the search or select a lab to start.</p>`
    }
    
}
/** End of Display Booking Function */


/* Search Feature for Rooms */
const searchForm = document.querySelector('.search-form');
searchForm.addEventListener('submit', function(event){
    event.preventDefault();


    const room = document.getElementById('lab-select').value;
    const date = document.getElementById('date-select').value;
    const time = document.getElementById('time-select').value;

    if(!room || !date || !time){
        alert('Please fill in all fields');
        return;
    }
    console.log(room, date, time);
    
    records[0].bookings.push({room, time, date});
    displayBooking();
})
/* End of Search Feature for Rooms */
displayBooking(username);