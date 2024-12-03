const express = require('express');
const router = express.Router();
const { createFilter, getFilters, addTagsToFilter,getFiltersGroupedByCategory, getFilterById, deleteTagFromFilter } = require('../controllers/filterController');

router.post('/', createFilter); // Crear un filtro
router.get('/', getFilters); // Obtener todos los filtros
router.put('/:filterId/tags', addTagsToFilter); // Añadir tags a un filtro
router.get('/grouped', getFiltersGroupedByCategory);
router.get('/:filterId', getFilterById)
router.delete('/:filterId/tags', deleteTagFromFilter)
module.exports = router;