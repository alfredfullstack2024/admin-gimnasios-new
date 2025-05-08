import React, { useState } from "react";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Alert, Row, Col, Table } from "react-bootstrap"; // Añadí Table aquí

const CrearEntrenador = () => {
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
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    try {
      setEnviando(true);
      const token = localStorage.getItem("token");
      await axios.post("/entrenadores", entrenador, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMensaje("✅ Entrenador creado exitosamente");
      setTimeout(() => navigate("/entrenadores"), 2000);
    } catch (err) {
      setError("❌ Error al crear el entrenador.");
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

  return (
    <div>
      <h2 className="text-primary mb-4" style={{ fontWeight: "bold" }}>
        🏋️‍♂️ Crear Entrenador
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
            {" "}
            {/* Cambié Tabla por Table */}
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
          {enviando ? "Creando..." : "Crear Entrenador"}
        </Button>
      </Form>
    </div>
  );
};

export default CrearEntrenador;
