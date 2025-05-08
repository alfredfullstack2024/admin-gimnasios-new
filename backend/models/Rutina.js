const mongoose = require("mongoose");

const rutinaSchema = new mongoose.Schema({
  grupoMuscular: {
    type: String,
    required: true,
  },
  nombreEjercicio: {
    type: String,
    required: true,
  },
  series: {
    type: Number,
    required: true,
  },
  repeticiones: {
    type: Number,
    required: true,
  },
  descripcion: {
    type: String,
    default: "",
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Referencia al modelo User
    required: true,
  },
});

module.exports = mongoose.model("Rutina", rutinaSchema);
