const mongoose = require('mongoose');

const carretItemSchema = new mongoose.Schema({
  producte: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producte',
    required: true
  },
  quantitat: {
    type: Number,
    required: true,
    min: [1, 'La quantitat ha de ser com a mínim 1'],
    default: 1
  },
  preu: {
    type: Number,
    required: true,
    min: [0, 'El preu no pot ser negatiu']
  }
});

const carretSchema = new mongoose.Schema({
  usuari: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuari',
    required: [true, 'L\'usuari és obligatori'],
    unique: true // Un carret per usuari
  },
  items: [carretItemSchema],
  total: {
    type: Number,
    default: 0,
    min: [0, 'El total no pot ser negatiu']
  }
}, {
  timestamps: true
});

// Índex per a cerques per usuari
carretSchema.index({ usuari: 1 });

// Middleware per calcular el total abans de desar
carretSchema.pre('save', function(next) {
  this.total = this.items.reduce((total, item) => {
    return total + (item.quantitat * item.preu);
  }, 0);
  next();
});

module.exports = mongoose.model('Carret', carretSchema);