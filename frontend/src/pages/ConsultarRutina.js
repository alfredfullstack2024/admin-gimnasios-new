import React, { useState } from "react";
import { Container, Form, Button, Table, Alert } from "react-bootstrap";
import {
  consultarRutinaPorNumeroIdentificacion,
  consultarPagosPorCedula,
  consultarClasesPorNumeroIdentificacion,
} from "../api/axios";

const ConsultarRutina = () => {
  const [numeroIdentificacion, setNumeroIdentificacion] = useState("");
  const [rutinas, setRutinas] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [clases, setClases] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleConsultar = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setRutinas([]);
    setPagos([]);
    setClases([]);

    if (!numeroIdentificacion) {
      setError("Por favor, ingrese un número de identificación.");
      return;
    }

    const cleanNumeroIdentificacion = numeroIdentificacion.replace(
      /[^0-9]/g,
      ""
    );
    console.log(
      "Consultando con numeroIdentificacion:",
      cleanNumeroIdentificacion
    );

    try {
      // Consultar rutinas
      const rutinasResponse = await consultarRutinaPorNumeroIdentificacion(
        cleanNumeroIdentificacion
      );
      console.log("Rutinas obtenidas:", rutinasResponse.data);
      setRutinas(rutinasResponse.data || []);

      // Consultar pagos
      const pagosResponse = await consultarPagosPorCedula(
        cleanNumeroIdentificacion
      );
      console.log("Pagos obtenidos:", pagosResponse.data);
      setPagos(pagosResponse.data || []);

      // Consultar clases registradas
      const clasesResponse = await consultarClasesPorNumeroIdentificacion(
        cleanNumeroIdentificacion
      );
      console.log("Clases obtenidas:", clasesResponse.data);
      setClases(clasesResponse.data || []);

      if (
        rutinasResponse.data.length === 0 &&
        pagosResponse.data.length === 0 &&
        clasesResponse.data.length === 0
      ) {
        setError("No se encontraron datos para este número de identificación.");
      } else {
        setSuccess("Datos cargados exitosamente.");
      }
    } catch (err) {
      console.error(
        "Error al consultar datos:",
        err.response ? err.response.data : err.message
      );
      setError(
        err.response?.data?.mensaje ||
          err.message ||
          "Error al consultar los datos."
      );
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Consultar Rutina y Más</h2>

      <Form onSubmit={handleConsultar}>
        <Form.Group className="mb-3">
          <Form.Label>Número de Identificación</Form.Label>
          <Form.Control
            type="text"
            value={numeroIdentificacion}
            onChange={(e) => setNumeroIdentificacion(e.target.value)}
            placeholder="Ingrese su número de identificación"
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Consultar
        </Button>
      </Form>

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="mt-3">
          {success}
        </Alert>
      )}

      {/* Sección de Rutinas */}
      {rutinas.length > 0 ? (
        <>
          <h3 className="mt-4">Rutinas Asignadas</h3>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nombre de la Rutina</th>
                <th>Ejercicios</th>
                <th>Duración (min)</th>
                <th>Fecha de Asignación</th>
              </tr>
            </thead>
            <tbody>
              {rutinas.map((rutina, index) => (
                <tr key={index}>
                  <td>{rutina.nombreRutina}</td>
                  <td>{rutina.ejercicios.join(", ")}</td>
                  <td>{rutina.duracion}</td>
                  <td>
                    {new Date(rutina.fechaAsignacion).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      ) : (
        <Alert variant="info" className="mt-3">
          No se encontraron rutinas asignadas.
        </Alert>
      )}

      {/* Sección de Pagos */}
      {pagos.length > 0 ? (
        <>
          <h3 className="mt-4">Pagos Realizados</h3>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Monto</th>
                <th>Fecha de Pago</th>
                <th>Método de Pago</th>
                <th>Concepto</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((pago, index) => (
                <tr key={index}>
                  <td>{pago.monto}</td>
                  <td>{new Date(pago.fechaPago).toLocaleDateString()}</td>
                  <td>{pago.metodoPago}</td>
                  <td>{pago.concepto}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      ) : (
        <Alert variant="info" className="mt-3">
          No se encontraron pagos realizados.
        </Alert>
      )}

      {/* Sección de Clases Inscritas */}
      {clases.length > 0 ? (
        <>
          <h3 className="mt-4">Clases Inscritas</h3>
          <Table striped bordered hover responsive>
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
              {clases.map((clase, index) => (
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
        </>
      ) : (
        <Alert variant="info" className="mt-3">
          No se encontraron clases inscritas.
        </Alert>
      )}
    </Container>
  );
};

export default ConsultarRutina;
