if (!localStorage.getItem('logedInUser')) {
    window.location.href = 'LoginPage.html';
}
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
    console.log(room);
    const option = document.createElement('option');
    option.textContent = room;
    option.value = room;
    option.id = room;
    element.appendChild(option);
})
/* End of populate Room Options */

function displayBooking(user){

    const bookings = document.getElementById('booking-list');
    document.getElementById('booking-list').innerHTML = '';

    const userRecord = records.find(record => record.username === user);

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
/* End of Display Booking Function */


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
    displayBooking(username);
})
/* End of Search Feature for Rooms */

/* Display Proper Account in the Top Right */

function displayAccount(username){
    const topRightProfile = document.getElementById('topRightProfile');

    const userRecord = records.find(record => record.username === username);
    if(userRecord)
    {
        const profileDiv = document.createElement('div');
        profileDiv.innerHTML=`
        <a class="profile-chip" href="profile.html" title="View profile">
        <img class="avatar" src="../pictures/temp.jpeg" alt="Profile picture" />
            <span class="profile-chip__meta">
                <span class="profile-chip__name">${userRecord.username}</span>
                <span class="profile-chip__role">${userRecord.status}</span>
            </span>
        </a>
    `;
    topRightProfile.appendChild(profileDiv);
    }    
}

/* End of Display Proper Account in the Top Right */

/* Logout Functionality */





displayBooking(username);

displayAccount(username);
