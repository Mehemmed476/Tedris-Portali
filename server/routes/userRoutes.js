// userRoutes.js
import express from 'express';
import { linkParentAccount } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/link-account', protect, linkParentAccount);
export default router;