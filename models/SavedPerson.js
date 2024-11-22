const mongoose = require('mongoose');

const savedPersonSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Usuario propietario
  name: { type: String, required: true }, // Nombre de la persona guardada
  filters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Filter' }], // Filtros asociados
  tags: { 
    type: [String], 
    default: [] // Lista de tags asociados a la persona
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SavedPerson', savedPersonSchema, 'savedPeople');