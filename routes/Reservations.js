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

router.get('/edit/:id', async (req, res) => {
    try {
        const booking = await BookedRooms.findById(req.params.id).lean();

        if (!booking) {
            return res.status(404).send("Reservation not found");
        }

        if (req.session.user.status === 'Student') {
            if (String(booking.username) !== String(req.session.user.username)) {
                return res.status(403).send("Not allowed");
            }
        }

        const rooms = await Room.find({}).lean();

        const roomsForView = rooms.map(room => ({
            ...room,
            isSelected: room.roomNumber === booking.roomNumber
        }));

        res.render('EditReservation', {
            booking,
            rooms: roomsForView,
            bookingJson: JSON.stringify(booking),
            roomsJson: JSON.stringify(rooms),
            fname: req.session.user.fname,
            lname: req.session.user.lname,
            status: req.session.user.status
        });
    } catch (err) {
        console.error("EDIT GET ERROR:", err);
        res.status(500).send("Server error");
    }
});

router.post('/edit/:id', async (req, res) => {
    try {
        const booking = await BookedRooms.findById(req.params.id);

        if (!booking) {
            return res.status(404).send("Reservation not found");
        }

        if (req.session.user.status === 'Student') {
            if (String(booking.username) !== String(req.session.user.username)) {
                return res.status(403).send("Not allowed");
            }
        }

        booking.roomNumber = req.body.roomNumber;
        booking.seat = req.body.seat;
        booking.date = req.body.date;
        booking.time = req.body.time;

        await booking.save();

        res.redirect('/studentdashboard-page');
    } catch (err) {
        console.error("EDIT POST ERROR:", err);
        res.status(500).send("Server error");
    }
});

router.post('/cancel/:id', async (req, res) => {
    try {
        const booking = await BookedRooms.findById(req.params.id);

        if (!booking) {
            return res.status(404).send("Reservation not found");
        }

        if (req.session.user.status === 'Student') {
            if (String(booking.username) !== String(req.session.user.username)) {
                return res.status(403).send("Not allowed");
            }
        }

        await BookedRooms.findByIdAndDelete(req.params.id);

        res.redirect('/studentdashboard-page');
    } catch (err) {
        console.error("CANCEL RESERVATION ERROR:", err);
        res.status(500).send("Server error");
    }
});

export default router;