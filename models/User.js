const mongoose = require("mongoose");
const Product = require("./Product").schema;

const userSchema = new mongoose.Schema({
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
  genre: Product.obj.genre, // Hereda las opciones de género de Product
  birthday: { type: Date },
  profilePicture: { type: String, default: null },
  bio: { type: String, maxlength: 280 },
  tags: Product.obj.tags, // Hereda las etiquetas
  favoriteProducts: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Product' // Referencia a la colección Product para luego usar .populate
  }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt: { type: Date, default: Date.now }, // cuando se crea el usuario
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