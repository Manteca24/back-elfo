const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserByUserName,
    getUserById,
    createUser,
    updateUser,
    deleteUser
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
router.get('/:userId', getUserById); // obtener usuario por su id
router.post('/', createUser); // crear nuevo usuario 
router.put('/:userId', updateUser); // actualizar usuario (SOLO USER Y ADMIN)
router.delete('/:userId', deleteUser) // borrar usuario (SOLO USER Y ADMIN)


router.post('/:userId/favorites', addFavorite); // añadir producto favorito y persona a la que se lo regalarías (SOLO USER Y ADMIN)
router.get('/:userId/favorites', getFavorites); // obtener favoritos de un usuario y sus "para quién" (SOLO USER Y ADMIN)
router.delete('/:userId/favorites/:favoriteId', removeFavorite); // borrar favorito (SOLO USER Y ADMIN)


router.post('/:userId/saved-people', addSavedPerson); // añadir una persona a "mis personas" con sus propios filtros guardados (SOLO USER Y ADMIN)
router.get('/:userId/saved-people', getSavedPeople); // obtener "mis personas" de un usuario concreto por su id (SOLO USER Y ADMIN)
router.put('/saved-people/:personId/tags', updateTags) // actualizar los tags de una de tus personas (SOLO USER Y ADMIN)
router.delete('/saved-people/:personId', removeSavedPerson); // borrar una persona de "tus personas" (SOLO USER Y ADMIN)

module.exports = router;