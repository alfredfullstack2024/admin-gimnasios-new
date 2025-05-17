const mongoose = require("mongoose");
const rutinaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  diasEntrenamiento: [
    {
      type: String,
      enum: [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
      ],
    },
  ],
  diasDescanso: [
    {
      type: String,
      enum: [
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado",
        "Domingo",
      ],
    },
  ],
});

const clienteSchema = mongoose.Schema({
  nombre: { type: String, required: true },
  apellido: { type: String, default: "" },
  email: { type: String, required: true },
  telefono: { type: String, default: "" },
  direccion: { type: String, default: "" },
  estado: { type: String, default: "activo" },
  numeroIdentificacion: { type: String, required: true, unique: true },
  fechaRegistro: { type: Date, default: Date.now },
  membresiaActiva: { type: Boolean, default: false },
});

module.exports = mongoose.model("Cliente", clienteSchema);
