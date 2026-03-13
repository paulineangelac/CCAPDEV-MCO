import 'dotenv/config';
import express, { urlencoded } from 'express';
import mongoose from 'mongoose';
import hbs from 'hbs';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import Room from './models/Rooms.js';
import User from './models/User.js';
import BookedRooms from './models/BookedRooms.js';

import SignUpController from '../CCAPDEV-MCO/controllers/SignUpController.js';
import LoginController from '../CCAPDEV-MCO/controllers/LoginController.js';
import ReserveController from '../CCAPDEV-MCO/controllers/ReserveController.js';
import SearchController from './controllers/SearchController.js';
import LabTechReserveController from './controllers/LabTechReserveController.js';

const app = express();


app.set("view engine", "hbs");

//makes sures when you view on localhost:3000, it will show the index page
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});


const PORT = process.env.SERVER_PORT;
const dbURL = process.env.MONGODB_URI;

//session
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 3 * 24 * 60 * 60 * 1000 //3 days
    }
}));

//gets the current session's information to update the dashboard page
app.get('/get-user', (req, res) => {
    if (req.session.user) {
        res.json({
            loggedIn: true,
            fname: req.session.user.fname,
            lname: req.session.user.lname,
            email: req.session.user.email,
            username: req.session.user.username,
            reservations: req.session.user.reservations,
            status: req.session.user.status
        });//important data only
    } else {
        res.json({ loggedIn: false });
    }
});
app.get('/rooms', async (req, res) => {
    try {
        const rooms = await Room.find({});
        res.json(rooms);
    } catch (error) {
        console.error("Error fetching rooms:", error);
    }
});

app.get('/rooms/:roomNumber', async (req, res) => {
    try {
        const room = await Room.findOne({ roomNumber: req.params.roomNumber });

        res.json(room);
    } catch (error) {
        console.error("Error fetching room ", error);
    }
});

app.get('/searchUser', async(req,res)=>{
    try {
        const searchedUsername = req.query.username;
        console.log(searchedUsername);
        const userData = await User.findOne({ username: searchedUsername }).lean();
        console.log(userData);
        
        res.render('ViewProfilePage', {
            profileUser: userData,
            reservations: userData.reservations,
            fname: req.session.user.fname,
            lname: req.session.user.lname,
            status: req.session.user.status
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// for searching users
app.get('/search-users', SearchController.searchUsers);
app.get('/get-user-profile', SearchController.getUserProfile);

// render view profile page and use renderProfilePage function
app.get('/viewprofile', SearchController.renderProfilePage);

//render login page
app.get('/login', (req, res) => {
    res.render('LoginPage');
});

//render studentdashboard page
app.get('/studentdashboard-page', (req, res) => {
    res.render('StudentDashboardPage',{
        reservations: req.session.user.reservations,
        fname: req.session.user.fname,
        lname: req.session.user.lname,
        status: req.session.user.status
    });
});

//render reservation page
app.get('/reservation-page', async (req, res) => {

    const allRooms = await Room.find({}).lean();

    res.render('ReservationPage', {
        fname: req.session.user.fname,
        lname: req.session.user.lname,
        status: req.session.user.status,
        rooms: allRooms,
    });
});

app.get('/signup', (req, res) => {
    res.render('SignUpPage');
});
app.get('/studentprofile-page', (req,res)=>{
    res.render('StudentProfilePage',{
        bio: req.session.user.bio,
        reservations: req.session.user.reservations,
        fname: req.session.user.fname,
        lname: req.session.user.lname,
        status: req.session.user.status,
        email: req.session.user.email,
        username: req.session.user.username,
    });
});
app.get('/faqs-page', (req,res)=>{
    res.render('FAQsPage');
});
app.get('/logout-page', (req,res)=>{
    res.render('LoginPage');
})
app.get('/LabTechDashboardPage', (req, res) => {
    res.render('LabTechDashboardPage');
});

app.get('/LabTechProfilePage', (req, res) => {
    res.render('LabTechProfilePage');
});

app.get('/LabTechEditReservation', async (req, res) => {
    try {
        const { roomNumber } = req.query;
        const roomsData = await Room.find({}).lean();
        res.render('LabTechEditReservation', {
            rooms: roomsData,
            selectedRoom: roomNumber || ''
        });
    } catch (error) {
        console.log(error);
    }
});

app.get('/get-booking', async (req, res) => {
    const { username, roomNumber, date, time } = req.query;
    try {
        const booking = await BookedRooms.findOne({
            username: Number(username),
            roomNumber,
            date,
            time
        }).lean();
        res.json(booking || null);
    } catch (error) {
        res.status(500).json({ error: 'server error' });
    }
});

app.get('/get-student-bookings', async (req, res) => {
    const { username } = req.query;
    try {
        const bookings = await BookedRooms.find({ username: Number(username) }).lean();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'server error' });
    }
});

app.get('/LabTechReservationPage', async (req, res) => {
    try {
        const roomsData = await Room.find({}).lean();

        res.render('LabTechReservationPage', {

            rooms: roomsData
        });
    } catch (error) {
        console.log(error);
    }
});

app.get('/ReservationPage', async (req, res) => {
    try {
        const roomsData = await Room.find({}).lean();

        res.render('ReservationPage', {

            rooms: roomsData
        });
    } catch (error) {
        console.log(error);
    }
});

//gets room
app.get('/rooms-with-stats', async (req, res) => {
    try {
        const rooms = await Room.find({});
        const booked = await BookedRooms.find({});

        const roomStats = rooms.map(room => {
            const bookedCount = booked.filter(b => b.roomNumber === room.roomNumber).length;
            return {
                roomNumber: room.roomNumber,
                totalSeats: room.seatNumbers.length,
                bookedSeats: bookedCount,
                availableSeats: room.seatNumbers.length - bookedCount
            };
        });

        res.json(roomStats);
    } catch (error) {
        console.error("Error fetching room stats:", error);
        res.status(500).json({ error: "server error" });
    }
});

app.get('/room-details/:roomNumber', async (req, res) => {
    try {
        const room = await Room.findOne({ roomNumber: req.params.roomNumber });
        const booked = await BookedRooms.find({ roomNumber: req.params.roomNumber });

        // get all unique time slots from first seat
        const timeSlots = room.seatNumbers[0].slots.map(slot => slot.time);

        const slotDetails = timeSlots.map(time => {
            const bookedSeats = booked
                .filter(b => b.time === time)
                .map(b => b.seat);
            return {
                time,
                bookedSeats,
                totalSeats: room.seatNumbers.length
            };
        });

        res.json({
            roomNumber: room.roomNumber,
            totalSeats: room.seatNumbers.length,
            slotDetails
        });
    } catch (error) {
        res.status(500).json({ error: "server error" });
    }
});

app.get('/get-all-users', async (req, res) => {
    try {
        const users = await User.find({ status: 'Student' }).select('username fname lname');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "server error" });
    }
});





app.use(express.urlencoded({ extended: true }));

app.post('/signUp', SignUpController.signUp);
app.post('/login', LoginController.login);
app.post('/reserve', ReserveController.reserve);
app.post('/labtech-reserve', LabTechReserveController.reserve);
app.post('/labtech-edit-reserve', async (req, res) => {
    try {
        const { bookingId, seat } = req.body;
        await BookedRooms.findByIdAndUpdate(bookingId, { seat });
        res.send(`
            <script>
                alert('Reservation updated successfully!');
                window.location.href = '/LabTechDashboardPage';
            </script>
        `);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
});

//connect to mongoose and start the server
mongoose.connect(dbURL)
    .then(() => {
        console.log("Connected to MongoDB successfully via Mongoose!");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit();
    });