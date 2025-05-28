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

  useEffect(() => {
    if (!user || !user.token) {
      setError("Debes iniciar sesión para asignar una rutina.");
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const [clientesRes, rutinasRes] = await Promise.all([
          obtenerClientes(config),
          obtenerRutinas(config),
        ]);
        setClientes(clientesRes.data);
        setRutinas(rutinasRes.data);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setError(
          "Error al cargar datos: " +
            (err.response?.data?.mensaje || err.message)
        );
      } finally {
        setLoading(false);
      }
    };
    if (user && user.token) fetchData();
  }, [user]);

  useEffect(() => {
    if (formData.clienteId) fetchAsignaciones();
    else setAsignaciones([]);
  }, [formData.clienteId]);

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
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const response = await consultarRutinaPorNumeroIdentificacion(
          cliente.numeroIdentificacion,
          config
        );
        console.log(
          "Respuesta de fetchAsignaciones:",
          JSON.stringify(response.data, null, 2)
        );
        setAsignaciones(
          Array.isArray(response.data) ? response.data : [response.data]
        );
      }
    } catch (err) {
      console.error("Error al cargar asignaciones:", err);
      setError(
        "Error al cargar asignaciones: " +
          (err.response?.data?.mensaje || err.message)
      );
      setAsignaciones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.diasEntrenamiento.length === 0 ||
      formData.diasDescanso.length === 0
    ) {
      setError(
        "Debes seleccionar al menos un día de entrenamiento y descanso."
      );
      return;
    }
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      let response;
      if (editMode) {
        response = await editarAsignacionRutina(editId, formData, config);
        setSuccess("Asignación actualizada con éxito!");
      } else {
        response = await asignarRutina(formData, config);
        setSuccess("Rutina asignada con éxito!");
      }
      setEditMode(false);
      setEditId(null);
      setFormData({
        ...formData,
        rutinaId: "",
        diasEntrenamiento: [],
        diasDescanso: [],
      });
      if (formData.clienteId) fetchAsignaciones();
    } catch (err) {
      console.error("Error al procesar asignación:", err);
      setError(
        "Error al procesar asignación: " +
          (err.response?.data?.mensaje || err.message)
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
    if (!window.confirm("¿Estás seguro de eliminar esta asignación?")) return;
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await eliminarAsignacionRutina(id, config);
      setSuccess("Asignación eliminada con éxito!");
      setAsignaciones(asignaciones.filter((a) => a._id !== id));
      setAsignacionesUsuario(asignacionesUsuario.filter((a) => a._id !== id));
    } catch (err) {
      console.error("Error al eliminar asignación:", err);
      setError(
        "Error al eliminar asignación: " +
          (err.response?.data?.mensaje || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConsultarCedula = async () => {
    if (!numeroCedula.trim()) {
      setError("Por favor, ingresa un número de cédula válido.");
      return;
    }
    try {
      setLoading(true);
      const cleanNumeroCedula = numeroCedula.replace(/[^0-9]/g, "");
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await consultarRutinaPorNumeroIdentificacion(
        cleanNumeroCedula,
        config
      );
      console.log(
        "Respuesta de handleConsultarCedula:",
        JSON.stringify(response.data, null, 2)
      );
      const asignacionesData = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setAsignacionesUsuario(asignacionesData);
      if (asignacionesData.length === 0) {
        setError("No se encontraron asignaciones para esta cédula.");
      }
    } catch (err) {
      console.error("Error al consultar por cédula:", err);
      setError(
        "Error al consultar por cédula: " +
          (err.response?.data?.mensaje || err.message)
      );
      setAsignacionesUsuario([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setFormData({
      clienteId: "",
      rutinaId: "",
      diasEntrenamiento: [],
      diasDescanso: [],
    });
    setAsignaciones([]);
    setEditMode(false);
    setEditId(null);
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
                    {cliente.nombre} {cliente.apellido || ""}
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
                ...formData,
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
        <Button
          variant="outline-secondary"
          className="ms-2"
          onClick={handleClearForm}
          disabled={loading}
        >
          Limpiar Formulario
        </Button>
      </Form>

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
                    {asignacion.clienteId?.nombre || "Desconocido"}{" "}
                    {asignacion.clienteId?.apellido || ""}
                  </td>
                  <td>
                    {asignacion.rutinaId?.nombreEjercicio || "Desconocido"} (
                    {asignacion.rutinaId?.grupoMuscular || ""})
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
        {asignacionesUsuario.length > 0 ? (
          <Table striped bordered hover className="mt-3">
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
              {asignacionesUsuario.map((asignacion, index) => (
                <tr key={asignacion._id || index}>
                  <td>
                    {asignacion.clienteId?.nombre || "Desconocido"}{" "}
                    {asignacion.clienteId?.apellido || ""}
                  </td>
                  <td>
                    {asignacion.rutinaId?.nombreEjercicio || "Desconocido"} (
                    {asignacion.rutinaId?.grupoMuscular || ""})
                  </td>
                  <td>{asignacion.diasEntrenamiento?.join(", ") || "N/A"}</td>
                  <td>{asignacion.diasDescanso?.join(", ") || "N/A"}</td>
                  <td>
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
        ) : !loading && !error ? (
          <p>No hay asignaciones para este número de cédula.</p>
        ) : null}
      </div>
    </Container>
  );
};

export default AsignarRutina;
