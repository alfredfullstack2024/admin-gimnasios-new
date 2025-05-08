const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware para proteger rutas (verificar token JWT)
const protect = async (req, res, next) => {
  let token;

  // Verificar si el token está en el encabezado Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token recibido:", token);

      // Decodificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Token decodificado:", decoded);

      // Buscar el usuario en la base de datos
      req.user = await User.findById(decoded.id).select("-password");
      console.log("Usuario encontrado:", req.user);

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "No autorizado, usuario no encontrado" });
      }

      next();
    } catch (error) {
      console.error("Error al verificar token:", error.message);
      return res.status(401).json({ message: "No autorizado, token inválido" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "No autorizado, token no proporcionado" });
  }
};

// Middleware para verificar roles
const verificarRol = (rolesPermitidos) => {
  return (req, res, next) => {
    const user = req.user; // req.user ya está poblado por el middleware protect
    console.log("Rol del usuario:", user.rol); // Cambiado de user.role a user.rol
    console.log("Roles permitidos:", rolesPermitidos);
    if (!user || !rolesPermitidos.includes(user.rol)) {
      // Cambiado de user.role a user.rol
      console.log("Acceso denegado: Rol no autorizado para el usuario:", user);
      return res
        .status(403)
        .json({ message: "Acceso denegado: Rol no autorizado" });
    }
    next();
  };
};

module.exports = { protect, verificarRol };
