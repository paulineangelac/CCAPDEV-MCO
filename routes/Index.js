import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/faqs-page', (req, res) => {
    res.render('FAQsPage');
});

router.get('/logout-page', (req, res) => {
    res.render('LoginPage');
});

export default router;