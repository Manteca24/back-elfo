const verifyAdmin = async (req, res, next) => {
    const { firebaseUid } = req.user; // Obtener el firebaseUid del req.user
  
    try {
      // Aquí se asume que tienes un modelo User para poder verificar si es admin
      const user = await User.findOne({ firebaseUid });
  
      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }
  
      if (!user.isAdmin) {
        return res.status(403).send("No tienes permiso para acceder a esta ruta");
      }
  
      next(); // El usuario es admin, pasa al siguiente middleware o controlador
    } catch (error) {
      console.error("Error al verificar el administrador:", error);
      res.status(500).send("Error al verificar el administrador");
    }
  };
  
  module.exports = { verifyToken, verifyAdmin };