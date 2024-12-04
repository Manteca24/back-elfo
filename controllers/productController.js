const Product = require("../models/Product");

// funciones auxiliares
const { createProduct } = require('../utils/productUtils');
const getUserFromFirebaseUid = require('../utils/userUtils');

// Obtener todos los productos
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('categories.category', 'name') // Populate las categorías
      .populate('categories.filters', 'name'); // Populate los filtros
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener los productos", error: err });
  }
};

// Obtener un producto por ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('categories.category', 'name')
      .populate('categories.filters', 'name');
    if (!product) return res.status(404).json({ message: "Producto no encontrado" });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener el producto", error: err });
  }
};

// Crear un nuevo producto
const createNewProduct = async (req, res) => {
  try {
    console.log('Datos recibidos:', req.body);
    const {
      name,
      description,
      price,
      type,
      categories, // Ahora incluye categorías y filtros
      gender,
      ageRange,
      tags,
      image,
      purchaseLocation,
      firebaseUid
    } = req.body;
    console.log(type)

    const user = await getUserFromFirebaseUid(firebaseUid);

    // Verificamos que las categorías estén correctamente formateadas como un array de objetos
    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: 'Debes proporcionar al menos una categoría con sus filtros.' });
    }

    // Creamos el producto utilizando la función `createProduct`
    const newProduct = await createProduct({
      name,
      description,
      price,
      type,
      categories, // Es un array de objetos que contiene categorías y filtros
      gender,
      ageRange,
      tags,
      image,
      purchaseLocation,
      user
    });

    // Enviamos la respuesta con el producto creado
    res.status(201).json({ message: 'Producto creado con éxito', product: newProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al crear el producto', error: err.message });
  }
};

// Actualizar un producto por ID
const updateProduct = async (req, res) => {
  try {
    const { categories, ...otherFields } = req.body;

    let updateData = { ...otherFields };

    // Si hay categorías, las formateamos antes de actualizar
    if (categories) {
      const formattedCategories = categories.map((cat) => ({
        category: cat.category,
        filters: cat.filters,
      }));
      updateData.categories = formattedCategories;
    }

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('categories.category')
      .populate('categories.filters');

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

// Añadir una categoría a un producto
const addCategoryToProduct = async (req, res) => {
  const { productId } = req.params;
  const { categoryId, filters } = req.body; // categoryId y filters son parte del body

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        $push: {
          categories: { category: categoryId, filters }, // Añadimos la nueva categoría
        },
      },
      { new: true }
    ).populate('categories.category').populate('categories.filters');

    res.status(200).json({ message: 'Categoría añadida con éxito', product: updatedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al añadir la categoría', error: err });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createNewProduct,
  updateProduct,
  deleteProduct,
  addCategoryToProduct,
};