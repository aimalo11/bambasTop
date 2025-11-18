const express = require('express');
const router = express.Router();
const usuariController = require('../controllers/usuariController');

router.post('/register', usuariController.register);
router.post('/login', usuariController.login);
router.get('/:id', usuariController.getUser);

module.exports = router;
