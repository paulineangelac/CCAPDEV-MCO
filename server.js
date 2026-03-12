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
<<<<<<< HEAD
import ReserveController from '../CCAPDEV-MCO/controllers/ReserveController.js';
=======
import SearchController from './controllers/SearchController.js';
>>>>>>> origin

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
    res.render('StudentDashboardPage');
});

//render reservation page
app.get('/reservation-page', async (req, res) => {
    const selectedRoom = req.query.lab;
    const selectedDate = req.query.date;
    const selectedTime = req.query.time;

    const allRooms = await Room.find({}).lean();

    res.render('ReservationPage', {
        rooms: allRooms,
        lab: selectedRoom,
        date: selectedDate,
        time: selectedTime
    });
});

app.get('/signup', (req, res) => {
    res.render('SignUpPage');
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



app.use(express.urlencoded({ extended: true }));

app.post('/signUp', SignUpController.signUp);
app.post('/login', LoginController.login);
app.post('/reserve', ReserveController.reserve);

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