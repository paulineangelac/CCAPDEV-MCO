import express from 'express';
import Room from '../models/Rooms.js';
import BookedRooms from '../models/BookedRooms.js';
import ReserveController from '../controllers/ReserveController.js';
import ReserveForStudentController from '../controllers/ReserveForStudentController.js';

const router = express.Router();

router.get('/reservation-page',  async (req,res)=>{
    const rooms = await Room.find({});

    res.render('ReservationPage',{
        rooms: rooms,
        fname: req.session.user.fname,
        lname: req.session.user.lname,
        status: req.session.user.status
    });
});
router.get('/rooms', async (req, res) => {
    const rooms = await Room.find({});
    res.json(rooms);
});

router.get('/rooms/:roomNumber', async (req, res) => {
    const room = await Room.findOne({ roomNumber: req.params.roomNumber });
    res.json(room);
});

router.post('/reserve', ReserveController.reserve);
router.post('/reserveforstudent', ReserveForStudentController.reserveforstudent);

// student bookings
router.get('/get-booking', async (req, res) => {
    const { username, roomNumber, date, time } = req.query;
    const booking = await BookedRooms.findOne({ username: Number(username), roomNumber, date, time }).lean();
    res.json(booking || null);
});

router.get('/get-student-bookings', async (req, res) => {
    const { username } = req.query;
    const bookings = await BookedRooms.find({ username: Number(username) }).lean();
    res.json(bookings);
});

export default router;