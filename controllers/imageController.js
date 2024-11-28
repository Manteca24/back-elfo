const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Usar una carpeta diferente en producción si es necesario
    const uploadPath = 'uploadsDir/' // 'uploads/'
    cb(null, path.join(__dirname, uploadPath));  //
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para cada archivo
  }
});

// Middleware de multer para subir una sola imagen
const upload = multer({ storage }).single('image');

// Controlador para manejar la subida de imágenes
const uploadImage = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error al subir la imagen.', error: err });
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No se subió ninguna imagen.' });
    }

    // Devolver la URL de la imagen subida
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
  });
};

module.exports = { uploadImage };