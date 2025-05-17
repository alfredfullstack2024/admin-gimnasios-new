import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Table } from "react-bootstrap";
import axios from "axios";

const Clases = () => {
  console.log("Renderizando Clases.js - Componente Principal");
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
  const [consultarId, setConsultarId] = useState("");
  const [clasesRegistradas, setClasesRegistradas] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClases = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/clases/disponibles",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Clases obtenidas:", response.data);
        setClases(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar las clases");
      }
    };

    const fetchClientes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/clientes/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Clientes obtenidos:", response.data);
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
    setError(null);

    const requiredFields = [
      "numeroIdentificacion",
      "nombre",
      "apellido",
      "entrenadorId",
      "nombreClase",
      "dia",
      "horarioInicio",
      "horarioFin",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);
    if (missingFields.length > 0) {
      setError(
        `Por favor completa todos los campos: ${missingFields.join(", ")}`
      );
      return;
    }

    console.log("Datos enviados al registrar:", formData); // Depuración
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:5000/api/clases/registrar",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Cliente registrado en clase con éxito");
      navigate("/clases");
      setFormData({
        numeroIdentificacion: "",
        nombre: "",
        apellido: "",
        entrenadorId: "",
        nombreClase: "",
        dia: "",
        horarioInicio: "",
        horarioFin: "",
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Error al registrar cliente en clase"
      );
      console.error("Error detallado:", err.response); // Depuración adicional
    }
  };

  const handleConsultar = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/clases/consultar/${consultarId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClasesRegistradas(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error al consultar clases");
      setClasesRegistradas([]);
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
                {cliente.nombre} {cliente.apellido || ""}
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
              const selectedIndex = e.target.value;
              const selectedClase = clases[selectedIndex] || {};
              setFormData({
                ...formData,
                entrenadorId: selectedClase.entrenadorId || "",
                nombreClase: selectedClase.nombreClase || "",
                dia: selectedClase.dia || "",
                horarioInicio: selectedClase.horarioInicio || "",
                horarioFin: selectedClase.horarioFin || "",
              });
              console.log("Clase seleccionada:", selectedClase); // Depuración
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
        <Button
          variant="primary"
          type="submit"
          disabled={!formData.entrenadorId}
        >
          Registrar
        </Button>
      </Form>

      <h2 className="mt-5">Consultar Clases Registradas</h2>
      <Form onSubmit={handleConsultar}>
        <Form.Group className="mb-3">
          <Form.Label>Número de Identificación</Form.Label>
          <Form.Control
            type="text"
            value={consultarId}
            onChange={(e) => setConsultarId(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Consultar
        </Button>
      </Form>

      {clasesRegistradas.length > 0 && (
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Nombre Completo</th>
              <th>Entrenador</th>
              <th>Clase</th>
              <th>Día</th>
              <th>Horario</th>
            </tr>
          </thead>
          <tbody>
            {clasesRegistradas.map((clase, index) => (
              <tr key={index}>
                <td>{clase.nombreCompleto}</td>
                <td>{clase.entrenadorNombre}</td>
                <td>{clase.nombreClase}</td>
                <td>{clase.dia}</td>
                <td>
                  {clase.horarioInicio} - {clase.horarioFin}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Clases;
