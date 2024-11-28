const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/imageController');

// Ruta para subir imágenes
router.post('/upload', uploadImage);

module.exports = router;