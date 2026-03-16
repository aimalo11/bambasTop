const Cistella = require('../models/Cistella');
const Orden = require('../models/orden');

// Obtener carrito (o crear uno si no existe)
exports.getCart = async (req, res) => {
    try {
        let cart = await Cistella.findOne().sort({ updatedAt: -1 });
        if (!cart) {
            cart = new Cistella({ items: [] });
            await cart.save();
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Añadir item
exports.addToCart = async (req, res) => {
    const { productoId, nombre, precio } = req.body;
    try {
        let cart = await Cistella.findOne().sort({ updatedAt: -1 });
        if (!cart) {
            cart = new Cistella({ items: [] });
        }
        cart.items.push({ productoId, nombre, precio });
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar item por ID
exports.removeFromCart = async (req, res) => {
    try {
        const { id } = req.params;
        let cart = await Cistella.findOne().sort({ updatedAt: -1 });
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

        const { name, email, address, cardNumber, cart } = req.body;

        const total = cart.reduce((sum, item) => sum + Number(item.precio), 0);

        const orden = new Orden({
            name,
            email,
            address,
            cardNumber,
            items: cart,
            total
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
