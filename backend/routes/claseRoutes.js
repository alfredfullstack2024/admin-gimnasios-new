const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Clase = require("../models/Clase");
const Entrenador = require("../models/Entrenador");
const { authMiddleware, checkRole } = require("../middleware/auth");

// Obtener todas las clases
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
        detalle: error.message,
      });
    }
  }
);

// Obtener una clase por ID
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
        detalle: error.message,
      });
    }
  }
);

// Crear una clase
router.post(
  "/",
  authMiddleware,
  checkRole(["admin", "recepcionista"]),
  async (req, res) => {
    try {
      console.log("Cuerpo recibido:", req.body);
      console.log("Usuario en req:", req.user); // Cambié req.usuario por req.user

      const { nombre, descripcion, horario, capacidad, entrenador, estado } =
        req.body;

      // Validar campos requeridos
      if (
        !nombre ||
        !Array.isArray(horario) ||
        horario.length === 0 ||
        !capacidad
      ) {
        return res.status(400).json({
          mensaje: "Faltan campos requeridos",
          detalle:
            "Asegúrate de enviar nombre, al menos un horario y capacidad",
        });
      }

      // Validar estructura de cada horario
      for (const h of horario) {
        if (!h.dia || !h.hora) {
          return res.status(400).json({
            mensaje: "Cada horario debe tener un día y una hora",
          });
        }
      }

      let entrenadorId = null;
      if (entrenador) {
        if (!mongoose.Types.ObjectId.isValid(entrenador)) {
          return res.status(400).json({ mensaje: "ID de entrenador inválido" });
        }
        const entrenadorExistente = await Entrenador.findById(entrenador);
        if (!entrenadorExistente) {
          return res.status(404).json({ mensaje: "Entrenador no encontrado" });
        }
        entrenadorId = entrenador;
      }

      // Verificar que req.user._id exista
      if (!req.user || !req.user._id) {
        return res.status(401).json({
          mensaje: "Usuario no autenticado o ID no disponible",
          detalle: "Verifica el middleware de autenticación",
        });
      }

      const nuevaClase = new Clase({
        nombre,
        descripcion: descripcion || "",
        horario,
        capacidad,
        entrenador: entrenadorId,
        estado: estado || "activa",
        creadoPor: req.user._id, // Cambié req.usuario._id por req.user._id
      });

      const claseGuardada = await nuevaClase.save();
      res.status(201).json(claseGuardada);
    } catch (error) {
      console.error("Error al crear clase:", error.stack);
      res.status(500).json({
        mensaje: "Error al crear la clase",
        detalle: error.message,
      });
    }
  }
);

// Actualizar una clase
router.put(
  "/:id",
  authMiddleware,
  checkRole(["admin", "recepcionista"]),
  async (req, res) => {
    try {
      const clase = await Clase.findById(req.params.id);
      if (!clase) {
        return res.status(404).json({ mensaje: "Clase no encontrada" });
      }

      const { nombre, descripcion, horario, capacidad, entrenador, estado } =
        req.body;

      if (horario && (!Array.isArray(horario) || horario.length === 0)) {
        return res.status(400).json({
          mensaje: "Debe proporcionar al menos un horario válido",
        });
      }

      if (horario) {
        for (const h of horario) {
          if (!h.dia || !h.hora) {
            return res.status(400).json({
              mensaje: "Cada horario debe tener un día y una hora",
            });
          }
        }
        clase.horario = horario;
      }

      if (entrenador) {
        if (!mongoose.Types.ObjectId.isValid(entrenador)) {
          return res.status(400).json({ mensaje: "ID de entrenador inválido" });
        }
        const entrenadorExistente = await Entrenador.findById(entrenador);
        if (!entrenadorExistente) {
          return res.status(404).json({ mensaje: "Entrenador no encontrado" });
        }
        clase.entrenador = entrenador;
      }

      clase.nombre = nombre || clase.nombre;
      clase.descripcion = descripcion ?? clase.descripcion;
      clase.capacidad = capacidad ?? clase.capacidad;
      clase.estado = estado || clase.estado;

      const claseActualizada = await clase.save();
      res.json(claseActualizada);
    } catch (error) {
      console.error("Error al actualizar clase:", error.stack);
      res.status(500).json({
        mensaje: "Error al actualizar la clase",
        detalle: error.message,
      });
    }
  }
);

// Eliminar una clase
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
        detalle: error.message,
      });
    }
  }
);

module.exports = router;
