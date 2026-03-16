const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cistellaController');

router.get('/', cartController.getCart);
router.post('/add', cartController.addToCart);
router.post('/checkout', cartController.checkout);
router.delete('/:id', cartController.removeFromCart);

module.exports = router;
