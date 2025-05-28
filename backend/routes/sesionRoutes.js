const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  crearSesion,
  obtenerSesiones,
} = require("../controllers/sesionController");

router.post("/crear", protect, crearSesion);
router.get("/", protect, obtenerSesiones);

module.exports = router;
