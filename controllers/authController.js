const logOut = async (req, res) => {
    // En el frontend, simplemente eliminar el token del localStorage
    res.status(200).send("Sesion cerrada correctamente");
  };
  
  module.exports = {logOut};
