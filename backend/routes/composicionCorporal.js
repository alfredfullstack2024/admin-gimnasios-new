const express = require("express");
const router = express.Router();
const ComposicionCorporal = require("../models/ComposicionCorporal");
const Cliente = require("../models/Cliente"); // Asegúrate de que este modelo esté definido
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, async (req, res) => {
  try {
    const {
      clienteId,
      peso,
      medidas,
      porcentajeGrasa,
      masaMuscular,
      objetivo,
      antecedentesMedicos,
    } = req.body;

    if (!clienteId || !peso || !objetivo) {
      return res.status(400).json({
        mensaje:
          "Faltan campos requeridos: clienteId, peso y objetivo son obligatorios",
      });
    }

    const nuevaComposicion = new ComposicionCorporal({
      clienteId,
      peso,
      medidas,
      porcentajeGrasa,
      masaMuscular,
      objetivo,
      antecedentesMedicos,
      creadoPor: req.user._id,
    });

    await nuevaComposicion.save();
    res
      .status(201)
      .json({
        mensaje: "Composición corporal guardada con éxito",
        composicion: nuevaComposicion,
      });
  } catch (err) {
    console.error("Error al guardar composición corporal:", err);
    res
      .status(500)
      .json({
        mensaje: "Error al guardar composición corporal",
        error: err.message,
      });
  }
});

router.get("/cliente/:identificacion", protect, async (req, res) => {
  try {
    const { identificacion } = req.params;
    const cliente = await Cliente.findOne({
      numeroIdentificacion: identificacion,
    }); // Corregido a 'numeroIdentificacion'
    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }
    const composiciones = await ComposicionCorporal.find({
      clienteId: cliente._id,
    }).sort({ createdAt: -1 });
    if (!composiciones.length) {
      return res
        .status(404)
        .json({
          mensaje: "No se encontraron registros para esta identificación",
        });
    }
    res.status(200).json(composiciones);
  } catch (err) {
    console.error("Error al consultar composiciones:", err);
    res
      .status(500)
      .json({
        mensaje: "Error al consultar composiciones",
        error: err.message,
      });
  }
});

module.exports = router;
