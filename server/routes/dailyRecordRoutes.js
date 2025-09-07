const express = require('express');
const router = express.Router();
const { getRecordByDate, upsertRecord, askQuestion } = require('../controllers/dailyRecordController');
const { protect } = require('../middleware/authMiddleware');

router.get('/class/:classId/date/:date', protect, getRecordByDate);
router.post('/', protect, upsertRecord);
router.post('/ask-question', protect, askQuestion);

module.exports = router;