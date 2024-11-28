// crear app express
const express = require("express");
const app = express();

const cors = require('cors');
app.use(cors());

//bd
const {dbConnection} = require('./config/db');
require('dotenv').config();
dbConnection(); // conectar a la base de datos

// firebase
const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// crear carpeta "uploads"
const fs = require('fs');
const path = require ('path');

const uploadsDir = path.join(__dirname, 'uploads'); // ruta absoluta 

if (!fs.existsSync(uploadsDir)) { // solo la crea si la carpeta no existe
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Carpeta uploads creada');
}

// Middlewares
app.use(express.json()); // para procesar JSON
app.use(express.urlencoded({ extended: true })); // para manejar datos de formularios (body)
// // sin estas línea no lee el token
// const cookieParser = require("cookie-parser"); 
// app.use(cookieParser());

/*---------------------*/

const authRouter = require('./routes/authRoutes');
app.use('/auth', authRouter);  // rutas de autenticación

const productRouter = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const commentRoutes = require('./routes/commentRoutes');
const filterRoutes = require('./routes/filterRoutes');
const tagRoutes = require('./routes/tagRoutes');
const searchRoutes = require('./routes/searchRoutes');
const imageRoutes = require('./routes/imageRoutes')

app.use('/products', productRouter);  
app.use('/users', userRoutes);    
app.use('/categories', categoryRoutes); 
app.use('/comments', commentRoutes);  
app.use('/filters', filterRoutes) 
app.use('/tags', tagRoutes);
app.use('/search', searchRoutes);  

// para las imágenes
app.use('/uploads', express.static('uploads'));
app.use('/images', imageRoutes);

app.get("/", (req, res) => {
    res.redirect('/products'); 
  });



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
