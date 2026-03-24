import express from 'express';
import SignUpController from '../controllers/SignUpController.js';
import LoginController from '../controllers/LoginController.js';

const router = express.Router();

router.get('/login', (req, res) => res.render('LoginPage'));
router.get('/signup-page', (req, res) => res.render('SignUpPage'));

router.post('/signUp', SignUpController.signUp);
router.post('/login', LoginController.login);

export default router;