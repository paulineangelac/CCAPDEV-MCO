import express from 'express';
import ContactMessage from '../models/ContactMessage.js';

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        query: req.query
    });
});

router.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.redirect('/?error=missing-fields#contact-section');
    }

    try {
        const newContactMessage = new ContactMessage({
            name,
            email,
            message
        });

        await newContactMessage.save();

        res.redirect('/?submitted=true#contact-section');
    } catch (error) {
        console.error('Error saving contact form:', error);
        res.redirect('/?error=server#contact-section');
    }
});

router.get('/faqs-page', (req, res) => {
    res.render('FAQsPage');
});

router.get('/logout-page', (req, res) => {
    res.render('LoginPage');
});

export default router;