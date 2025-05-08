const mongoose = require("mongoose");

const rutinaAsignadaSchema = new mongoose.Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
    required: true,
  },
  numeroIdentificacion: { type: String, required: true }, // Para consulta rápida
  rutinaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rutina",
    required: true,
  },
  diasEntrenamiento: { type: [String], required: true }, // Ejemplo: ["Lunes: Pecho", "Miércoles: Piernas"]
  diasDescanso: { type: [String], required: true }, // Ejemplo: ["Martes", "Jueves"]
  fechaAsignacion: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RutinaAsignada", rutinaAsignadaSchema);
