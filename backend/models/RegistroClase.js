const mongoose = require("mongoose");

const registroClaseSchema = new mongoose.Schema({
  clienteId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
    required: true,
  },
  entrenadorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Entrenador",
    required: true,
  },
  nombreClase: { type: String, required: true },
  dia: { type: String, required: true }, // Ejemplo: "Lunes"
  horarioInicio: { type: String, required: true }, // Ejemplo: "08:00"
  horarioFin: { type: String, required: true }, // Ejemplo: "09:00"
  fechaRegistro: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RegistroClase", registroClaseSchema);
