const express = require("express");
const router = express.Router();
const Contabilidad = require("../models/Contabilidad");
const { authMiddleware } = require("../middleware/auth");

// Listar todas las transacciones
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("Solicitud GET recibida en /", req.path, req.query); // Depuración
    if (!Contabilidad || typeof Contabilidad.find !== "function") {
      throw new Error("Modelo Contabilidad no está correctamente definido");
    }

    const { fechaInicio, fechaFin } = req.query;
    const filtro = {};
    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      fin.setHours(23, 59, 59, 999);
      filtro.fecha = { $gte: inicio, $lte: fin };
    } else if (fechaInicio) {
      const inicio = new Date(fechaInicio);
      filtro.fecha = { $gte: inicio };
    } else if (fechaFin) {
      const fin = new Date(fechaFin);
      fin.setHours(23, 59, 59, 999);
      filtro.fecha = { $lte: fin };
    }

    console.log("Filtro aplicado:", filtro); // Depuración
    const transacciones = await Contabilidad.find(filtro)
      .populate("creadoPor", "nombre email")
      .sort({ fecha: -1 });

    console.log("Transacciones encontradas:", transacciones); // Depuración
    res.json({ transacciones });
  } catch (error) {
    console.error("Error al listar transacciones:", error.message);
    res.status(500).json({
      mensaje: "Error al listar las transacciones",
      detalle: error.message,
    });
  }
});

// Crear una nueva transacción
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("Solicitud POST recibida en /", req.body); // Depuración
    if (!Contabilidad) {
      throw new Error("Modelo Contabilidad no está definido");
    }

    const {
      tipo,
      monto,
      fecha,
      descripcion,
      categoria,
      cuentaDebito,
      cuentaCredito,
      referencia,
    } = req.body;

    // Validar campos requeridos
    if (
      !tipo ||
      !monto ||
      !fecha ||
      !descripcion ||
      !cuentaDebito ||
      !cuentaCredito ||
      !referencia
    ) {
      return res.status(400).json({
        mensaje: "Faltan campos requeridos",
        detalle:
          "Asegúrate de enviar tipo, monto, fecha, descripcion, cuentaDebito, cuentaCredito y referencia",
      });
    }

    // Validar que req.user._id esté definido
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        mensaje: "Usuario no autenticado",
        detalle: "No se encontró el ID del usuario en el token",
      });
    }

    const fechaTransaccion = new Date(fecha);
    if (isNaN(fechaTransaccion)) {
      return res.status(400).json({ mensaje: "Fecha inválida" });
    }

    const nuevaTransaccion = new Contabilidad({
      tipo,
      monto: Number(monto),
      fecha: fechaTransaccion,
      descripcion,
      categoria: categoria || "",
      cuentaDebito,
      cuentaCredito,
      referencia,
      creadoPor: req.user._id,
    });

    const transaccionGuardada = await nuevaTransaccion.save();
    await transaccionGuardada.populate("creadoPor", "nombre email");
    console.log("Transacción guardada:", transaccionGuardada); // Depuración
    res.status(201).json(transaccionGuardada);
  } catch (error) {
    console.error("Error al crear transacción:", error.message);
    res.status(500).json({
      mensaje: "Error interno al crear la transacción",
      detalle: error.message,
    });
  }
});

// Obtener una transacción por ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    console.log("Solicitud GET recibida en /:id", req.params.id); // Depuración
    if (!Contabilidad || typeof Contabilidad.findById !== "function") {
      throw new Error("Modelo Contabilidad no está correctamente definido");
    }

    const transaccion = await Contabilidad.findById(req.params.id).populate(
      "creadoPor",
      "nombre email"
    );
    if (!transaccion) {
      return res.status(404).json({ mensaje: "Transacción no encontrada" });
    }
    res.status(200).json(transaccion);
  } catch (error) {
    console.error("Error al obtener transacción:", error.message);
    res.status(500).json({
      mensaje: "Error al obtener la transacción",
      detalle: error.message,
    });
  }
});

// Actualizar una transacción
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    console.log("Solicitud PUT recibida en /:id", req.params.id); // Depuración
    if (!Contabilidad || typeof Contabilidad.findById !== "function") {
      throw new Error("Modelo Contabilidad no está correctamente definido");
    }

    const {
      tipo,
      monto,
      fecha,
      descripcion,
      categoria,
      cuentaDebito,
      cuentaCredito,
      referencia,
    } = req.body;
    const transaccion = await Contabilidad.findById(req.params.id);
    if (!transaccion) {
      return res.status(404).json({ mensaje: "Transacción no encontrada" });
    }

    const fechaTransaccion = new Date(fecha);
    if (isNaN(fechaTransaccion)) {
      return res.status(400).json({ mensaje: "Fecha inválida" });
    }

    transaccion.tipo = tipo;
    transaccion.monto = Number(monto);
    transaccion.fecha = fechaTransaccion;
    transaccion.descripcion = descripcion;
    transaccion.categoria = categoria || "";
    transaccion.cuentaDebito = cuentaDebito;
    transaccion.cuentaCredito = cuentaCredito;
    transaccion.referencia = referencia;
    transaccion.updatedAt = new Date();

    await transaccion.save();
    await transaccion.populate("creadoPor", "nombre email");
    res.json(transaccion);
  } catch (error) {
    console.error("Error al actualizar transacción:", error.message);
    res.status(500).json({
      mensaje: "Error al actualizar la transacción",
      detalle: error.message,
    });
  }
});

// Eliminar una transacción
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    console.log("Solicitud DELETE recibida en /:id", req.params.id); // Depuración
    if (!Contabilidad || typeof Contabilidad.findByIdAndDelete !== "function") {
      throw new Error("Modelo Contabilidad no está correctamente definido");
    }

    const transaccionEliminada = await Contabilidad.findByIdAndDelete(
      req.params.id
    );
    if (!transaccionEliminada) {
      return res.status(404).json({ mensaje: "Transacción no encontrada" });
    }
    res.status(200).json({ mensaje: "Transacción eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar transacción:", error.message);
    res.status(500).json({
      mensaje: "Error al eliminar la transacción",
      detalle: error.message,
    });
  }
});

module.exports = router;
