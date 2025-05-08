import React, { useState, useEffect } from "react";
import { Container, Form, Button } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../api/axios";
import { useNavigate, useParams } from "react-router-dom";

const EditarClase = () => {
  const { id } = useParams();
  const [clase, setClase] = useState({
    nombre: "",
    entrenador: "",
    horario: new Date(),
    capacidad: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClase = async () => {
      try {
        const response = await api.get(`/clases/${id}`);
        setClase({
          nombre: response.data.nombre,
          entrenador: response.data.entrenador,
          horario: new Date(response.data.horario),
          capacidad: response.data.capacidad,
        });
      } catch (err) {
        console.error("Error al cargar clase:", err);
      }
    };
    fetchClase();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClase({ ...clase, [name]: value });
  };

  const handleDateChange = (date) => {
    setClase({ ...clase, horario: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/clases/${id}`, clase);
      navigate("/clases");
    } catch (err) {
      console.error("Error al actualizar clase:", err);
    }
  };

  return (
    <Container className="mt-4">
      <h2>Editar Clase</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={clase.nombre}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Entrenador (opcional)</Form.Label>
          <Form.Control
            type="text"
            name="entrenador"
            value={clase.entrenador}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Horario</Form.Label>
          <div>
            <DatePicker
              selected={clase.horario}
              onChange={handleDateChange}
              showTimeSelect
              dateFormat="EEEE dd/MM/yyyy HH:mm"
              timeFormat="HH:mm"
              timeIntervals={15}
              className="form-control"
            />
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Capacidad</Form.Label>
          <Form.Control
            type="number"
            name="capacidad"
            value={clase.capacidad}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Actualizar Clase
        </Button>
        <Button
          variant="secondary"
          className="ms-2"
          onClick={() => navigate("/clases")}
        >
          Cancelar
        </Button>
      </Form>
    </Container>
  );
};

export default EditarClase;
