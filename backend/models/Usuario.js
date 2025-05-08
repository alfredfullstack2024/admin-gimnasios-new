const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  correo: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  contraseña: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    enum: ["admin", "empleado"],
    default: "empleado",
  },
});

// 💡 Esta línea previene el error de sobreescritura
const Usuario =
  mongoose.models.Usuario || mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;
