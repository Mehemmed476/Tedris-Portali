// server/routes/classRoutes.js
const express = require('express');
const router = express.Router();
const { getClasses, createClass, deleteClass } = require('../controllers/classController');
const { protect } = require('../middleware/authMiddleware');

// /api/classes ünvanı üçün
router.route('/')
    .get(protect, getClasses)
    .post(protect, createClass);

// /api/classes/:id ünvanı üçün (məs: /api/classes/12345)
router.route('/:id')
    .delete(protect, deleteClass); // YENİ

module.exports = router;