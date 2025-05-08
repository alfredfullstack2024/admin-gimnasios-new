import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import {
  obtenerPagoPorId,
  editarPago,
  obtenerClientes,
  obtenerProductos,
} from "../../api/axios";

const EditarPago = () => {
  const { id } = useParams();
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [formData, setFormData] = useState({
    cliente: "",
    producto: "",
    cantidad: 1,
    monto: "",
    fecha: "",
    metodoPago: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pagoResponse, clientesResponse, productosResponse] =
          await Promise.all([
            obtenerPagoPorId(id),
            obtenerClientes(),
            obtenerProductos(),
          ]);

        const pago = pagoResponse.data;
        setFormData({
          cliente: pago.cliente?._id || "",
          producto: pago.producto?._id || "",
          cantidad: pago.cantidad || 1,
          monto: pago.monto || "",
          fecha: pago.fecha
            ? new Date(pago.fecha).toISOString().split("T")[0]
            : "",
          metodoPago: pago.metodoPago || "Efectivo",
        });

        setClientes(clientesResponse.data);
        setProductos(productosResponse.data);
      } catch (err) {
        setError("Error al cargar datos: " + err.message);
        if (err.message.includes("Sesión expirada")) {
          navigate("/login");
        }
      }
    };
    fetchData();
  }, [id, navigate]);

  useEffect(() => {
    if (formData.producto && formData.cantidad) {
      const productoSeleccionado = productos.find(
        (prod) => prod._id === formData.producto
      );
      if (productoSeleccionado) {
        const nuevoMonto = productoSeleccionado.precio * formData.cantidad;
        setFormData((prev) => ({
          ...prev,
          monto: nuevoMonto.toString(),
        }));
      }
    }
  }, [formData.producto, formData.cantidad, productos]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.producto) {
      const productoSeleccionado = productos.find(
        (prod) => prod._id === formData.producto
      );
      if (
        productoSeleccionado &&
        productoSeleccionado.stock < parseInt(formData.cantidad)
      ) {
        setError("Stock insuficiente para el producto seleccionado.");
        return;
      }
    }

    const datosEnvio = {
      cliente: formData.cliente || undefined,
      producto: formData.producto || undefined,
      cantidad: parseInt(formData.cantidad),
      monto: parseFloat(formData.monto),
      fecha: formData.fecha || undefined,
      metodoPago: formData.metodoPago,
    };

    try {
      await editarPago(id, datosEnvio);
      navigate("/pagos");
    } catch (err) {
      setError("Error al actualizar el pago: " + err.message);
      if (err.message.includes("Sesión expirada")) {
        navigate("/login");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Editar Pago</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="cliente">
              <Form.Label>Cliente (opcional)</Form.Label>
              <Form.Control
                as="select"
                name="cliente"
                value={formData.cliente}
                onChange={handleChange}
              >
                <option value="">Seleccione un cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente._id} value={cliente._id}>
                    {cliente.nombre} {cliente.apellido}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="producto">
              <Form.Label>Producto (opcional)</Form.Label>
              <Form.Control
                as="select"
                name="producto"
                value={formData.producto}
                onChange={handleChange}
              >
                <option value="">Seleccione un producto</option>
                {productos.map((producto) => (
                  <option key={producto._id} value={producto._id}>
                    {producto.nombre} - ${producto.precio} ({producto.stock} en
                    stock)
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="cantidad">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                name="cantidad"
                value={formData.cantidad}
                onChange={handleChange}
                min="1"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="monto">
              <Form.Label>Monto</Form.Label>
              <Form.Control
                type="number"
                name="monto"
                value={formData.monto}
                onChange={handleChange}
                step="0.01"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="fecha">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="metodoPago">
              <Form.Label>Método de Pago</Form.Label>
              <Form.Control
                as="select"
                name="metodoPago"
                value={formData.metodoPago}
                onChange={handleChange}
                required
              >
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta">Tarjeta</option>
                <option value="Transferencia">Transferencia</option>
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit">
              Actualizar Pago
            </Button>
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => navigate("/pagos")}
            >
              Cancelar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditarPago;
