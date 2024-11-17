// crear app express
const express = require("express");
const app = express();

//bd
const {dbConnection} = require('./config/db');
require('dotenv').config();

// // sin esta línea no lee el token
// const cookieParser = require("cookie-parser"); 

// conectar a la base de datos
dbConnection();

// Middlewares
app.use(express.json()); // para procesar JSON
app.use(express.urlencoded({ extended: true })); // para manejar datos de formularios (body)
// app.use(cookieParser()); // sin esta línea no lee el token

/*---------------------*/


const productRouter = require('./routes/productRoutes');
app.use('/products', productRouter);  // Prefijo para las rutas de productos
// const authRouter = require('./routes/authRoutes');
// app.use('/auth', authRouter);  // Prefijo para las rutas de autenticación


app.get("/", (req, res) => {
    // res.send("elfo backend is working! 🎉");
    res.redirect('/products'); 
  });


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});