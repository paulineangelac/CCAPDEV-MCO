const records=[
    {name: 'John Doe', bookings:[]}
]

const rooms = ['Goks 304A', 'Goks 304B', 'Goks 306A', 'Goks 306B', 'Andrew 1904'];

const element = document.getElementById('lab-select');

rooms.forEach(room =>{
    const option = document.createElement('option');
    option.textContent = room;
    option.value = room;
    option.id = room;
    element.appendChild(option);
})

function displayBooking(){
    document.getElementById('booking-list').innerHTML = '';
    const bookings = document.getElementById('booking-list');
    records[0].bookings.forEach(booking =>{
    const bookingRoom = document.createElement('div');
    bookingRoom.classList.add('bookings-div');
    bookingRoom.innerHTML = `
        <h3><a>${booking.room}</a></h3>
        <p>${booking.time}</p>
        <p>${booking.date}</p>
        
    `;
    bookings.appendChild(bookingRoom);
})
}
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