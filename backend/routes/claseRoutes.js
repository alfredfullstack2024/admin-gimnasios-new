const express = require("express");
const router = express.Router();
const { protect, verificarPermisos } = require("../middleware/authMiddleware");
const {
  obtenerClasesDisponibles,
  registrarClienteEnClase,
  consultarClasesPorNumeroIdentificacion,
  obtenerInscritosPorClase,
} = require("../controllers/claseController");

// Solo recepcionistas y admins pueden acceder
router.get(
  "/disponibles",
  protect,
  verificarPermisos(),
  obtenerClasesDisponibles
);
router.post(
  "/registrar",
  protect,
  verificarPermisos(),
  registrarClienteEnClase
);
router.get(
  "/consultar/:numeroIdentificacion",
  protect,
  verificarPermisos(),
  consultarClasesPorNumeroIdentificacion
);
router.get(
  "/inscritos",
  protect,
  verificarPermisos(),
  obtenerInscritosPorClase
);

module.exports = router;
