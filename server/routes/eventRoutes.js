// eventRoutes.js
import express from 'express';
import { getEventsByClass, createEvent } from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/class/:classId').get(protect, getEventsByClass);
router.route('/').post(protect, createEvent);
export default router;