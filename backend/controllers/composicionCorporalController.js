const ComposicionCorporal = require("../models/ComposicionCorporal");
const asyncHandler = require("express-async-handler");

// @desc    Crear una nueva composición corporal
// @route   POST /api/composicion-corporal
// @access  Private (Admin o Entrenador)
exports.crearComposicionCorporal = asyncHandler(async (req, res) => {
  const {
    numeroIdentificacion,
    fecha,
    peso,
    altura,
    imc,
    porcentajeGrasa,
    porcentajeMusculo,
    notas,
    medidas,
    objetivo,
  } = req.body;

  if (!numeroIdentificacion || !fecha || !peso || !altura) {
    return res.status(400).json({ message: "Faltan campos requeridos" });
  }

  const composicion = new ComposicionCorporal({
    numeroIdentificacion,
    fecha,
    peso,
    altura,
    imc,
    porcentajeGrasa,
    porcentajeMusculo,
    notas: notas || "",
    medidas: medidas || {},
    objetivo: objetivo || "",
    creadoPor: req.user._id,
  });

  const nuevaComposicion = await composicion.save();
  res.status(201).json({
    message: "Composición corporal creada con éxito",
    composicion: nuevaComposicion,
  });
});

// @desc    Obtener todas las composiciones corporales
// @route   GET /api/composicion-corporal
// @access  Private (Admin)
exports.obtenerComposicionesCorporales = asyncHandler(async (req, res) => {
  const composiciones = await ComposicionCorporal.find()
    .populate("creadoPor", "nombre apellido")
    .lean();
  res.json(composiciones);
});

// @desc    Obtener una composición corporal por ID
// @route   GET /api/composicion-corporal/:id
// @access  Private (Admin)
exports.obtenerComposicionCorporal = asyncHandler(async (req, res) => {
  const composicion = await ComposicionCorporal.findById(req.params.id)
    .populate("creadoPor", "nombre apellido")
    .lean();

  if (!composicion) {
    return res.status(404).json({ message: "Composición no encontrada" });
  }

  res.json(composicion);
});

// @desc    Actualizar una composición corporal
// @route   PUT /api/composicion-corporal/:id
// @access  Private (Admin)
exports.actualizarComposicionCorporal = asyncHandler(async (req, res) => {
  const {
    numeroIdentificacion,
    fecha,
    peso,
    altura,
    imc,
    porcentajeGrasa,
    porcentajeMusculo,
    notas,
    medidas,
    objetivo,
  } = req.body;

  const composicion = await ComposicionCorporal.findById(req.params.id);

  if (!composicion) {
    return res.status(404).json({ message: "Composición no encontrada" });
  }

  if (
    req.user.rol !== "admin" &&
    composicion.creadoPor.toString() !== req.user._id.toString()
  ) {
    return res
      .status(403)
      .json({ message: "No tienes permiso para actualizar esta composición" });
  }

  composicion.numeroIdentificacion =
    numeroIdentificacion || composicion.numeroIdentificacion;
  composicion.fecha = fecha || composicion.fecha;
  composicion.peso = peso || composicion.peso;
  composicion.altura = altura || composicion.altura;
  composicion.imc = imc || composicion.imc;
  composicion.porcentajeGrasa = porcentajeGrasa || composicion.porcentajeGrasa;
  composicion.porcentajeMusculo =
    porcentajeMusculo || composicion.porcentajeMusculo;
  composicion.notas = notas || composicion.notas;
  composicion.medidas = medidas || composicion.medidas;
  composicion.objetivo = objetivo || composicion.objetivo;

  const composicionActualizada = await composicion.save();
  res.json({
    message: "Composición corporal actualizada con éxito",
    composicion: composicionActualizada,
  });
});

// @desc    Eliminar una composición corporal
// @route   DELETE /api/composicion-corporal/:id
// @access  Private (Admin)
exports.eliminarComposicionCorporal = asyncHandler(async (req, res) => {
  const composicion = await ComposicionCorporal.findById(req.params.id);

  if (!composicion) {
    return res.status(404).json({ message: "Composición no encontrada" });
  }

  if (req.user.rol !== "admin") {
    return res
      .status(403)
      .json({ message: "No tienes permiso para eliminar esta composición" });
  }

  await composicion.deleteOne();
  res.json({ message: "Composición corporal eliminada con éxito" });
});

// @desc    Consultar composiciones corporales por número de identificación del cliente
// @route   GET /api/composicion-corporal/cliente/:identificacion
// @access  Private (Admin o Entrenador)
exports.consultarComposicionesPorCliente = asyncHandler(async (req, res) => {
  const { identificacion } = req.params;

  const composiciones = await ComposicionCorporal.find({
    numeroIdentificacion: identificacion,
  })
    .populate("creadoPor", "nombre apellido")
    .lean();

  if (!composiciones || composiciones.length === 0) {
    return res
      .status(404)
      .json({
        message: "No se encontraron registros para esta identificación.",
      });
  }

  res.json(composiciones);
});
