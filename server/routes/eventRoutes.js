// server/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const { getEventsByClass, createEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

router.route('/class/:classId').get(protect, getEventsByClass);
router.route('/').post(protect, createEvent);

module.exports = router;