const Entrenador = require("../models/Entrenador");
const RegistroClase = require("../models/RegistroClase");

exports.obtenerClasesDisponibles = async (req, res) => {
  try {
    console.log("Solicitud GET /api/clases/disponibles recibida");
    const entrenadores = await Entrenador.find();
    if (!entrenadores || entrenadores.length === 0) {
      console.log("No se encontraron entrenadores en la base de datos.");
      return res
        .status(404)
        .json({ message: "No se encontraron entrenadores." });
    }
    const clasesDisponibles = entrenadores
      .flatMap((entrenador) =>
        entrenador.clases && Array.isArray(entrenador.clases)
          ? entrenador.clases.flatMap((clase) =>
              clase.dias && Array.isArray(clase.dias)
                ? clase.dias.map((dia) => ({
                    entrenadorId: entrenador._id,
                    entrenadorNombre: entrenador.nombre,
                    especialidad: entrenador.especialidad,
                    nombreClase: clase.nombreClase,
                    dia: dia.dia,
                    horarioInicio: dia.horarioInicio,
                    horarioFin: dia.horarioFin,
                    capacidadMaxima: clase.capacidadMaxima || 10, // Valor por defecto si no está definido
                  }))
                : []
            )
          : []
      )
      .filter((clase) => clase);
    console.log("Clases disponibles:", clasesDisponibles);
    if (clasesDisponibles.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron clases disponibles." });
    }
    res.json(clasesDisponibles);
  } catch (error) {
    console.error("Error al obtener clases disponibles:", error.stack);
    res
      .status(500)
      .json({ message: "Error interno del servidor al obtener clases." });
  }
};

exports.registrarClienteEnClase = async (req, res) => {
  const {
    numeroIdentificacion,
    entrenadorId,
    nombreClase,
    dia,
    horarioInicio,
    horarioFin,
  } = req.body;

  if (
    !numeroIdentificacion ||
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
    const entrenador = await Entrenador.findById(entrenadorId);
    const clase = entrenador.clases.find((c) => c.nombreClase === nombreClase);
    const registros = await RegistroClase.find({
      entrenadorId,
      nombreClase,
      dia,
      horarioInicio,
      horarioFin,
    });
    if (registros.length >= (clase.capacidadMaxima || 10)) {
      return res
        .status(400)
        .json({ message: "Capacidad máxima de la clase alcanzada." });
    }

    const registro = new RegistroClase({
      numeroIdentificacion,
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
    console.error("Error al registrar cliente en clase:", error.stack);
    res.status(400).json({ message: error.message });
  }
};

exports.consultarClasesPorNumeroIdentificacion = async (req, res) => {
  const { numeroIdentificacion } = req.params;

  try {
    const registros = await RegistroClase.find({ numeroIdentificacion });
    const clasesConDetalles = await Promise.all(
      registros.map(async (registro) => {
        const entrenador = await Entrenador.findById(registro.entrenadorId);
        return {
          entrenadorNombre: entrenador.nombre,
          nombreClase: registro.nombreClase,
          dia: registro.dia,
          horarioInicio: registro.horarioInicio,
          horarioFin: registro.horarioFin,
        };
      })
    );
    res.json(clasesConDetalles);
  } catch (error) {
    console.error("Error al consultar clases:", error.stack);
    res.status(500).json({ message: "Error interno del servidor." });
  }
};
