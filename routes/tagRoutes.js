const express = require('express');
const router = express.Router();
const { getRecommendedTags } = require('../controllers/tagController');


router.get('/recommended/:filterId', getRecommendedTags); // obtener tags recomendados por filtro

module.exports = router;