const mongoose = require('mongoose');

const filterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }], // Relación con categoría
  tags: { type: [String], default: [] }, // Tags sugeridos para este filtro
});

filterSchema.index({ name: 'text', tags: 'text' });

module.exports = mongoose.model('Filter', filterSchema, 'filters');