const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/', authMiddleware, orderController.createOrder);

module.exports = router;
