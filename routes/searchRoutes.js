const express = require('express');
const router = express.Router();
const { searchProducts, searchCategories, searchFilters, searchByFilters } = require('../controllers/searchController');

router.get('/products', searchProducts); // Buscar productos
router.get('/categories', searchCategories); // Buscar categorías
router.get('/filters', searchFilters); // Buscar filtros
router.get('/person/:personId', searchByFilters) // Buscar por persona

module.exports = router;