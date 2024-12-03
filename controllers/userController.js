const User = require('../models/User');

// funciones auxiliares
const getUserFromFirebaseUid = require('../utils/userUtils')

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

    const user = await getUserFromFirebaseUid(req.uid);

      res.status(200).json({user});
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};

// Obtener usuario por Mongo ID
const getUserByMongoId = async (req, res) => {
  try {
    const { id } = req.params; // Obtén el ID de los parámetros de la URL
    const user = await User.findById(id); // Busca el usuario por ID

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(user); // Devuelve el usuario en formato JSON
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error });
  }
};

// crear un usuario
const createUser = async (req, res) => {
  const { firebaseUid, fullName, username, email, gender, password, birthday, profilePicture, bio, tags, favoriteProducts, savedPeople } = req.body;

  try {
    const newUser = new User({
      firebaseUid, // Agregar el UID recibido
      fullName,
      username,
      email,
      gender,
      password,
      birthday,
      profilePicture,
      bio,
      tags,
      favoriteProducts,
      savedPeople,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Actualizar un usuario por su ID
const updateUser = async (req, res) => {
  try {
    const user = await getUserFromFirebaseUid(req.user.firebaseUid);
      
      // Actualizar los campos del usuario
      const { fullName, email, password, birthday, profilePicture, bio, tags, favoriteProducts, isAdmin, status, savedPeople } = req.body;
      user.fullName = fullName || user.fullName;
      user.email = email || user.email;
      user.password = password || user.password; // Asegúrate de hashear la contraseña
      user.bio = bio || user.bio;
      user.birthday = birthday || user.birthday;
      user.profilePicture = profilePicture || user.profilePicture;
      user.tags = tags || user.tags;
      user.favoriteProducts = favoriteProducts || user.favoriteProducts;
      user.savedPeople = savedPeople || user.savedPeople;
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
    const user = await getUserFromFirebaseUid(req.user.firebaseUid);

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
  createUser,
  updateUser,
  deleteUser,
  getUserByMongoId
};