const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/', authMiddleware, orderController.createOrder);
router.get('/me', authMiddleware, orderController.getMyOrders);
router.get('/all', authMiddleware, roleMiddleware('admin'), orderController.getAllOrders);

module.exports = router;
