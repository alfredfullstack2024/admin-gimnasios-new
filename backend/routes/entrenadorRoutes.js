const express = require("express");
const router = express.Router();
const entrenadorController = require("../controllers/entrenadoresController");
const { protect, verificarPermisos } = require("../middleware/authMiddleware");

console.log("Configurando rutas para entrenadores...");

// Rutas protegidas con permisos basados en authMiddleware.js
router.get(
  "/",
  protect,
  verificarPermisos(),
  entrenadorController.listarEntrenadores
);
router.post(
  "/",
  protect,
  verificarPermisos(),
  entrenadorController.agregarEntrenador
);
router.get(
  "/:id",
  protect,
  verificarPermisos(),
  entrenadorController.obtenerEntrenadorPorId
);
router.put(
  "/:id",
  protect,
  verificarPermisos(),
  entrenadorController.editarEntrenador
);
router.delete(
  "/:id",
  protect,
  verificarPermisos(),
  entrenadorController.eliminarEntrenador
);

module.exports = router;
