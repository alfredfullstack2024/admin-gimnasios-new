const Entrenador = require("../models/Entrenador");
const RegistroClase = require("../models/RegistroClase");

exports.obtenerClasesDisponibles = async (req, res) => {
  try {
    console.log("Solicitud GET /api/clases/disponibles recibida");
    const entrenadores = await Entrenador.find();
    const clasesDisponibles = entrenadores.flatMap((entrenador) =>
      entrenador.clases.flatMap((clase) =>
        clase.dias.map((dia) => ({
          entrenadorId: entrenador._id,
          entrenadorNombre: entrenador.nombre,
          nombreClase: clase.nombreClase,
          dia: dia.dia,
          horarioInicio: dia.horarioInicio,
          horarioFin: dia.horarioFin,
        }))
      )
    );
    console.log("Clases disponibles:", clasesDisponibles);
    res.json(clasesDisponibles);
  } catch (error) {
    console.error("Error al obtener clases disponibles:", error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.registrarClienteEnClase = async (req, res) => {
  const {
    clienteId,
    entrenadorId,
    nombreClase,
    dia,
    horarioInicio,
    horarioFin,
  } = req.body;

  if (
    !clienteId ||
    !entrenadorId ||
    !nombreClase ||
    !dia ||
    !horarioInicio ||
    !horarioFin
  ) {
    return res
      .status(400)
      .json({ message: "Todos los campos son requeridos." });
  }

  try {
    const registro = new RegistroClase({
      clienteId,
      entrenadorId,
      nombreClase,
      dia,
      horarioInicio,
      horarioFin,
    });
    const nuevoRegistro = await registro.save();
    console.log("Cliente registrado en clase:", nuevoRegistro);
    res.status(201).json(nuevoRegistro);
  } catch (error) {
    console.error("Error al registrar cliente en clase:", error.message);
    res.status(400).json({ message: error.message });
  }
};
