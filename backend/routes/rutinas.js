const express = require("express");
const router = express.Router();
const Rutina = require("../models/Rutina");
const RutinaAsignada = require("../models/RutinaAsignada");
const Cliente = require("../models/Cliente");
const { protect } = require("../middleware/authMiddleware");

// Crear una rutina (Protegida)
router.post("/", protect, async (req, res) => {
  try {
    const {
      grupoMuscular,
      nombreEjercicio,
      series,
      repeticiones,
      descripcion,
    } = req.body;

    console.log("Datos recibidos:", req.body); // Depuración
    console.log("Usuario autenticado:", req.user); // Depuración

    if (!grupoMuscular || !nombreEjercicio || !series || !repeticiones) {
      return res.status(400).json({
        mensaje:
          "Faltan campos requeridos: grupoMuscular, nombreEjercicio, series y repeticiones son obligatorios",
      });
    }

    const nuevaRutina = new Rutina({
      grupoMuscular,
      nombreEjercicio,
      series,
      repeticiones,
      descripcion,
      creadoPor: req.user._id, // Cambiado de req.user.id a req.user._id
    });

    await nuevaRutina.save();
    console.log("Rutina guardada:", nuevaRutina); // Depuración
    res
      .status(201)
      .json({ mensaje: "Rutina creada con éxito", rutina: nuevaRutina });
  } catch (err) {
    console.error("Error al crear rutina:", err);
    res.status(500).json({
      mensaje: "Error al crear rutina",
      error: err.message,
      stack: err.stack,
    });
  }
});

// Listar todas las rutinas (Protegida)
router.get("/", protect, async (req, res) => {
  try {
    const rutinas = await Rutina.find().populate({
      path: "creadoPor",
      select: "nombre",
      strictPopulate: false,
    });
    res.json(rutinas);
  } catch (err) {
    console.error("Error al listar rutinas:", err);
    res
      .status(500)
      .json({ mensaje: "Error al listar rutinas", error: err.message });
  }
});

// Actualizar una rutina (Protegida)
router.put("/:id", protect, async (req, res) => {
  try {
    const {
      grupoMuscular,
      nombreEjercicio,
      series,
      repeticiones,
      descripcion,
    } = req.body;

    if (!grupoMuscular || !nombreEjercicio || !series || !repeticiones) {
      return res.status(400).json({
        mensaje:
          "Faltan campos requeridos: grupoMuscular, nombreEjercicio, series y repeticiones son obligatorios",
      });
    }

    const rutinaActualizada = await Rutina.findByIdAndUpdate(
      req.params.id,
      {
        grupoMuscular,
        nombreEjercicio,
        series,
        repeticiones,
        descripcion,
        creadoPor: req.user._id, // Cambiado de req.user.id a req.user._id
      },
      { new: true }
    );

    if (!rutinaActualizada) {
      return res.status(404).json({ mensaje: "Rutina no encontrada" });
    }

    res.json({
      mensaje: "Rutina actualizada con éxito",
      rutina: rutinaActualizada,
    });
  } catch (err) {
    console.error("Error al actualizar rutina:", err);
    res
      .status(500)
      .json({ mensaje: "Error al actualizar rutina", error: err.message });
  }
});

// Asignar una rutina a un cliente (Protegida)
router.post("/asignar", protect, async (req, res) => {
  try {
    const { clienteId, rutinaId, diasEntrenamiento, diasDescanso } = req.body;

    if (!clienteId || !rutinaId || !diasEntrenamiento || !diasDescanso) {
      return res.status(400).json({
        mensaje:
          "Faltan campos requeridos: clienteId, rutinaId, diasEntrenamiento y diasDescanso son obligatorios",
      });
    }

    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    const rutina = await Rutina.findById(rutinaId);
    if (!rutina) {
      return res.status(404).json({ mensaje: "Rutina no encontrada" });
    }

    const rutinaAsignada = new RutinaAsignada({
      clienteId,
      numeroIdentificacion: cliente.numeroIdentificacion,
      rutinaId,
      diasEntrenamiento,
      diasDescanso,
      asignadaPor: req.user._id, // Cambiado de req.user.id a req.user._id
    });

    await rutinaAsignada.save();
    res
      .status(201)
      .json({ mensaje: "Rutina asignada con éxito", rutinaAsignada });
  } catch (err) {
    console.error("Error al asignar rutina:", err);
    res
      .status(500)
      .json({ mensaje: "Error al asignar rutina", error: err.message });
  }
});

// Actualizar una asignación de rutina (Protegida)
router.put("/asignar/:id", protect, async (req, res) => {
  try {
    const { clienteId, rutinaId, diasEntrenamiento, diasDescanso } = req.body;

    if (!clienteId || !rutinaId || !diasEntrenamiento || !diasDescanso) {
      return res.status(400).json({
        mensaje:
          "Faltan campos requeridos: clienteId, rutinaId, diasEntrenamiento y diasDescanso son obligatorios",
      });
    }

    const rutinaAsignada = await RutinaAsignada.findByIdAndUpdate(
      req.params.id,
      {
        clienteId,
        rutinaId,
        diasEntrenamiento,
        diasDescanso,
        asignadaPor: req.user._id, // Cambiado de req.user.id a req.user._id
      },
      { new: true }
    );

    if (!rutinaAsignada) {
      return res.status(404).json({ mensaje: "Asignación no encontrada" });
    }

    res.json({ mensaje: "Asignación actualizada con éxito", rutinaAsignada });
  } catch (err) {
    console.error("Error al actualizar asignación:", err);
    res
      .status(500)
      .json({ mensaje: "Error al actualizar asignación", error: err.message });
  }
});

// Eliminar una asignación de rutina (Protegida)
router.delete("/asignar/:id", protect, async (req, res) => {
  try {
    const rutinaAsignada = await RutinaAsignada.findByIdAndDelete(
      req.params.id
    );

    if (!rutinaAsignada) {
      return res.status(404).json({ mensaje: "Asignación no encontrada" });
    }

    res.json({ mensaje: "Asignación eliminada con éxito" });
  } catch (err) {
    console.error("Error al eliminar asignación:", err);
    res
      .status(500)
      .json({ mensaje: "Error al eliminar asignación", error: err.message });
  }
});

// Consultar todas las rutinas asignadas por número de identificación (Protegida)
router.get("/consultar/:numeroIdentificacion", protect, async (req, res) => {
  try {
    const rutinasAsignadas = await RutinaAsignada.find({
      numeroIdentificacion: req.params.numeroIdentificacion,
    })
      .populate("clienteId", "nombre apellido")
      .populate(
        "rutinaId",
        "grupoMuscular nombreEjercicio series repeticiones descripcion"
      );

    if (!rutinasAsignadas || rutinasAsignadas.length === 0) {
      return res.status(404).json({
        mensaje: "No se encontraron rutinas asignadas para este cliente",
      });
    }

    // Formatear la respuesta para que coincida con lo que espera el frontend
    const formattedRutinas = rutinasAsignadas.map((rutinaAsignada) => ({
      nombreRutina: rutinaAsignada.rutinaId.nombreEjercicio,
      ejercicios: [
        `${rutinaAsignada.rutinaId.grupoMuscular}: ${rutinaAsignada.rutinaId.series} series x ${rutinaAsignada.rutinaId.repeticiones} repeticiones`,
      ],
      duracion: rutinaAsignada.diasEntrenamiento * 60, // Suponiendo 60 minutos por día de entrenamiento
      fechaAsignacion: rutinaAsignada.createdAt,
    }));

    res.json(formattedRutinas);
  } catch (err) {
    console.error("Error al consultar rutinas:", err);
    res
      .status(500)
      .json({ mensaje: "Error al consultar rutinas", error: err.message });
  }
});

module.exports = router;
