const mongoose = require("mongoose");

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
