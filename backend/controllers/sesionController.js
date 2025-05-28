const Sesion = require("../models/Sesion");

exports.crearSesion = async (req, res) => {
  const { profesorId, fecha, horaInicio, horaFin, tipo, descripcion } =
    req.body;
  const sesion = new Sesion({
    profesorId,
    fecha,
    horaInicio,
    horaFin,
    tipo,
    descripcion,
  });

  try {
    const nuevaSesion = await sesion.save();
    res.status(201).json(nuevaSesion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.obtenerSesiones = async (req, res) => {
  try {
    const sesiones = await Sesion.find().populate("profesorId", "nombre");
    res.json(sesiones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
