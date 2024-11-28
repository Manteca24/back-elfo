const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const multer = require('multer');
const multerGridFsStorage = require('multer-gridfs-storage');

// Crear el almacenamiento con Multer para usar GridFS
const storage = new multerGridFsStorage({
  url: process.env.MONGO_URI, // URI de MongoDB
  file: (req, file) => {
    return {
      bucketName: 'uploads', // Nombre del bucket donde almacenar los archivos
      filename: `${Date.now()}-${file.originalname}`, // El nombre del archivo
    };
  },
});

const upload = multer({ storage }).single('image');

module.exports = upload;