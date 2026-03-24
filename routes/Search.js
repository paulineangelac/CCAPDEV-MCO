import express from 'express';
import SearchController from '../controllers/SearchController.js';

const router = express.Router();

router.get('/search-users', SearchController.searchUsers);
router.get('/get-user-profile', SearchController.getUserProfile);
router.get('/searchUser', SearchController.renderProfilePage);


export default router;