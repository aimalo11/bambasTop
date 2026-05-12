const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: [true, 'El nom de la categoria és obligatori'],
    unique: true,
    trim: true,
    maxlength: [50, 'El nom no pot tenir més de 50 caràcters']
  },
  descripcio: {
    type: String,
    maxlength: [200, 'La descripció no pot tenir més de 200 caràcters']
  }
}, {
  timestamps: true
});

// Índex per a cerques per nom
categoriaSchema.index({ nom: 1 });

module.exports = mongoose.model('Categoria', categoriaSchema);