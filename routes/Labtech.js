import express from 'express';
import Room from '../models/Rooms.js';
import LabTechReserveController from '../controllers/LabTechReserveController.js';

const router = express.Router();

router.get('/labtechdashboard-page', (req, res) => {
    res.render('LabTechDashboardPage', {
        fname: req.session.user.fname,
        lname: req.session.user.lname,
        status: req.session.user.status
    });
});

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

export default router;