const Usuario = require("../models/Usuario");
const jwt = require("jsonwebtoken");

// ✅ REGISTRAR USUARIO
const registerUser = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono, direccion, password, rol } =
      req.body;

    const normalizedNombre = nombre?.trim();
    const normalizedApellido = apellido?.trim();
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedPassword = password?.trim();

    if (
      !normalizedNombre ||
      !normalizedApellido ||
      !normalizedEmail ||
      !normalizedPassword
    ) {
      return res.status(400).json({
        message: "Nombre, apellido, email y contraseña son obligatorios",
      });
    }

    const userExists = await Usuario.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya está registrado" });
    }

    const nuevoUsuario = new Usuario({
      nombre: normalizedNombre,
      apellido: normalizedApellido,
      email: normalizedEmail,
      telefono: telefono?.trim() || "No registrado",
      direccion: direccion?.trim() || "No registrada",
      password: normalizedPassword,
      rol: rol || "empleado",
    });

    await nuevoUsuario.save();

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      userId: nuevoUsuario._id,
      email: nuevoUsuario.email,
    });
  } catch (error) {
    console.error("❌ Error al registrar usuario:", error.message, error.stack);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// ✅ LOGIN DE USUARIO
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email y contraseña son obligatorios" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const usuario = await Usuario.findOne({ email: normalizedEmail });

    if (!usuario) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const isMatch = await usuario.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("❌ ERROR: JWT_SECRET no está definido en .env");
      return res
        .status(500)
        .json({ message: "Error de configuración del servidor" });
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("❌ Error al iniciar sesión:", error.message, error.stack);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// ✅ PERFIL DEL USUARIO AUTENTICADO
const getUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "⚠️ Usuario no autenticado" });
    }

    const usuario = await Usuario.findById(req.user.id).select("-password");

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json({
      id: usuario._id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono,
      direccion: usuario.direccion,
      rol: usuario.rol,
    });
  } catch (error) {
    console.error(
      "❌ Error al obtener el perfil del usuario:",
      error.message,
      error.stack
    );
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

// 🧠 DEBUG opcional (puede comentarlo si desea)
console.log("✅ Funciones exportadas desde userController:", {
  registerUser,
  loginUser,
  getUserProfile,
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};
