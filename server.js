import 'dotenv/config';
import express, { urlencoded } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import Room from './models/Rooms.js';
import User from './models/User.js';
import { engine } from 'express-handlebars';

import SignUpController from '../CCAPDEV-MCO/controllers/SignUpController.js';
import LoginController from '../CCAPDEV-MCO/controllers/LoginController.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // updated to manually create __dirname (since we r using import) so that the server knows where project folder is located

// Handlebars configuration
app.engine('hbs', engine({
    extname: 'hbs',         // tell express to look for .hbs file extension
    defaultLayout: 'main',  // sets views/layouts/main.hbs as the default wrapper
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}));

app.set("view engine", "hbs");

app.use(express.static(path.join(__dirname, 'public'))); // find public folder
app.set('views', path.join(__dirname, 'views')); // find views folder


// routes for the pages
app.get('/', (req, res) => {
    res.render('index', { title: "Lab Reservation Index Page" });
});

app.get('/signup', (req, res) => {
    res.render('SignUpPage', { title: "Signup" });  // will render SignUpPage.hbs
});

app.get('/login', (req, res) => {
    res.render('LoginPage', { title: "Login" });  // will render LoginPage.hbs
});

app.get('/faqs', (req, res) => {
    res.render('FAQsPage', { title: "FAQs" });
});

app.get('/studentdashboard', (req, res) => {
    res.render('StudentDashboardPage', { title: "Student Dashboard" });
});

app.get('/studentprofile', (req, res) => {
    res.render('StudentProfilePage', { title: "Student Profile" });
});

app.get('/viewstudentprofile', (req, res) => {
    res.render('ViewProfilePage', { title: "View Profile" });
});

app.get('/reservation', (req, res) => {
    res.render('ReservationPage', { title: "Reservation" });
});

app.get('/editreservation', (req, res) => {
    res.render('EditReservation', { title: "Edit Reservation" });
});

app.get('/admindashboard', (req, res) => {
    res.render('AdminDashboardPage', { title: "Admin Dashboard" });
});

app.get('/labtechdashboard', (req, res) => {
    res.render('LabTechDashboardPage', { title: "Lab Technician Dashboard" });
});

app.get('/labtechprofile', (req, res) => {
    res.render('LabTechProfilePage', { title: "Lab Technician Profile" });
});
app.get('/labtechreservation', (req, res) => {
    res.render('LabTechReservationPage', { title: "Reserve for a Student" });
});

app.get('/labtecheditreservation', (req, res) => {
    res.render('LabTechEditReservation', { title: "Edit Student Reservation" });
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
        }); //important data only
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

// GET route for searching users
app.get('/search-users', async (req, res) => {
    try {
        const query = req.query.q; // gets the name from the URL

        if (!query || query.trim() === '') {
            return res.json([]); // return empty array
        }

        const users = await User.find({
            $or: [
                { fname: { $regex: `^${query}`, $options: 'i' } },
                { lname: { $regex: `^${query}`, $options: 'i' } }
            ]
        }).select('fname lname username email status bio');

        res.json(users);
    } catch (error) {
        console.error("Error searching user:", error);
        res.status(500).json({ error: "server error" });
    }
});

// GET route to get a user profile given a username
app.get('/get-user-profile', async (req, res) => {
    try {
        const username = req.query.username;

        if (!username || username.trim() == '') {
            return res.status(400).json({ error: "Username is required" });
        }

        const user = await User.findOne({ username: username })
            .select('fname lname username email status bio');

        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("Error getting user profile:", error);
        res.status(500).json({ error: "server error" });
    }
});


app.use(express.urlencoded({ extended: true }));

app.post('/signUp', SignUpController.signUp);
app.post('/login', LoginController.login);

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