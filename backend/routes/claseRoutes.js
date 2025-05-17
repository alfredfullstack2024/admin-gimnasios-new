const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  obtenerClasesDisponibles,
  registrarClienteEnClase,
} = require("../controllers/claseController");

router.get("/disponibles", protect, obtenerClasesDisponibles);
router.post("/registrar", protect, registrarClienteEnClase);

module.exports = router;
