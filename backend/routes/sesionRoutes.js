const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const {
  crearSesion,
  obtenerSesiones,
} = require("../controllers/sesionController");

router.post("/sesiones/crear", authMiddleware, crearSesion);
router.get("/sesiones", authMiddleware, obtenerSesiones);

module.exports = router;
