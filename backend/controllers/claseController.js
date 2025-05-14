const Clase = require("../models/Clase");
const Usuario = require("../models/Usuario");
const Entrenador = require("../models/Entrenador");
const mongoose = require("mongoose");

// Crear una nueva clase
const crearClase = async (req, res) => {
  try {
    console.log("Cuerpo recibido (sin parsear):", req.body);

    const {
      nombre,
      horarios,
      capacidad,
      creadoPor,
      descripcion,
      entrenador,
      estado,
    } = req.body;

    // Validar campos requeridos
    console.log("Validando campos:", {
      nombre,
      horarios,
      capacidad,
      creadoPor,
    });
    if (!nombre || !horarios || !capacidad || !creadoPor) {
      console.log("Validación fallida - Campos requeridos:", {
        nombre,
        horarios,
        capacidad,
        creadoPor,
      });
      return res.status(400).json({
        mensaje: "Faltan campos requeridos",
        detalle: "Asegúrate de enviar nombre, horarios, capacidad y creadoPor",
      });
    }

    // Validar tipos y formatos
    if (typeof nombre !== "string" || nombre.trim() === "") {
      return res
        .status(400)
        .json({ mensaje: "El nombre debe ser una cadena no vacía" });
    }

    if (!Array.isArray(horarios) || horarios.length === 0) {
      return res
        .status(400)
        .json({ mensaje: "Horarios debe ser un array no vacío" });
    }

    const diasValidos = [
      "lunes",
      "martes",
      "miércoles",
      "jueves",
      "viernes",
      "sábado",
      "domingo",
    ];
    for (const horario of horarios) {
      console.log("Validando horario:", horario);
      if (!horario.dia || !horario.hora) {
        return res
          .status(400)
          .json({ mensaje: "Cada horario debe tener un día y una hora" });
      }
      if (!diasValidos.includes(horario.dia.toLowerCase())) {
        return res
          .status(400)
          .json({ mensaje: `Día inválido: ${horario.dia}` });
      }
      if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(horario.hora)) {
        return res
          .status(400)
          .json({ mensaje: `Formato de hora inválido: ${horario.hora}` });
      }
    }

    const capacidadNumerica = Number(capacidad);
    if (isNaN(capacidadNumerica) || capacidadNumerica <= 0) {
      console.log("Capacidad inválida:", capacidad, typeof capacidad);
      return res
        .status(400)
        .json({ mensaje: "La capacidad debe ser un número positivo" });
    }

    if (!mongoose.Types.ObjectId.isValid(creadoPor)) {
      console.log("creadoPor inválido:", creadoPor);
      return res
        .status(400)
        .json({ mensaje: "creadoPor debe ser un ObjectId válido" });
    }
    const usuarioCreador = await Usuario.findById(creadoPor);
    if (!usuarioCreador) {
      return res.status(400).json({ mensaje: "El usuario creador no existe" });
    }

    if (entrenador) {
      if (!mongoose.Types.ObjectId.isValid(entrenador)) {
        console.log("entrenador inválido:", entrenador);
        return res
          .status(400)
          .json({ mensaje: "entrenador debe ser un ObjectId válido" });
      }
      const entrenadorExistente = await Entrenador.findById(entrenador);
      if (!entrenadorExistente) {
        return res.status(400).json({ mensaje: "El entrenador no existe" });
      }
    }

    const nuevaClase = new Clase({
      nombre,
      horarios,
      capacidad: capacidadNumerica,
      creadoPor,
      descripcion: descripcion || "",
      entrenador: entrenador || null,
      estado: estado || "activa",
    });

    console.log("Clase antes de guardar:", nuevaClase);
    const claseGuardada = await nuevaClase.save();
    console.log("Clase guardada:", claseGuardada);
    res.status(201).json(claseGuardada);
  } catch (error) {
    if (error.name === "ValidationError") {
      console.error("Error de validación de Mongoose:", error.errors);
      const mensajesError = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        mensaje: "Error de validación",
        detalle: mensajesError.join(", "),
      });
    }
    console.error("Error al crear la clase:", error);
    res
      .status(500)
      .json({ mensaje: "Error al crear la clase", error: error.message });
  }
};

// Obtener todas las clases
const obtenerClases = async (req, res) => {
  try {
    const clases = await Clase.find()
      .populate("creadoPor", "nombre email")
      .populate("entrenador", "nombre apellido");
    res.status(200).json(clases);
  } catch (error) {
    console.error("Error al obtener las clases:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener las clases", error: error.message });
  }
};

// Obtener una clase por ID
const obtenerClasePorId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: "ID de clase inválido" });
    }

    const clase = await Clase.findById(id)
      .populate("creadoPor", "nombre email")
      .populate("entrenador", "nombre apellido");
    if (!clase) {
      return res.status(404).json({ mensaje: "Clase no encontrada" });
    }

    res.status(200).json(clase);
  } catch (error) {
    console.error("Error al obtener la clase:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener la clase", error: error.message });
  }
};

// Actualizar una clase
const actualizarClase = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, horarios, capacidad, descripcion, entrenador, estado } =
      req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: "ID de clase inválido" });
    }

    const clase = await Clase.findById(id);
    if (!clase) {
      return res.status(404).json({ mensaje: "Clase no encontrada" });
    }

    if (nombre && (typeof nombre !== "string" || nombre.trim() === "")) {
      return res
        .status(400)
        .json({ mensaje: "El nombre debe ser una cadena no vacía" });
    }

    if (horarios) {
      if (!Array.isArray(horarios) || horarios.length === 0) {
        return res
          .status(400)
          .json({ mensaje: "Horarios debe ser un array no vacío" });
      }
      const diasValidos = [
        "lunes",
        "martes",
        "miércoles",
        "jueves",
        "viernes",
        "sábado",
        "domingo",
      ];
      for (const horario of horarios) {
        if (!horario.dia || !horario.hora) {
          return res
            .status(400)
            .json({ mensaje: "Cada horario debe tener un día y una hora" });
        }
        if (!diasValidos.includes(horario.dia.toLowerCase())) {
          return res
            .status(400)
            .json({ mensaje: `Día inválido: ${horario.dia}` });
        }
        if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(horario.hora)) {
          return res
            .status(400)
            .json({ mensaje: `Formato de hora inválido: ${horario.hora}` });
        }
      }
      clase.horarios = horarios;
    }

    if (capacidad) {
      const capacidadNumerica = Number(capacidad);
      if (isNaN(capacidadNumerica) || capacidadNumerica <= 0) {
        return res
          .status(400)
          .json({ mensaje: "La capacidad debe ser un número positivo" });
      }
      clase.capacidad = capacidadNumerica;
    }

    if (entrenador) {
      if (!mongoose.Types.ObjectId.isValid(entrenador)) {
        return res
          .status(400)
          .json({ mensaje: "entrenador debe ser un ObjectId válido" });
      }
      const entrenadorExistente = await Entrenador.findById(entrenador);
      if (!entrenadorExistente) {
        return res.status(400).json({ mensaje: "El entrenador no existe" });
      }
      clase.entrenador = entrenador;
    }

    if (nombre) clase.nombre = nombre;
    if (descripcion) clase.descripcion = descripcion;
    if (estado) clase.estado = estado;

    const claseActualizada = await clase.save();
    res.status(200).json(claseActualizada);
  } catch (error) {
    if (error.name === "ValidationError") {
      const mensajesError = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        mensaje: "Error de validación",
        detalle: mensajesError.join(", "),
      });
    }
    console.error("Error al actualizar la clase:", error);
    res
      .status(500)
      .json({ mensaje: "Error al actualizar la clase", error: error.message });
  }
};

// Eliminar una clase
const eliminarClase = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ mensaje: "ID de clase inválido" });
    }

    const clase = await Clase.findByIdAndDelete(id);
    if (!clase) {
      return res.status(404).json({ mensaje: "Clase no encontrada" });
    }

    res.status(200).json({ mensaje: "Clase eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar la clase:", error);
    res
      .status(500)
      .json({ mensaje: "Error al eliminar la clase", error: error.message });
  }
};

module.exports = {
  crearClase,
  obtenerClases,
  obtenerClasePorId,
  actualizarClase,
  eliminarClase,
};
