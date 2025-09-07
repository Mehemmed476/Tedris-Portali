// server/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, loginStudent } = require('../controllers/authController');

// Müəllim və Valideyn üçün
router.post('/register', registerUser);
router.post('/login', loginUser);

// Şagird üçün
router.post('/student-login', loginStudent);

module.exports = router;