const mongoose = require("mongoose");

<<<<<<< HEAD
const registroClasesSchema = new mongoose.Schema({
  numeroIdentificacion: {
    type: String,
    required: true,
  },
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  entrenadorId: {
    type: String,
    required: true,
  },
  nombreClase: {
    type: String,
    required: true,
  },
  dia: {
    type: String,
    required: true,
  },
  horarioInicio: {
    type: String,
    required: true,
  },
  horarioFin: {
    type: String,
    required: true,
  },
  fechaRegistro: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("RegistroClases", registroClasesSchema);
=======
const registroClaseSchema = new mongoose.Schema(
  {
    numeroIdentificacion: { type: String, required: true },
    nombre: { type: String, required: true }, // Nuevo campo para el nombre
    apellido: { type: String, required: true }, // Nuevo campo para el apellido
    entrenadorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entrenador",
      required: true,
    },
    nombreClase: { type: String, required: true },
    dia: { type: String, required: true },
    horarioInicio: { type: String, required: true },
    horarioFin: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RegistroClase", registroClaseSchema);
>>>>>>> 215dfae80f6fe6a3e500483bfc6db50798d6b9af
