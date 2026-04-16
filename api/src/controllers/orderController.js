const Product = require('../models/Product');
const Order = require('../models/orden');

const sanitizeProducts = async (productsFromClient) => {
    if (!Array.isArray(productsFromClient) || productsFromClient.length === 0) {
        return { error: 'La cistella no pot estar buida' };
    }

    const validatedProducts = [];
    for (const item of productsFromClient) {
        const product = await Product.findById(item.productoId || item.productId || item.product);
        if (!product) {
            return { error: `Producte inexistent: ${item.productoId || item.productId || 'desconegut'}` };
        }

        const quantity = Number(item.quantity || 1);
        if (!Number.isFinite(quantity) || quantity < 1) {
            return { error: `Quantitat invàlida per al producte ${product.name}` };
        }

        if (product.stock < quantity) {
            return { error: `Stock insuficient per al producte ${product.name}` };
        }

        const price = Number(product.price);
        validatedProducts.push({
            product: product._id,
            name: product.name,
            price,
            quantity,
            subtotal: Number((price * quantity).toFixed(2))
        });
    }

    const total = Number(validatedProducts.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));
    return { validatedProducts, total };
};

exports.createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { products, shipping } = req.body;

        if (!shipping || !shipping.name || !shipping.email || !shipping.address) {
            return res.status(400).json({ message: 'Dades d\'enviament incompletes' });
        }

        const { validatedProducts, total, error } = await sanitizeProducts(products);
        if (error) {
            return res.status(400).json({ message: error });
        }

        const order = await Order.create({
            user: userId,
            shipping: {
                name: shipping.name,
                email: shipping.email,
                address: shipping.address
            },
            products: validatedProducts,
            total,
            status: 'pending'
        });

        return res.status(201).json({
            message: 'Comanda creada correctament',
            order
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error creant la comanda', error: error.message });
    }
};

exports.sanitizeProducts = sanitizeProducts;
