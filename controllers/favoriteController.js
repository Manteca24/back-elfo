const Product = require('../models/Product');
const SavedPerson = require('../models/SavedPerson');
const User = require('../models/User');

// funciones auxiliares
const getUserFromFirebaseUid = require('../utils/userUtils');

// Añadir un producto a favoritos
const addFavorite = async (req, res) => {
  const { productId, type, relatedPersonId } = req.body;
  try {
    // Validar producto
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    // Validar usuario
    const user = await getUserFromFirebaseUid(req.uid);

    // Validar persona guardada si el tipo es "savedPerson" y existe el relatedPersonId
    if (type === 'savedPerson' && relatedPersonId) {
      const person = await SavedPerson.findById(relatedPersonId);
      if (!person) {
        return res.status(404).json({ message: 'Persona guardada no encontrada' });
      }
    }

    // Añadir a favoritos
    user.favoriteProducts.push({
      product: productId,
      type,
      ...(relatedPersonId && { relatedPerson: relatedPersonId }), // Añadir solo si relatedPersonId existe
    });
    await user.save();
    // console.log("Updated favorites:", user.favoriteProducts.length);

    res.status(200).json({
      message: 'Producto añadido a favoritos',
      favoriteProducts: user.favoriteProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al añadir el producto a favoritos' });
  }
};

// Obtener los productos favoritos de un usuario
const getFavorites = async (req, res) => {
  try {
    const user = await getUserFromFirebaseUid(req.uid)
    
    await user.populate({
      path: 'favoriteProducts.product', // El campo que quieres poblar
      select: 'name image' // Los campos que quieres que se incluyan
    }); // Poblamos los datos del producto
    // }).populate({
    //   path: 'favoriteProducts.relatedPerson',
    //   select: 'name filters', // Poblamos los datos de la persona guardada
    // });


    // console.log(user.favoriteProducts);

    res.status(200).json(user.favoriteProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los favoritos' });
  }
};

// Eliminar un favorito
const removeFavorite = async (req, res) => {
  const { productId } = req.body; // Expecting productId instead of favoriteId
  // console.log(productId)

  try {
    const user = await getUserFromFirebaseUid(req.uid);

    // Filter out the product using the productId, not the favorite entry ID
    user.favoriteProducts = user.favoriteProducts.filter(
      (fav) => fav.product.toString() !== productId
    );
    
    await user.save();
    // console.log("After removal:", user.favoriteProducts.length)

    res.status(200).json({ 
      message: 'Favorite removed', 
      favoriteProducts: user.favoriteProducts 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error removing favorite' });
  }
};

module.exports = { addFavorite, getFavorites, removeFavorite };