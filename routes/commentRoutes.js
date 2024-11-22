const express = require('express');
const router = express.Router();
const {
    getCommentsByProduct, 
    addComment, 
    updateComment, 
    deleteComment,
    getCommentsByUserId} = require('../controllers/commentController');


router.post('/:productId', addComment); // crear un comentario en un producto (SOLO REGITRADOS)
router.get('/product/:productId', getCommentsByProduct); // obtener los comentarios de un producto
router.get('/user/:userId', getCommentsByUserId); // obtener los comentarios de un usuario
router.put('/:commentId', updateComment); // editar un comentario en un producto (SOLO EL USUARIO QUE LO CREÓ)
router.delete('/:commentId', deleteComment); // borrar un comentario en un producto ( SOLO EL ADMIN )


module.exports = router;