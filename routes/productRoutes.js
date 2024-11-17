const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// Rutas para productos
router.get("/", getAllProducts); // Obtener todos los productos
router.get("/:id", getProductById); // Obtener un producto por ID
router.post("/", createProduct); // Crear un nuevo producto
router.put("/:id", updateProduct); // Actualizar un producto por ID
router.delete("/:id", deleteProduct); // Eliminar un producto por ID

module.exports = router;