const mongoose = require("mongoose");

const claseSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre de la clase es obligatorio"],
      trim: true,
    },
    descripcion: {
      type: String,
      default: "",
      trim: true,
    },
    horario: {
      type: Date,
      required: [true, "El horario es obligatorio"],
    },
    capacidad: {
      type: Number,
      required: [true, "La capacidad es obligatoria"],
      min: [1, "La capacidad debe ser al menos 1"],
    },
    entrenador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Entrenador",
    },
    estado: {
      type: String,
      enum: ["activa", "inactiva"],
      default: "activa",
    },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: [true, "El creador de la clase es obligatorio"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Clase", claseSchema);
