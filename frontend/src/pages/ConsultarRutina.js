import React, { useState } from "react";
import { Container, Form, Button, Table } from "react-bootstrap";
import {
  consultarRutinaPorNumeroIdentificacion,
  consultarClasesPorNumeroIdentificacion,
} from "../api/axios";

const ConsultarRutina = () => {
  const [numeroIdentificacion, setNumeroIdentificacion] = useState("");
  const [rutinas, setRutinas] = useState([]);
  const [clases, setClases] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError(
          "Debes iniciar sesión para consultar. Por favor, inicia sesión."
        );
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const [rutinasResponse, clasesResponse] = await Promise.all([
        consultarRutinaPorNumeroIdentificacion(numeroIdentificacion, config),
        consultarClasesPorNumeroIdentificacion(numeroIdentificacion, config),
      ]);
      setRutinas(rutinasResponse.data || []);
      setClases(clasesResponse.data || []);
      setError(null);
    } catch (err) {
      setError(
        err.message ||
          "Error al consultar datos. Asegúrate de estar autenticado."
      );
    }
  };

  return (
    <Container>
      <h2>Consultar Rutina</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Número de Identificación</Form.Label>
          <Form.Control
            type="text"
            value={numeroIdentificacion}
            onChange={(e) => setNumeroIdentificacion(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Consultar
        </Button>
      </Form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {rutinas.length > 0 && (
        <div>
          <h3>Rutinas Asignadas</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Rutina</th>
                <th>Días de Entrenamiento</th>
                <th>Días de Descanso</th>
              </tr>
            </thead>
            <tbody>
              {rutinas.map((rutina, index) => (
                <tr key={index}>
                  <td>{rutina.clienteNombre}</td>
                  <td>{rutina.nombre}</td>
                  <td>{rutina.diasEntrenamiento.join(", ")}</td>
                  <td>{rutina.diasDescanso.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {clases.length > 0 && (
        <div>
          <h3>Clases Inscritas</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Entrenador</th>
                <th>Clase</th>
                <th>Día</th>
                <th>Horario</th>
              </tr>
            </thead>
            <tbody>
              {clases.map((clase, index) => (
                <tr key={index}>
                  <td>{clase.entrenadorNombre}</td>
                  <td>{clase.nombreClase}</td>
                  <td>{clase.dia}</td>
                  <td>{`${clase.horarioInicio} - ${clase.horarioFin}`}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      {rutinas.length === 0 && clases.length === 0 && !error && (
        <p>
          No se encontraron rutinas ni clases para este número de
          identificación.
        </p>
      )}
    </Container>
  );
};

export default ConsultarRutina;
