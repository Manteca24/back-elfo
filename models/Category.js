const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  filters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Filter' }], // Relación con filtros
});

categorySchema.index({ name: 'text' });

module.exports = mongoose.model('Category', categorySchema, 'categories');