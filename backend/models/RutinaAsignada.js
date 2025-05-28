const mongoose = require("mongoose");

const rutinaAsignadaSchema = new mongoose.Schema(
  {
    clienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
      required: true,
    },
    numeroIdentificacion: {
      type: String,
      required: true,
    },
    rutinaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rutina",
      required: true,
    },
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
    asignadaPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("RutinaAsignada", rutinaAsignadaSchema);
