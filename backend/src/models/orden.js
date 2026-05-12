const mongoose = require('mongoose');

const ordenSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuari',
        required: true
    },
    shipping: {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true },
        address: { type: String, required: true, trim: true }
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: { type: String, required: true },
            price: { type: Number, required: true, min: 0 },
            quantity: { type: Number, required: true, min: 1 },
            subtotal: { type: Number, required: true, min: 0 }
        }
    ],
    total: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'cancelled', 'failed'],
        default: 'pending'
    },
    stripeSessionId: {
        type: String,
        index: true
    },
    stripePaymentIntentId: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Orden', ordenSchema);