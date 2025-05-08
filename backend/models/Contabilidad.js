const mongoose = require("mongoose");

const contabilidadSchema = new mongoose.Schema(
  {
    fecha: {
      type: Date,
      required: true,
    },
    descripcion: {
      type: String,
      required: true,
    },
    tipo: {
      type: String,
      enum: ["ingreso", "egreso"],
      required: true,
    },
    categoria: {
      type: String,
      default: "",
    },
    cuentaDebito: {
      type: String,
      required: true,
    },
    cuentaCredito: {
      type: String,
      required: true,
    },
    monto: {
      type: Number,
      required: true,
    },
    referencia: {
      type: String,
      required: true,
    },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, collection: "transacciones" }
);

module.exports = mongoose.model("Contabilidad", contabilidadSchema);
