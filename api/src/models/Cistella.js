const mongoose = require('mongoose');

const cistellaSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuari',
        required: true,
        unique: true
    },
    items: [{
        productoId: { type: String, required: true },
        nombre: { type: String, required: true },
        precio: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1, default: 1 }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Cistella', cistellaSchema);
