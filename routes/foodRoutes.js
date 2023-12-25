import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { createFood, getAllFoods } from '../controllers/foodController.js';

const router = express.Router();

router.post('/', protect, createFood);
router.get('/all', protect, getAllFoods);

export default router;