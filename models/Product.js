const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  categories: [
    {
      category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
      filters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Filter' }]
    }
  ],
  gender: { type: String, enum: ['masculino', 'femenino', 'no relevante'], required: true }, // no-relevante significa todo
  ageRange: { type: String, enum: ['bebé', 'niño', 'adolescente', 'adulto', 'anciano'], required: true }, 
  tags: { type: [String], default: [] }, // "divertido", "educativo" PENDIENTE
  image: { type: String, required: true }, 
  purchaseLocation: {
    storeName: { type: String, required: false },
    url: { type: String, required: false }
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Relación con el usuario que creó el producto
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], 
  commentsCount: { type: Number, default: 0 }, // el nº de comentarios del producto
  createdAt: { type: Date, default: Date.now },
});

productSchema.index(
  { name: 'text', description: 'text', tags: 'text' },
  { weights: { name: 10, description: 5, tags: 1 } } // Prioriza el nombre
);

module.exports = mongoose.model("Product", productSchema, 'products');