const mongoose = require("mongoose");

const composicionCorporalSchema = new mongoose.Schema(
  {
    numeroIdentificacion: { type: String, required: true, index: true }, // Añadir index: true
    fecha: { type: Date, required: true },
    peso: { type: Number, required: true },
    altura: { type: Number, required: true },
    imc: { type: Number },
    porcentajeGrasa: { type: Number },
    porcentajeMusculo: { type: Number },
    notas: { type: String },
    medidas: {
      brazoDerecho: Number,
      brazoIzquierdo: Number,
      pecho: Number,
      cintura: Number,
      cadera: Number,
      piernaDerecha: Number,
      piernaIzquierda: Number,
    },
    objetivo: { type: String },
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

module.exports = mongoose.model(
  "ComposicionCorporal",
  composicionCorporalSchema
);
