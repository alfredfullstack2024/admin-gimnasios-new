const Sesion = require("../models/Sesion");
const mongoose = require("mongoose");

const crearSesion = async (req, res) => {
  try {
    const { profesor, horarios } = req.body;
    if (!profesor || !Array.isArray(horarios) || horarios.length === 0) {
      return res.status(400).json({ mensaje: "Faltan datos requeridos" });
    }
    const nuevaSesion = new Sesion({ profesor, horarios });
    const sesionGuardada = await nuevaSesion.save();
    res.status(201).json(sesionGuardada);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

const obtenerSesiones = async (req, res) => {
  try {
    const sesiones = await Sesion.find().populate(
      "profesor",
      "nombre apellido"
    );
    res.status(200).json(sesiones);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

module.exports = { crearSesion, obtenerSesiones };
