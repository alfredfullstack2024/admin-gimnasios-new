const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  obtenerClasesDisponibles,
  registrarClienteEnClase,
  consultarClasesPorNumeroIdentificacion,
} = require("../controllers/claseController");

router.get("/disponibles", protect, obtenerClasesDisponibles);
router.post("/registrar", protect, registrarClienteEnClase);
router.get(
  "/consultar/:numeroIdentificacion",
  protect,
  consultarClasesPorNumeroIdentificacion
);

module.exports = router;
