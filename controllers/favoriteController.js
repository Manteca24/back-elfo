const Product = require('../models/Product');
const SavedPerson = require('../models/SavedPerson');

// funciones auxiliares
const getUserFromFirebaseUid = require('../utils/userUtils')


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
      const user = await getUserFromFirebaseUid(req.user.firebaseUid);

      // Validar persona guardada si el tipo es "savedPerson"
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
        ...(relatedPersonId && { relatedPerson: relatedPersonId }) // Añadir solo si existe
      });
      await user.save();
  
      res.status(200).json({ 
        message: 'Producto añadido a favoritos', 
        favoriteProducts: user.favoriteProducts.toString() 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al añadir el producto a favoritos' });
    }
  };
  

// Obtener favoritos de un usuario
const getFavorites = async (req, res) => {

  try {
    const user = await getUserFromFirebaseUid(req.user.firebaseUid)
      .populate({
        path: 'favoriteProducts.product',
        select: 'name price category image',
      })
      .populate({
        path: 'favoriteProducts.relatedPerson',
        select: 'name filters',
      });


    res.status(200).json(user.favoriteProducts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los favoritos' });
  }
};

// Eliminar un favorito
const removeFavorite = async (req, res) => {
  const { favoriteId } = req.params;

  try {
    const user = await getUserFromFirebaseUid(req.user.firebaseUid);


    // Filtrar el favorito
    user.favoriteProducts = user.favoriteProducts.filter(
      (fav) => fav._id.toString() !== favoriteId
    );

    await user.save();
    res.status(200).json({ message: 'Favorito eliminado', favoriteProducts: user.favoriteProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el favorito' });
  }
};

module.exports = { addFavorite, getFavorites, removeFavorite };