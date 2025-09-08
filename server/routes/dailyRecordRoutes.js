// dailyRecordRoutes.js
import express from 'express';
import { getRecordByDate, upsertRecord, askQuestion, answerQuestion } from '../controllers/dailyRecordController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.get('/class/:classId/date/:date', protect, getRecordByDate);
router.post('/', protect, upsertRecord);
router.post('/ask-question', protect, askQuestion);
router.post('/answer-question', protect, answerQuestion);
export default router;