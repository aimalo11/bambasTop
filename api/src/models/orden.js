const mongoose = require('mongoose');

const ordenSchema = new mongoose.Schema({
    name: String,
    email: String,
    address: String,
    cardNumber: String,
    items: Array,
    total: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Orden', ordenSchema);