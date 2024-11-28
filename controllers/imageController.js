const Grid = require('gridfs-stream');
const mongoose = require('mongoose');
const { db } = require('../config/db');  // Importa la conexión de la base de datos

// Inicializar GridFS+
console.log(db)
const gfs = Grid(db, mongoose.mongo);
gfs.collection('uploads'); // Asegúrate de que "uploads" sea el nombre de tu colección

const uploadImage = (req, res) => {
  // Aquí iría tu lógica para guardar la imagen en GridFS
};

module.exports = {
  uploadImage,
};