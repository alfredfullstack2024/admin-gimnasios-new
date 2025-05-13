const mongoose = require("mongoose");

const claseSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    descripcion: {
      type: String,
    },
    horario: {
      type: String,
      required: true,
    },
    capacidad: {
      type: Number,
      required: true,
      min: 1,
    },
    entrenador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entrenador",
    },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Clase", claseSchema);
