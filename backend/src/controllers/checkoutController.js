const Stripe = require('stripe');
const Order = require('../models/orden');
const Product = require('../models/Product');
const { sanitizeProducts } = require('./orderController');

const buildFrontendUrl = () => process.env.FRONTEND_URL || 'http://localhost:5173';

exports.createSession = async (req, res) => {
    try {
        if (!process.env.STRIPE_SECRET_KEY) {
            return res.status(500).json({ message: 'Falta STRIPE_SECRET_KEY al backend' });
        }

        const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
        const userId = req.user.id;
        const { products, shipping, orderId } = req.body;

        if (!shipping || !shipping.name || !shipping.email || !shipping.address) {
            return res.status(400).json({ message: 'Dades d\'enviament incompletes' });
        }

        let order;
        let validatedProducts;
        let total;

        if (orderId) {
            order = await Order.findOne({ _id: orderId, user: userId, status: 'pending' });
            if (!order) {
                return res.status(404).json({ message: 'Comanda pending no trobada' });
            }
            validatedProducts = order.products;
            total = order.total;
        } else {
            const sanitized = await sanitizeProducts(products);
            if (sanitized.error) {
                return res.status(400).json({ message: sanitized.error });
            }
            validatedProducts = sanitized.validatedProducts;
            total = sanitized.total;

            order = await Order.create({
                user: userId,
                shipping,
                products: validatedProducts,
                total,
                status: 'pending'
            });
        }

        const frontendUrl = buildFrontendUrl();
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: validatedProducts.map((p) => ({
                price_data: {
                    currency: 'eur',
                    product_data: { name: p.name },
                    unit_amount: Math.round(p.price * 100)
                },
                quantity: p.quantity
            })),
            mode: 'payment',
            success_url: `${frontendUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${frontendUrl}/checkout/cancel`,
            metadata: {
                orderId: String(order._id),
                userId: String(userId)
            }
        });

        order.stripeSessionId = session.id;
        await order.save();

        return res.json({ sessionId: session.id, orderId: order._id });
    } catch (error) {
        return res.status(400).json({ message: 'Error en el pagament', error: error.message });
    }
};

exports.webhook = async (req, res) => {
    try {
        if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
            return res.status(500).send('Missing Stripe configuration');
        }

        const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
        const signature = req.headers['stripe-signature'];

        let event;
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (error) {
            return res.status(400).send(`Webhook Error: ${error.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const order = await Order.findOne({ stripeSessionId: session.id });
            if (order) {
                order.status = 'paid';
                order.stripePaymentIntentId = session.payment_intent;
                await order.save();

                for (const item of order.products) {
                    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
                }
            }
        }

        if (event.type === 'checkout.session.expired') {
            const session = event.data.object;
            await Order.findOneAndUpdate({ stripeSessionId: session.id }, { status: 'cancelled' });
        }

        return res.json({ received: true });
    } catch (error) {
        return res.status(500).json({ message: 'Webhook processing error', error: error.message });
    }
};
