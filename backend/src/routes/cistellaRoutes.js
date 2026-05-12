const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cistellaController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Obtenir la cistella de l'usuari
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cistella de l'usuari
 */
router.get('/', authMiddleware, cartController.getCart);

/**
 * @swagger
 * /api/cart/add:
 *   post:
 *     summary: Afegir un producte a la cistella
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productoId:
 *                 type: string
 *               nombre:
 *                 type: string
 *               precio:
 *                 type: number
 *     responses:
 *       200:
 *         description: Producte afegit a la cistella
 */
router.post('/add', authMiddleware, cartController.addToCart);

/**
 * @swagger
 * /api/cart/checkout:
 *   post:
 *     summary: Finalitzar la compra (checkout)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Compra realitzada amb èxit
 */
router.post('/checkout', authMiddleware, cartController.checkout);

router.delete('/clear', authMiddleware, cartController.clearCart);

/**
 * @swagger
 * /api/cart/{id}:
 *   delete:
 *     summary: Eliminar un producte de la cistella
 *     tags: [Cart]
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
 *         description: Producte eliminat de la cistella
 */
router.delete('/:id', authMiddleware, cartController.removeFromCart);

module.exports = router;
