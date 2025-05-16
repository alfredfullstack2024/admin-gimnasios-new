import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import axios from "axios";

const Clases = () => {
  const navigate = useNavigate();
  const [clases, setClases] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    numeroIdentificacion: "",
    nombre: "",
    apellido: "",
    entrenadorId: "",
    nombreClase: "",
    dia: "",
    horarioInicio: "",
    horarioFin: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClases = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/clases/disponibles"
        );
        setClases(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar las clases");
      }
    };

    const fetchClientes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/clientes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClientes(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar los clientes");
      }
    };

    fetchClases();
    fetchClientes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "numeroIdentificacion") {
      const clienteSeleccionado = clientes.find(
        (c) => c.numeroIdentificacion === value
      );
      setFormData({
        ...formData,
        numeroIdentificacion: value,
        nombre: clienteSeleccionado?.nombre || "",
        apellido: clienteSeleccionado?.apellido || "",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/clases/registrar", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Cliente registrado en clase con éxito");
      navigate("/clases");
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al registrar cliente en clase"
      );
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Container>
      <h2>Lista de Clases Disponibles</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Seleccionar cliente</Form.Label>
          <Form.Select
            name="numeroIdentificacion"
            value={formData.numeroIdentificacion}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map((cliente, index) => (
              <option key={index} value={cliente.numeroIdentificacion}>
                {`${cliente.nombre} ${cliente.apellido}`}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            readOnly
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Apellido</Form.Label>
          <Form.Control
            type="text"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            readOnly
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Seleccionar Clase</Form.Label>
          <Form.Select
            onChange={(e) => {
              const selectedClase = clases[e.target.selectedIndex];
              setFormData({
                ...formData,
                entrenadorId: selectedClase.entrenadorId,
                nombreClase: selectedClase.nombreClase,
                dia: selectedClase.dia,
                horarioInicio: selectedClase.horarioInicio,
                horarioFin: selectedClase.horarioFin,
              });
            }}
            required
          >
            <option value="">Seleccione una clase</option>
            {clases.map((clase, index) => (
              <option key={index} value={index}>
                {clase.nombreClase} - {clase.dia} {clase.horarioInicio}-
                {clase.horarioFin} ({clase.entrenadorNombre})
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit">
          Registrar
        </Button>
      </Form>
    </Container>
  );
};

export default Clases;
