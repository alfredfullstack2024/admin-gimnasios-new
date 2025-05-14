const mongoose = require("mongoose");

const claseSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    horario: [{ dia: String, hora: String }],
    capacidad: { type: Number, required: true },
    entrenador: { type: mongoose.Schema.Types.ObjectId, ref: "Entrenador" },
    estado: { type: String, enum: ["activa", "inactiva"], default: "activa" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Clase", claseSchema);
