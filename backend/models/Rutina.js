const mongoose = require("mongoose");

const rutinaSchema = new mongoose.Schema(
  {
    grupoMuscular: { type: String, required: true },
    nombreEjercicio: { type: String, required: true },
    series: { type: Number, required: true },
    repeticiones: { type: Number, required: true },
    descripcion: { type: String },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario", // Cambiado de "User" a "Usuario"
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rutina", rutinaSchema);
