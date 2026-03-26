import express from 'express';
import Room from '../models/Rooms.js';
import User from '../models/User.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.use(isAuthenticated); // route protection

router.get('/studentdashboard-page', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const rooms = await Room.find({}).lean();
    res.render('StudentDashboardPage', {
        room: rooms,
        reservations: req.session.user.reservations,
        fname: req.session.user.fname,
        lname: req.session.user.lname,
        status: req.session.user.status
    });
});

router.get('/studentprofile-page', async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const currentUser = await User.findOne({ username: req.session.user.username }).lean();
    res.render('StudentProfilePage', { currentUser });
});

export default router;