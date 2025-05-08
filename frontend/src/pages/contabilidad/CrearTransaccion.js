import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const CrearTransaccion = () => {
  const [transaccion, setTransaccion] = useState({
    tipo: "egreso", // Cambiado a minúsculas para coincidir con el backend
    descripcion: "",
    monto: "",
    fecha: "",
    categoria: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const categories = [
    "Alquiler y Servicios",
    "Sueldos y Honorarios",
    "Equipamiento y Mantenimiento",
    "Productos de Limpieza y Sanitización",
    "Publicidad y Marketing",
    "Tecnología y Software",
    "Impuestos y Legalidades",
    "Compras de Productos para Venta o Consumo Interno",
    "Transporte y Logística",
    "Capacitaciones y Eventos",
  ];

  const handleChange = (e) => {
    setTransaccion({ ...transaccion, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !user.token) {
      setError("No estás autenticado. Inicia sesión primero.");
      return;
    }

    // Validaciones locales
    const { tipo, descripcion, monto, fecha, categoria } = transaccion;
    if (!descripcion.trim()) {
      setError("La descripción es obligatoria.");
      return;
    }
    const montoNum = Number(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      setError("El monto debe ser un número positivo.");
      return;
    }
    if (!fecha) {
      setError("La fecha es obligatoria.");
      return;
    }
    if (!categoria) {
      setError("La categoría es obligatoria.");
      return;
    }

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` },
      };
      const payload = {
        tipo,
        descripcion,
        monto: montoNum,
        fecha,
        categoria,
      };
      console.log("Datos enviados:", payload);
      await axios.post(
        "http://localhost:5000/api/transacciones",
        payload,
        config
      );
      navigate("/contabilidad");
    } catch (err) {
      setError(
        "Error al crear la transacción: " +
          (err.response?.data?.message || err.message)
      );
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Crear Transacción</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="tipo" className="mb-3">
          <Form.Label>Tipo</Form.Label>
          <Form.Control
            as="select"
            name="tipo"
            value={transaccion.tipo}
            onChange={handleChange}
            required
            disabled
          >
            <option value="egreso">Egreso</option>{" "}
            {/* Mostrar "Egreso" en la UI, pero enviar "egreso" */}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="descripcion" className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            type="text"
            name="descripcion"
            value={transaccion.descripcion}
            onChange={handleChange}
            placeholder="Ingresa la descripción"
            required
          />
        </Form.Group>
        <Form.Group controlId="monto" className="mb-3">
          <Form.Label>Monto</Form.Label>
          <Form.Control
            type="number"
            name="monto"
            value={transaccion.monto}
            onChange={handleChange}
            placeholder="Ingresa el monto"
            required
            min="0.01"
            step="0.01"
          />
        </Form.Group>
        <Form.Group controlId="fecha" className="mb-3">
          <Form.Label>Fecha</Form.Label>
          <Form.Control
            type="date"
            name="fecha"
            value={transaccion.fecha}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="categoria" className="mb-3">
          <Form.Label>Categoría</Form.Label>
          <Form.Control
            as="select"
            name="categoria"
            value={transaccion.categoria}
            onChange={handleChange}
            required
          >
            <option value="">-- Selecciona una categoría --</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
        <Button variant="primary" type="submit">
          Crear Transacción
        </Button>
      </Form>
    </div>
  );
};

export default CrearTransaccion;
