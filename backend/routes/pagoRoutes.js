const express = require("express");
const router = express.Router();
const Pago = require("../models/Pago");
const Contabilidad = require("../models/Contabilidad");
const { authMiddleware } = require("../middleware/auth");

// Listar todos los pagos
router.get("/", authMiddleware, async (req, res) => {
  try {
    console.log("Solicitud GET recibida en /api/pagos", req.query); // Depuración
    console.log("Modelo Pago:", Pago); // Verificar si el modelo está cargado

    if (!Pago || typeof Pago.find !== "function") {
      throw new Error("Modelo Pago no está correctamente definido");
    }

    const pagos = await Pago.find()
      .populate("cliente", "nombre")
      .populate("producto", "nombre");
    console.log("Pagos encontrados:", JSON.stringify(pagos, null, 2)); // Depuración detallada

    res.json({ pagos });
  } catch (error) {
    console.error("Error al listar pagos:", error.stack); // Depuración con stack trace
    res.status(500).json({
      mensaje: "Error interno al listar los pagos",
      detalle: error.message || "Error desconocido",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Crear un nuevo pago y registrar una transacción correspondiente
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log(
      "Solicitud POST recibida en /api/pagos",
      JSON.stringify(req.body, null, 2)
    );

    const { cliente, producto, cantidad, monto, fecha, metodoPago } = req.body;

    if (!cliente || !producto || !cantidad || !monto || !fecha || !metodoPago) {
      return res.status(400).json({
        mensaje: "Faltan campos requeridos",
        detalle:
          "Asegúrate de enviar cliente, producto, cantidad, monto, fecha y metodoPago",
      });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        mensaje: "Usuario no autenticado",
        detalle: "No se encontró el ID del usuario en el token",
      });
    }

    const fechaPago = new Date(fecha);
    if (isNaN(fechaPago.getTime())) {
      return res.status(400).json({ mensaje: "Fecha inválida" });
    }

    const nuevoPago = new Pago({
      cliente,
      producto,
      cantidad,
      monto: Number(monto),
      fecha: fechaPago,
      metodoPago,
      creadoPor: req.user._id,
    });

    const pagoGuardado = await nuevoPago.save();

    // Crear una transacción correspondiente en la colección transacciones
    const nuevaTransaccion = new Contabilidad({
      tipo: "ingreso",
      monto: Number(monto),
      fecha: fechaPago,
      descripcion: `Pago de cliente - Método: ${metodoPago}`,
      categoria: "Pago de cliente",
      cuentaDebito: "Caja",
      cuentaCredito: "Ingresos por servicios",
      referencia: `PAGO-${pagoGuardado._id}`,
      creadoPor: req.user._id,
    });

    const transaccionGuardada = await nuevaTransaccion.save();
    console.log(
      "Transacción creada desde pago:",
      JSON.stringify(transaccionGuardada, null, 2)
    );

    res.status(201).json(pagoGuardado);
  } catch (error) {
    console.error("Error al crear pago:", error.stack);
    res.status(500).json({
      mensaje: "Error interno al crear el pago",
      detalle: error.message || "Error desconocido",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

module.exports = router;
