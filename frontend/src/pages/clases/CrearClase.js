import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { crearClase, obtenerEntrenadores } from "../../api/axios";
import jwtDecode from "jwt-decode";

const CrearClase = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    horario: "",
    capacidad: 1,
    entrenador: "",
    estado: "activa",
  });
  const [entrenadores, setEntrenadores] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const horario = new Date(formData.horario);
    if (isNaN(horario.getTime())) {
      setError("Horario inválido");
      setIsLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    let creadoPor = null;
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        creadoPor = decodedToken.id || decodedToken.sub;
      } catch (err) {
        setError("Error al decodificar el token: " + err.message);
        setIsLoading(false);
        return;
      }
    }
    if (!creadoPor) {
      setError(
        "No se pudo determinar el usuario creador. Inicia sesión nuevamente."
      );
      setIsLoading(false);
      return;
    }

    const datosEnvio = {
      ...formData,
      horario: horario.toISOString(),
      capacidad: Number(formData.capacidad),
      creadoPor,
    };
    console.log("Datos enviados al backend:", datosEnvio);

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

            <Form.Group className="mb-3" controlId="horario">
              <Form.Label>Horario</Form.Label>
              <Form.Control
                type="datetime-local"
                name="horario"
                value={formData.horario}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
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
