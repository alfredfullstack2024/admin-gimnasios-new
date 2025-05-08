const express = require("express");
const router = express.Router();
const {
  listarPagos,
  agregarPago,
  obtenerPagoPorId,
  editarPago,
  eliminarPago,
} = require("../controllers/pagoController");
const { authMiddleware } = require("../middleware/auth");

// Rutas para pagos
router.get("/", authMiddleware, listarPagos);
router.post("/", authMiddleware, agregarPago);
router.get("/:id", authMiddleware, obtenerPagoPorId);
router.put("/:id", authMiddleware, editarPago);
router.delete("/:id", authMiddleware, eliminarPago);

module.exports = router;
