const mongoose = require('mongoose');

const usuariSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'El nom és obligatori'],
    trim: true,
    maxlength: [50, 'El nom no pot tenir més de 50 caràcters']
  },
  cognom: {
    type: String,
    required: [true, 'El cognom és obligatori'],
    trim: true,
    maxlength: [100, 'El cognom no pot tenir més de 100 caràcters']
  },
  email: {
    type: String,
    required: [true, 'L\'email és obligatori'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Si us plau, introdueix un email vàlid']
  },
  password: {
    type: String,
    required: [true, 'La contrasenya és obligatòria'],
    minlength: [6, 'La contrasenya ha de tenir almenys 6 caràcters']
  },
  saldo: {
    type: Number,
    default: 0,
    min: [0, 'El saldo no pot ser negatiu']
  },
  role: {
    type: String,
    enum: ['usuari', 'admin'],
    default: 'usuari'
  }
}, {
  timestamps: true
});

// Índex per a cerques per email i nom
usuariSchema.index({ email: 1 });     //busca per email
usuariSchema.index({ nom: 1, cognom: 1 });   //busca per el nom complet 

module.exports = mongoose.model('Usuari', usuariSchema);