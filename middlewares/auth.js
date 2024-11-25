const admin = require("firebase-admin");

const verifyToken = async (req, res, next) => {
  // Asegúrate de que el token sea extraído correctamente del encabezado
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  
  if (!token) return res.status(403).send("Token required");

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.uid = decodedToken.uid; // Guardar el UID en la solicitud
    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(401).send("Invalid token");
  }
};

module.exports = verifyToken;
