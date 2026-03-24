import express from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import 'dotenv/config';

// Import routes
import IndexRoutes from './routes/Index.js';
import AuthRoutes from './routes/Authentication.js';
import AdminRoutes from './routes/Admin.js';
import ReservationsRoutes from './routes/Reservations.js';
import SearchRoutes from './routes/Search.js';
import StudentRoutes from './routes/Student.js';

const app = express();

app.set("view engine", "hbs");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3 * 24 * 60 * 60 * 1000 }
}));

// Mount the routers
app.use('/', IndexRoutes);
app.use('/', AuthRoutes);
app.use('/', AdminRoutes);
app.use('/', ReservationsRoutes);
app.use('/', SearchRoutes);
app.use('/', StudentRoutes);

// MongoDB connection & start server
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB successfully!");
        app.listen(process.env.SERVER_PORT, () => {
            console.log(`Server running on http://localhost:${process.env.SERVER_PORT}`);
        });
    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit();
    });