const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");
const {
  crearSesion,
  obtenerSesiones,
} = require("../controllers/sesionController");

router.post("/crear", authMiddleware, crearSesion);
router.get("/", authMiddleware, obtenerSesiones);

module.exports = router;
