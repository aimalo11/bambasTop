const mongoose = require('mongoose');

const pagamentSchema = new mongoose.Schema({
  usuari: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuari',
    required: [true, 'L\'usuari és obligatori']
  },
  metode_pagament: {
    type: String,
    enum: ['targeta', 'paypal', 'transferencia'],
    required: [true, 'El mètode de pagament és obligatori']
  },
  estat: {
    type: String,
    enum: ['pendent', 'completat', 'fallat', 'reemborsat'],
    default: 'pendent'
  },
  quantitat: {
    type: Number,
    required: [true, 'La quantitat és obligatòria'],
    min: [0, 'La quantitat no pot ser negativa']
  },
  referencia: {
    type: String,
    unique: true
  },
  dades_pagament: {
    // Camps específics segons el mètode de pagament
    numero_targeta: String,
    caducitat: String,
    cvv: String,
    email_paypal: String,
    compte_bancari: String
  }
}, {
  timestamps: true
});

// Índex per a cerques per usuari, estat i referència
pagamentSchema.index({ usuari: 1 });
pagamentSchema.index({ estat: 1 });
pagamentSchema.index({ referencia: 1 });

module.exports = mongoose.model('Pagament', pagamentSchema);