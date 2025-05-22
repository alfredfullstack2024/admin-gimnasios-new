import React, { useState, useEffect } from "react";
import { consultarComposicionPorCliente } from "../api/axios";
import { Container, Form, Button, Table, Alert } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";

const ConsultarComposicionCorporal = () => {
  const [identificacion, setIdentificacion] = useState("");
  const [composiciones, setComposiciones] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (identificacion) {
      fetchComposiciones();
    }
  }, [identificacion]);

  const fetchComposiciones = async () => {
    try {
      const response = await consultarComposicionPorCliente(identificacion);
      setComposiciones(response.data);
      setError("");
    } catch (err) {
      setError("No se encontraron registros para esta identificación.");
      setComposiciones([]);
    }
  };

  const evaluarMejora = (current, previous) => {
    if (!previous) return null;
    const pesoMejor = current.peso < previous.peso;
    const grasaMejor = current.porcentajeGrasa < previous.porcentajeGrasa;
    const masaMejor = current.masaMuscular > previous.masaMuscular;
    return pesoMejor && grasaMejor && masaMejor ? (
      <FaCheck color="green" />
    ) : (
      <FaTimes color="red" />
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess("");
    fetchComposiciones();
  };

  return (
    <Container className="mt-4">
      <h2>Consultar Composición Corporal</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group className="mb-3">
          <Form.Label>Número de Identificación</Form.Label>
          <Form.Control
            type="text"
            value={identificacion}
            onChange={(e) => setIdentificacion(e.target.value)}
            placeholder="Ingresa el número de identificación"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Consultar
        </Button>
      </Form>

      {composiciones.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Peso (kg)</th>
              <th>Porcentaje Grasa (%)</th>
              <th>Masa Muscular (kg)</th>
              <th>Medidas (cm)</th>
              <th>Objetivo</th>
              <th>Antecedentes Médicos</th>
              <th>Indicador de Mejora</th>
            </tr>
          </thead>
          <tbody>
            {composiciones
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 3)
              .map((comp, index) => (
                <tr key={comp._id}>
                  <td>{new Date(comp.createdAt).toLocaleDateString()}</td>
                  <td>{comp.peso}</td>
                  <td>{comp.porcentajeGrasa || "N/A"}</td>
                  <td>{comp.masaMuscular || "N/A"}</td>
                  <td>
                    {comp.medidas ? (
                      <ul style={{ listStyleType: "none", padding: 0 }}>
                        <li>Brazo D.: {comp.medidas.brazoDerecho || "N/A"}</li>
                        <li>
                          Brazo I.: {comp.medidas.brazoIzquierdo || "N/A"}
                        </li>
                        <li>Pecho: {comp.medidas.pecho || "N/A"}</li>
                        <li>Cintura: {comp.medidas.cintura || "N/A"}</li>
                        <li>Cadera: {comp.medidas.cadera || "N/A"}</li>
                        <li>
                          Pierna D.: {comp.medidas.piernaDerecha || "N/A"}
                        </li>
                        <li>
                          Pierna I.: {comp.medidas.piernaIzquierda || "N/A"}
                        </li>
                      </ul>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>{comp.objetivo || "N/A"}</td>
                  <td>
                    {comp.antecedentesMedicos ? (
                      <ul style={{ listStyleType: "none", padding: 0 }}>
                        <li>
                          Problemas:{" "}
                          {comp.antecedentesMedicos.problemasFisicos || "N/A"}
                        </li>
                        <li>
                          Notas:{" "}
                          {comp.antecedentesMedicos.notasAdicionales || "N/A"}
                        </li>
                      </ul>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td>
                    {index === 0 ? evaluarMejora(comp, composiciones[1]) : null}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default ConsultarComposicionCorporal;
