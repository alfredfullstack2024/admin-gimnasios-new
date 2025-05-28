import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { obtenerUsuarios, crearSesion } from "../../api/axios";

const CrearSesion = () => {
  const [formData, setFormData] = useState({
    profesor: "",
    horarios: [{ dia: "", hora: "" }],
  });
  const [usuarios, setUsuarios] = useState([]);
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
    const fetchUsuarios = async () => {
      try {
        const response = await obtenerUsuarios();
        setUsuarios(response.data.filter((u) => u.rol === "profesor"));
      } catch (err) {
        setError(err.message);
      }
    };
    fetchUsuarios();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleHorarioChange = (index, field, value) => {
    const nuevosHorarios = [...formData.horarios];
    nuevosHorarios[index][field] = value;
    setFormData({ ...formData, horarios: nuevosHorarios });
  };

  const agregarHorario = () => {
    setFormData({
      ...formData,
      horarios: [...formData.horarios, { dia: "", hora: "" }],
    });
  };

  const eliminarHorario = (index) => {
    const nuevosHorarios = formData.horarios.filter((_, i) => i !== index);
    setFormData({ ...formData, horarios: nuevosHorarios });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    if (!formData.profesor || formData.horarios.length === 0) {
      setError("Seleccione un profesor y al menos un horario");
      setIsLoading(false);
      return;
    }
    try {
      await crearSesion(formData);
      navigate("/sesiones");
    } catch (err) {
      setError(err.response?.data?.mensaje || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Crear Sesión</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Profesor</Form.Label>
              <Form.Control
                as="select"
                name="profesor"
                value={formData.profesor}
                onChange={handleChange}
                required
                disabled={isLoading}
              >
                <option value="">Seleccione un profesor</option>
                {usuarios.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.nombre} {u.apellido}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Horarios</Form.Label>
              {formData.horarios.map((h, i) => (
                <Row key={i} className="mb-2">
                  <Col md={5}>
                    <Form.Control
                      as="select"
                      value={h.dia}
                      onChange={(e) =>
                        handleHorarioChange(i, "dia", e.target.value)
                      }
                      required
                      disabled={isLoading}
                    >
                      <option value="">Día</option>
                      {diasSemana.map((d) => (
                        <option key={d} value={d}>
                          {d.charAt(0).toUpperCase() + d.slice(1)}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                  <Col md={5}>
                    <Form.Control
                      type="time"
                      value={h.hora}
                      onChange={(e) =>
                        handleHorarioChange(i, "hora", e.target.value)
                      }
                      required
                      disabled={isLoading}
                    />
                  </Col>
                  <Col md={2}>
                    <Button
                      variant="danger"
                      onClick={() => eliminarHorario(i)}
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
                Agregar Horario
              </Button>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoading}>
              Crear Sesión
            </Button>
            <Button
              variant="secondary"
              className="ms-2"
              onClick={() => navigate("/sesiones")}
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

export default CrearSesion;
