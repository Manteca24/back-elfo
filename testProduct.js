const mongoose = require("mongoose");
const Product = require("./models/Product"); 
require('dotenv').config();

// Conectarse a la base de datos
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Conexión a MongoDB exitosa"))
  .catch((err) => console.error("Error al conectar a MongoDB:", err));

// Prueba: Crear un nuevo producto
const testProduct = async () => {
  try {
    const newProduct = new Product({
      name: "Producto de Prueba",
      description: "Este es un producto de prueba",
      price: 10.99,
      category: "Prueba",
      ageRange: "Todas las edades",
      tags: ["test", "demo"],
    });

    const savedProduct = await newProduct.save();
    console.log("Producto guardado correctamente:", savedProduct);

    // Cerrar la conexión después de la prueba
    mongoose.connection.close();
  } catch (err) {
    console.error("Error al guardar el producto:", err);
  }
};

// Ejecuta la prueba
testProduct();