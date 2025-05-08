const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { authMiddleware } = require("../middleware/auth");

// Obtener datos del usuario autenticado
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el usuario", error });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar que se enviaron email y password
    if (!email || !password) {
      return res
        .status(400)
        .json({ mensaje: "Email y contraseña son obligatorios" });
    }

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ mensaje: "Usuario no encontrado" });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ mensaje: "Contraseña incorrecta" });
    }

    // Generar token con el rol incluido
    const token = jwt.sign(
      { id: user._id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al iniciar sesión", error });
  }
});

// Registro
router.post("/register", async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Validar datos
    if (!nombre || !email || !password) {
      return res
        .status(400)
        .json({ mensaje: "Nombre, email y contraseña son obligatorios" });
    }

    const nuevoUsuario = new User({ nombre, email, password, rol });
    await nuevoUsuario.save();

    const token = jwt.sign(
      {
        id: nuevoUsuario._id,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
      },
      process.env.JWT_SECRET || "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(201).json({
      token,
      user: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
      },
    });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al registrar usuario", error });
  }
});

module.exports = router;
