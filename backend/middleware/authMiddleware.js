const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Usuario = require("../models/Usuario"); // Asegúrate de que coincida con el nombre del modelo

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token recibido:", token);

      if (!process.env.JWT_SECRET) {
        throw new Error("Clave secreta JWT no definida en .env");
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decodificado:", decoded);

      // Usar el documento Mongoose completo sin .lean()
      req.user = await Usuario.findById(decoded.id).select("-password");
      if (!req.user) {
        console.log("Usuario no encontrado para el ID:", decoded.id);
        return res
          .status(401)
          .json({ message: "No autorizado, usuario no encontrado" });
      }
      console.log("Usuario encontrado:", req.user);

      next();
    } catch (error) {
      console.error("Error al verificar el token:", error.message);
      return res.status(401).json({
        message: "No autorizado, token inválido o expirado",
        error: error.message,
      });
    }
  } else {
    console.log("Encabezado Authorization no encontrado o mal formado");
    return res
      .status(401)
      .json({ message: "No autorizado, token no proporcionado" });
  }
});

const verificarRol = (rolesPermitidos) => {
  return asyncHandler(async (req, res, next) => {
    const user = req.user;
    console.log("Rol del usuario:", user?.rol);
    console.log("Roles permitidos:", rolesPermitidos);

    if (!user || !user.rol || !rolesPermitidos.includes(user.rol)) {
      console.log("Acceso denegado: Rol no autorizado para el usuario:", user);
      return res
        .status(403)
        .json({ message: "Acceso denegado: Rol no autorizado" });
    }

    next();
  });
};

module.exports = { protect, verificarRol };
