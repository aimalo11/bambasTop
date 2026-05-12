const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nom és obligatori'],
    minlength: [3, 'El nom ha de tenir almenys 3 caràcters'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'El preu és obligatori'],
    min: [0, 'El preu no pot ser negatiu']
  },
  description: {
    type: String,
    maxlength: [1000, 'La descripció no pot superar els 1000 caràcters']
  },
  image: {
    type: String,
    required: false
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'L\'estoc no pot ser negatiu']
  },
  category: {
    type: String,
    enum: {
      values: ['Running', 'Casual', 'Sport', 'Formal', 'Other'],
      message: '{VALUE} no és una categoria vàlida'
    },
    default: 'Other'
  },
  sku: {
    type: String,
    match: [/^[A-Z0-9]{3}-[A-Z0-9]{3}$/, 'El format del SKU ha de ser XXX-XXX'],
    unique: true,
    sparse: true // Permet valors nuls si no tots els productes tenen SKU encara
  }
});

module.exports = mongoose.model('Product', productSchema);

