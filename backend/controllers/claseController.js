const Entrenador = require("../models/Entrenador");
const RegistroClases = require("../models/RegistroClases");
const Cliente = require("../models/Cliente");

exports.obtenerClasesDisponibles = async (req, res) => {
  try {
    console.log("Solicitud GET /api/clases/disponibles recibida");
    const entrenadores = await Entrenador.find().lean();
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
                    entrenadorId: entrenador._id.toString(),
                    entrenadorNombre: entrenador.nombre,
                    especialidad: entrenador.especialidad,
                    nombreClase: clase.nombreClase,
                    dia: dia.dia,
                    horarioInicio: dia.horarioInicio,
                    horarioFin: dia.horarioFin,
                    capacidadMaxima: clase.capacidadMaxima || 10,
                  }))
                : []
            )
          : []
      )
      .filter((clase) => clase);

    if (clasesDisponibles.length === 0) {
      console.log("No se encontraron clases disponibles después de procesar.");
      return res
        .status(404)
        .json({ message: "No se encontraron clases disponibles." });
    }

    console.log("Clases disponibles enviadas:", clasesDisponibles);
    res.json(clasesDisponibles);
  } catch (error) {
    console.error("Error al obtener clases disponibles:", error.stack);
    res.status(500).json({
      message: "Error interno del servidor al obtener clases.",
      error: error.message,
    });
  }
};

exports.registrarClienteEnClase = async (req, res) => {
  try {
    const {
      numeroIdentificacion,
      nombre,
      apellido,
      entrenadorId,
      nombreClase,
      dia,
      horarioInicio,
      horarioFin,
    } = req.body;

    console.log("Datos recibidos para registrar:", req.body);

    if (
      !numeroIdentificacion ||
      !entrenadorId ||
      !nombreClase ||
      !dia ||
      !horarioInicio ||
      !horarioFin
    ) {
      return res.status(400).json({
        message: "Todos los campos son requeridos excepto nombre y apellido.",
      });
    }

    // Validar que el numeroIdentificacion exista en la colección clientes
    const cliente = await Cliente.findOne({ numeroIdentificacion });
    if (!cliente) {
      return res
        .status(404)
        .json({ message: "Número de identificación no encontrado." });
    }

    const entrenador = await Entrenador.findById(entrenadorId).lean();
    if (!entrenador) {
      return res.status(404).json({ message: "Entrenador no encontrado." });
    }

    const clase = entrenador.clases.find((c) => c.nombreClase === nombreClase);
    if (!clase) {
      return res.status(404).json({ message: "Clase no encontrada." });
    }

    // Verificar y actualizar capacidad
    const diaClase = clase.dias.find(
      (d) =>
        d.dia === dia &&
        d.horarioInicio === horarioInicio &&
        d.horarioFin === horarioFin
    );
    if (!diaClase) {
      return res
        .status(404)
        .json({ message: "Día y horario no encontrados para esta clase." });
    }

    const registros = await RegistroClases.find({
      entrenadorId,
      nombreClase,
      dia,
      horarioInicio,
      horarioFin,
    });
    if (registros.length >= clase.capacidadMaxima) {
      return res
        .status(400)
        .json({ message: "Capacidad máxima de la clase alcanzada." });
    }

    // Actualizar capacidad en el modelo Entrenador
    const entrenadorActualizado = await Entrenador.findOneAndUpdate(
      {
        _id: entrenadorId,
        "clases.nombreClase": nombreClase,
        "clases.dias.dia": dia,
        "clases.dias.horarioInicio": horarioInicio,
        "clases.dias.horarioFin": horarioFin,
      },
      { $inc: { "clases.$[clase].capacidadMaxima": -1 } },
      { arrayFilters: [{ "clase.nombreClase": nombreClase }], new: true }
    );
    if (!entrenadorActualizado) {
      return res
        .status(500)
        .json({ message: "Error al actualizar la capacidad de la clase." });
    }

    const registro = new RegistroClases({
      numeroIdentificacion,
      nombre: cliente.nombre || nombre || "",
      apellido: cliente.apellido || apellido || "",
      entrenadorId,
      nombreClase,
      dia,
      horarioInicio,
      horarioFin,
    });
    const nuevoRegistro = await registro.save();
    console.log("Cliente registrado en clase:", nuevoRegistro);
    res.status(201).json({
      message: "Cliente registrado en clase con éxito",
      registro: nuevoRegistro,
    });
  } catch (error) {
    console.error("Error al registrar cliente en clase:", error.message);
    res.status(500).json({
      message: "Error al registrar cliente en clase",
      error: error.message,
    });
  }
};

exports.consultarClasesPorNumeroIdentificacion = async (req, res) => {
  const { numeroIdentificacion } = req.params;

  try {
    const registros = await RegistroClases.find({
      numeroIdentificacion,
    }).lean();
    if (!registros || registros.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron registros para este cliente." });
    }

    const clasesConDetalles = await Promise.all(
      registros.map(async (registro) => {
        const entrenador = await Entrenador.findById(
          registro.entrenadorId
        ).lean();
        return {
          nombreCompleto: `${registro.nombre} ${registro.apellido}`,
          entrenadorNombre: entrenador ? entrenador.nombre : "Desconocido",
          nombreClase: registro.nombreClase,
          dia: registro.dia,
          horarioInicio: registro.horarioInicio,
          horarioFin: registro.horarioFin,
        };
      })
    );
    res.json(clasesConDetalles);
  } catch (error) {
    console.error("Error al consultar clases:", error.message);
    res
      .status(500)
      .json({ message: "Error interno del servidor.", error: error.message });
  }
};

exports.obtenerInscritosPorClase = async (req, res) => {
  try {
    const { entrenadorId, nombreClase, dia, horarioInicio, horarioFin } =
      req.query;

    console.log("Parámetros recibidos en /inscritos:", {
      entrenadorId,
      nombreClase,
      dia,
      horarioInicio,
      horarioFin,
    });

    if (
      !entrenadorId ||
      !nombreClase ||
      !dia ||
      !horarioInicio ||
      !horarioFin
    ) {
      return res.status(400).json({
        message:
          "Todos los parámetros (entrenadorId, nombreClase, dia, horarioInicio, horarioFin) son requeridos.",
      });
    }

    // Normalizar los parámetros para evitar problemas de coincidencia
    const nombreClaseNormalizado = nombreClase.trim().toLowerCase();
    const diaNormalizado = dia.toLowerCase().trim();
    const horarioInicioNormalizado = horarioInicio.trim().padStart(5, "0"); // Asegura formato "08:00"
    const horarioFinNormalizado = horarioFin.trim().padStart(5, "0"); // Asegura formato "10:00"

    console.log("Parámetros normalizados:", {
      entrenadorId,
      nombreClase: nombreClaseNormalizado,
      dia: diaNormalizado,
      horarioInicio: horarioInicioNormalizado,
      horarioFin: horarioFinNormalizado,
    });

    // Buscar en la base de datos con parámetros normalizados
    const inscritos = await RegistroClases.find({
      entrenadorId,
      nombreClase: { $regex: new RegExp(nombreClaseNormalizado, "i") },
      dia: diaNormalizado,
      horarioInicio: horarioInicioNormalizado,
      horarioFin: horarioFinNormalizado,
    }).lean();

    console.log("Inscritos encontrados:", inscritos);

    if (!inscritos || inscritos.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay inscritos en esta clase." });
    }

    // Devolver solo los nombres completos
    const nombresInscritos = inscritos.map((inscrito) => ({
      nombreCompleto: `${inscrito.nombre} ${inscrito.apellido}`,
    }));

    console.log("Nombres de inscritos devueltos:", nombresInscritos);
    res.json(nombresInscritos);
  } catch (error) {
    console.error("Error al obtener inscritos por clase:", error.message);
    res.status(500).json({
      message: "Error interno del servidor al obtener inscritos.",
      error: error.message,
    });
  }
};
