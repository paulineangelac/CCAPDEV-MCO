import express from 'express';
import multer from 'multer';
import path from 'path';
import Room from '../models/Rooms.js';
import User from '../models/User.js';
import { isAuthenticated } from '../middleware/auth.js';
import BookedRooms from '../models/BookedRooms.js';

const router = express.Router();

router.use(isAuthenticated); // route protection

router.get('/studentdashboard-page', async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/login');

        const rooms = await Room.find({}).lean();
        const bookings = await BookedRooms.find({
            username: req.session.user.username
        }).lean();

        const currentUser = await User.findOne({
            username: req.session.user.username
        }).lean();

        res.render('StudentDashboardPage', {
            rooms,
            bookings,
            fname: currentUser.fname,
            lname: currentUser.lname,
            status: currentUser.status,
            profilePic: currentUser.profilePic || '/pictures/temp.jpeg'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/studentprofile-page', async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/login');

        const currentUser = await User.findOne({
            username: req.session.user.username
        }).lean();

        const bookings = await BookedRooms.find({
            username: req.session.user.username
        }).lean();

        res.render('StudentProfilePage', {
            currentUser,
            bookings
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/profile-pics');
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `user-${req.session.user.username}-${Date.now()}${ext}`);
    }
});

const upload = multer({ storage });

router.post('/upload-profile-pic', upload.single('profilePic'), async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/login');

        const imagePath = `/uploads/profile-pics/${req.file.filename}`;

        await User.updateOne(
            { username: req.session.user.username },
            { $set: { profilePic: imagePath } }
        );

        req.session.user.profilePic = imagePath;

        res.redirect('/studentprofile-page');
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

router.post('/update-bio', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ message: 'Not logged in' });
        }

        await User.updateOne(
            { username: req.session.user.username },
            { $set: { bio: req.body.bio } }
        );

        res.json({ success: true });
    } catch (err) {
        console.error('UPDATE BIO ERROR:', err);
        res.status(500).json({ success: false });
    }
});

router.get('/view-profile/:username', async (req, res) => {
    try {
        if (!req.session.user) return res.redirect('/login');

        const currentUser = await User.findOne({
            username: req.session.user.username
        }).lean();

        const profileUser = await User.findOne({
            username: req.params.username
        }).lean();

        if (!profileUser) {
            return res.status(404).send('User not found');
        }

        // const bookings = await BookedRooms.find({
        //     username: profileUser.username
        // }).lean();

        res.render('ViewProfilePage', {
            currentUser,
            profileUser,
            navProfilePic: currentUser?.profilePic || '/pictures/temp.jpeg',
            navFname: currentUser?.fname || '',
            navLname: currentUser?.lname || '',
            navStatus: currentUser?.status || ''
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

export default router;