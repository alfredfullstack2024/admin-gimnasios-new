import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import api from "../api/axios";

const Indicadores = () => {
  const [indicadores, setIndicadores] = useState({
    clientesActivos: 0,
    clientesInactivos: 0,
    totalProductos: 0,
    existenciasTotales: 0,
    entrenadores: 0,
    clasesActivas: 0,
    membresiasActivas: 0,
    membresiasPorVencer: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIndicadores = async () => {
      try {
        const response = await api.get("/indicadores");
        console.log("Datos de indicadores recibidos:", response.data);
        setIndicadores(response.data);
        setLoading(false);
      } catch (err) {
        console.error(
          "Error al cargar los indicadores:",
          err.response ? err.response : err
        );
        setError("Error al cargar los indicadores: Recurso no encontrado.");
        setLoading(false);
      }
    };

    fetchIndicadores();
  }, []);

  if (loading) return <Container>Cargando...</Container>;
  if (error) return <Container className="text-danger">{error}</Container>;

  return (
    <Container className="mt-4">
      <h2>Indicadores del Gimnasio</h2>
      <Row>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Clientes Activos</Card.Title>
              <Card.Text>{indicadores.clientesActivos}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Clientes Inactivos</Card.Title>
              <Card.Text>{indicadores.clientesInactivos}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Total de Productos</Card.Title>
              <Card.Text>{indicadores.totalProductos}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Existencias Totales</Card.Title>
              <Card.Text>{indicadores.existenciasTotales}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Entrenadores</Card.Title>
              <Card.Text>{indicadores.entrenadores}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Clases Activas</Card.Title>
              <Card.Text>{indicadores.clasesActivas}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Membresías Activas</Card.Title>
              <Card.Text>{indicadores.membresiasActivas}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Membresías por Vencer (5 días)</Card.Title>
              <Card.Text>{indicadores.membresiasPorVencer}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Indicadores;
