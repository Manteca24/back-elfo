const Product = require("../models/Product")

const createProduct = ({ name, description, price, type, purchaseLocation, categories, gender, ageRange, tags, image, user }) => {
  // Le digo: si tags ya es un array, úsalo tal cual; si es una string, divídelo
  const tagArray = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []);

// formatear para asegurar la estructura correcta
  const formattedCategories = categories.map((cat) => ({
    category: cat.category,
    filters: cat.filters,
  }));


  const newProduct = new Product({
    name,
    description,
    price,
    type,
    purchaseLocation,
    categories: formattedCategories, 
    gender,
    ageRange,
    tags: tagArray,
    image,
    user,
  });

  return newProduct.save();
};

const addCategory = async (productId, categoryId) => {
  try {
    const product = await Product.findById(productId);
    
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    if (product.filters.includes(categoryId)) {
      throw new Error('Esta categoría ya está asignada a este producto');
    }

    product.filters.push(categoryId);

    await product.save();
    return product;  

  } catch (error) {
    console.error(error);
    throw new Error('Error al añadir categoría al producto');
  }
};

module.exports = {
  createProduct,
  addCategory
};
