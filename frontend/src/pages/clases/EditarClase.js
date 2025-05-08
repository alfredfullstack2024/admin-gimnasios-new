import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const EditarClase = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    fechaInicio: null,
    fechaFin: null,
    instructor: "",
    cupoMaximo: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClase = async () => {
      if (!user || !user.token) {
        setError("Debes iniciar sesión para editar una clase.");
        return;
      }
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const response = await axios.get(
          `http://localhost:5000/api/clases/${id}`,
          config
        );
        const clase = response.data;
        setFormData({
          nombre: clase.nombre || "",
          descripcion: clase.descripcion || "",
          fechaInicio: clase.fechaInicio ? new Date(clase.fechaInicio) : null,
          fechaFin: clase.fechaFin ? new Date(clase.fechaFin) : null,
          instructor: clase.instructor || "",
          cupoMaximo: clase.cupoMaximo || "",
        });
      } catch (err) {
        setError(
          "Error al cargar la clase: " +
            (err.response?.data?.message || err.message)
        );
      } finally {
        setLoading(false);
      }
    };
    fetchClase();
  }, [id, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (name) => (date) => {
    setFormData({ ...formData, [name]: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!user || !user.token) {
      setError("Debes iniciar sesión para editar una clase.");
      return;
    }

    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const payload = {
        ...formData,
        fechaInicio: formData.fechaInicio
          ? formData.fechaInicio.toISOString()
          : null,
        fechaFin: formData.fechaFin ? formData.fechaFin.toISOString() : null,
      };
      await axios.put(
        `http://localhost:5000/api/clases/${id}`,
        payload,
        config
      );
      setSuccess("Clase actualizada con éxito!");
      setTimeout(() => navigate("/clases"), 2000);
    } catch (err) {
      setError(
        "Error al actualizar la clase: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Editar Clase</h2>
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
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Fecha Inicio</Form.Label>
          <DatePicker
            selected={formData.fechaInicio}
            onChange={handleDateChange("fechaInicio")}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            placeholderText="Selecciona una fecha"
            isClearable
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Fecha Fin</Form.Label>
          <DatePicker
            selected={formData.fechaFin}
            onChange={handleDateChange("fechaFin")}
            dateFormat="yyyy-MM-dd"
            className="form-control"
            placeholderText="Selecciona una fecha"
            isClearable
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Instructor</Form.Label>
          <Form.Control
            type="text"
            name="instructor"
            value={formData.instructor}
            onChange={handleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Cupo Máximo</Form.Label>
          <Form.Control
            type="number"
            name="cupoMaximo"
            value={formData.cupoMaximo}
            onChange={handleChange}
            required
            min="1"
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={loading}>
          Actualizar Clase
        </Button>
      </Form>
    </div>
  );
};

export default EditarClase;
