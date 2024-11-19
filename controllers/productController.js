const Product = require("../models/Product");
const { filterProducts, createProduct } = require('../utils/productUtils');

// Obtener todos los productos
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener los productos", error: err });
  }
};

const getFilteredProducts = async (req, res) => {
  const { genre, ageRange, category, tags } = req.query;
  console.log(req.query)
  const products = await filterProducts({ genre, ageRange, category, tags });
  res.json(products);
};

// Obtener un producto por ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener el producto", error: err });
  }
};

// Crear un nuevo producto
const createNewProduct = async (req, res) => {
    try {
      const { name, description, price, category, genre, ageRange, tags, image } = req.body;
      const newProduct = await createProduct({ name, description, price, category, genre, ageRange, tags, image });
      res.status(201).json({ message: 'Producto creado con éxito', product: newProduct });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error al crear el producto' });
      
console.log(req.body)
    }
  };
  
// Actualizar un producto por ID
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Producto no encontrado" });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: "Error al actualizar el producto", error: err });
  }
};

// Eliminar un producto por ID
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Producto no encontrado" });
    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar el producto", error: err });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createNewProduct,
  updateProduct,
  deleteProduct,
  getFilteredProducts
};