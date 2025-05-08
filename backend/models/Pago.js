const mongoose = require("mongoose");

const pagoSchema = new mongoose.Schema(
  {
    cliente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cliente",
      default: null,
    },
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      default: null,
    },
    cantidad: { type: Number, default: 1 },
    monto: { type: Number, required: true },
    fecha: { type: Date, required: true },
    metodoPago: { type: String, required: true },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Pago", pagoSchema);
