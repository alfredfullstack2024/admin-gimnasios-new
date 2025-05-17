const Rutina = require("../models/Rutina");
const Cliente = require("../models/Cliente");

exports.consultarRutinaPorNumeroIdentificacion = async (req, res) => {
  const { numeroIdentificacion } = req.params;

  try {
    const cliente = await Cliente.findOne({ numeroIdentificacion });
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado." });
    }

    const rutinas = await Rutina.find({ clienteId: cliente._id });
    const rutinasConDetalles = await Promise.all(
      rutinas.map(async (rutina) => {
        const clienteNombre = cliente.nombre;
        return {
          clienteNombre,
          nombre: rutina.nombre,
          diasEntrenamiento: rutina.diasEntrenamiento,
          diasDescanso: rutina.diasDescanso,
        };
      })
    );
    res.json(rutinasConDetalles);
  } catch (error) {
    console.error("Error al consultar rutinas:", error.stack);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
