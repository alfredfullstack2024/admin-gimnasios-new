const mongoose = require("mongoose");

const clienteSchema = new mongoose.Schema({
  numeroIdentificacion: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true }, // Asegura que el campo exista
  telefono: { type: String },
  email: { type: String },
  fechaNacimiento: { type: Date },
  fechaRegistro: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Cliente", clienteSchema);
