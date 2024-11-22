// crear app express
const express = require("express");
const app = express();

//bd
const {dbConnection} = require('./config/db');
require('dotenv').config();
dbConnection(); // conectar a la base de datos



// Middlewares
app.use(express.json()); // para procesar JSON
app.use(express.urlencoded({ extended: true })); // para manejar datos de formularios (body)
// // sin estas línea no lee el token
// const cookieParser = require("cookie-parser"); 
// app.use(cookieParser());

/*---------------------*/

// const authRouter = require('./routes/authRoutes');
// app.use('/auth', authRouter);  // rutas de autenticación

const productRouter = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const commentRoutes = require('./routes/commentRoutes');
const filterRoutes = require('./routes/filterRoutes');
const tagRoutes = require('./routes/tagRoutes');
const searchRoutes = require('./routes/searchRoutes');

app.use('/products', productRouter);  
app.use('/users', userRoutes);    
app.use('/categories', categoryRoutes); 
app.use('/comments', commentRoutes);  
app.use('/filters', filterRoutes) 
app.use('/tags', tagRoutes);
app.use('/search', searchRoutes);  



app.get("/", (req, res) => {
    res.redirect('/products'); 
  });



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
