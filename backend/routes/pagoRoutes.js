const express = require("express");
const router = express.Router();
const Pago = require("../models/Pago");
const Contabilidad = require("../models/Contabilidad");
const Cliente = require("../models/Cliente");
const { protect } = require("../middleware/authMiddleware");

// Obtener un pago por ID
router.get("/:id", protect, async (req, res) => {
  try {
    console.log("Solicitud GET recibida en /api/pagos/:id", req.params.id);
    const pago = await Pago.findById(req.params.id)
      .populate("cliente", "nombre apellido")
      .populate("producto", "nombre precio stock");

    if (!pago) {
      return res.status(404).json({
        mensaje: "Pago no encontrado",
        detalle: `No se encontró un pago con el ID ${req.params.id}`,
      });
    }

    console.log("Pago encontrado:", JSON.stringify(pago, null, 2));
    res.json(pago);
  } catch (error) {
    console.error("Error al obtener pago por ID:", error.stack);
    res.status(500).json({
      mensaje: "Error interno al obtener el pago",
      detalle: error.message || "Error desconocido",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Actualizar un pago por ID
router.put("/:id", protect, async (req, res) => {
  try {
    console.log(
      "Solicitud PUT recibida en /api/pagos/:id",
      req.params.id,
      req.body
    );
    const { cliente, producto, cantidad, monto, fecha, metodoPago } = req.body;

    if (!cantidad || !monto || !fecha || !metodoPago) {
      return res.status(400).json({
        mensaje: "Faltan campos requeridos",
        detalle: "Asegúrate de enviar cantidad, monto, fecha y metodoPago",
      });
    }

    const fechaPago = new Date(fecha);
    if (isNaN(fechaPago.getTime())) {
      return res.status(400).json({ mensaje: "Fecha inválida" });
    }

    // Validar stock si se proporciona un producto
    if (producto) {
      const Producto = require("../models/Producto");
      const productoDoc = await Producto.findById(producto);
      if (productoDoc && productoDoc.stock < cantidad) {
        return res.status(400).json({
          mensaje: "Stock insuficiente",
          detalle: `Stock disponible: ${productoDoc.stock}, solicitado: ${cantidad}`,
        });
      }
    }

    const pagoActualizado = await Pago.findByIdAndUpdate(
      req.params.id,
      {
        cliente: cliente || undefined,
        producto: producto || undefined,
        cantidad: Number(cantidad),
        monto: Number(monto),
        fecha: fechaPago,
        metodoPago,
      },
      { new: true, runValidators: true }
    )
      .populate("cliente", "nombre apellido")
      .populate("producto", "nombre precio stock");

    if (!pagoActualizado) {
      return res.status(404).json({
        mensaje: "Pago no encontrado",
        detalle: `No se encontró un pago con el ID ${req.params.id}`,
      });
    }

    console.log("Pago actualizado:", JSON.stringify(pagoActualizado, null, 2));
    res.json(pagoActualizado);
  } catch (error) {
    console.error("Error al actualizar pago:", error.stack);
    res.status(500).json({
      mensaje: "Error interno al actualizar el pago",
      detalle: error.message || "Error desconocido",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Listar todos los pagos
router.get("/", protect, async (req, res) => {
  try {
    console.log("Solicitud GET recibida en /api/pagos", req.query);
    console.log("Modelo Pago:", Pago);

    if (!Pago || typeof Pago.find !== "function") {
      throw new Error("Modelo Pago no está correctamente definido");
    }

    // Aplicar filtros de fecha si se proporcionan
    const query = {};
    if (req.query.fechaInicio && req.query.fechaFin) {
      query.fecha = {
        $gte: new Date(req.query.fechaInicio),
        $lte: new Date(req.query.fechaFin),
      };
    }

    const pagos = await Pago.find(query)
      .populate("cliente", "nombre")
      .populate("producto", "nombre")
      .lean();

    // Log para verificar los estados de los pagos
    const estados = pagos.map((pago) => pago.estado);
    console.log("Estados de los pagos:", estados);

    // Calcular el total solo de pagos completados
    const totalCompletados = pagos
      .filter((pago) => pago.estado === "Completado")
      .reduce((sum, pago) => sum + (pago.monto || 0), 0);

    console.log("Pagos encontrados:", JSON.stringify(pagos, null, 2));
    console.log("Total de pagos completados:", totalCompletados);

    res.json({ pagos, total: totalCompletados });
  } catch (error) {
    console.error("Error al listar pagos:", error.stack);
    res.status(500).json({
      mensaje: "Error interno al listar los pagos",
      detalle: error.message || "Error desconocido",
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Crear un nuevo pago y registrar una transacción correspondiente
router.post("/", protect, async (req, res) => {
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

// Consultar pagos por número de identificación (Protegida)
router.get("/consultar/:numeroIdentificacion", protect, async (req, res) => {
  try {
    console.log(
      "Consultando pagos para numeroIdentificacion:",
      req.params.numeroIdentificacion
    );

    // Buscar el cliente por numeroIdentificacion
    const cliente = await Cliente.findOne({
      numeroIdentificacion: req.params.numeroIdentificacion,
    });
    if (!cliente) {
      return res.status(404).json({
        mensaje: "Cliente no encontrado con este número de identificación.",
      });
    }

    // Buscar los pagos asociados a ese cliente
    const pagos = await Pago.find({ cliente: cliente._id })
      .populate("cliente", "nombre apellido")
      .populate("producto", "nombre")
      .lean();

    if (!pagos || pagos.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "No se encontraron pagos para este cliente." });
    }

    // Formatear la respuesta para el frontend
    const formattedPagos = pagos.map((pago) => ({
      monto: pago.monto,
      fechaPago: pago.fecha,
      metodoPago: pago.metodoPago,
      concepto: pago.producto?.nombre
        ? `Compra de producto: ${pago.producto.nombre}`
        : "Pago general",
    }));

    console.log("Pagos formateados:", formattedPagos);
    res.json(formattedPagos);
  } catch (error) {
    console.error("Error al consultar pagos:", error.message);
    res
      .status(500)
      .json({ mensaje: "Error interno del servidor.", error: error.message });
  }
});

// Obtener ingresos totales (para Resumen Financiero)
router.get("/ingresos", protect, async (req, res) => {
  try {
    console.log("Solicitud GET recibida en /api/pagos/ingresos", req.query);

    const query = { estado: "Completado" };
    if (req.query.fechaInicio && req.query.fechaFin) {
      query.fecha = {
        $gte: new Date(req.query.fechaInicio),
        $lte: new Date(req.query.fechaFin),
      };
    }

    const pagos = await Pago.find(query).lean();
    const totalIngresos = pagos.reduce((sum, pago) => sum + pago.monto, 0);

    console.log("Ingresos calculados:", totalIngresos);
    res.json({ ingresos: totalIngresos, detalles: pagos });
  } catch (error) {
    console.error("Error al calcular ingresos:", error.message);
    res.status(500).json({ mensaje: "Error al calcular ingresos", error });
  }
});

module.exports = router;
