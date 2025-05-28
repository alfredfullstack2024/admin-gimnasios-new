const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Registrar un nuevo usuario
const register = async (req, res) => {
  try {
    const { nombre, email, password, role } = req.body;

    if (!nombre || !email || !password) {
      return res
        .status(400)
        .json({ message: "Nombre, email y contraseña son requeridos" });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado" });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear el nuevo usuario
    const user = new User({
      nombre,
      email,
      password: hashedPassword,
      role: role || "user", // Por defecto, el rol es "user" si no se especifica
    });

    const savedUser = await user.save();

    // Generar un token JWT
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
      expiresIn: "30d", // Cambiado a 30 días para evitar expiraciones rápidas
    });

    console.log("Token generado para registro:", token); // Log para depuración

    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        nombre: savedUser.nombre,
        email: savedUser.email,
        role: savedUser.role,
      },
    });
  } catch (error) {
    console.error("Error al registrar usuario:", error.message);
    res.status(500).json({
      message: "Error al registrar usuario",
      detalle: error.message,
    });
  }
};

// Iniciar sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email y contraseña son requeridos" });
    }

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    }

    // Generar un token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d", // Cambiado a 30 días para evitar expiraciones rápidas
    });

    console.log("Token generado para login:", token); // Log para depuración

    res.json({
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error.message);
    res.status(500).json({
      message: "Error al iniciar sesión",
      detalle: error.message,
    });
  }
};

// Obtener los datos del usuario autenticado
const getMe = async (req, res) => {
  try {
    // req.user ya está poblado por el middleware authMiddleware (protect)
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      id: user._id,
      nombre: user.nombre,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error.message);
    res.status(500).json({
      message: "Error al obtener datos del usuario",
      detalle: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
};
