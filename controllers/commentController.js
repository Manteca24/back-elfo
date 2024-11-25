const Comment = require('../models/Comment');
const Product = require('../models/Product');

// funciones auxiliares
const getUserFromFirebaseUid = require('../utils/userUtils')

// crear comentario
const addComment = async (req, res) => {
  const { productId } = req.params;
  const { comment } = req.body;

  try {
    // Obtener usuario autenticado desde Firebase
    const user = await getUserFromFirebaseUid(req.user.firebaseUid);

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    const newComment = new Comment({ 
      productId, 
      userId: user._id,
      comment 
    });

    await newComment.save();

    // en User...actualizar el usuario con el ID del nuevo comentario
    user.comments.push(newComment._id);
    await user.save();

    // en Product...añadir el comentario al producto y actualizar el contador
    product.comments.push(newComment._id);
    product.commentsCount = product.comments.length; 
    await product.save();

    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener comentarios de un producto
const getCommentsByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const comments = await Comment.find({ productId })
    .populate('userId', 'username'); 
    res.json(comments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// obtener comentarios de un usuario específico por su id
const getCommentsByUserId = async (req, res) => {
  try {
    const user = await getUserFromFirebaseUid(req.user.firebaseUid);

    const comments = await Comment
    .find({ userId: user._id })
    .populate('productId', 'name')
    
    if (comments.length === 0) {
      return res.status(404).json({ message: 'No se encontraron comentarios para este usuario' });
    }
    res.status(200).json(comments);

  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    res.status(400).json({ message: error.message });
  }
};



// editar comentario //// PENDIENTE JWT CUANDO AÑADA FIREBASE
const updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { newComment } = req.body; // 'newComment' es el nuevo texto del comentario

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    // verificar que el usuario que intenta editar el comentario es el autor - prueba! cambiar después de firebase
    if (comment.userId.toString() !== req.user.firebaseUid) {
      return res.status(403).json({ message: 'No tienes permiso para editar este comentario' });
    }
    
        comment.comment = newComment;
    await comment.save();
    
    res.status(200).json({ message: 'Comentario actualizado', comment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// borrar comentario
const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });
  
    // Verificar que el usuario autenticado sea el autor del comentario
  if (comment.userId.toString() !== req.user.firebaseUid) {
    return res.status(403).json({ message: 'No tienes permiso para eliminar este comentario' });
  }

    const product = await Product.findById(comment.productId);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    product.comments = product.comments.filter(comment => comment.toString() !== commentId);
    product.commentsCount = product.comments.length; 

    await product.save();

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: 'Comentario eliminado' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addComment,
  getCommentsByProduct,
  updateComment,
  deleteComment,
  getCommentsByUserId
};