const upload = require('../config/gridfsStorage'); // Importa el middleware de multer con gridfs-storage

const uploadImage = (req, res) => {
  if (req.file) {
    // Si el archivo se ha subido correctamente, puedes devolver el ID de GridFS
    res.status(200).json({
      imageUrl: `/uploads/${req.file.id}`,  // Utiliza el ID del archivo en GridFS
    });
  } else {
    res.status(400).json({ message: 'No se ha cargado el archivo' });
  }
};

module.exports = {
  uploadImage,
};