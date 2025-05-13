import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { crearClase, obtenerEntrenadores } from "../../api/axios";
import { jwtDecode } from "jwt-decode";

const CrearClase = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    horarios: [{ dia: "", hora: "" }],
    capacidad: 1,
    entrenador: "",
    estado: "activa",
  });
  const [entrenadores, setEntrenadores] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const diasSemana = [
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
    "domingo",
  ];

  useEffect(() => {
    const fetchEntrenadores = async () => {
      setIsLoading(true);
      try {
        const response = await obtenerEntrenadores();
        console.log("Entrenadores cargados:", response.data);
        setEntrenadores(response.data);
      } catch (err) {
        setError("Error al cargar entrenadores: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntrenadores();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleHorarioChange = (index, field, value) => {
    const nuevosHorarios = [...formData.horarios];
    nuevosHorarios[index][field] = value;
    setFormData((prevState) => ({ ...prevState, horarios: nuevosHorarios }));
  };

  const agregarHorario = () => {
    setFormData((prevState) => ({
      ...prevState,
      horarios: [...prevState.horarios, { dia: "", hora: "" }],
    }));
  };

  const eliminarHorario = (index) => {
    const nuevosHorarios = formData.horarios.filter((_, i) => i !== index);
    setFormData((prevState) => ({ ...prevState, horarios: nuevosHorarios }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validar horarios
    if (formData.horarios.length === 0) {
      setError("Debe proporcionar al menos un horario");
      setIsLoading(false);
      return;
    }
    for (const horario of formData.horarios) {
      if (!horario.dia || !horario.hora) {
        setError("Todos los horarios deben tener un día y una hora");
        setIsLoading(false);
        return;
      }
      if (!diasSemana.includes(horario.dia.toLowerCase())) {
        setError("Día inválido: " + horario.dia);
        setIsLoading(false);
        return;
      }
      if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(horario.hora)) {
        setError("Formato de hora inválido: " + horario.hora);
        setIsLoading(false);
        return;
      }
    }

    const token = localStorage.getItem("token");
    console.log("Token en localStorage:", token);
    let creadoPor = null;
    if (!token) {
      setError("No se encontró un token. Inicia sesión nuevamente.");
      setIsLoading(false);
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      console.log("Token decodificado:", decodedToken);
      creadoPor =
        decodedToken.id ||
        decodedToken.sub ||
        decodedToken._id ||
        decodedToken.userId;
      console.log("creadoPor extraído:", creadoPor); // Línea 155
      if (!creadoPor) {
        setError(
          "No se pudo extraer el ID del usuario del token. Verifica la estructura del token."
        );
        setIsLoading(false);
        return;
      }
    } catch (err) {
      console.error("Error al decodificar el token:", err);
      setError("Error al decodificar el token: " + err.message);
      setIsLoading(false);
      return;
    }

    // Construir datos a enviar
    const datosEnvio = {
      ...formData,
      capacidad: Number(formData.capacidad),
      creadoPor,
    };
    console.log("Datos enviados al backend (antes de axios):", datosEnvio);

    try {
      const response = await crearClase(datosEnvio);
      console.log("Respuesta del backend:", response.data);
      navigate("/clases");
    } catch (err) {
      const errorMessage = err.response?.data?.mensaje || err.message;
      setError("Error al crear la clase: " + errorMessage);
      console.error("Error completo:", err);
      if (errorMessage.includes("Sesión expirada")) {
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Crear Clase</h2>

      {isLoading && <Alert variant="info">Cargando...</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="descripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                disabled={isLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="horarios">
              <Form.Label>Horarios</Form.Label>
              {formData.horarios.map((horario, index) => (
                <Row key={index} className="mb-2">
                  <Col md={5}>
                    <Form.Control
                      as="select"
                      value={horario.dia}
                      onChange={(e) =>
                        handleHorarioChange(index, "dia", e.target.value)
                      }
                      required
                      disabled={isLoading}
                    >
                      <option value="">Seleccione un día</option>
                      {diasSemana.map((dia) => (
                        <option key={dia} value={dia}>
                          {dia.charAt(0).toUpperCase() + dia.slice(1)}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={5}>
                    <Form.Control
                      type="time"
                      value={horario.hora}
                      onChange={(e) =>
                        handleHorarioChange(index, "hora", e.target.value)
                      }
                      required
                      disabled={isLoading}
                    />
                  </Col>
                  <Col md={2}>
                    <Button
                      variant="danger"
                      onClick={() => eliminarHorario(index)}
                      disabled={isLoading || formData.horarios.length === 1}
                    >
                      Eliminar
                    </Button>
                  </Col>
                </Row>
              ))}
              <Button
                variant="secondary"
                onClick={agregarHorario}
                disabled={isLoading}
                className="mt-2"
              >
                Agregar otro horario
              </Button>
            </Form.Group>

            <Form.Group className="mb-3" controlId="capacidad">
              <Form.Label>Capacidad</Form.Label>
              <Form.Control
                type="number"
                name="capacidad"
                value={formData.capacidad}
                onChange={handleChange}
                min="1"
                required
                disabled={isLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="entrenador">
              <Form.Label>Entrenador</Form.Label>
              <Form.Control
                as="select"
                name="entrenador"
                value={formData.entrenador}
                onChange={handleChange}
                required
                disabled={isLoading}
              >
                <option value="">Seleccione un entrenador</option>
                {entrenadores.map((entrenador) => (
                  <option key={entrenador._id} value={entrenador._id}>
                    {entrenador.nombre} {entrenador.apellido}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="estado">
              <Form.Label>Estado</Form.Label>
              <Form.Control
                as="select"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="activa">Activa</option>
                <option value="inactiva">Inactiva</option>
              </Form.Control>
            </Form.Group>

            <Button variant="primary" type="submit" disabled={isLoading}>
              Crear Clase
            </Button>
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => navigate("/clases")}
              disabled={isLoading}
            >
              Cancelar
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CrearClase;
