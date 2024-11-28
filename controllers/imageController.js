const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

// Configurar GridFS para leer archivos
const {dbConnection} = require('../config/db');
let gfs;

dbConnection().then((db) => {
  gfs = Grid(db, mongoose.mongo); // Inicializar GridFS
  gfs.collection('uploads'); // Seleccionar el bucket donde se guardarán los archivos
});

const uploadImage = (req, res) => {
  // El middleware de multer se encargará de subir el archivo a GridFS
  // y se retornará la URL del archivo
  if (!req.file) {
    return res.status(400).json({ message: 'No se subió ninguna imagen' });
  }

  const imageUrl = `${req.protocol}://${req.get('host')}/files/${req.file.filename}`;
  return res.status(200).json({ imageUrl });
};

module.exports = { uploadImage };