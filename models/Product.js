const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true }, // "tecnología", "ropa", "juguetes".. FILTROS PENDIENTE
  genre: { type: String, enum: ['masculino', 'femenino', 'no relevante'], required: false }, // no-relevante significa todo
  ageRange: { type: String, enum: ['bebé', 'niño', 'adolescente', 'adulto', 'anciano'], required: true }, 
  tags: { type: [String], default: [] }, // "divertido", "educativo" PENDIENTE
  image: { type: mongoose.Schema.Types.Mixed, required: false }, // pendiente FORMATO
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema, 'products');