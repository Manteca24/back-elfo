const multer = require('multer');
const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage'); // Importación correcta
const Grid = require('gridfs-stream')
const { dbConnection, db } = require('./db'); // Conexión exportada desde db.js

let gfs;

dbConnection().then(() => {
//   const conn = mongoose.connection;
  gfs = Grid(db, mongoose.mongo);  // Pasamos la conexión y mongo al constructor de Grid
  gfs.collection('uploads');  // Aseguramos que la colección 'uploads' sea usada

  // Aquí es donde ya puedes hacer operaciones de GridFS
  db.once('open', () => {
    console.log('Conexión a MongoDB abierta y lista para usar GridFS');
  });
}).catch((err) => {
  console.error('Error al conectar a MongoDB', err);
});

// Configuración de multer-gridfs-storage
const storage = new GridFsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = `${Date.now()}-${file.originalname}`;
      const fileInfo = {
        filename: filename,
        bucketName: 'uploads', // El nombre de la colección en GridFS
      };
      resolve(fileInfo);
    });
  },
});

const upload = multer({ storage });

module.exports = upload;