import React, { useState, useEffect, useContext } from "react";
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
  Spinner,
} from "react-bootstrap";
import { AuthContext } from "../../context/AuthContext";

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
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [numeroCedula, setNumeroCedula] = useState("");
  const [asignacionesUsuario, setAsignacionesUsuario] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Verificar autenticación al cargar el componente
  useEffect(() => {
    if (!user || !user.token) {
      setError("Debes iniciar sesión para asignar una rutina.");
      navigate("/login");
    }
  }, [user, navigate]);

  // Cargar clientes y rutinas al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [clientesRes, rutinasRes] = await Promise.all([
          obtenerClientes(),
          obtenerRutinas(),
        ]);
        setClientes(clientesRes.data);
        setRutinas(rutinasRes.data);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(
          "Error al cargar datos: " + (err.message || "Intenta de nuevo.")
        );
      } finally {
        setLoading(false);
      }
    };
    if (user && user.token) {
      fetchData();
    }
  }, [user]);

  // Cargar asignaciones cuando cambia el cliente seleccionado
  useEffect(() => {
    if (formData.clienteId) {
      fetchAsignaciones();
    } else {
      setAsignaciones([]); // Limpiar asignaciones si no hay cliente seleccionado
    }
  }, [formData.clienteId]);

  // Limpiar mensajes de error y éxito después de 5 segundos
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

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

  const fetchAsignaciones = async () => {
    try {
      setLoading(true);
      const cliente = clientes.find((c) => c._id === formData.clienteId);
      if (cliente) {
        const response = await consultarRutinaPorNumeroIdentificacion(
          cliente.numeroIdentificacion
        );
        // Asegurarse de que response.data sea un array
        const asignacionesData = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setAsignaciones(asignacionesData);
      } else {
        setAsignaciones([]);
      }
    } catch (err) {
      console.error("Error al cargar asignaciones:", err);
      setError(
        "Error al cargar asignaciones: " + (err.message || "Intenta de nuevo.")
      );
      setAsignaciones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validar que se hayan seleccionado días
    if (formData.diasEntrenamiento.length === 0) {
      setError("Debes seleccionar al menos un día de entrenamiento.");
      return;
    }
    if (formData.diasDescanso.length === 0) {
      setError("Debes seleccionar al menos un día de descanso.");
      return;
    }

    try {
      setLoading(true);
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
      await fetchAsignaciones();
    } catch (err) {
      console.error("Error al procesar asignación:", err);
      setError(
        "Error al procesar asignación: " + (err.message || "Intenta de nuevo.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (asignacion) => {
    setEditMode(true);
    setEditId(asignacion._id);
    setFormData({
      clienteId: asignacion.clienteId?._id || "",
      rutinaId: asignacion.rutinaId?._id || "",
      diasEntrenamiento: asignacion.diasEntrenamiento || [],
      diasDescanso: asignacion.diasDescanso || [],
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta asignación?")) {
      try {
        setLoading(true);
        await eliminarAsignacionRutina(id);
        setSuccess("Asignación eliminada con éxito!");
        await fetchAsignaciones();
      } catch (err) {
        console.error("Error al eliminar asignación:", err);
        setError(
          "Error al eliminar asignación: " +
            (err.message || "Intenta de nuevo.")
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleConsultarCedula = async () => {
    if (!numeroCedula.trim()) {
      setError("Por favor, ingresa un número de cédula válido.");
      return;
    }
    try {
      setLoading(true);
      const response = await consultarRutinaPorNumeroIdentificacion(
        numeroCedula
      );
      const asignacionesData = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setAsignacionesUsuario(asignacionesData);
      setError("");
    } catch (err) {
      console.error("Error al consultar por cédula:", err);
      setError(
        "Error al consultar por cédula: " + (err.message || "Intenta de nuevo.")
      );
      setAsignacionesUsuario([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <h2>{editMode ? "Editar Asignación" : "Asignar Rutina"}</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      {loading && (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      )}
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Cliente</Form.Label>
              <Form.Select
                name="clienteId"
                value={formData.clienteId}
                onChange={handleChange}
                required
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
        <Button variant="primary" type="submit" disabled={loading}>
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
            disabled={loading}
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
                  <td>{asignacion.clienteId?.nombre || "Desconocido"}</td>
                  <td>
                    {asignacion.rutinaId
                      ? `${asignacion.rutinaId.nombreEjercicio} (${asignacion.rutinaId.grupoMuscular})`
                      : "Desconocido"}
                  </td>
                  <td>{asignacion.diasEntrenamiento?.join(", ") || "N/A"}</td>
                  <td>{asignacion.diasDescanso?.join(", ") || "N/A"}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      onClick={() => handleEdit(asignacion)}
                      disabled={loading}
                    >
                      Editar
                    </Button>{" "}
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(asignacion._id)}
                      disabled={loading}
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
                disabled={loading}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Button
              variant="info"
              onClick={handleConsultarCedula}
              className="mt-2"
              disabled={loading}
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
                  <td>{asignacion.clienteId?.nombre || "Desconocido"}</td>
                  <td>
                    {asignacion.rutinaId
                      ? `${asignacion.rutinaId.nombreEjercicio} (${asignacion.rutinaId.grupoMuscular})`
                      : "Desconocido"}
                  </td>
                  <td>{asignacion.diasEntrenamiento?.join(", ") || "N/A"}</td>
                  <td>{asignacion.diasDescanso?.join(", ") || "N/A"}</td>
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
