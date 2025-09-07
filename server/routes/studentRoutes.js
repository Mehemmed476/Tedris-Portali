// server/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const { getStudentsByClass, createStudent, updateStudent, deleteStudent, getStudentDetails } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/class/:classId', protect, getStudentsByClass);
router.post('/', protect, createStudent);

router.route('/:id')
    .get(protect, getStudentDetails) // YENİ
    .put(protect, updateStudent)
    .delete(protect, deleteStudent);

module.exports = router;