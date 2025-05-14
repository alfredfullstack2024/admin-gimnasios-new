const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Clase = require("../models/Clase");
const { authMiddleware } = require("../middleware/auth");
const {
  crearClase,
  obtenerClases,
  obtenerClasePorId,
  actualizarClase,
  eliminarClase,
} = require("../controllers/claseController");

// Obtener todas las clases
router.get("/", authMiddleware, obtenerClases);

// Obtener una clase por ID
router.get("/:id", authMiddleware, obtenerClasePorId);

// Crear una clase
router.post("/", authMiddleware, crearClase);

// Actualizar una clase
router.put("/:id", authMiddleware, actualizarClase);

// Eliminar una clase
router.delete("/:id", authMiddleware, eliminarClase);

module.exports = router;
