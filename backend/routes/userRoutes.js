const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { authMiddleware, checkRole } = require("../middleware/auth");

// Obtener todos los usuarios (solo admin)
router.get("/", authMiddleware, checkRole(["admin"]), async (req, res) => {
  try {
    const usuarios = await User.find().select("-password"); // No devolver contraseñas
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los usuarios", error });
  }
});

// Obtener un usuario por ID (solo admin)
router.get("/:id", authMiddleware, checkRole(["admin"]), async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id).select("-password");
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el usuario", error });
  }
});

// Crear un usuario (solo admin)
router.post("/", authMiddleware, checkRole(["admin"]), async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    const nuevoUsuario = new User({ nombre, email, password, rol });
    await nuevoUsuario.save();
    res.status(201).json({ mensaje: "Usuario creado correctamente" });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al crear el usuario", error });
  }
});

// Actualizar un usuario (solo admin)
router.put("/:id", authMiddleware, checkRole(["admin"]), async (req, res) => {
  try {
    const { nombre, email, rol, password } = req.body;
    const updateData = { nombre, email, rol };
    if (password) {
      updateData.password = password; // El middleware pre-save se encargará de hashear la contraseña
    }
    const usuario = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    }).select("-password");
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }
    res.json({ mensaje: "Usuario actualizado correctamente", usuario });
  } catch (error) {
    res.status(400).json({ mensaje: "Error al actualizar el usuario", error });
  }
});

// Eliminar un usuario (solo admin)
router.delete(
  "/:id",
  authMiddleware,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      const usuario = await User.findByIdAndDelete(req.params.id);
      if (!usuario) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }
      res.json({ mensaje: "Usuario eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ mensaje: "Error al eliminar el usuario", error });
    }
  }
);

module.exports = router;
