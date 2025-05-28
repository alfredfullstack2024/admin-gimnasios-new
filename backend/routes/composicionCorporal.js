const express = require("express");
const router = express.Router();
const {
  crearComposicionCorporal,
  obtenerComposicionesCorporales,
  obtenerComposicionCorporal,
  actualizarComposicionCorporal,
  eliminarComposicionCorporal,
  consultarComposicionesPorCliente, // Nueva función a importar
} = require("../controllers/composicionCorporalController");
const {
  protect,
  verificarPermisos,
  permisosPorRol,
} = require("../middleware/authMiddleware");

router
  .route("/")
  .post(protect, verificarPermisos(), crearComposicionCorporal) // Usar verificarPermisos
  .get(protect, verificarPermisos(), obtenerComposicionesCorporales);

router
  .route("/:id")
  .get(protect, verificarPermisos(), obtenerComposicionCorporal)
  .put(protect, verificarPermisos(), actualizarComposicionCorporal)
  .delete(protect, verificarPermisos(), eliminarComposicionCorporal);

router
  .route("/cliente/:identificacion") // Nueva ruta para consultar por cliente
  .get(protect, verificarPermisos(), consultarComposicionesPorCliente);

module.exports = router;
