// dashboardRoutes.js
import express from 'express';
import { getParentDashboardData, getStudentDashboardData } from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.get('/parent', protect, getParentDashboardData);
router.get('/student', protect, getStudentDashboardData);
export default router;