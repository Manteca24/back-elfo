const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  // en cuanto al producto...
  name: { type: String, required: true },
  description: { type: String }, 
  tags: { type: [String], default: [] },
  type: { type: String, enum: ['diy', 'experiencia', 'material'], required: true},
  price: { type: Number, required: true,  min: [0, 'El precio debe ser un valor positivo'] },
  purchaseLocation: {
    ubication: { type: String, enum: ['diy', 'online', 'cadena', 'local'], required: true},
    storeName: { type: String, required: false },
    url: { type: String, required: false }
  },
  image: { type: String, required: true }, 
  // en cuanto a la persona a la que se lo regalaste...
  relation: {type: String, enum: ["madre", "padre", "hermana", "hermano", "hija", "hijo", "abuela", "abuelo", "tía", "tío", "prima", "primo", "amiga", "amigo", "sobrina", "sobrino", "pareja", "novia", "novio", "esposo", "esposa", "compañero de trabajo", "compañera de trabajo", "jefe", "jefa", "vecino", "profesor", "alumno", "alumna", "profesora", "vecina", "cliente", "mascota"], required: true },
  categories: [
    {
      category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
      filters: [
        {
          filter: { type: mongoose.Schema.Types.ObjectId, ref: 'Filter'},
          selectedTags: [{ type: String }]  // Los tags seleccionados por el usuario
        }
      ]
    }
  ],
  gender: { type: String, enum: ['masculino', 'femenino', 'no-relevante'], required: true }, // no-relevante significa todo
  ageRange: { type: String, enum: ['bebé', 'niño', 'adolescente', 'adulto', 'anciano'], required: true }, 
  // tú:
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Relación con el usuario que creó el producto
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], 
  commentsCount: { type: Number, default: 0 }, // el nº de comentarios del producto para "los más populares" puede servir
  createdAt: { type: Date, default: Date.now },
});

productSchema.index(
  { name: 'text', description: 'text', tags: 'text' },
  { weights: { name: 10, description: 8, relation: 5, tags: 1 } } // Prioriza el nombre
);

// // Si la compra es online, es obligatorio rellenar alguno de los campos "URL" o "StoreName"
// productSchema.path('purchaseLocation.ubication').validate(function(value) {
//   // Si la ubicación de compra es 'online', entonces `url` debe estar presente
//   if (value.ubication === 'online') {
//     if (!value.url && !value.storeName) {
//       return false;  // Si ninguno de los dos está presente, no es válido
//     }
//   }
//   // Si la ubicación de compra no es 'online', no es necesario verificar `url` o `storeName`
//   return true;
// }, 'Se requiere que uno de los dos campos (storeName o url) esté presente cuando la ubicación es "online".');

// para ir contando los comentarios
productSchema.pre('save', function(next) {
  this.commentsCount = this.comments.length;
  next();
});

module.exports = mongoose.model("Product", productSchema, 'products');