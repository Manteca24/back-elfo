const mongoose = require('mongoose');
const Product = require('./Product').schema;

const savedPersonSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Usuario propietario
  name: { type: String, required: true }, // Nombre de la persona guardada
  gender: Product.obj.gender, // Hereda las opciones de género del esquema Product
  ageRange: Product.obj.ageRange, // Hereda ageRange del esquema Product
  relation: {type: String, enum: ["madre", "padre", "hermana", "hermano", "hija", "hijo", "abuela", "abuelo", "tía", "tío", "prima", "primo", "amiga", "amigo", "sobrina", "sobrino", "pareja", "novia", "novio", "esposo", "esposa", "compañero de trabajo", "compañera de trabajo", "jefe", "jefa", "vecino", "profesor", "alumno", "alumna", "profesora", "vecina", "cliente", "mascota"], required: true },
  filters: [
    {
      filterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Filter', required: true }, // Filtro asociado
      tags: [{ type: String }]
    }
  ],
  createdAt: { type: Date, default: Date.now }, // Fecha de creación
});

module.exports = mongoose.model('SavedPerson', savedPersonSchema, 'savedPeople');