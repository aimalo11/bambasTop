const mongoose = require('mongoose');

const imatgeProducteSchema = new mongoose.Schema({
  producte: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producte',
    required: [true, 'El producte és obligatori']
  },
  url_imatge: {
    type: String,
    required: [true, 'La URL de la imatge és obligatòria']
  },
  ordre: {
    type: Number,
    default: 0,
    min: [0, 'L\'ordre no pot ser negatiu']
  },
  es_principal: {
    type: Boolean,
    default: false
  },
  text_alternatiu: {
    type: String,
    maxlength: [125, 'El text alternatiu no pot tenir més de 125 caràcters']
  }
}, {
  timestamps: true
});

// Índex per a cerques per producte i ordre
imatgeProducteSchema.index({ producte: 1, ordre: 1 });
imatgeProducteSchema.index({ es_principal: 1 });

// Assegurar que només hi hagi una imatge principal per producte
imatgeProducteSchema.index({ 
  producte: 1, 
  es_principal: 1 
}, { 
  unique: true, 
  partialFilterExpression: { es_principal: true } 
});

module.exports = mongoose.model('ImatgeProducte', imatgeProducteSchema);