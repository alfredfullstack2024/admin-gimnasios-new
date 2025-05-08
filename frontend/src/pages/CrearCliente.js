import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

const CrearCliente = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    estado: "activo", // Estado por defecto: activo
    numeroIdentificacion: "", // Nuevo campo
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("/clientes", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/clientes");
    } catch (err) {
      setError(`❌ Error al crear el cliente: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>Crear Cliente</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="nombre">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="apellido">
          <Form.Label>Apellido</Form.Label>
          <Form.Control
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Correo electrónico</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="telefono">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="direccion">
          <Form.Label>Dirección</Form.Label>
          <Form.Control
            type="text"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="numeroIdentificacion">
          <Form.Label>Número de Identificación</Form.Label>
          <Form.Control
            type="text"
            name="numeroIdentificacion"
            value={formData.numeroIdentificacion}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="estado">
          <Form.Label>Estado</Form.Label>
          <Form.Control
            as="select"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            required
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit">
          Crear Cliente
        </Button>
      </Form>
    </div>
  );
};

export default CrearCliente;
