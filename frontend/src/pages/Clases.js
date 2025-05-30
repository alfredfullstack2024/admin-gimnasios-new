import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import { Form, Button, Container, Table } from "react-bootstrap";
=======
import { Form, Button, Container } from "react-bootstrap";
>>>>>>> 215dfae80f6fe6a3e500483bfc6db50798d6b9af
import axios from "axios";

const Clases = () => {
  const navigate = useNavigate();
  const [clases, setClases] = useState([]);
<<<<<<< HEAD
=======
  const [clientes, setClientes] = useState([]);
>>>>>>> 215dfae80f6fe6a3e500483bfc6db50798d6b9af
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
<<<<<<< HEAD
  const [consultarId, setConsultarId] = useState("");
  const [clasesRegistradas, setClasesRegistradas] = useState([]);
=======
>>>>>>> 215dfae80f6fe6a3e500483bfc6db50798d6b9af
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClases = async () => {
      try {
<<<<<<< HEAD
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/clases/disponibles",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Clases obtenidas:", response.data);
=======
        const response = await axios.get(
          "http://localhost:5000/api/clases/disponibles"
        );
>>>>>>> 215dfae80f6fe6a3e500483bfc6db50798d6b9af
        setClases(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Error al cargar las clases");
      }
    };

<<<<<<< HEAD
=======
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

>>>>>>> 215dfae80f6fe6a3e500483bfc6db50798d6b9af
    fetchClases();
    fetchClientes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
<<<<<<< HEAD
    setFormData({ ...formData, [name]: value });
  };

  const handleClaseChange = (e) => {
    const selectedIndex = e.target.value;
    const selectedClase = clases[selectedIndex] || {};
    console.log("Clase seleccionada:", selectedClase);
    setFormData({
      ...formData,
      entrenadorId: selectedClase.entrenadorId || "",
      nombreClase: selectedClase.nombreClase || "",
      dia: selectedClase.dia || "",
      horarioInicio: selectedClase.horarioInicio || "",
      horarioFin: selectedClase.horarioFin || "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    console.log("Datos enviados al registrar:", formData);
    try {
      const token = localStorage.getItem("token");
      // Validar que el numeroIdentificacion exista antes de registrar
      const clienteResponse = await axios.get(
        `http://localhost:5000/api/clientes/consultar/${formData.numeroIdentificacion}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!clienteResponse.data) {
        throw new Error("Número de identificación no encontrado");
      }

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
        err.response?.data?.message ||
          err.message ||
          "Error al registrar cliente en clase"
      );
      console.error("Error detallado:", err.response?.data || err.message);
    }
  };

  const handleConsultar = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/clases/consultar/${consultarId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setClasesRegistradas(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Error al consultar clases");
      setClasesRegistradas([]);
=======
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
>>>>>>> 215dfae80f6fe6a3e500483bfc6db50798d6b9af
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Container>
      <h2>Lista de Clases Disponibles</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
<<<<<<< HEAD
          <Form.Label>Número de Identificación</Form.Label>
          <Form.Control
            type="text"
=======
          <Form.Label>Seleccionar cliente</Form.Label>
          <Form.Select
>>>>>>> 215dfae80f6fe6a3e500483bfc6db50798d6b9af
            name="numeroIdentificacion"
            value={formData.numeroIdentificacion}
            onChange={handleChange}
            required
<<<<<<< HEAD
            placeholder="Ingresa el número de identificación"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Seleccionar Clase</Form.Label>
          <Form.Select onChange={handleClaseChange} required>
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
          disabled={!formData.numeroIdentificacion || !formData.entrenadorId}
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
=======
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
>>>>>>> 215dfae80f6fe6a3e500483bfc6db50798d6b9af
    </Container>
  );
};

export default Clases;
