import express from 'express';
import { googleAuth, getMe, updateCategories } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/google', googleAuth);
router.get('/me', protect, getMe);
router.put('/categories', protect, updateCategories);

export default router;
