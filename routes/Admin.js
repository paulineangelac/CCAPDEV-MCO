import express from 'express';
import LabTech from '../models/LabTech.js';
import AdminController from '../controllers/AdminController.js';
import { isAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.use(isAuthenticated); // route protection

router.get('/admindashboard-page', async (req, res) => {
    const labtechs = await LabTech.find({}).lean();
    res.render('AdminDashboardPage', {
        labtech: labtechs,
        fname: req.session.user.fname,
        lname: req.session.user.lname,
        status: req.session.user.status
    });
});

router.post('/makelabtech', AdminController.makelabtech);

export default router;