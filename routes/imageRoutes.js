const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/imageController');
const upload = require('../config/gridfsStorage'); // Middleware de Multer

// Ruta para subir una imagen
router.post('/upload', upload.single('file'), uploadImage); // Usamos upload.single('file') en lugar de solo 'upload'

// Ruta para obtener una imagen de GridFS
router.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ message: 'Archivo no encontrado' });
    }

    const readStream = gfs.createReadStream(file.filename);
    readStream.pipe(res);
  });
});

module.exports = router;