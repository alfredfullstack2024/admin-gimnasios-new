const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

// Middleware para proteger rutas (verificar token JWT)
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Verificar si el token está en el encabezado Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token recibido:", token);

      // Verificar y decodificar el token
      if (!process.env.JWT_SECRET) {
        throw new Error("Clave secreta JWT no definida en .env");
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decodificado:", decoded);

      // Buscar el usuario en la base de datos
      req.user = await User.findById(decoded.id).select("-password");
      console.log("Usuario encontrado:", req.user);

      if (!req.user) {
        console.log("Usuario no encontrado para el ID:", decoded.id);
        res.status(401);
        throw new Error("No autorizado, usuario no encontrado");
      }

      next();
    } catch (error) {
      console.error("Error al verificar el token:", error.message);
      res.status(401);
      throw new Error("No autorizado, token inválido o expirado");
    }
  } else {
    console.log("Encabezado Authorization no encontrado o mal formado");
    res.status(401);
    throw new Error("No autorizado, token no proporcionado");
  }
});

// Middleware para verificar roles
const verificarRol = (rolesPermitidos) => {
  return asyncHandler(async (req, res, next) => {
    const user = req.user; // req.user ya está poblado por el middleware protect
    console.log("Rol del usuario:", user?.rol);
    console.log("Roles permitidos:", rolesPermitidos);

    if (!user || !user.rol || !rolesPermitidos.includes(user.rol)) {
      console.log("Acceso denegado: Rol no autorizado para el usuario:", user);
      res.status(403);
      throw new Error("Acceso denegado: Rol no autorizado");
    }

    next();
  });
};

module.exports = { protect, verificarRol };
