import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Table } from "react-bootstrap";
import axios from "axios";

const Clases = () => {
  const navigate = useNavigate();
  const [clases, setClases] = useState([]);
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
  const [inscritosPorClase, setInscritosPorClase] = useState({});
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

    fetchClases();
  }, []);

  useEffect(() => {
    const fetchInscritos = async () => {
      try {
        const token = localStorage.getItem("token");
        const inscritosData = {};
        for (const clase of clases) {
          // Normalizar los datos antes de enviarlos
          const nombreClaseNormalizado = clase.nombreClase.trim().toLowerCase();
          const diaNormalizado = clase.dia.toLowerCase().trim();
          const horarioInicioNormalizado = clase.horarioInicio
            .trim()
            .padStart(5, "0");
          const horarioFinNormalizado = clase.horarioFin
            .trim()
            .padStart(5, "0");

          console.log("Consultando inscritos para:", {
            entrenadorId: clase.entrenadorId,
            nombreClase: nombreClaseNormalizado,
            dia: diaNormalizado,
            horarioInicio: horarioInicioNormalizado,
            horarioFin: horarioFinNormalizado,
          });

          const response = await axios.get(
            "http://localhost:5000/api/clases/inscritos",
            {
              headers: { Authorization: `Bearer ${token}` },
              params: {
                entrenadorId: clase.entrenadorId,
                nombreClase: nombreClaseNormalizado,
                dia: diaNormalizado,
                horarioInicio: horarioInicioNormalizado,
                horarioFin: horarioFinNormalizado,
              },
            }
          );

          console.log(
            `Inscritos para ${clase.nombreClase}-${clase.dia}:`,
            response.data
          );
          inscritosData[
            `${clase.nombreClase}-${clase.dia}-${clase.horarioInicio}`
          ] = Array.isArray(response.data) ? response.data : [];
        }
        console.log("Estado inscritosPorClase actualizado:", inscritosData);
        setInscritosPorClase(inscritosData);
      } catch (err) {
        console.error(
          "Error al obtener inscritos:",
          err.response?.data || err.message
        );
      }
    };

    if (clases.length > 0) {
      fetchInscritos();
    }
  }, [clases]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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
      // Recargar clases después de registrar
      const updatedResponse = await axios.get(
        "http://localhost:5000/api/clases/disponibles",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setClases(updatedResponse.data);
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
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Container>
      <h2>Lista de Clases Disponibles</h2>
      <p>Número de Identificación</p>
      <p>Ingrese el número de identificación</p>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Número de Identificación</Form.Label>
          <Form.Control
            type="text"
            name="numeroIdentificacion"
            value={formData.numeroIdentificacion}
            onChange={handleChange}
            required
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
                {clase.horarioFin} ({clase.entrenadorNombre}) - Capacidad:{" "}
                {clase.capacidadMaxima}
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

      <Table striped bordered hover className="mt-4">
        <thead>
          <tr>
            <th>Entrenador</th>
            <th>Especialidad</th>
            <th>Clase</th>
            <th>Día</th>
            <th>Horario</th>
            <th>Capacidad Disponible</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clases.map((clase, index) => {
            const inscritos =
              inscritosPorClase[
                `${clase.nombreClase}-${clase.dia}-${clase.horarioInicio}`
              ] || [];
            return (
              <React.Fragment key={index}>
                <tr>
                  <td>{clase.entrenadorNombre}</td>
                  <td>{clase.especialidad}</td>
                  <td>{clase.nombreClase}</td>
                  <td>{clase.dia}</td>
                  <td>
                    {clase.horarioInicio} - {clase.horarioFin}
                  </td>
                  <td>{clase.capacidadMaxima}</td>
                  <td>
                    <Button
                      variant="primary"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          entrenadorId: clase.entrenadorId,
                          nombreClase: clase.nombreClase,
                          dia: clase.dia,
                          horarioInicio: clase.horarioInicio,
                          horarioFin: clase.horarioFin,
                        });
                      }}
                    >
                      Registrarse
                    </Button>
                  </td>
                </tr>
                <tr>
                  <td colSpan="7">
                    <h4>Inscritos:</h4>
                    {inscritos.length > 0 ? (
                      <ul>
                        {inscritos.map((inscrito, i) => (
                          <li key={i}>{inscrito.nombreCompleto}</li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ color: "gray" }}>
                        No hay inscritos en esta clase.
                      </p>
                    )}
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </Table>

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
