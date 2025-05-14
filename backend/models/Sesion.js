const mongoose = require("mongoose");

const sesionSchema = new mongoose.Schema({
  profesorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Entrenador",
    required: true,
  },
  fecha: {
    type: Date,
    required: true,
  },
  horaInicio: {
    type: String,
    required: true,
  },
  horaFin: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Sesion", sesionSchema);
