const mongoose = require('mongoose');

const producteSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'El nom del producte és obligatori'],
    trim: true,
    maxlength: [100, 'El nom no pot tenir més de 100 caràcters']
  },
  descripcio: {
    type: String,
    required: [true, 'La descripció és obligatòria'],
    maxlength: [1000, 'La descripció no pot tenir més de 1000 caràcters']
  },
  preu: {
    type: Number,
    required: [true, 'El preu és obligatori'],
    min: [0, 'El preu no pot ser negatiu']
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Categoria',
    required: [true, 'La categoria és obligatòria']
  },
  stock: {
    type: Number,
    required: [true, 'L\'stock és obligatori'],
    min: [0, 'L\'stock no pot ser negatiu'],
    default: 0
  },
  actiu: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Índex per a cerques per nom, categoria i preu
producteSchema.index({ nom: 'text', descripcio: 'text' });
producteSchema.index({ categoria: 1 });
producteSchema.index({ preu: 1 });
producteSchema.index({ actiu: 1 });

module.exports = mongoose.model('Producte', producteSchema);