const express = require('express');
const router = express.Router();
const {
    getCommentsByProduct, 
    addComment, 
    updateComment, 
    deleteComment,
    getCommentsByUserId} = require('../controllers/commentController');
const verifyToken = require("../middlewares/auth");


router.post('/:productId', verifyToken, addComment); // crear un comentario en un producto (SOLO REGITRADOS)
router.get('/product/:productId', getCommentsByProduct); // obtener los comentarios de un producto
router.get('/user/:userId', verifyToken, getCommentsByUserId); // obtener los comentarios de un usuario
router.put('/:commentId', verifyToken, updateComment); // editar un comentario en un producto (SOLO EL USUARIO QUE LO CREÓ)
router.delete('/:commentId', verifyToken, deleteComment); // borrar un comentario en un producto ( SOLO EL ADMIN )


module.exports = router;