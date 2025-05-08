const mongoose = require("mongoose");
const Entrenador = require("../models/Entrenador");

// Listar todos los entrenadores
const listarEntrenadores = async (req, res) => {
  try {
    console.log("Iniciando listarEntrenadores...");
    const entrenadores = await Entrenador.find().sort({ createdAt: -1 });
    console.log("Entrenadores encontrados:", entrenadores);
    res.json(entrenadores);
  } catch (error) {
    console.error("Error al listar entrenadores:", error.message);
    res.status(500).json({
      mensaje: "Error al listar entrenadores",
      detalle: error.message,
    });
  }
};

// Agregar un nuevo entrenador
const agregarEntrenador = async (req, res) => {
  try {
    console.log("Iniciando agregarEntrenador...");
    console.log("Datos recibidos:", req.body);
    console.log("Usuario autenticado:", req.user);

    const { nombre, apellido, email, telefono, especialidad, horarios } =
      req.body;

    if (!nombre || !apellido || !email) {
      return res
        .status(400)
        .json({ mensaje: "Nombre, apellido y email son requeridos" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ mensaje: "Usuario no autenticado" });
    }

    const entrenador = new Entrenador({
      nombre,
      apellido,
      email,
      telefono,
      especialidad,
      horarios: horarios || [], // Añadimos los horarios, si no hay, se usa un array vacío
      creadoPor: req.user._id,
    });

    const savedEntrenador = await entrenador.save();
    console.log("Entrenador guardado:", savedEntrenador);
    res.status(201).json(savedEntrenador);
  } catch (error) {
    console.error("Error al agregar entrenador:", error.message);
    res.status(500).json({
      mensaje: "Error al agregar entrenador",
      detalle: error.message,
    });
  }
};

// Obtener un entrenador por ID
const obtenerEntrenadorPorId = async (req, res) => {
  try {
    console.log("Iniciando obtenerEntrenadorPorId...");
    const entrenador = await Entrenador.findById(req.params.id);
    if (!entrenador) {
      console.log("Entrenador no encontrado para el ID:", req.params.id);
      return res.status(404).json({ mensaje: "Entrenador no encontrado" });
    }
    console.log("Entrenador encontrado:", entrenador);
    res.json(entrenador);
  } catch (error) {
    console.error("Error al obtener entrenador:", error.message);
    res.status(500).json({
      mensaje: "Error al obtener entrenador",
      detalle: error.message,
    });
  }
};

// Editar un entrenador existente
const editarEntrenador = async (req, res) => {
  try {
    console.log("Iniciando editarEntrenador...");
    const { nombre, apellido, email, telefono, especialidad, horarios } =
      req.body;

    const entrenador = await Entrenador.findById(req.params.id);
    if (!entrenador) {
      console.log("Entrenador no encontrado para el ID:", req.params.id);
      return res.status(404).json({ mensaje: "Entrenador no encontrado" });
    }

    const updatedEntrenador = await Entrenador.findByIdAndUpdate(
      req.params.id,
      {
        nombre,
        apellido,
        email,
        telefono,
        especialidad,
        horarios: horarios || [], // Añadimos los horarios al editar
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    console.log("Entrenador actualizado:", updatedEntrenador);
    res.json(updatedEntrenador);
  } catch (error) {
    console.error("Error al actualizar entrenador:", error.message);
    res.status(500).json({
      mensaje: "Error al actualizar entrenador",
      detalle: error.message,
    });
  }
};

// Eliminar un entrenador
const eliminarEntrenador = async (req, res) => {
  try {
    console.log("Iniciando eliminarEntrenador...");
    const entrenador = await Entrenador.findById(req.params.id);
    if (!entrenador) {
      console.log("Entrenador no encontrado para el ID:", req.params.id);
      return res.status(404).json({ mensaje: "Entrenador no encontrado" });
    }

    await Entrenador.findByIdAndDelete(req.params.id);
    console.log("Entrenador eliminado:", entrenador);
    res.json({ mensaje: "Entrenador eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar entrenador:", error.message);
    res.status(500).json({
      mensaje: "Error al eliminar entrenador",
      detalle: error.message,
    });
  }
};

module.exports = {
  listarEntrenadores,
  agregarEntrenador,
  obtenerEntrenadorPorId,
  editarEntrenador,
  eliminarEntrenador,
};
