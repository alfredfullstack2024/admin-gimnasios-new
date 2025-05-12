import React, { useState } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const CrearTransaccion = () => {
  const [formData, setFormData] = useState({
    tipo: "ingreso", // Puede ser "ingreso" o "egreso"
    concepto: "",
    monto: "",
    fecha: "",
    metodoPago: "efectivo",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      console.log("Datos enviados para crear transacción:", formData); // Depuración
      const response = await api.post("/contabilidad/transacciones", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Respuesta del backend:", response.data); // Depuración
      navigate("/contabilidad"); // Redirige al listado de transacciones
    } catch (err) {
      const errorMessage = err.response?.data?.mensaje || err.message;
      setError("Error al crear la transacción: " + errorMessage);
      console.error("Detalles del error:", err.response?.data); // Depuración
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Registrar Nueva Transacción</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {isLoading && <Spinner animation="border" variant="primary" />}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="tipo">
          <Form.Label>Tipo de Transacción</Form.Label>
          <Form.Control
            as="select"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
          >
            <option value="ingreso">Ingreso</option>
            <option value="egreso">Egreso</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="concepto">
          <Form.Label>Concepto</Form.Label>
          <Form.Control
            type="text"
            name="concepto"
            value={formData.concepto}
            onChange={handleChange}
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
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="metodoPago">
          <Form.Label>Método de Pago</Form.Label>
          <Form.Control
            as="select"
            name="metodoPago"
            value={formData.metodoPago}
            onChange={handleChange}
          >
            <option value="efectivo">Efectivo</option>
            <option value="transferencia">Transferencia</option>
            <option value="tarjeta">Tarjeta</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit" disabled={isLoading}>
          Registrar Transacción
        </Button>
      </Form>
    </div>
  );
};

export default CrearTransaccion;
