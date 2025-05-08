const mongoose = require("mongoose");

const HorarioSchema = new mongoose.Schema({
  dia: { type: String, required: true }, // Ejemplo: "Lunes"
  horaInicio: { type: String, required: true }, // Ejemplo: "08:00"
  horaFin: { type: String, required: true }, // Ejemplo: "10:00"
});

const EntrenadorSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telefono: { type: String },
    especialidad: { type: String },
    horarios: [HorarioSchema], // Array de horarios
    creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Añadido para relacionar con el usuario que creó el entrenador
  },
  { timestamps: true }
);

module.exports = mongoose.model("Entrenador", EntrenadorSchema);
