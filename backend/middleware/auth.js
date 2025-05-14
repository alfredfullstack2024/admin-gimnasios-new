const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario"); // Cambié 'User' por 'Usuario'

// Middleware para verificar el token y cargar el usuario
const authMiddleware = async (req, res, next) => {
  // Extraer el token del header Authorization
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.error("Token no proporcionado o formato inválido:", req.headers);
    return res
      .status(401)
      .json({ mensaje: "Token no proporcionado o formato inválido" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    // Verificar y decodificar el token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "supersecreto123"
    );
    console.log("Token decodificado:", decoded);

    if (!decoded.id) {
      console.error("Token no contiene id:", decoded);
      return res
        .status(401)
        .json({ mensaje: "Token inválido: ID de usuario no encontrado" });
    }

    // Buscar el usuario en la base de datos
    const user = await Usuario.findById(decoded.id).select("-password");
    if (!user) {
      console.error("Usuario no encontrado para ID:", decoded.id);
      return res.status(401).json({ mensaje: "Usuario no encontrado" });
    }

    // Asegurar que req.user tenga el formato esperado
    req.user = {
      id: user._id.toString(),
      ...user.toObject(),
    };
    console.log("Usuario autenticado:", req.user);
    next();
  } catch (error) {
    console.error("Error al verificar token:", error.message);
    res.status(401).json({ mensaje: "Token inválido", detalle: error.message });
  }
};

// Middleware para verificar permisos según el rol
const checkRole = (allowedRoles) => (req, res, next) => {
  if (!req.user) {
    console.error("Usuario no autenticado en checkRole");
    return res.status(401).json({ mensaje: "Usuario no autenticado" });
  }

  const userRole = req.user.rol;
  if (!userRole) {
    console.error("Rol no definido para el usuario:", req.user);
    return res.status(403).json({ mensaje: "Rol de usuario no definido" });
  }

  if (!allowedRoles.includes(userRole)) {
    console.error(
      "Rol no permitido:",
      userRole,
      "Roles permitidos:",
      allowedRoles
    );
    return res
      .status(403)
      .json({ mensaje: "No tienes permisos para acceder a esta ruta" });
  }

  console.log("Permisos verificados para rol:", userRole);
  next();
};

module.exports = { authMiddleware, checkRole };
