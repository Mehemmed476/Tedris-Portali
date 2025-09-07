// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { linkParentAccount } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/link-account', protect, linkParentAccount);

module.exports = router;