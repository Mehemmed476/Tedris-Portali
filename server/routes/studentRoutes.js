// studentRoutes.js
import express from 'express';
import { getStudentsByClass, createStudent, updateStudent, deleteStudent, getStudentDetails } from '../controllers/studentController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.get('/class/:classId', protect, getStudentsByClass);
router.post('/', protect, createStudent);
router.route('/:id').get(protect, getStudentDetails).put(protect, updateStudent).delete(protect, deleteStudent);
export default router;