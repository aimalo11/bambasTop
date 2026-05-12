const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutes públiques d'autenticació

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registre d'un nou usuari
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuari registrat correctament
 *       400:
 *         description: Error en les dades proporcionades
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login d'usuari
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login correcte, retorna un token
 *       401:
 *         description: Credencials incorrectes
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Renova el token d'accés utilitzant el refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token renovat correctament
 *       401:
 *         description: Refresh token invàlid o expirat
 */
router.post('/refresh', authController.refresh);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Tancar sessió d'usuari (invalidar token)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sessió tancada correctament
 *       401:
 *         description: No autoritzat
 */
router.post('/logout', authController.logout);

module.exports = router;
