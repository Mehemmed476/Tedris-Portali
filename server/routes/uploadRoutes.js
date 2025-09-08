// uploadRoutes.js
import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import { uploadFile } from '../controllers/uploadController.js';
const router = express.Router();
const upload = multer({ dest: 'uploads/' });
router.post('/', protect, upload.single('file'), uploadFile);
export default router;