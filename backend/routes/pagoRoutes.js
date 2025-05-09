const express = require("express");
const router = express.Router();
const {
  listarPagos,
  consultarPagosPorCedula, // Nueva función
  agregarPago,
  obtenerPagoPorId,
  editarPago,
  eliminarPago,
} = require("../controllers/pagoController");
const { authMiddleware } = require("../middleware/auth");

// Rutas para pagos (protegidas)
router.get("/", authMiddleware, listarPagos);
router.post("/", authMiddleware, agregarPago);
router.get("/:id", authMiddleware, obtenerPagoPorId);
router.put("/:id", authMiddleware, editarPago);
router.delete("/:id", authMiddleware, eliminarPago);

// Ruta pública para consultar pagos por número de identificación
router.get("/consultar/:numeroIdentificacion", consultarPagosPorCedula);

module.exports = router;
