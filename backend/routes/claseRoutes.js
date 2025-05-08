const express = require("express");
const router = express.Router();
const Clase = require("../models/Clase");
const { authMiddleware, checkRole } = require("../middleware/auth");

// Obtener todas las clases (admin, recepcionista, entrenador)
router.get(
  "/",
  authMiddleware,
  checkRole(["admin", "recepcionista", "entrenador"]),
  async (req, res) => {
    try {
      const clases = await Clase.find().populate("entrenador");
      res.json(clases);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener las clases", error });
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
      const clase = await Clase.findById(req.params.id).populate("entrenador");
      if (!clase) {
        return res.status(404).json({ mensaje: "Clase no encontrada" });
      }
      res.json(clase);
    } catch (error) {
      res.status(500).json({ mensaje: "Error al obtener la clase", error });
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
      // Validar y convertir horario a Date
      const horario = new Date(req.body.horario);
      if (isNaN(horario.getTime())) {
        return res.status(400).json({ mensaje: "Horario inválido" });
      }

      const nuevaClase = new Clase({
        nombre: req.body.nombre,
        entrenador: req.body.entrenador,
        horario: horario,
        capacidad: req.body.capacidad,
        estado: req.body.estado || "activa",
      });
      await nuevaClase.save();
      res.status(201).json(nuevaClase);
    } catch (error) {
      res.status(400).json({ mensaje: "Error al crear la clase", error });
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

      clase.nombre = req.body.nombre || clase.nombre;
      clase.entrenador = req.body.entrenador || clase.entrenador;
      clase.horario = horario;
      clase.capacidad = req.body.capacidad || clase.capacidad;
      clase.estado = req.body.estado || clase.estado;

      const claseActualizada = await clase.save();
      res.json(claseActualizada);
    } catch (error) {
      res.status(400).json({ mensaje: "Error al actualizar la clase", error });
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
      res.status(500).json({ mensaje: "Error al eliminar la clase", error });
    }
  }
);

module.exports = router;
