const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  addFilterToCategory,
} = require("../controllers/categoryController");


router.post("/", createCategory); // Crear una nueva categoría ( SOLO ADMIN )
router.get("/", getCategories); // Obtener todas las categorías 
router.get("/:categoryId", getCategoryById); // Obtener una categoría por su ID
router.put("/:categoryId", updateCategory); // Actualizar una categoría por su ID ( SOLO ADMIN )
router.delete("/:categoryId", deleteCategory); // Eliminar una categoría por su ID ( SOLO ADMIN )
router.post("/:categoryId/filters", addFilterToCategory); // Añadir un filtro a una categoría ( SOLO ADMIN )

module.exports = router;