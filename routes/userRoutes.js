const express = require('express');
const router = express.Router();
const verifyToken = require("../middlewares/auth");
const {
    getUsers,
    getUserByUserName,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getUserByMongoId
} = require('../controllers/userController');

const {
    addFavorite,
    getFavorites,
    removeFavorite
} = require('../controllers/favoriteController');
const {
    addSavedPerson,
    getSavedPeople,
    removeSavedPerson,
    updateTags
} = require('../controllers/savedPersonController')

router.get('/', getUsers); // obtener todos los usuarios
router.get('/username/:username', getUserByUserName); // obtener usuario por su username
router.get('/user/:id', getUserByMongoId)
router.get('/user', verifyToken, getUserById); // obtener usuario por su id
router.post('/user', createUser); // crear nuevo usuario 
router.put('/user', verifyToken, updateUser); // actualizar usuario (SOLO USER Y ADMIN)
router.delete('/user', verifyToken, deleteUser) // borrar usuario (SOLO USER Y ADMIN)


router.post('/:userId/favorites', verifyToken, addFavorite); // añadir producto favorito y persona a la que se lo regalarías (SOLO USER Y ADMIN)
router.get('/:userId/favorites', verifyToken, getFavorites); // obtener favoritos de un usuario y sus "para quién" (SOLO USER Y ADMIN)
router.delete('/:userId/favorites/:favoriteId', verifyToken, removeFavorite); // borrar favorito (SOLO USER Y ADMIN)


router.post('/:userId/saved-people', verifyToken, addSavedPerson); // añadir una persona a "mis personas" con sus propios filtros guardados (SOLO USER Y ADMIN)
router.get('/:userId/saved-people', verifyToken, getSavedPeople); // obtener "mis personas" de un usuario concreto por su id (SOLO USER Y ADMIN)
router.put('/saved-people/:personId/tags', verifyToken, updateTags) // actualizar los tags de una de tus personas (SOLO USER Y ADMIN)
router.delete('/saved-people/:personId', verifyToken, removeSavedPerson); // borrar una persona de "tus personas" (SOLO USER Y ADMIN)

module.exports = router;