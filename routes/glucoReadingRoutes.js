import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createReading, getAllReadings, getReadingsForDate } from '../controllers/glucoReadingController.js';

const router = express.Router();

router.post('/', protect, createReading);
router.get('/all', protect, getAllReadings);
router.get('/:date', protect, getReadingsForDate);

export default router;