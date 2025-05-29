const Rutina = require("../models/Rutina");
const Pago = require("../models/Pago");
const RutinaAsignada = require("../models/RutinaAsignada");
const Cliente = require("../models/Cliente");

exports.consultarRutinasPorNumeroIdentificacion = async (req, res) => {
  const { numeroIdentificacion } = req.params;
  try {
    const cliente = await Cliente.findOne({ numeroIdentificacion });
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado." });
    }
    console.log("Cliente encontrado:", cliente);

    const asignaciones = await RutinaAsignada.find({ clienteId: cliente._id })
      .populate("clienteId", "nombre apellido")
      .populate("rutinaId", "nombreEjercicio grupoMuscular");
    console.log(
      "Asignaciones después de populate:",
      JSON.stringify(asignaciones, null, 2)
    );

    if (!asignaciones || asignaciones.length === 0) {
      return res.status(200).json([]);
    }

    // Transform the data to match ConsultarRutina.js expectations
    const transformedAsignaciones = asignaciones.map((asignacion) => ({
      nombreRutina: asignacion.rutinaId?.nombreEjercicio || "Desconocido",
      ejercicios: [
        `${
          asignacion.rutinaId?.grupoMuscular || "Desconocido"
        }: 3 series x 10 repeticiones`,
      ],
      duracion: 60, // Default or fetch from rutinaId if available
      fechaAsignacion: asignacion.createdAt,
      clienteId: asignacion.clienteId, // Keep for reference if needed
      rutinaId: asignacion.rutinaId, // Keep for reference if needed
      diasEntrenamiento: asignacion.diasEntrenamiento,
      diasDescanso: asignacion.diasDescanso,
    }));

    res.json(transformedAsignaciones);
  } catch (error) {
    console.error("Error al consultar rutinas asignadas:", error.message);
    res
      .status(500)
      .json({ message: "Error interno del servidor.", error: error.message });
  }
};

exports.consultarPagosPorNumeroIdentificacion = async (req, res) => {
  const { numeroIdentificacion } = req.params;
  try {
    const cliente = await Cliente.findOne({ numeroIdentificacion }).lean();
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado." });
    }

    const pagos = await Pago.find({ clienteId: cliente._id }).lean();
    if (!pagos || pagos.length === 0) {
      return res.status(200).json([]);
    }

    res.json(pagos);
  } catch (error) {
    console.error("Error al consultar pagos:", error.message);
    res
      .status(500)
      .json({ message: "Error interno del servidor.", error: error.message });
  }
};

// Add the missing eliminarAsignacionRutina function
exports.eliminarAsignacionRutina = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if user is authenticated and has admin role
    if (!req.user) {
      return res.status(401).json({ message: "No estás autenticado." });
    }
    console.log("Usuario autenticado:", req.user);
    if (!req.user.role || req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "No tienes permisos para realizar esta acción." });
    }

    // Find and delete the assigned routine
    const asignacion = await RutinaAsignada.findByIdAndDelete(id);
    if (!asignacion) {
      return res.status(404).json({ message: "Asignación no encontrada." });
    }

    res.json({ message: "Asignación eliminada con éxito." });
  } catch (error) {
    console.error("Error al eliminar asignación:", error.message);
    res
      .status(500)
      .json({ message: "Error interno del servidor.", error: error.message });
  }
};
