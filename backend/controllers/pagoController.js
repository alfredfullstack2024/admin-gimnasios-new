const Pago = require("../models/Pago");
const Cliente = require("../models/Cliente");

// Listar todos los pagos (protegida)
const listarPagos = async (req, res) => {
  try {
    const pagos = await Pago.find()
      .populate("cliente", "nombre apellido")
      .populate("producto", "nombre precio")
      .populate("creadoPor", "nombre");
    res.json(pagos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar pagos", error });
  }
};

// Consultar pagos por número de identificación (pública)
const consultarPagosPorCedula = async (req, res) => {
  try {
    const { numeroIdentificacion } = req.params;

    // Buscar cliente por número de identificación
    const cliente = await Cliente.findOne({ numeroIdentificacion });
    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    // Buscar pagos asociados a ese cliente
    const pagos = await Pago.find({ cliente: cliente._id })
      .populate("cliente", "nombre apellido")
      .populate("producto", "nombre precio");
    if (!pagos || pagos.length === 0) {
      return res
        .status(404)
        .json({ mensaje: "No se encontraron pagos para este cliente" });
    }

    res.json(pagos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al consultar pagos", error });
  }
};

// Agregar un nuevo pago (protegida)
const agregarPago = async (req, res) => {
  try {
    const { cliente, producto, cantidad, monto, fecha, metodoPago } = req.body;
    const nuevoPago = new Pago({
      cliente,
      producto,
      cantidad,
      monto,
      fecha,
      metodoPago,
      creadoPor: req.user.id,
    });
    await nuevoPago.save();
    res.status(201).json({ mensaje: "Pago creado con éxito", pago: nuevoPago });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear pago", error });
  }
};

// Obtener un pago por ID (protegida)
const obtenerPagoPorId = async (req, res) => {
  try {
    const pago = await Pago.findById(req.params.id)
      .populate("cliente", "nombre apellido")
      .populate("producto", "nombre precio")
      .populate("creadoPor", "nombre");
    if (!pago) {
      return res.status(404).json({ mensaje: "Pago no encontrado" });
    }
    res.json(pago);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener pago", error });
  }
};

// Editar un pago (protegida)
const editarPago = async (req, res) => {
  try {
    const { cliente, producto, cantidad, monto, fecha, metodoPago } = req.body;
    const pago = await Pago.findByIdAndUpdate(
      req.params.id,
      { cliente, producto, cantidad, monto, fecha, metodoPago },
      { new: true }
    );
    if (!pago) {
      return res.status(404).json({ mensaje: "Pago no encontrado" });
    }
    res.json({ mensaje: "Pago actualizado con éxito", pago });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al actualizar pago", error });
  }
};

// Eliminar un pago (protegida)
const eliminarPago = async (req, res) => {
  try {
    const pago = await Pago.findByIdAndDelete(req.params.id);
    if (!pago) {
      return res.status(404).json({ mensaje: "Pago no encontrado" });
    }
    res.json({ mensaje: "Pago eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar pago", error });
  }
};

module.exports = {
  listarPagos,
  consultarPagosPorCedula, // Nueva función
  agregarPago,
  obtenerPagoPorId,
  editarPago,
  eliminarPago,
};
