const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const checkoutController = require('../controllers/checkoutController');

const router = express.Router();

router.post('/create-session', authMiddleware, checkoutController.createSession);
router.post('/webhook', checkoutController.webhook);

module.exports = router;
