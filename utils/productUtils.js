const Product = require('../models/Product');

const filterProducts = async ({ genre, ageRange, category, tags }) => {
  try {
    const filters = {};
    // Si el género es "no relevante", incluye todos los géneros
    if (genre) {
      if (genre === "no relevante") {
        filters.genre = { $in: ["masculino", "femenino", "no relevante"] };
      } else {
        filters.genre = genre;
      }
    }

    if (ageRange) filters.ageRange = ageRange;
    if (category) filters.category = category;

    // Manejar múltiples tags
    if (tags && typeof tags === "string") {
      const tagArray = tags.split(",").map((tag) => tag.trim()).filter(Boolean);
      if (tagArray.length > 0) {
        filters.tags = { 
          $all: tagArray }; ///!!!! $in busca que tenga alguno de los tags, $all que los cumpla todos
      }
    }

    return await Product.find(filters);
  } catch (error) {
    console.error("Error al filtrar productos:", error);
    throw error;
  }
};


// función para crear producto
const createProduct = ({ name, description, price, category, genre, ageRange, tags, image }) => {
  // Si tags ya es un array, úsalo tal cual; si es una string, divídelo
  const tagArray = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(tag => tag.trim()) : []);
  const newProduct = new Product({
    name,
    description,
    price,
    category,
    genre,
    ageRange,
    tags: tagArray, // Guardar tags como un array
    image,
  });

  return newProduct.save(); // Guarda el producto en la base de datos
};

module.exports = {
  filterProducts,
  createProduct
};