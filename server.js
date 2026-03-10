import 'dotenv/config';
import express, { urlencoded } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import Room from './models/Rooms.js';
import User from './models/User.js';

import SignUpController from '../CCAPDEV-MCO/controllers/SignUpController.js';
import LoginController from '../CCAPDEV-MCO/controllers/LoginController.js';

const app = express();

//makes sures when you view on localhost:3000, it will show the index page
app.use(express.static('.'));
app.use(express.static('src'));
const indexPath = path.dirname(fileURLToPath(import.meta.url));
app.get('/', (req, res) => {
    res.sendFile(path.join(indexPath, '../CCAPDEV-MCO/src/IndexPage.html'));
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