const User = require('../models/User');

// Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener usuario por nombre de usuario
const getUserByUserName = async (req, res) => {
    try {
        const { username } = req.params; 
        const user = await User.findOne({ username: username });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Excluir campos sensibles como la contraseña antes de enviar la respuesta
        user.password = undefined;

        res.status(200).json(user); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los datos del usuario' });
    }
};

// Obtener un usuario por su ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' + {userId} });
          }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};


// Obtener productos favoritos por ID de usuario
const getFavoriteProductsByUserId = async (req, res) => {
  const { userId } = req.params; 

  try {
    const user = await User.findById(userId).populate('favoriteProducts', 'name'); 
    // aquí añado la propiedad que quiera que muestre de products (en este caso solo name)

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (!user.favoriteProducts || user.favoriteProducts.length === 0) {
      return res.status(404).json({ message: 'No se encontraron productos favoritos para este usuario' });
    }

    res.status(200).json(user.favoriteProducts);

  } catch (error) {
    console.error('Error al obtener los productos favoritos:', error);
    res.status(500).json({ message: 'Error al obtener los productos favoritos' });
  }
};


// Crear un nuevo usuario
const createUser = async (req, res) => {
  const { fullName, username, email, password, birthday, profilePicture, bio, tags, favoriteProducts} = req.body;
  
  try {
    const newUser = new User({ fullName, username, email, password, birthday, profilePicture, bio, tags, favoriteProducts});
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar un usuario por su ID
const updateUser = async (req, res) => {
    try {
        const { userId } = req.params; 
        const { fullName, email, password, birthday, profilePicture, bio, tags, favoriteProducts, isAdmin, status } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        // Actualizar los campos del usuario
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.password = password || user.password; // hashear!
        user.bio = bio || user.bio;
        user.birthday = birthday || user.birthday;
        user.profilePicture = profilePicture || user.profilePicture;
        user.tags = tags || user.tags;
        user.favoriteProducts = favoriteProducts || user.favoriteProducts;
        user.isAdmin = isAdmin !== undefined ? isAdmin : user.isAdmin;
        user.status = status || user.status;
        
        const updatedUser = await user.save();
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};

// Eliminar un usuario por su ID
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};

module.exports = {
  getUsers,
  getUserByUserName,
  getUserById,
  getFavoriteProductsByUserId,
  createUser,
  updateUser,
  deleteUser
};