const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String, required: true }, // "tecnología", "ropa".. FILTROS PENDIENTE
  ageRange: { type: String }, // acceder de un select? edad exacta? PENDIENTE
  tags: { type: [String], default: [] }, // "divertido", "educativo" PENDIENTE
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Product", productSchema, 'products');