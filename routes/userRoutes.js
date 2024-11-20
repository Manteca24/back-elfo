const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserByUserName,
    getUserById,
    getFavoriteProductsByUserId,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');

router.get('/', getUsers);
router.get('/username/:username', getUserByUserName);
router.get('/:userId', getUserById); 
router.get('/favorites/:userId', getFavoriteProductsByUserId); 
router.post('/', createUser);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser)

module.exports = router;