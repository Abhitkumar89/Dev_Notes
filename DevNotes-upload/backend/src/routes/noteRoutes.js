import express from 'express';
import {
  getNotes,
  getStats,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/noteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All note routes require authentication
router.use(protect);

router.get('/stats', getStats);
router.route('/').get(getNotes).post(createNote);
router.route('/:id').get(getNoteById).put(updateNote).delete(deleteNote);

export default router;
