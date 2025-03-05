const Comment = require('../models/Comment');
const Product = require('../models/Product');
const User = require('../models/User');

// funciones auxiliares
const getUserFromFirebaseUid = require('../utils/userUtils')

// crear comentario
const addComment = async (req, res) => {
  const { productId } = req.params;
  const { comment } = req.body;

  try {
    // Obtener usuario autenticado desde Firebase
    const user = await getUserFromFirebaseUid(req.uid);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    const product = await Product.findById(productId);
    console.log("USER", user, "PRODUCT", product)
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    const newComment = new Comment({ 
      productId, 
      userId: user._id,
      comment 
    });

    // Guardar el comentario primero
    await newComment.save();

    // Agregar el comentario a la lista de comentarios del usuario y del producto
    user.comments.push(newComment._id);
    product.comments.push(newComment._id);
    product.commentsCount = product.comments.length;

    // Guardar ambos modelos en paralelo
    await user.save()
    await product.save();

    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error al agregar comentario:", error);
    res.status(500).json({ message: "Error al agregar el comentario." });
  }
};

// Obtener comentarios de un producto
const getCommentsByProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const comments = await Comment.find({ productId })
    .populate('userId', 'username profilePicture createdAt isAdmin'); 
    res.json(comments);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// obtener comentarios de un usuario específico por su id
const getCommentsByUserId = async (req, res) => {
  try {
    const user = await getUserFromFirebaseUid(req.params.userId);


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
  const user = await getUserFromFirebaseUid(req.uid);
  console.log(req.uid)

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    // verificar que el usuario que intenta editar el comentario es el autor - prueba! cambiar después de firebase
    if (comment.userId.toString() !== user._id.toString()) { 
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
  const user = await getUserFromFirebaseUid(req.uid);

  try {
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comentario no encontrado' });

    console.log(comment.userId.toString(), "=?", user._id.toString());

    // Verificar que el usuario autenticado sea el autor del comentario o un admin
    if (comment.userId.toString() !== user._id.toString() && !user.isAdmin) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar este comentario' });
    }

    const product = await Product.findById(comment.productId);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    console.log(product.comments);

    // Filtrar el comentario eliminado del array y actualizar el contador
    product.comments = product.comments.filter(c => c.toString() !== commentId.toString());
    product.commentsCount = product.comments.length;

    console.log(product);

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