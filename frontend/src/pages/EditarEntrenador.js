import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Alert, Spinner, Row, Col, Table } from "react-bootstrap";

const EditarEntrenador = () => {
  const { id } = useParams();
  const [entrenador, setEntrenador] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    especialidad: "",
    horarios: [],
  });
  const [nuevoHorario, setNuevoHorario] = useState({
    dia: "",
    horaInicio: "",
    horaFin: "",
  });
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntrenador = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No se encontró el token de autenticación");
        }
        const response = await axios.get(`/entrenadores/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Datos del entrenador:", response.data); // Depuración
        setEntrenador(response.data);
      } catch (err) {
        console.error(
          "Error al cargar el entrenador:",
          err.response?.data || err.message
        ); // Depuración
        setError(
          `❌ Error al cargar el entrenador: ${
            err.response?.data?.message || err.message
          }`
        );
      } finally {
        setCargando(false);
      }
    };

    fetchEntrenador();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      setEnviando(true);
      const token = localStorage.getItem("token");
      await axios.put(`/entrenadores/${id}`, entrenador, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje("✅ Entrenador actualizado exitosamente");
      setTimeout(() => navigate("/entrenadores"), 2000);
    } catch (err) {
      setError("❌ Error al actualizar el entrenador.");
    } finally {
      setEnviando(false);
    }
  };

  const handleAddHorario = () => {
    if (
      !nuevoHorario.dia ||
      !nuevoHorario.horaInicio ||
      !nuevoHorario.horaFin
    ) {
      setError("❌ Todos los campos del horario son obligatorios.");
      return;
    }
    setEntrenador({
      ...entrenador,
      horarios: [...entrenador.horarios, nuevoHorario],
    });
    setNuevoHorario({ dia: "", horaInicio: "", horaFin: "" });
  };

  const handleRemoveHorario = (index) => {
    setEntrenador({
      ...entrenador,
      horarios: entrenador.horarios.filter((_, i) => i !== index),
    });
  };

  if (cargando) {
    return (
      <div className="text-center">
        <Spinner animation="border" variant="primary" />
        <p>Cargando entrenador...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-primary mb-4" style={{ fontWeight: "bold" }}>
        🏋️‍♂️ Editar Entrenador
      </h2>

      {mensaje && <Alert variant="success">{mensaje}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Form.Group className="col-md-6 mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={entrenador.nombre}
              onChange={(e) =>
                setEntrenador({ ...entrenador, nombre: e.target.value })
              }
              required
            />
          </Form.Group>

          <Form.Group className="col-md-6 mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              value={entrenador.apellido}
              onChange={(e) =>
                setEntrenador({ ...entrenador, apellido: e.target.value })
              }
              required
            />
          </Form.Group>

          <Form.Group className="col-md-6 mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={entrenador.email}
              onChange={(e) =>
                setEntrenador({ ...entrenador, email: e.target.value })
              }
              required
            />
          </Form.Group>

          <Form.Group className="col-md-6 mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              value={entrenador.telefono}
              onChange={(e) =>
                setEntrenador({ ...entrenador, telefono: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="col-md-6 mb-3">
            <Form.Label>Especialidad</Form.Label>
            <Form.Control
              type="text"
              value={entrenador.especialidad}
              onChange={(e) =>
                setEntrenador({ ...entrenador, especialidad: e.target.value })
              }
            />
          </Form.Group>
        </Row>

        <h4 className="mt-4 mb-3">Horarios</h4>
        {entrenador.horarios.length > 0 && (
          <Table striped bordered hover className="mb-3">
            <thead>
              <tr>
                <th>Día</th>
                <th>Hora Inicio</th>
                <th>Hora Fin</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {entrenador.horarios.map((horario, index) => (
                <tr key={index}>
                  <td>{horario.dia}</td>
                  <td>{horario.horaInicio}</td>
                  <td>{horario.horaFin}</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveHorario(index)}
                    >
                      🗑️ Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        <h5>Añadir Nuevo Horario</h5>
        <Row className="mb-3">
          <Form.Group className="col-md-4">
            <Form.Label>Día</Form.Label>
            <Form.Select
              value={nuevoHorario.dia}
              onChange={(e) =>
                setNuevoHorario({ ...nuevoHorario, dia: e.target.value })
              }
            >
              <option value="">Selecciona un día</option>
              <option value="Lunes">Lunes</option>
              <option value="Martes">Martes</option>
              <option value="Miércoles">Miércoles</option>
              <option value="Jueves">Jueves</option>
              <option value="Viernes">Viernes</option>
              <option value="Sábado">Sábado</option>
              <option value="Domingo">Domingo</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="col-md-3">
            <Form.Label>Hora Inicio</Form.Label>
            <Form.Control
              type="time"
              value={nuevoHorario.horaInicio}
              onChange={(e) =>
                setNuevoHorario({ ...nuevoHorario, horaInicio: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="col-md-3">
            <Form.Label>Hora Fin</Form.Label>
            <Form.Control
              type="time"
              value={nuevoHorario.horaFin}
              onChange={(e) =>
                setNuevoHorario({ ...nuevoHorario, horaFin: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group className="col-md-2 d-flex align-items-end">
            <Button variant="primary" onClick={handleAddHorario}>
              Añadir
            </Button>
          </Form.Group>
        </Row>

        <Button
          type="submit"
          variant="danger"
          disabled={enviando}
          className="mt-3"
        >
          {enviando ? "Actualizando..." : "Actualizar Entrenador"}
        </Button>
      </Form>
    </div>
  );
};

export default EditarEntrenador;
