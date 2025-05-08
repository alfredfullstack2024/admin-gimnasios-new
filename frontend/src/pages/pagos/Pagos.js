import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Alert, Form, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Pagos = () => {
  const [pagos, setPagos] = useState([]);
  const [total, setTotal] = useState(0);
  const [filtroTipo, setFiltroTipo] = useState("mes"); // "mes" o "semana"
  const [mes, setMes] = useState(""); // Formato: YYYY-MM
  const [semana, setSemana] = useState(""); // Formato: YYYY-WW
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPagos = useCallback(async () => {
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

      const response = await api.get("/pagos", { params });
      const fetchedPagos = response.data.pagos || [];
      setPagos(fetchedPagos);
      setTotal(response.data.total || 0);
    } catch (err) {
      const errorMessage =
        err.response?.status === 401
          ? `Error de autenticación: ${
              err.response.data.mensaje || "Sesión inválida"
            }`
          : err.response?.status === 404
          ? "Ruta no encontrada en el backend. Verifica que el servidor esté corriendo y la ruta /pagos esté configurada."
          : err.message;
      setError("Error al cargar los pagos: " + errorMessage);
      setPagos([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  }, [filtroTipo, mes, semana]);

  useEffect(() => {
    fetchPagos();
  }, [fetchPagos]);

  const manejarFiltrar = async (e) => {
    e.preventDefault();
    setPagos([]); // Limpiar pagos antes de la nueva solicitud
    setTotal(0);
    await fetchPagos();
  };

  const limpiarFiltros = async () => {
    setFiltroTipo("mes");
    setMes("");
    setSemana("");
    setPagos([]);
    setTotal(0);
    await fetchPagos();
  };

  const eliminarPago = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este pago?")) {
      return;
    }

    try {
      setIsLoading(true);
      await api.delete(`/pagos/${id}`);
      setPagos((prevPagos) => {
        const nuevosPagos = prevPagos.filter((pago) => pago._id !== id);
        const nuevoTotal = nuevosPagos.reduce(
          (sum, pago) => sum + pago.monto,
          0
        );
        setTotal(nuevoTotal);
        return nuevosPagos;
      });
      setError("");
    } catch (err) {
      setError(
        "Error al eliminar el pago: " +
          (err.response?.data?.mensaje || err.message)
      );
      await fetchPagos();
    } finally {
      setIsLoading(false);
    }
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
      <h2>Pagos</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Filtrar por Período</Card.Title>
          <Form onSubmit={manejarFiltrar}>
            <Row>
              <Col md={4}>
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
                <Col md={4}>
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
                <Col md={4}>
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
              <Col md={4} className="d-flex align-items-end">
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
          <Card.Title>Total de Pagos</Card.Title>
          <p>
            <strong>Total:</strong> ${total.toLocaleString()}
          </p>
        </Card.Body>
      </Card>

      <Button
        variant="primary"
        className="mb-3"
        onClick={() => navigate("/pagos/crear")}
        disabled={isLoading}
      >
        Crear Pago
      </Button>

      {isLoading && <Alert variant="info">Cargando pagos...</Alert>}

      {!isLoading && pagos.length === 0 && !error && (
        <Alert variant="info">No hay pagos para mostrar.</Alert>
      )}

      {!isLoading && pagos.length > 0 && (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago) => (
              <tr key={pago._id}>
                <td>
                  {pago.cliente
                    ? `${pago.cliente.nombre} ${pago.cliente.apellido || ""}`
                    : "Cliente no encontrado"}
                </td>
                <td>${pago.monto.toLocaleString()}</td>
                <td>{formatFecha(pago.fecha)}</td>
                <td>{pago.producto?.nombre || "Producto no especificado"}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/pagos/editar/${pago._id}`)}
                    disabled={isLoading}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => eliminarPago(pago._id)}
                    disabled={isLoading}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Pagos;
