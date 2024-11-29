const express = require('express');
const router = express.Router();
const { uploadImage } = require('../controllers/imageController');
const upload = require('../config/gridfsStorage'); // Middleware de Multer

// Ruta para subir una imagen
router.post('/upload', upload.single('image'), async (req, res) => {
    res.json({ fileUrl: `/uploads/${req.file.filename}` });
  });


const { GridFSBucket } = require('mongodb');

// Recuperar la imagen por su filename
router.get('/uploads/:filename', async (req, res) => {
  const db = await connect();
  const bucket = new GridFSBucket(db, { bucketName: 'uploads' });

  const downloadStream = bucket.openDownloadStreamByName(req.params.filename);
  downloadStream.pipe(res);
});

module.exports = router;