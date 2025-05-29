const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Usuario = require("../models/Usuario");

// Middleware para verificar el token y autenticar al usuario
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

      req.user = await Usuario.findById(decoded.id).select("-password");
      if (!req.user) {
        console.log("Usuario no encontrado para el ID:", decoded.id);
        return res
          .status(401)
          .json({ message: "No autorizado, usuario no encontrado" });
      }
      console.log("Usuario encontrado - Rol:", req.user.rol);

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

// Middleware para verificar el rol del usuario
const verificarRol = (...rolesPermitidos) => {
  return asyncHandler(async (req, res, next) => {
    const user = req.user;
    console.log(
      "Verificando rol - Usuario:",
      user?.rol,
      "Roles permitidos:",
      rolesPermitidos
    );
    if (!user || !user.rol || !rolesPermitidos.includes(user.rol)) {
      console.log("Acceso denegado: Rol no autorizado para el usuario:", user);
      return res
        .status(403)
        .json({ message: "Acceso denegado: Rol no autorizado" });
    }
    next();
  });
};

// Normalizar rutas dinámicas
const normalizeRoute = (ruta) => {
  console.log("Ruta original:", ruta); // Log para depuración
  // Eliminar barra final si existe
  ruta = ruta.endsWith("/") ? ruta.slice(0, -1) : ruta;
  console.log("Ruta normalizada:", ruta); // Log para depuración

  return ruta
    .replace(/\/rutinas\/\w+/, "/rutinas/:id")
    .replace(/\/rutinas\/asignar\/\w+/, "/rutinas/asignar/:id")
    .replace(
      /\/clases\/consultar\/\w+/,
      "/clases/consultar/:numeroIdentificacion"
    )
    .replace(
      /\/rutinas\/consultar\/\w+/,
      "/rutinas/consultar/:numeroIdentificacion"
    )
    .replace(
      /\/pagos\/consultar\/\w+/,
      "/pagos/consultar/:numeroIdentificacion"
    )
    .replace(
      /\/composicion-corporal\/cliente\/\w+/,
      "/composicion-corporal/cliente/:identificacion"
    )
    .replace(/\/composicion-corporal$/, "/composicion-corporal")
    .replace(/\/entrenadores\/\w+/, "/entrenadores/:id")
    .replace(/\/entrenadores$/, "/entrenadores");
};

// Middleware para verificar permisos específicos por ruta
const verificarPermisos = (permisosPorRolOverride = permisosPorRol) => {
  return asyncHandler(async (req, res, next) => {
    const permisosPorRol = permisosPorRolOverride;
    const user = req.user;
    const metodo = req.method.toUpperCase();
    const ruta = normalizeRoute(req.baseUrl + req.path); // Normalizar la ruta

    console.log("Verificando permisos para:", metodo, ruta);
    console.log("Usuario completo:", user);

    if (!user || !user.rol) {
      return res
        .status(403)
        .json({ message: "Acceso denegado: Rol no definido" });
    }

    // Admin tiene acceso completo
    if (user.rol === "admin") {
      console.log("Usuario admin, acceso permitido");
      return next();
    }

    // Obtener permisos del rol del usuario
    const permisos = permisosPorRol[user.rol] || {};
    const rutasPermitidas = permisos.rutas || {};

    // Verificar si la ruta y método están permitidos
    const rutaPermiso = rutasPermitidas[ruta];
    console.log("Ruta permitida encontrada:", rutaPermiso); // Log para depuración
    if (!rutaPermiso || !rutaPermiso.includes(metodo)) {
      console.log(
        `Acceso denegado: ${user.rol} no tiene permiso para ${metodo} ${ruta}`
      );
      return res
        .status(403)
        .json({ message: "No tienes permisos para realizar esta acción." });
    }

    console.log(`Acceso permitido para ${user.rol} en ${metodo} ${ruta}`);
    next();
  });
};

// Definición de permisos por rol
const permisosPorRol = {
  recepcionista: {
    rutas: {
      "/api/clases/disponibles": ["GET"],
      "/api/clases/registrar": ["POST"],
      "/api/clases/consultar/:numeroIdentificacion": ["GET"],
      "/api/pagos": ["GET", "POST"],
      "/api/pagos/:id": ["GET", "PUT"],
      "/api/pagos/consultar/:numeroIdentificacion": ["GET"],
      "/api/pagos/ingresos": ["GET"],
      "/api/rutinas/consultar/:numeroIdentificacion": ["GET"],
      "/api/composicion-corporal/cliente/:identificacion": ["GET"],
    },
  },
  entrenador: {
    rutas: {
      "/api/rutinas": ["POST", "GET", "PUT"],
      "/api/rutinas/:id": ["PUT"],
      "/api/rutinas/asignar": ["POST"],
      "/api/rutinas/asignar/:id": ["PUT"],
      "/api/rutinas/consultar/:numeroIdentificacion": ["GET"],
      "/api/composicion-corporal": ["POST", "GET"],
      "/api/composicion-corporal/cliente/:identificacion": ["GET"],
      "/api/entrenadores": ["POST", "GET", "PUT"],
      "/api/entrenadores/:id": ["GET", "PUT"],
    },
  },
  admin: {
    rutas: {}, // No necesita definición, tiene acceso completo
  },
};

module.exports = { protect, verificarRol, verificarPermisos, permisosPorRol };
