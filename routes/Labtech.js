import express from 'express';
import Room from '../models/Rooms.js';
import User from '../models/User.js';
import LabTechReserveController from '../controllers/LabTechReserveController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.use(isAuthenticated); // route protection

router.get('/makereservation-page', async (req, res) => {
    const allRooms = await Room.find({}).lean();
    res.render('LabTechMakeReservation', {
        rooms: allRooms,
        fname: req.session.user.fname,
        lname: req.session.user.lname,
        status: req.session.user.status
    });
});

router.post('/labtech-reserve', LabTechReserveController.reserve);

router.get('/labtechdashboard-page', async (req, res) => {
    try {
        const rooms = await Room.find({}).lean();

        res.render('LabTechDashboardPage', {
            rooms,
            fname: req.session.user.fname,
            lname: req.session.user.lname,
            status: req.session.user.status
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/editreservation-page', async (req, res) => {
    try {
        const rooms = await Room.find({}).lean();
        const students = await User.find({ status: 'Student' }).lean();

        res.render('LabTechEditReservation', {
            rooms,
            students,
            fname: req.session.user.fname,
            lname: req.session.user.lname,
            status: req.session.user.status
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/get-all-users', async (req, res) => {
    try {
        const users = await User.find({ status: 'Student' }).lean();
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;