import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Alert, Form, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Contabilidad = () => {
  const [transacciones, setTransacciones] = useState([]);
  const [totalIngresos, setTotalIngresos] = useState(0);
  const [totalEgresos, setTotalEgresos] = useState(0);
  const [balance, setBalance] = useState(0);
  const [filtroTipo, setFiltroTipo] = useState("mes");
  const [mes, setMes] = useState("");
  const [semana, setSemana] = useState("");
  const [tipoTransaccion, setTipoTransaccion] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTransacciones = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const params = {};
      if (filtroTipo === "mes" && mes) {
        const [year, month] = mes.split("-");
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        endDate.setHours(23, 59, 59, 999);
        params.fechaInicio = startDate.toISOString();
        params.fechaFin = endDate.toISOString();
      } else if (filtroTipo === "semana" && semana) {
        const [year, week] = semana.split("-W");
        const startDate = new Date(year, 0, 1);
        startDate.setDate(
          startDate.getDate() + (week - 1) * 7 - startDate.getDay() + 1
        );
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        params.fechaInicio = startDate.toISOString();
        params.fechaFin = endDate.toISOString();
      }

      if (tipoTransaccion) {
        params.tipo = tipoTransaccion;
      }

      console.log("Parámetros enviados a /api/contabilidad:", params); // Depuración
      const response = await api.get("/api/contabilidad", { params });
      console.log("Respuesta del backend (/api/contabilidad):", response.data); // Depuración
      const fetchedTransacciones = response.data.transacciones || [];
      setTransacciones(fetchedTransacciones);
      setTotalIngresos(
        fetchedTransacciones
          .filter((t) => t.tipo === "ingreso")
          .reduce((sum, t) => sum + t.monto, 0)
      );
      setTotalEgresos(
        fetchedTransacciones
          .filter((t) => t.tipo === "egreso")
          .reduce((sum, t) => sum + t.monto, 0)
      );
      setBalance(totalIngresos - totalEgresos);
    } catch (err) {
      const errorMessage = err.response?.data?.mensaje || err.message;
      setError("Error al cargar las transacciones: " + errorMessage);
      setTransacciones([]);
      setTotalIngresos(0);
      setTotalEgresos(0);
      setBalance(0);
      console.error("Detalles del error:", err.response?.data); // Depuración
    } finally {
      setIsLoading(false);
    }
  }, [filtroTipo, mes, semana, tipoTransaccion, totalIngresos, totalEgresos]);

  useEffect(() => {
    fetchTransacciones();
  }, [fetchTransacciones]);

  const manejarFiltrar = async (e) => {
    e.preventDefault();
    setTransacciones([]);
    setTotalIngresos(0);
    setTotalEgresos(0);
    setBalance(0);
    await fetchTransacciones();
  };

  const limpiarFiltros = async () => {
    setFiltroTipo("mes");
    setMes("");
    setSemana("");
    setTipoTransaccion("");
    setTransacciones([]);
    setTotalIngresos(0);
    setTotalEgresos(0);
    setBalance(0);
    await fetchTransacciones();
  };

  const formatFecha = (fecha) => {
    const date = new Date(fecha);
    return new Date(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate()
    ).toLocaleDateString("es-ES");
  };

  return (
    <div className="container mt-4">
      <h2>Contabilidad</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Filtrar Transacciones</Card.Title>
          <Form onSubmit={manejarFiltrar}>
            <Row>
              <Col md={3}>
                <Form.Group controlId="filtroTipo">
                  <Form.Label>Tipo de Filtro</Form.Label>
                  <Form.Select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="mes">Mes</option>
                    <option value="semana">Semana</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              {filtroTipo === "mes" ? (
                <Col md={3}>
                  <Form.Group controlId="mes">
                    <Form.Label>Mes</Form.Label>
                    <Form.Control
                      type="month"
                      value={mes}
                      onChange={(e) => setMes(e.target.value)}
                      disabled={isLoading}
                    />
                  </Form.Group>
                </Col>
              ) : (
                <Col md={3}>
                  <Form.Group controlId="semana">
                    <Form.Label>Semana</Form.Label>
                    <Form.Control
                      type="week"
                      value={semana}
                      onChange={(e) => setSemana(e.target.value)}
                      disabled={isLoading}
                    />
                  </Form.Group>
                </Col>
              )}
              <Col md={3}>
                <Form.Group controlId="tipoTransaccion">
                  <Form.Label>Tipo de Transacción</Form.Label>
                  <Form.Select
                    value={tipoTransaccion}
                    onChange={(e) => setTipoTransaccion(e.target.value)}
                    disabled={isLoading}
                  >
                    <option value="">Todos</option>
                    <option value="ingreso">Ingresos</option>
                    <option value="egreso">Egresos</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3} className="d-flex align-items-end">
                <Button
                  type="submit"
                  variant="primary"
                  className="me-2"
                  disabled={isLoading}
                >
                  Filtrar
                </Button>
                <Button
                  variant="secondary"
                  onClick={limpiarFiltros}
                  disabled={isLoading}
                >
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
          <p>
            <strong>Total Ingresos:</strong> ${totalIngresos.toLocaleString()}
          </p>
          <p>
            <strong>Total Egresos:</strong> ${totalEgresos.toLocaleString()}
          </p>
          <p>
            <strong>Balance:</strong> ${balance.toLocaleString()}
          </p>
        </Card.Body>
      </Card>
      <Button
        variant="primary"
        className="mb-3"
        onClick={() => navigate("/contabilidad/crear-transaccion")}
        disabled={isLoading}
      >
        Registrar Nueva Transacción
      </Button>
      {isLoading && <Alert variant="info">Cargando transacciones...</Alert>}
      {!isLoading && transacciones.length === 0 && !error && (
        <Alert variant="info">No hay transacciones para mostrar.</Alert>
      )}
      {!isLoading && transacciones.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Descripción</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Cuenta Débito</th>
              <th>Cuenta Crédito</th>
              <th>Referencia</th>
              <th>Creado Por</th>
            </tr>
          </thead>
          <tbody>
            {transacciones.map((transaccion) => (
              <tr key={transaccion._id}>
                <td>{transaccion.tipo === "ingreso" ? "Ingreso" : "Egreso"}</td>
                <td>{transaccion.descripcion}</td>
                <td>${transaccion.monto.toLocaleString()}</td>
                <td>{formatFecha(transaccion.fecha)}</td>
                <td>{transaccion.cuentaDebito}</td>
                <td>{transaccion.cuentaCredito}</td>
                <td>{transaccion.referencia}</td>
                <td>{transaccion.creadoPor?.nombre || "Desconocido"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Contabilidad;
