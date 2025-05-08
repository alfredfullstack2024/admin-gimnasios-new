import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const CrearTransaccion = () => {
  const [formData, setFormData] = useState({
    tipo: "egreso",
    categoria: "",
    monto: "",
    descripcion: "",
    fecha: new Date().toISOString().split("T")[0],
    cuentaDebito: "Caja",
    cuentaCredito: "Gastos",
    referencia: "manual",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validar campos antes de enviar
      if (!formData.monto || !formData.descripcion) {
        setError("Monto y descripción son obligatorios");
        return;
      }

      const response = await api.post("/contabilidad", formData);
      console.log("Transacción creada:", response.data);
      navigate("/contabilidad");
    } catch (err) {
      const errorMessage =
        err.response?.status === 500
          ? `Error ${err.response.status}: ${
              err.response.data.detalle || "Error interno del servidor"
            }`
          : err.response?.status === 400
          ? `Error ${err.response.status}: ${
              err.response.data.detalle || "Solicitud inválida"
            }`
          : err.message;
      setError("Error al crear el egreso: " + errorMessage);
      if (errorMessage.includes("Sesión expirada")) {
        navigate("/login");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Crear Egreso</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="categoria" className="mb-3">
          <Form.Label>Categoría</Form.Label>
          <Form.Control
            type="text"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
            placeholder="Ej. Mantenimiento, Baños, etc."
          />
        </Form.Group>
        <Form.Group controlId="monto" className="mb-3">
          <Form.Label>Monto</Form.Label>
          <Form.Control
            type="number"
            name="monto"
            value={formData.monto}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="descripcion" className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="fecha" className="mb-3">
          <Form.Label>Fecha</Form.Label>
          <Form.Control
            type="date"
            name="fecha"
            value={formData.fecha}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Button type="submit" variant="primary">
          Crear Egreso
        </Button>
        <Button
          variant="secondary"
          className="ms-2"
          onClick={() => navigate("/contabilidad")}
        >
          Cancelar
        </Button>
      </Form>
    </div>
  );
};

export default CrearTransaccion;
