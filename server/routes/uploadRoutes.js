const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const { uploadFile } = require('../controllers/uploadController');

const upload = multer({ dest: 'uploads/' });

router.post('/', protect, upload.single('file'), uploadFile);

module.exports = router;