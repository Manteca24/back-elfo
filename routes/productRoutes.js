const express = require("express");
const {
  getAllProducts,
  getProductById,
  createNewProduct,
  updateProduct,
  deleteProduct,
  addCategoryToProduct
} = require("../controllers/productController");
const verifyToken = require("../middlewares/auth");

const router = express.Router();

router.get("/", getAllProducts); // Obtener todos los productos
// router.get("/dashboard", verifyToken, getAllProducts); // Obtener todos los productos
router.get("/:id", getProductById); // Obtener un producto por ID
router.post("/", createNewProduct); // Crear un nuevo producto (SOLO REGISTRADOS)
router.put("/:id", updateProduct); // Actualizar un producto por ID (SOLO CREADOR)
router.delete("/:id", deleteProduct); // Eliminar un producto por ID (SOLO CREADOR Y ADMIN)
router.post("/:productId/addCategory/:categoryId", addCategoryToProduct) // Añadir categoría existente a producto existente (SOLO ADMIN)
module.exports = router;