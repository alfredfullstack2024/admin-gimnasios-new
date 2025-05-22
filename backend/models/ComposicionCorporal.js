const mongoose = require("mongoose");

const composicionCorporalSchema = new mongoose.Schema(
  {
    clienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
      required: true,
    },
    peso: { type: Number, required: true },
    medidas: {
      brazoDerecho: { type: Number },
      brazoIzquierdo: { type: Number },
      pecho: { type: Number },
      cintura: { type: Number },
      cadera: { type: Number },
      piernaDerecha: { type: Number },
      piernaIzquierda: { type: Number },
    },
    porcentajeGrasa: { type: Number },
    masaMuscular: { type: Number },
    objetivo: {
      type: String,
      enum: [
        "Cardio",
        "Pérdida de peso",
        "Ganar músculo",
        "Mejorar resistencia",
        "Rehabilitación",
      ],
      required: true,
    },
    antecedentesMedicos: {
      problemasFisicos: { type: String },
      notasAdicionales: { type: String },
    },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ComposicionCorporal",
  composicionCorporalSchema
);
