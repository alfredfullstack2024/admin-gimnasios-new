const Cliente = require("../models/Cliente");

// Obtener todos los clientes
const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find().select(
      "nombre apellido email telefono direccion estado numeroIdentificacion fechaRegistro"
    );
    res.status(200).json(clientes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener clientes: " + error.message });
  }
};

// Consultar cliente por número de identificación (pública)
const consultarClientePorCedula = async (req, res) => {
  try {
    const { numeroIdentificacion } = req.params;
    const cliente = await Cliente.findOne({ numeroIdentificacion });
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.status(200).json(cliente);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al consultar cliente: " + error.message });
  }
};

// Crear un nuevo cliente
const crearCliente = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      estado,
      numeroIdentificacion,
    } = req.body;
    console.log("Datos recibidos para crear cliente:", req.body);

    // Validar campos obligatorios
    if (!nombre || !email || !numeroIdentificacion) {
      return res.status(400).json({
        message: "Nombre, email y número de identificación son obligatorios",
      });
    }

    // Validar formato de email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Correo electrónico inválido" });
    }

    // Validar teléfono (si se proporciona, debe tener 10 dígitos)
    if (telefono && !/^\d{10}$/.test(telefono)) {
      return res
        .status(400)
        .json({ message: "Teléfono debe tener 10 dígitos" });
    }

    // Validar estado (si se proporciona, debe ser "activo" o "inactivo")
    if (estado && !["activo", "inactivo"].includes(estado.toLowerCase())) {
      return res
        .status(400)
        .json({ message: "Estado debe ser 'activo' o 'inactivo'" });
    }

    // Verificar unicidad de numeroIdentificacion
    const clienteExistente = await Cliente.findOne({ numeroIdentificacion });
    if (clienteExistente) {
      return res
        .status(400)
        .json({ message: "El número de identificación ya está registrado" });
    }

    const nuevoCliente = new Cliente({
      nombre,
      apellido: apellido || "",
      email,
      telefono: telefono || "",
      direccion: direccion || "",
      estado: estado ? estado.toLowerCase() : "activo",
      numeroIdentificacion,
      fechaRegistro: new Date(),
    });

    const clienteGuardado = await nuevoCliente.save();
    res.status(201).json(clienteGuardado);
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res
      .status(400)
      .json({ message: "Error al crear cliente: " + error.message });
  }
};

// Obtener un cliente por ID
const obtenerClientePorId = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.status(200).json(cliente);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener cliente: " + error.message });
  }
};

// Actualizar un cliente
const actualizarCliente = async (req, res) => {
  try {
    console.log("Datos recibidos para actualizar cliente:", req.body);
    const {
      nombre,
      apellido,
      email,
      telefono,
      direccion,
      estado,
      numeroIdentificacion,
    } = req.body;
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Validar campos obligatorios
    if (!nombre || !email || !numeroIdentificacion) {
      return res.status(400).json({
        message: "Nombre, email y número de identificación son obligatorios",
      });
    }

    // Validar formato de email
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Correo electrónico inválido" });
    }

    // Validar teléfono (si se proporciona, debe tener 10 dígitos)
    if (telefono && !/^\d{10}$/.test(telefono)) {
      return res
        .status(400)
        .json({ message: "Teléfono debe tener 10 dígitos" });
    }

    // Validar estado (si se proporciona, debe ser "activo" o "inactivo")
    if (estado && !["activo", "inactivo"].includes(estado.toLowerCase())) {
      return res
        .status(400)
        .json({ message: "Estado debe ser 'activo' o 'inactivo'" });
    }

    // Verificar unicidad de numeroIdentificacion (si se actualiza)
    if (
      numeroIdentificacion &&
      numeroIdentificacion !== cliente.numeroIdentificacion
    ) {
      const clienteExistente = await Cliente.findOne({ numeroIdentificacion });
      if (clienteExistente) {
        return res
          .status(400)
          .json({ message: "El número de identificación ya está registrado" });
      }
    }

    // Actualizar los campos manualmente
    cliente.nombre = nombre || cliente.nombre;
    cliente.apellido = apellido || "";
    cliente.email = email || cliente.email;
    cliente.telefono = telefono || "";
    cliente.direccion = direccion || "";
    cliente.estado = estado ? estado.toLowerCase() : cliente.estado;
    cliente.numeroIdentificacion =
      numeroIdentificacion || cliente.numeroIdentificacion;

    const clienteActualizado = await cliente.save();
    console.log("Cliente actualizado:", clienteActualizado);
    res.status(200).json(clienteActualizado);
  } catch (error) {
    console.error("Error al actualizar cliente:", error);
    res
      .status(400)
      .json({ message: "Error al actualizar cliente: " + error.message });
  }
};

// Eliminar un cliente
const eliminarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }
    res.status(200).json({ message: "Cliente eliminado" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar cliente: " + error.message });
  }
};

module.exports = {
  obtenerClientes,
  consultarClientePorCedula,
  crearCliente,
  obtenerClientePorId,
  actualizarCliente,
  eliminarCliente,
};
