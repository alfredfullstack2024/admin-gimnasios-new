const mongoose = require("mongoose");
const Pago = require("../models/Pago");
const Producto = require("../models/Producto");
const Transaccion = require("../models/Transaccion");

// Listar todos los pagos con filtros y totales
const listarPagos = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    const filtro = {};
    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      fin.setHours(23, 59, 59, 999);
      filtro.fecha = {
        $gte: inicio,
        $lte: fin,
      };
    } else if (fechaInicio) {
      const inicio = new Date(fechaInicio);
      filtro.fecha = { $gte: inicio };
    } else if (fechaFin) {
      const fin = new Date(fechaFin);
      fin.setHours(23, 59, 59, 999);
      filtro.fecha = { $lte: fin };
    }

    const pagos = await Pago.find(filtro)
      .populate("cliente", "nombre apellido")
      .populate("producto", "nombre precio")
      .populate({
        path: "creadoPor",
        select: "nombre email",
        options: { strictPopulate: false },
      })
      .sort({ fecha: -1 });

    const totalPagos = await Pago.aggregate([
      { $match: filtro },
      { $group: { _id: null, total: { $sum: "$monto" } } },
    ]);

    const total = totalPagos.length > 0 ? totalPagos[0].total : 0;

    res.json({
      pagos,
      total,
    });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al listar pagos",
      detalle: error.message,
    });
  }
};

// Agregar un nuevo pago
const agregarPago = async (req, res) => {
  try {
    const { cliente, producto, cantidad, monto, fecha, metodoPago } = req.body;

    if (!monto || monto <= 0) {
      return res.status(400).json({ mensaje: "El monto debe ser mayor a 0" });
    }
    if (!cantidad || cantidad <= 0) {
      return res
        .status(400)
        .json({ mensaje: "La cantidad debe ser mayor a 0" });
    }
    if (!metodoPago) {
      return res
        .status(400)
        .json({ mensaje: "El método de pago es requerido" });
    }

    if (producto) {
      const productoDoc = await Producto.findById(producto);
      if (!productoDoc) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
      }
      if (productoDoc.stock < cantidad) {
        return res.status(400).json({ mensaje: "Stock insuficiente" });
      }
      productoDoc.stock -= cantidad;
      await productoDoc.save();
    }

    const fechaPago = fecha ? new Date(fecha) : new Date();
    if (isNaN(fechaPago)) {
      return res.status(400).json({ mensaje: "Fecha inválida" });
    }

    const pago = new Pago({
      cliente: cliente || null,
      producto: producto || null,
      cantidad,
      monto,
      fecha: fechaPago,
      metodoPago,
      creadoPor: req.user._id,
    });

    const savedPago = await pago.save();

    await savedPago.populate("cliente", "nombre apellido");
    await savedPago.populate("producto", "nombre precio");
    await savedPago.populate({
      path: "creadoPor",
      select: "nombre email",
      options: { strictPopulate: false },
    });

    const transaccion = new Transaccion({
      descripcion: `Pago registrado${cliente ? ` de cliente ${cliente}` : ""}${
        producto ? ` por producto ${producto}` : ""
      }`,
      monto,
      tipo: "ingreso",
      categoria: producto ? "Venta de producto" : "Pago directo",
      fecha: fechaPago,
    });

    await transaccion.save();

    res.status(201).json(savedPago);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al agregar pago",
      detalle: error.message,
    });
  }
};

// Obtener un pago por ID
const obtenerPagoPorId = async (req, res) => {
  try {
    const pago = await Pago.findById(req.params.id)
      .populate("cliente", "nombre apellido")
      .populate("producto", "nombre precio")
      .populate({
        path: "creadoPor",
        select: "nombre email",
        options: { strictPopulate: false },
      });
    if (!pago) {
      return res.status(404).json({ mensaje: "Pago no encontrado" });
    }
    res.json(pago);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener pago",
      detalle: error.message,
    });
  }
};

// Editar un pago existente
const editarPago = async (req, res) => {
  try {
    const { cliente, producto, cantidad, monto, fecha, metodoPago } = req.body;

    const pago = await Pago.findById(req.params.id);
    if (!pago) {
      return res.status(404).json({ mensaje: "Pago no encontrado" });
    }

    if (
      producto &&
      (pago.producto?.toString() !== producto || pago.cantidad !== cantidad)
    ) {
      if (pago.producto) {
        const productoAnterior = await Producto.findById(pago.producto);
        if (productoAnterior) {
          productoAnterior.stock += pago.cantidad;
          await productoAnterior.save();
        }
      }

      const nuevoProducto = await Producto.findById(producto);
      if (!nuevoProducto) {
        return res.status(404).json({ mensaje: "Producto no encontrado" });
      }
      if (nuevoProducto.stock < cantidad) {
        return res.status(400).json({ mensaje: "Stock insuficiente" });
      }
      nuevoProducto.stock -= cantidad;
      await nuevoProducto.save();
    }

    const fechaPago = fecha ? new Date(fecha) : new Date();
    if (isNaN(fechaPago)) {
      return res.status(400).json({ mensaje: "Fecha inválida" });
    }

    const updatedPago = await Pago.findByIdAndUpdate(
      req.params.id,
      {
        cliente: cliente || null,
        producto: producto || null,
        cantidad,
        monto,
        fecha: fechaPago,
        metodoPago,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    await updatedPago.populate("cliente", "nombre apellido");
    await updatedPago.populate("producto", "nombre precio");
    await updatedPago.populate({
      path: "creadoPor",
      select: "nombre email",
      options: { strictPopulate: false },
    });

    res.json(updatedPago);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al actualizar pago",
      detalle: error.message,
    });
  }
};

// Eliminar un pago
const eliminarPago = async (req, res) => {
  try {
    const pago = await Pago.findById(req.params.id);
    if (!pago) {
      return res.status(404).json({ mensaje: "Pago no encontrado" });
    }

    if (pago.producto) {
      const producto = await Producto.findById(pago.producto);
      if (producto) {
        producto.stock += pago.cantidad;
        await producto.save();
      }
    }

    await Pago.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Pago eliminado correctamente" });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al eliminar pago",
      detalle: error.message,
    });
  }
};

module.exports = {
  listarPagos,
  agregarPago,
  obtenerPagoPorId,
  editarPago,
  eliminarPago,
};
