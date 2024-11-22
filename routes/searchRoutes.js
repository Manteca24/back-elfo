const express = require('express');
const router = express.Router();
const { searchProducts, searchCategories, searchFilters } = require('../controllers/searchController');

router.get('/products', searchProducts); // Buscar productos
router.get('/categories', searchCategories); // Buscar categorías
router.get('/filters', searchFilters); // Buscar filtros

module.exports = router;