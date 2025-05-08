const express = require("express");
const router = express.Router();
const entrenadorController = require("../controllers/entrenadoresController"); // Cambiado de "entrenadorController" a "entrenadoresController"
const { protect, verificarRol } = require("../middleware/authMiddleware");

console.log("Configurando rutas para entrenadores...");

// Solo los administradores pueden crear, editar y eliminar entrenadores
router.get("/", protect, entrenadorController.listarEntrenadores);
router.post(
  "/",
  protect,
  verificarRol(["admin"]),
  entrenadorController.agregarEntrenador
);
router.get("/:id", protect, entrenadorController.obtenerEntrenadorPorId);
router.put(
  "/:id",
  protect,
  verificarRol(["admin"]),
  entrenadorController.editarEntrenador
);
router.delete(
  "/:id",
  protect,
  verificarRol(["admin"]),
  entrenadorController.eliminarEntrenador
);

module.exports = router;
