// classRoutes.js
import express from 'express';
import { getClasses, createClass, deleteClass } from '../controllers/classController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/').get(protect, getClasses).post(protect, createClass);
router.route('/:id').delete(protect, deleteClass);
export default router;