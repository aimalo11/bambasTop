const mongoose = require('mongoose');

const resenyaSchema = new mongoose.Schema({
  usuari: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuari',
    required: [true, 'L\'usuari és obligatori']
  },
  producte: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producte',
    required: [true, 'El producte és obligatori']
  },
  puntuacio: {
    type: Number,
    required: [true, 'La puntuació és obligatòria'],
    min: [1, 'La puntuació mínima és 1'],
    max: [5, 'La puntuació màxima és 5']
  },
  comentari: {
    type: String,
    maxlength: [500, 'El comentari no pot tenir més de 500 caràcters']
  }
}, {
  timestamps: true
});

// Índex compost per evitar resenyes duplicades
resenyaSchema.index({ usuari: 1, producte: 1 }, { unique: true });

// Índex per a cerques per producte i puntuació
resenyaSchema.index({ producte: 1 });
resenyaSchema.index({ puntuacio: 1 });

module.exports = mongoose.model('Resenya', resenyaSchema);