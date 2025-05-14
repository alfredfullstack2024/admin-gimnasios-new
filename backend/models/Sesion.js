const mongoose = require("mongoose");

const sesionSchema = new mongoose.Schema(
  {
    profesor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    horarios: [{ dia: String, hora: String }],
    estado: { type: String, enum: ["activa", "inactiva"], default: "activa" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sesion", sesionSchema);
