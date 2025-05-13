// backend/controllers/claseController.js
const Clase = require("../models/Clase");

const crearClase = async (req, res) => {
  try {
    const { nombre, descripcion, horario, capacidad, entrenador } = req.body;

    const nuevaClase = new Clase({
      nombre,
      descripcion,
      horario,
      capacidad,
      entrenador,
      creadoPor: req.usuario._id, // <-- Asegúrate que el middleware de auth asigna esto
    });

    const claseGuardada = await nuevaClase.save();
    res.status(201).json(claseGuardada);
  } catch (error) {
    console.error("Error al crear clase:", error);
    res.status(500).json({ mensaje: "Error al crear la clase", error });
  }
};

module.exports = {
  crearClase,
};
