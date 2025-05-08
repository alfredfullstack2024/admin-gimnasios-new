const Cliente = require("../models/Cliente");

// Obtener todos los clientes
const obtenerClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.status(200).json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo cliente
const crearCliente = async (req, res) => {
  try {
    const { nombre, apellido, email, telefono, direccion, estado } = req.body;
    console.log("Datos recibidos para crear cliente:", req.body); // Depuración
    const nuevoCliente = new Cliente({
      nombre,
      apellido: apellido || "",
      email,
      telefono: telefono || "",
      direccion: direccion || "",
      estado: estado || "activo",
      fechaRegistro: new Date(),
    });
    const clienteGuardado = await nuevoCliente.save();
    res.status(201).json(clienteGuardado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener un cliente por ID
const obtenerClientePorId = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }
    res.status(200).json(cliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un cliente
const actualizarCliente = async (req, res) => {
  try {
    console.log("Datos recibidos para actualizar cliente:", req.body); // Depuración
    const { nombre, apellido, email, telefono, direccion, estado } = req.body;
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }

    // Actualizar los campos manualmente
    cliente.nombre = nombre;
    cliente.apellido = apellido || "";
    cliente.email = email;
    cliente.telefono = telefono || "";
    cliente.direccion = direccion || "";
    cliente.estado = estado;

    const clienteActualizado = await cliente.save();
    console.log("Cliente actualizado:", clienteActualizado); // Depuración
    res.status(200).json(clienteActualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar un cliente
const eliminarCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) {
      return res.status(404).json({ mensaje: "Cliente no encontrado" });
    }
    res.status(200).json({ mensaje: "Cliente eliminado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  obtenerClientes,
  crearCliente,
  obtenerClientePorId,
  actualizarCliente,
  eliminarCliente,
};
