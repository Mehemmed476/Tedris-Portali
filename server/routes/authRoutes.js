// authRoutes.js
import express from 'express';
import { registerUser, loginUser, loginStudent } from '../controllers/authController.js';
const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/student-login', loginStudent);
export default router;