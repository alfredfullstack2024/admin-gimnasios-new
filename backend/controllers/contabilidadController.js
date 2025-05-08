const Transaccion = require("../models/Transaccion");

// Crear una nueva transacción (ingreso o egreso)
const crearTransaccion = async (req, res) => {
  try {
    const { descripcion, monto, tipo, categoria, fecha } = req.body;

    const nuevaTransaccion = new Transaccion({
      descripcion,
      monto,
      tipo,
      categoria,
      fecha,
    });

    await nuevaTransaccion.save();

    res.status(201).json(nuevaTransaccion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear la transacción" });
  }
};

// Obtener ingresos mensuales
const ingresosMensuales = async (req, res) => {
  try {
    const transacciones = await Transaccion.aggregate([
      {
        $match: { tipo: "ingreso" },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$fecha" } },
          monto: { $sum: "$monto" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const datos = transacciones.map((item) => ({
      mes: item._id,
      monto: item.monto,
    }));

    res.json(datos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener ingresos mensuales" });
  }
};

module.exports = {
  crearTransaccion,
  ingresosMensuales,
};
