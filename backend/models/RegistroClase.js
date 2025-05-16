const mongoose = require("mongoose");

const registroClaseSchema = new mongoose.Schema({
  numeroIdentificacion: { type: String, required: true },
  entrenadorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Entrenador",
    required: true,
  },
  nombreClase: { type: String, required: true },
  dia: { type: String, required: true },
  horarioInicio: { type: String, required: true },
  horarioFin: { type: String, required: true },
});

module.exports = mongoose.model("RegistroClase", registroClaseSchema);
