const express = require("express");
const router = express.Router();
const clienteController = require("../controllers/clienteController");
const { protect } = require("../middleware/authMiddleware");

// Rutas para clientes
router.get("/", protect, clienteController.obtenerClientes);
router.post("/", protect, clienteController.crearCliente);
router.get("/:id", protect, clienteController.obtenerClientePorId);
router.put("/:id", protect, clienteController.actualizarCliente);
router.delete("/:id", protect, clienteController.eliminarCliente);

module.exports = router;
