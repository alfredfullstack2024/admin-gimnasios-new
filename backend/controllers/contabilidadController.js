const Transaccion = require("../models/Transaccion");

// Crear una nueva transacción (protegida)
const crearTransaccion = async (req, res) => {
  try {
    const { tipo, concepto, monto, fecha, metodoPago } = req.body;
    console.log("Datos recibidos para crear transacción:", req.body); // Depuración

    // Validar campos obligatorios
    if (!tipo || !concepto || !monto || !fecha) {
      return res
        .status(400)
        .json({ mensaje: "Tipo, concepto, monto y fecha son obligatorios" });
    }

    // Validar tipo
    if (!["ingreso", "egreso"].includes(tipo.toLowerCase())) {
      return res
        .status(400)
        .json({ mensaje: "Tipo debe ser 'ingreso' o 'egreso'" });
    }

    const nuevaTransaccion = new Transaccion({
      tipo: tipo.toLowerCase(),
      concepto,
      monto,
      fecha,
      metodoPago: metodoPago || "efectivo",
      creadoPor: req.user.id,
    });

    const transaccionGuardada = await nuevaTransaccion.save();
    console.log("Transacción guardada:", transaccionGuardada); // Depuración
    res
      .status(201)
      .json({
        mensaje: "Transacción creada con éxito",
        transaccion: transaccionGuardada,
      });
  } catch (error) {
    console.error("Error al crear transacción:", error); // Depuración
    res.status(500).json({ mensaje: "Error al crear transacción", error });
  }
};

// Listar transacciones (protegida)
const listarTransacciones = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, tipo } = req.query;
    const query = {};

    if (fechaInicio && fechaFin) {
      query.fecha = {
        $gte: new Date(fechaInicio),
        $lte: new Date(fechaFin),
      };
    }

    if (tipo) {
      query.tipo = tipo.toLowerCase();
    }

    console.log("Consulta para listar transacciones:", query); // Depuración
    const transacciones = await Transaccion.find(query).populate(
      "creadoPor",
      "nombre"
    );
    const totalIngresos = transacciones
      .filter((t) => t.tipo === "ingreso")
      .reduce((sum, t) => sum + t.monto, 0);
    const totalEgresos = transacciones
      .filter((t) => t.tipo === "egreso")
      .reduce((sum, t) => sum + t.monto, 0);
    const balance = totalIngresos - totalEgresos;

    console.log("Transacciones encontradas:", transacciones); // Depuración
    res.json({ transacciones, totalIngresos, totalEgresos, balance });
  } catch (error) {
    console.error("Error al listar transacciones:", error); // Depuración
    res.status(500).json({ mensaje: "Error al listar transacciones", error });
  }
};

module.exports = {
  crearTransaccion,
  listarTransacciones,
};
