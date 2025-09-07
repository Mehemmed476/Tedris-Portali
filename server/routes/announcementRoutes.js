// server/routes/announcementRoutes.js
const express = require('express');
const router = express.Router();
const { getAnnouncementsByClass, createAnnouncement } = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');

router.route('/class/:classId').get(protect, getAnnouncementsByClass);
router.route('/').post(protect, createAnnouncement);

module.exports = router;