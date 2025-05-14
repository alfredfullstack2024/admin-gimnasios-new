const Clase = require("../models/Clase");
const mongoose = require("mongoose");

// Crear una nueva clase
const crearClase = async (req, res) => {
  try {
    const { nombre, horario, capacidad, entrenador, estado } = req.body;
    if (!nombre || !horario || !Array.isArray(horario) || !capacidad) {
      return res
        .status(400)
        .json({
          mensaje: "Faltan campos requeridos: nombre, horario y capacidad",
        });
    }

    const nuevaClase = new Clase({
      nombre,
      horario,
      capacidad: Number(capacidad),
      entrenador: entrenador || null,
      estado: estado || "activa",
    });

    const claseGuardada = await nuevaClase.save();
    res.status(201).json(claseGuardada);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al crear la clase", error: error.message });
  }
};

// Obtener todas las clases
const obtenerClases = async (req, res) => {
  try {
    const clases = await Clase.find().populate("entrenador", "nombre apellido");
    res.status(200).json(clases);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener las clases", error: error.message });
  }
};

// Obtener una clase por ID
const obtenerClasePorId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: "ID inválido" });
    }
    const clase = await Clase.findById(id).populate(
      "entrenador",
      "nombre apellido"
    );
    if (!clase) return res.status(404).json({ mensaje: "Clase no encontrada" });
    res.status(200).json(clase);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener la clase", error: error.message });
  }
};

// Actualizar una clase
const actualizarClase = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, horario, capacidad, entrenador, estado } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: "ID inválido" });
    }
    const clase = await Clase.findById(id);
    if (!clase) return res.status(404).json({ mensaje: "Clase no encontrada" });

    clase.nombre = nombre || clase.nombre;
    clase.horario = horario || clase.horario;
    clase.capacidad =
      capacity !== undefined ? Number(capacity) : clase.capacidad;
    clase.entrenador = entrenador || clase.entrenador;
    clase.estado = estado || clase.estado;

    const claseActualizada = await clase.save();
    res.status(200).json(claseActualizada);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al actualizar la clase", error: error.message });
  }
};

// Eliminar una clase
const eliminarClase = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: "ID inválido" });
    }
    const clase = await Clase.findByIdAndDelete(id);
    if (!clase) return res.status(404).json({ mensaje: "Clase no encontrada" });
    res.status(200).json({ mensaje: "Clase eliminada correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al eliminar la clase", error: error.message });
  }
};

module.exports = {
  crearClase,
  obtenerClases,
  obtenerClasePorId,
  actualizarClase,
  eliminarClase,
};
