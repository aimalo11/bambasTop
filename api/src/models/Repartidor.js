const mongoose = require('mongoose');

const repartidorSchema = new mongoose.Schema({
  usuari: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuari',
    required: [true, 'L\'usuari és obligatori']
  },
  nom_repartidor: {
    type: String,
    required: [true, 'El nom del repartidor és obligatori'],
    trim: true
  },
  estat: {
    type: String,
    enum: ['recollit', 'en_cami', 'lliurat', 'incidencia'],
    default: 'recollit'
  },
  data_estimada_entrega: {
    type: Date,
    required: [true, 'La data estimada d\'entrega és obligatòria']
  },
  data_entrega_real: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [500, 'Les notes no poden tenir més de 500 caràcters']
  },
  numero_seguiment: {
    type: String,
    unique: true,
    sparse: true
  }
}, {
  timestamps: true
});

// Índex per a cerques per repartidor, estat i dates
repartidorSchema.index({ nom_repartidor: 1 });
repartidorSchema.index({ estat: 1 });
repartidorSchema.index({ data_estimada_entrega: 1 });
repartidorSchema.index({ numero_seguiment: 1 });

module.exports = mongoose.model('Repartidor', repartidorSchema);