const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

/**
 * @swagger
 * /api/test/admin:
 *   get:
 *     summary: Ruta de prova per a administradors
 *     description: Aquesta ruta només és accessible per a usuaris amb el rol 'admin'. S'utilitza per demostrar el control d'accés (RBAC).
 *     tags: [Tests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Accés permès. L'usuari és administrador.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       403:
 *         description: Accés prohibit. L'usuari no té el rol necessari.
 *       401:
 *         description: No autoritzat. Token inexistent o invàlid.
 */
router.get('/admin', authMiddleware, roleMiddleware('admin'), (req, res) => {
    res.json({
        message: "✅ Felicitats! Ets administrador i tens accés a aquesta ruta protegida.",
        user: req.user
    });
});

module.exports = router;
