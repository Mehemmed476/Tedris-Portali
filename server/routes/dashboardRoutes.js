// server/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const { getParentDashboardData, getStudentDashboardData } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/parent', protect, getParentDashboardData);
router.get('/student', protect, getStudentDashboardData);

module.exports = router;