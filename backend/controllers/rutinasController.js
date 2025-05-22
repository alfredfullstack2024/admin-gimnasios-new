const Rutina = require("../models/Rutina");
const Pago = require("../models/Pago");

// Consultar rutinas por número de identificación
exports.consultarRutinasPorNumeroIdentificacion = async (req, res) => {
  const { numeroIdentificacion } = req.params;
  try {
    const rutinas = await Rutina.find({ numeroIdentificacion }).lean();
    if (!rutinas || rutinas.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron rutinas para este cliente." });
    }
    res.json(rutinas);
  } catch (error) {
    console.error("Error al consultar rutinas:", error.message);
    res
      .status(500)
      .json({ message: "Error interno del servidor.", error: error.message });
  }
};

// Consultar pagos por número de identificación
exports.consultarPagosPorNumeroIdentificacion = async (req, res) => {
  const { numeroIdentificacion } = req.params;
  try {
    const pagos = await Pago.find({ numeroIdentificacion }).lean();
    if (!pagos || pagos.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron pagos para este cliente." });
    }
    res.json(pagos);
  } catch (error) {
    console.error("Error al consultar pagos:", error.message);
    res
      .status(500)
      .json({ message: "Error interno del servidor.", error: error.message });
  }
};
