import express from 'express';
import Room from '../models/Rooms.js';
import BookedRooms from '../models/BookedRooms.js';
import User from '../models/User.js';
import ReserveController from '../controllers/ReserveController.js';
import ReserveForStudentController from '../controllers/ReserveForStudentController.js';

const router = express.Router();

router.get('/reservation-page', async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/login');

        const rooms = await Room.find({}).lean();

        const currentUser = await User.findOne({
            username: req.session.user.username
        }).lean();

        res.render('ReservationPage', {
            rooms,
            fname: currentUser.fname,
            lname: currentUser.lname,
            status: currentUser.status,
            profilePic: currentUser.profilePic || '/pictures/temp.jpeg',
            error: req.query.error || null,
            success: req.query.success || null
        });
    } catch (err) {
        console.error('RESERVATION PAGE ERROR:', err);
        res.status(500).send('Server error');
    }
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
        if (!req.session.user) return res.redirect('/login');

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

        const currentUser = await User.findOne({
            username: req.session.user.username
        }).lean();

        const roomsForView = rooms.map(room => ({
            ...room,
            isSelected: room.roomNumber === booking.roomNumber
        }));

        res.render('EditReservation', {
            booking,
            rooms: roomsForView,
            bookingJson: JSON.stringify(booking),
            roomsJson: JSON.stringify(rooms),
            fname: currentUser.fname,
            lname: currentUser.lname,
            status: currentUser.status,
            profilePic: currentUser.profilePic || '/pictures/temp.jpeg',
            error: req.query.error || null,
            success: req.query.success || null
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

        const { roomNumber, seat, date, time } = req.body;

        const conflict = await BookedRooms.findOne({
            _id: { $ne: req.params.id },
            roomNumber,
            seat,
            date,
            time
        });

        if (conflict) {
            return res.redirect(`/edit/${req.params.id}?error=Seat%20is%20already%20reserved`);
        }

        booking.roomNumber = roomNumber;
        booking.seat = seat;
        booking.date = date;
        booking.time = time;

        await booking.save();

        res.redirect('/studentdashboard-page?success=Reservation%20updated%20successfully');
    } catch (err) {
        console.error("EDIT POST ERROR:", err);
        res.redirect(`/edit/${req.params.id}?error=Something%20went%20wrong`);
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