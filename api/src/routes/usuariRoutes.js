const express = require('express');
const router = express.Router();
const usuariController = require('../controllers/usuariController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registre d'usuari (versió usuaris)
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Usuari creat
 */
router.post('/register', usuariController.register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login d'usuari (versió usuaris)
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Login correcte
 */
router.post('/login', usuariController.login);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtenir dades d'un usuari per ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dades de l'usuari
 */
router.get('/:id', authMiddleware, usuariController.getUser);

module.exports = router;
