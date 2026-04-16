const Cistella = require('../models/Cistella');
const Orden = require('../models/orden');
const Product = require('../models/Product');

const getOrCreateUserCart = async (userId) => {
    let cart = await Cistella.findOne({ user: userId });
    if (!cart) {
        cart = await Cistella.create({ user: userId, items: [] });
    }
    return cart;
};

// Obtener carrito (o crear uno si no existe)
exports.getCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await getOrCreateUserCart(userId);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Añadir item
exports.addToCart = async (req, res) => {
    const { productoId } = req.body;
    try {
        const userId = req.user.id;
        const product = await Product.findById(productoId);
        if (!product) {
            return res.status(404).json({ message: 'Producte no trobat' });
        }

        const cart = await getOrCreateUserCart(userId);
        const existingItem = cart.items.find((item) => item.productoId === String(product._id));
        const nextQuantity = existingItem ? existingItem.quantity + 1 : 1;
        if (product.stock < nextQuantity) {
            return res.status(400).json({ message: 'Stock insuficient per aquest producte' });
        }

        if (existingItem) {
            existingItem.quantity = nextQuantity;
            existingItem.precio = Number(product.price);
            existingItem.nombre = product.name;
        } else {
            cart.items.push({
                productoId: String(product._id),
                nombre: product.name,
                precio: Number(product.price),
                quantity: 1
            });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar item por ID
exports.removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const cart = await getOrCreateUserCart(userId);
        if (cart) {
            cart.items.pull({ _id: id });
            await cart.save();
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Realitzar checkout (buidar cistella)
exports.checkout = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, email, address, cart } = req.body;
        if (!Array.isArray(cart) || cart.length === 0) {
            return res.status(400).json({ status: 'error', message: 'La cistella no pot estar buida' });
        }
        if (!name || !email || !address) {
            return res.status(400).json({ status: 'error', message: 'Falten dades d\'enviament' });
        }

        const total = cart.reduce((sum, item) => {
            const quantity = Number(item.quantity || 1);
            return sum + (Number(item.precio) * quantity);
        }, 0);

        const products = cart.map((item) => {
            const quantity = Number(item.quantity || 1);
            const price = Number(item.precio);
            return {
                product: item.productoId,
                name: item.nombre,
                price,
                quantity,
                subtotal: price * quantity
            };
        });

        const orden = new Orden({
            user: userId,
            shipping: { name, email, address },
            products,
            total,
            status: 'pending'
        });

        await orden.save();

        res.status(200).json({
            status: "success",
            message: "Orden guardada"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Error al guardar la orden"
        });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await getOrCreateUserCart(userId);
        cart.items = [];
        await cart.save();
        res.json({ message: 'Cistella buidada correctament' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
