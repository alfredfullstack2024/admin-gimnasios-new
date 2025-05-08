import React, { useState, useEffect } from "react";
import {
  obtenerClientes,
  obtenerRutinas,
  asignarRutina,
  editarAsignacionRutina,
  eliminarAsignacionRutina,
  consultarRutinaPorNumeroIdentificacion,
} from "../../api/axios";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Form,
  Button,
  Table,
  Alert,
  Row,
  Col,
} from "react-bootstrap";

const AsignarRutina = () => {
  const [clientes, setClientes] = useState([]);
  const [rutinas, setRutinas] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [formData, setFormData] = useState({
    clienteId: "",
    rutinaId: "",
    diasEntrenamiento: [],
    diasDescanso: [],
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [numeroCedula, setNumeroCedula] = useState("");
  const [asignacionesUsuario, setAsignacionesUsuario] = useState([]);
  const navigate = useNavigate();

  // Verificar token al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token en localStorage:", token);
    if (!token) {
      setError("Debes iniciar sesión para asignar una rutina.");
      navigate("/login");
    }
  }, [navigate]);

  // Cargar clientes, rutinas y asignaciones al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientesRes, rutinasRes] = await Promise.all([
          obtenerClientes(),
          obtenerRutinas(),
        ]);
        setClientes(clientesRes.data);
        setRutinas(rutinasRes.data);

        // Cargar asignaciones actuales (puedes ajustar la lógica según tu backend)
        const asignacionesRes = await consultarRutinaPorNumeroIdentificacion(
          ""
        ); // Inicialmente vacío
        setAsignaciones(asignacionesRes.data ? [asignacionesRes.data] : []);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError("Error al cargar datos: " + err.message);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDiasEntrenamiento = (e) => {
    const dias = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, diasEntrenamiento: dias });
  };

  const handleDiasDescanso = (e) => {
    const dias = Array.from(e.target.selectedOptions, (option) => option.value);
    setFormData({ ...formData, diasDescanso: dias });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      let response;
      if (editMode) {
        response = await editarAsignacionRutina(editId, formData);
        console.log("Respuesta del backend (editar):", response);
        setSuccess("Asignación actualizada con éxito!");
      } else {
        response = await asignarRutina(formData);
        console.log("Respuesta del backend (asignar):", response);
        setSuccess("Rutina asignada con éxito!");
      }
      setEditMode(false);
      setEditId(null);
      setFormData({
        clienteId: "",
        rutinaId: "",
        diasEntrenamiento: [],
        diasDescanso: [],
      });
      fetchAsignaciones(); // Recargar asignaciones
    } catch (err) {
      console.error("Error al procesar asignación:", err);
      setError(
        "Error al procesar asignación: " + (err.message || "Intenta de nuevo.")
      );
    }
  };

  const handleEdit = (asignacion) => {
    setEditMode(true);
    setEditId(asignacion._id);
    setFormData({
      clienteId: asignacion.clienteId,
      rutinaId: asignacion.rutinaId,
      diasEntrenamiento: asignacion.diasEntrenamiento,
      diasDescanso: asignacion.diasDescanso,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta asignación?")) {
      try {
        await eliminarAsignacionRutina(id);
        setSuccess("Asignación eliminada con éxito!");
        fetchAsignaciones(); // Recargar asignaciones
      } catch (err) {
        console.error("Error al eliminar asignación:", err);
        setError("Error al eliminar asignación: " + err.message);
      }
    }
  };

  const fetchAsignaciones = async () => {
    try {
      const response = await consultarRutinaPorNumeroIdentificacion(
        formData.clienteId
          ? clientes.find((c) => c._id === formData.clienteId)
              ?.numeroIdentificacion || ""
          : ""
      );
      setAsignaciones(response.data ? [response.data] : []);
    } catch (err) {
      console.error("Error al cargar asignaciones:", err);
      setError("Error al cargar asignaciones: " + err.message);
    }
  };

  const handleConsultarCedula = async () => {
    try {
      const response = await consultarRutinaPorNumeroIdentificacion(
        numeroCedula
      );
      setAsignacionesUsuario(response.data ? [response.data] : []);
      setError("");
    } catch (err) {
      console.error("Error al consultar por cédula:", err);
      setError("Error al consultar por cédula: " + err.message);
      setAsignacionesUsuario([]);
    }
  };

  return (
    <Container className="mt-4">
      <h2>{editMode ? "Editar Asignación" : "Asignar Rutina"}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Cliente</Form.Label>
              <Form.Select
                name="clienteId"
                value={formData.clienteId}
                onChange={(e) => {
                  handleChange(e);
                  fetchAsignaciones(); // Actualizar asignaciones al cambiar cliente
                }}
                required
              >
                <option value="">Seleccione un cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente._id} value={cliente._id}>
                    {cliente.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Rutina</Form.Label>
              <Form.Select
                name="rutinaId"
                value={formData.rutinaId}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una rutina</option>
                {rutinas.map((rutina) => (
                  <option key={rutina._id} value={rutina._id}>
                    {rutina.nombreEjercicio} ({rutina.grupoMuscular})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Días de Entrenamiento</Form.Label>
              <Form.Select
                multiple
                name="diasEntrenamiento"
                value={formData.diasEntrenamiento}
                onChange={handleDiasEntrenamiento}
                required
              >
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
                <option value="Sábado">Sábado</option>
                <option value="Domingo">Domingo</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Días de Descanso</Form.Label>
              <Form.Select
                multiple
                name="diasDescanso"
                value={formData.diasDescanso}
                onChange={handleDiasDescanso}
                required
              >
                <option value="Lunes">Lunes</option>
                <option value="Martes">Martes</option>
                <option value="Miércoles">Miércoles</option>
                <option value="Jueves">Jueves</option>
                <option value="Viernes">Viernes</option>
                <option value="Sábado">Sábado</option>
                <option value="Domingo">Domingo</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Button variant="primary" type="submit">
          {editMode ? "Actualizar Asignación" : "Asignar Rutina"}
        </Button>
        {editMode && (
          <Button
            variant="secondary"
            className="ms-2"
            onClick={() => {
              setEditMode(false);
              setEditId(null);
              setFormData({
                clienteId: "",
                rutinaId: "",
                diasEntrenamiento: [],
                diasDescanso: [],
              });
            }}
          >
            Cancelar Edición
          </Button>
        )}
      </Form>

      {/* Sección para listar las asignaciones del cliente seleccionado */}
      <div className="mt-5">
        <h3>Asignaciones del Cliente</h3>
        {asignaciones.length === 0 ? (
          <p>No hay asignaciones para este cliente.</p>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Rutina</th>
                <th>Días de Entrenamiento</th>
                <th>Días de Descanso</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {asignaciones.map((asignacion) => (
                <tr key={asignacion._id}>
                  <td>
                    {asignacion.clienteId
                      ? asignacion.clienteId.nombre
                      : "Desconocido"}
                  </td>
                  <td>
                    {asignacion.rutinaId
                      ? `${asignacion.rutinaId.nombreEjercicio} (${asignacion.rutinaId.grupoMuscular})`
                      : "Desconocido"}
                  </td>
                  <td>{asignacion.diasEntrenamiento.join(", ")}</td>
                  <td>{asignacion.diasDescanso.join(", ")}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleEdit(asignacion)}
                    >
                      Editar
                    </Button>{" "}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(asignacion._id)}
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

      {/* Sección para consulta por número de cédula */}
      <div className="mt-5">
        <h3>Consultar Asignaciones por Número de Cédula</h3>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Número de Cédula</Form.Label>
              <Form.Control
                type="text"
                value={numeroCedula}
                onChange={(e) => setNumeroCedula(e.target.value)}
                placeholder="Ingresa el número de cédula"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Button
              variant="info"
              onClick={handleConsultarCedula}
              className="mt-2"
            >
              Consultar
            </Button>
          </Col>
        </Row>
        {asignacionesUsuario.length > 0 && (
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Rutina</th>
                <th>Días de Entrenamiento</th>
                <th>Días de Descanso</th>
              </tr>
            </thead>
            <tbody>
              {asignacionesUsuario.map((asignacion) => (
                <tr key={asignacion._id}>
                  <td>
                    {asignacion.clienteId
                      ? asignacion.clienteId.nombre
                      : "Desconocido"}
                  </td>
                  <td>
                    {asignacion.rutinaId
                      ? `${asignacion.rutinaId.nombreEjercicio} (${asignacion.rutinaId.grupoMuscular})`
                      : "Desconocido"}
                  </td>
                  <td>{asignacion.diasEntrenamiento.join(", ")}</td>
                  <td>{asignacion.diasDescanso.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </Container>
  );
};

export default AsignarRutina;
