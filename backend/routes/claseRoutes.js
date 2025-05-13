const express = require("express");
const router = express.Router();
const Clase = require("../models/Clase");
const Entrenador = require("../models/Entrenador");
const { authMiddleware, checkRole } = require("../middleware/auth");

const mongoose = require("mongoose");

// Obtener todas las clases (admin, recepcionista, entrenador)
router.get(
  "/",
  authMiddleware,
  checkRole(["admin", "recepcionista", "entrenador"]),
  async (req, res) => {
    try {
      const clases = await Clase.find().populate(
        "entrenador",
        "nombre apellido"
      );
      res.json(clases);
    } catch (error) {
      res.status(500).json({
        mensaje: "Error al obtener las clases",
        detalle: error.message || "Error desconocido",
      });
    }
  }
);

// Obtener una clase por ID (admin, recepcionista, entrenador)
router.get(
  "/:id",
  authMiddleware,
  checkRole(["admin", "recepcionista", "entrenador"]),
  async (req, res) => {
    try {
      const clase = await Clase.findById(req.params.id).populate(
        "entrenador",
        "nombre apellido"
      );
      if (!clase) {
        return res.status(404).json({ mensaje: "Clase no encontrada" });
      }
      res.json(clase);
    } catch (error) {
      res.status(500).json({
        mensaje: "Error al obtener la clase",
        detalle: error.message || "Error desconocido",
      });
    }
  }
);

// Crear una clase (solo admin y recepcionista)
router.post(
  "/",
  authMiddleware,
  checkRole(["admin", "recepcionista"]),
  async (req, res) => {
    try {
      console.log("Solicitud POST recibida en /api/clases:", req.body);

      // Validar campos requeridos
      const { nombre, horario, capacidad } = req.body;
      if (!nombre || !horario || !capacidad) {
        return res.status(400).json({
          mensaje: "Faltan campos requeridos",
          detalle: "Asegúrate de enviar nombre, horario y capacidad",
        });
      }

      // Validar y convertir horario a Date
      const horarioDate = new Date(horario);
      if (isNaN(horarioDate.getTime())) {
        return res.status(400).json({ mensaje: "Horario inválido" });
      }

      // Validar entrenador si se proporciona
      let entrenadorId = req.body.entrenador;
      if (entrenadorId) {
        if (!mongoose.Types.ObjectId.isValid(entrenadorId)) {
          return res.status(400).json({ mensaje: "ID de entrenador inválido" });
        }
        const entrenador = await Entrenador.findById(entrenadorId);
        if (!entrenador) {
          return res.status(404).json({ mensaje: "Entrenador no encontrado" });
        }
      }

      const nuevaClase = new Clase({
        nombre,
        entrenador: entrenadorId,
        horario: horarioDate,
        capacidad: Number(capacidad),
        estado: req.body.estado || "activa",
        descripcion: req.body.descripcion || "",
      });
      const claseGuardada = await nuevaClase.save();
      console.log("Clase creada:", claseGuardada);
      res.status(201).json(claseGuardada);
    } catch (error) {
      console.error("Error al crear clase:", error.stack);
      res.status(500).json({
        mensaje: "Error al crear la clase",
        detalle: error.message || "Error desconocido",
      });
    }
  }
);

// Actualizar una clase (solo admin y recepcionista)
router.put(
  "/:id",
  authMiddleware,
  checkRole(["admin", "recepcionista"]),
  async (req, res) => {
    try {
      console.log(
        "Solicitud PUT recibida en /api/clases/:id:",
        req.params.id,
        req.body
      );
      const clase = await Clase.findById(req.params.id).populate("entrenador");
      if (!clase) {
        return res.status(404).json({ mensaje: "Clase no encontrada" });
      }

      // Validar y convertir horario a Date si se proporciona
      let horario = clase.horario;
      if (req.body.horario) {
        horario = new Date(req.body.horario);
        if (isNaN(horario.getTime())) {
          return res.status(400).json({ mensaje: "Horario inválido" });
        }
      }

      // Validar entrenador si se proporciona
      let entrenadorId = req.body.entrenador || clase.entrenador;
      if (entrenadorId && entrenadorId !== clase.entrenador) {
        if (!mongoose.Types.ObjectId.isValid(entrenadorId)) {
          return res.status(400).json({ mensaje: "ID de entrenador inválido" });
        }
        const entrenador = await Entrenador.findById(entrenadorId);
        if (!entrenador) {
          return res.status(404).json({ mensaje: "Entrenador no encontrado" });
        }
      }

      clase.nombre = req.body.nombre || clase.nombre;
      clase.entrenador = entrenadorId;
      clase.horario = horario;
      clase.capacidad = req.body.capacidad || clase.capacidad;
      clase.estado = req.body.estado || clase.estado;
      clase.descripcion = req.body.descripcion || clase.descripcion;

      const claseActualizada = await clase.save();
      console.log("Clase actualizada:", claseActualizada);
      res.json(claseActualizada);
    } catch (error) {
      console.error("Error al actualizar clase:", error.stack);
      res.status(500).json({
        mensaje: "Error al actualizar la clase",
        detalle: error.message || "Error desconocido",
      });
    }
  }
);

// Eliminar una clase (solo admin)
router.delete(
  "/:id",
  authMiddleware,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      const clase = await Clase.findByIdAndDelete(req.params.id);
      if (!clase) {
        return res.status(404).json({ mensaje: "Clase no encontrada" });
      }
      res.json({ mensaje: "Clase eliminada correctamente" });
    } catch (error) {
      res.status(500).json({
        mensaje: "Error al eliminar la clase",
        detalle: error.message || "Error desconocido",
      });
    }
  }
);

module.exports = router;
