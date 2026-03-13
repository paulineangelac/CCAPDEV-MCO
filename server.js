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
import ContactMessage from './models/ContactMessage.js';
import SignUpController from '../CCAPDEV-MCO/controllers/SignUpController.js';
import LoginController from '../CCAPDEV-MCO/controllers/LoginController.js';
import ReserveController from '../CCAPDEV-MCO/controllers/ReserveController.js';
import SearchController from './controllers/SearchController.js';
import LabTech from './models/LabTech.js';
import bcrypt from 'bcryptjs'; // safely hashes passwords

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
    if (!req.session.user) {
        return res.redirect('/login');
    }

    res.render('StudentDashboardPage',{
        reservations: req.session.user.reservations,
        fname: req.session.user.fname,
        lname: req.session.user.lname,
        status: req.session.user.status
    });
});
//render admin page
app.get('/AdminDashboardPage', async (req,res)=>{
    res.render('AdminDashboardPage');
});
//render reservation page
app.get('/reservation-page', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const allRooms = await Room.find({}).lean();

    res.render('ReservationPage', {
        fname: req.session.user.fname,
        lname: req.session.user.lname,
        status: req.session.user.status,
        rooms: allRooms,
    });
});

app.get('/signup-page', (req, res) => {
    res.render('SignUpPage');
});

app.get('/studentprofile-page', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

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

app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 

app.post('/contact', async (req, res) => {
  try {
    console.log("Contact form data:", req.body); // print submitted data

    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      console.log("Missing required fields");
      return res.status(400).send("Please fill in all required fields.");
    }
    await ContactMessage.create({ name, email, phone, message, date: new Date() });

    res.send(`<script>alert("Thank you, ${name}! Your message has been submitted."); window.location.href = "/";</script>`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error. Please try again.");
  }
});

// GET all lab technicians
app.get('/labtechs', async (req, res) => {
    try {
        const labTechs = await LabTech.find().lean(); // lean() returns plain JS objects
        res.json(labTechs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch lab technicians" });
    }
});

// POST create new lab technician
app.post('/labtechs/create', async (req, res) => {
    try {
        const { firstName, lastName, email, contactNumber, password, confirmPassword, assignedLab } = req.body;

        // Check all required fields
        if (!firstName || !lastName || !email || !password || !confirmPassword || !assignedLab) {
            return res.status(400).json({ error: "Please fill in all required fields." });
        }

        // Confirm passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match." });
        }

        // Check if email is already in use
        const existing = await LabTech.findOne({ email });
        if (existing) {
            return res.status(400).json({ error: "Email already exists." });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        const newLabTech = new LabTech({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            assignedLab
        });

        await newLabTech.save();
        res.status(201).json({ message: "Lab technician created successfully." });

    } catch (err) {
        console.error("Error creating lab technician:", err);
        res.status(500).json({ error: "Server error. Please try again." });
    }
});

app.post('/labtech-login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const labTech = await LabTech.findOne({ email });
        if (!labTech) return res.status(400).json({ error: "Invalid email or password" });

        // 🔒 compare entered password with stored hash
        const isMatch = await bcrypt.compare(password, labTech.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

        // Optional: save session
        req.session.user = {
            id: labTech._id,
            firstName: labTech.firstName,
            lastName: labTech.lastName,
            email: labTech.email,
            assignedLab: labTech.assignedLab,
            role: "LabTech"
        };

        res.json({ message: "Login successful" });
    } catch (err) {
        res.status(500).json({ error: "Server error during login" });
    }
});

app.get('/logout-page', (req,res)=>{
    res.render('LoginPage');
})

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