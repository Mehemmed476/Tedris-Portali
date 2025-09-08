// announcementRoutes.js
import express from 'express';
import { getAnnouncementsByClass, createAnnouncement } from '../controllers/announcementController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.route('/class/:classId').get(protect, getAnnouncementsByClass);
router.route('/').post(protect, createAnnouncement);
export default router;