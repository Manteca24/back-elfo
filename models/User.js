const mongoose = require("mongoose");
const Product = require("./Product").schema;

const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  fullName: { 
    type: String, 
    required: true 
  },
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    minlength: 3 
  },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: Product.obj.gender, // Hereda las opciones de género de Product
  birthday: { type: Date },
  profilePicture: { type: String, default: null },
  bio: { type: String, maxlength: 280 },
  tags: Product.obj.tags, // Hereda las etiquetas

  favoriteProducts: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Producto favorito
      type: { type: String, enum: ['self', 'savedPerson'], default: 'self' }, // Indica si es para uno mismo o para otra persona
      relatedPerson: { type: mongoose.Schema.Types.ObjectId, ref: 'SavedPerson' }, // Id de la persona para la que es el favorito
    }
  ],
  
  savedPeople: [
    {
      name: { type: String}, // Nombre de la persona guardada
      filters: { type: mongoose.Schema.Types.ObjectId, ref: 'Filter' }, // Filtros asociados a esta persona
    }
  ],

  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt: { type: Date, default: Date.now }, // cuándo se creó el usuario
  updatedAt: { type: Date, default: Date.now }, // última actualización
  isAdmin: { type: Boolean, default: false }, // Si es administrador
  status: { type: String, enum: ['active', 'inactive', 'banned'], default: 'active' }
});


// !!!!!!!!!!!!!!!!! Middleware para actualizar la fecha de modificación
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("User", userSchema, 'users');