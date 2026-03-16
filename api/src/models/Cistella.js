const mongoose = require('mongoose');

const cistellaSchema = new mongoose.Schema({
    items: [{
        productoId: { type: String, required: true },
        nombre: { type: String, required: true },
        precio: { type: Number, required: true }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Cistella', cistellaSchema);
