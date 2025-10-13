const mongoose = require('mongoose');

const adrecaSchema = new mongoose.Schema({
  usuari: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuari',
    required: [true, 'L\'usuari és obligatori']
  },
  nom: {
    type: String,
    required: [true, 'El nom de l\'adreça és obligatori'],
    trim: true,
    maxlength: [50, 'El nom no pot tenir més de 50 caràcters']
  },
  carrer: {
    type: String,
    required: [true, 'El carrer és obligatori'],
    trim: true
  },
  numero: {
    type: String,
    required: [true, 'El número és obligatori']
  },
  pis: {
    type: String
  },
  porta: {
    type: String
  },
  ciutat: {
    type: String,
    required: [true, 'La ciutat és obligatòria'],
    trim: true
  },
  codi_postal: {
    type: String,
    required: [true, 'El codi postal és obligatori'],
    match: [/^\d{5}$/, 'El codi postal ha de tenir 5 dígits']
  },
  provincia: {
    type: String,
    required: [true, 'La província és obligatòria'],
    trim: true
  },
  pais: {
    type: String,
    required: [true, 'El país és obligatori'],
    default: 'Espanya'
  },
  es_principal: {
    type: Boolean,
    default: false
  },
  telefon: {
    type: String,
    match: [/^[+]?[\d\s\-()]+$/, 'Si us plau, introdueix un telèfon vàlid']
  }
}, {
  timestamps: true
});

// Índex per a cerques per usuari i adreça principal
adrecaSchema.index({ usuari: 1 });
adrecaSchema.index({ usuari: 1, es_principal: 1 });

// Assegurar que només hi hagi una adreça principal per usuari
adrecaSchema.index({ 
  usuari: 1, 
  es_principal: 1 
}, { 
  unique: true, 
  partialFilterExpression: { es_principal: true } 
});

module.exports = mongoose.model('Adreça', adrecaSchema);