const mongoose = require("mongoose");

const horarioSchema = new mongoose.Schema({
  dia: {
    type: String,
    required: true,
    enum: [
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
      "domingo",
    ],
  },
  hora: {
    type: String, // Formato "HH:mm"
    required: true,
  },
});

const claseSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  entrenador: { type: mongoose.Schema.Types.ObjectId, ref: "Entrenador" },
  capacidad: { type: Number, required: true },
  estado: { type: String, default: "activa", enum: ["activa", "inactiva"] },
  horario: [horarioSchema], // <- CAMBIO AQUÍ
});

module.exports = mongoose.model("Clase", claseSchema);
