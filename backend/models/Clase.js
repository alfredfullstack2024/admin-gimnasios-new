const mongoose = require("mongoose");

const claseSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  entrenador: { type: String, required: true },
  horario: { type: Date, required: true }, // Cambiado de String a Date
  capacidad: { type: Number, required: true },
  estado: { type: String, enum: ["activa", "inactiva"], default: "activa" },
});

module.exports = mongoose.model("Clase", claseSchema);
