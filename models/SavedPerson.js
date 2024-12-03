const mongoose = require('mongoose');

const savedPersonSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Usuario propietario
  name: { type: String, required: true }, // Nombre de la persona guardada
  filters: [
    {
      filterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Filter', required: true }, // Filtro asociado
      tags: { type: [String], default: [] } // Tags asociados a este filtro
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SavedPerson', savedPersonSchema, 'savedPeople');