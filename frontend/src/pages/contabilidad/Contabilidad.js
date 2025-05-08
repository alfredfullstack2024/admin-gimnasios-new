import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Alert, Form, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Contabilidad = () => {
  const [transacciones, setTransacciones] = useState([]);
  const [ingresos, setIngresos] = useState(0);
  const [egresos, setEgresos] = useState(0);
  const [saldo, setSaldo] = useState(0);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (fechaInicio) {
        params.fechaInicio = fechaInicio;
      }
      if (fechaFin) {
        params.fechaFin = fechaFin;
      }

      // Obtener egresos
      const contabilidadResponse = await api.get("/contabilidad", { params });
      const egresosData = contabilidadResponse.data.transacciones || [];

      // Filtrar solo egresos creados manualmente (referencia: "manual")
      const egresosFiltrados = egresosData.filter(
        (t) => t.tipo === "egreso" && t.referencia === "manual"
      );

      // Calcular total de egresos
      const egresosTotal = egresosFiltrados.reduce(
        (sum, t) => sum + t.monto,
        0
      );

      // Obtener ingresos totales desde Pagos
      const pagosResponse = await api.get("/pagos", { params });
      const ingresosTotal = pagosResponse.data.total || 0;

      // Calcular saldo
      const saldoTotal = ingresosTotal - egresosTotal;

      setTransacciones(egresosFiltrados);
      setIngresos(ingresosTotal);
      setEgresos(egresosTotal);
      setSaldo(saldoTotal);
      setError("");
    } catch (err) {
      const errorMessage =
        err.response?.status === 404
          ? "Ruta no encontrada en el backend. Verifica que el servidor esté corriendo y la ruta /contabilidad esté configurada."
          : err.message;
      setError("Error al cargar los datos: " + errorMessage);
      if (errorMessage.includes("Sesión expirada")) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [fechaInicio, fechaFin, navigate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const manejarFiltrar = (e) => {
    e.preventDefault();
    fetchData();
  };

  const limpiarFiltros = () => {
    setFechaInicio("");
    setFechaFin("");
    fetchData();
  };

  return (
    <div className="container mt-4">
      <h2>Contabilidad</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Filtrar por Fechas</Card.Title>
          <Form onSubmit={manejarFiltrar}>
            <Row>
              <Col md={4}>
                <Form.Group controlId="fechaInicio">
                  <Form.Label>Fecha de Inicio</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    placeholder="dd/mm/aaaa"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId="fechaFin">
                  <Form.Label>Fecha Final</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    placeholder="dd/mm/aaaa"
                  />
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex align-items-end">
                <Button type="submit" variant="primary" className="me-2">
                  Filtrar
                </Button>
                <Button variant="secondary" onClick={limpiarFiltros}>
                  Limpiar
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Resumen Financiero</Card.Title>
          {loading ? (
            <p>Cargando datos...</p>
          ) : (
            <Row>
              <Col md={4}>
                <p>
                  <strong>Ingresos totales:</strong> $
                  {ingresos.toLocaleString()}
                </p>
              </Col>
              <Col md={4}>
                <p>
                  <strong>Egresos totales:</strong> ${egresos.toLocaleString()}
                </p>
              </Col>
              <Col md={4}>
                <p>
                  <strong>Saldo:</strong> ${saldo.toLocaleString()}
                </p>
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      <Button
        variant="primary"
        className="mb-3"
        onClick={() => navigate("/contabilidad/crear-transaccion")}
      >
        Crear Egreso
      </Button>

      {loading ? (
        <Alert variant="info">Cargando transacciones...</Alert>
      ) : transacciones.length === 0 ? (
        <Alert variant="info">No hay egresos para mostrar.</Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Descripción</th>
              <th>Monto</th>
              <th>Tipo</th>
              <th>Categoría</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {transacciones.map((transaccion) => (
              <tr key={transaccion._id}>
                <td>{transaccion.descripcion}</td>
                <td>${transaccion.monto.toLocaleString()}</td>
                <td>{transaccion.tipo}</td>
                <td>{transaccion.categoria || "Sin categoría"}</td>
                <td>
                  {new Date(transaccion.fecha).toLocaleDateString("es-ES")}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Contabilidad;
