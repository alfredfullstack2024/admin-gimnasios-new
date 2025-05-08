const mongoose = require("mongoose");

const clienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  apellido: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  telefono: {
    type: String,
    trim: true,
  },
  direccion: {
    type: String,
    trim: true,
  },
  numeroIdentificacion: { type: String, required: true, unique: true },
  estado: {
    type: String,
    enum: ["activo", "inactivo"],
    default: "activo",
  },

  fechaRegistro: {
    type: Date,
    default: Date.now,
  },
  membresiaActiva: {
    type: Boolean,
    default: false,
  },
  membresiaFechaFin: {
    type: Date,
  },
});

module.exports = mongoose.model("Cliente", clienteSchema);
