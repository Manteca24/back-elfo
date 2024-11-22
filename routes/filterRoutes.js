const express = require('express');
const router = express.Router();
const { createFilter, getFilters, addTagsToFilter } = require('../controllers/filterController');

router.post('/', createFilter); // Crear un filtro
router.get('/', getFilters); // Obtener todos los filtros
router.put('/:filterId/tags', addTagsToFilter); // Añadir tags a un filtro


module.exports = router;