import React, { useState, useEffect } from "react";
import { Table, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Clases = () => {
  const [clases, setClases] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Cargar clases al montar el componente
  useEffect(() => {
    const fetchClases = async () => {
      try {
        const response = await api.get("/clases");
        setClases(response.data || []);
        setError("");
      } catch (err) {
        setError("Error al cargar las clases: " + err.message);
      }
    };
    fetchClases();
  }, []);

  // Función para eliminar una clase
  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta clase?")) {
      try {
        await api.delete(`/clases/${id}`);
        setClases(clases.filter((clase) => clase._id !== id));
      } catch (err) {
        setError("Error al eliminar la clase: " + err.message);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Clases</h2>

      {/* Mostrar error si existe */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Botón para crear una nueva clase */}
      <Button
        variant="primary"
        className="mb-3"
        onClick={() => navigate("/clases/crear")}
      >
        Crear Clase
      </Button>

      {/* Tabla de clases */}
      {clases.length === 0 ? (
        <Alert variant="info">No hay clases para mostrar.</Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Entrenador</th>
              <th>Horario</th>
              <th>Capacidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clases.map((clase) => (
              <tr key={clase._id}>
                <td>{clase.nombre}</td>
                <td>
                  {clase.entrenador
                    ? `${clase.entrenador.nombre} ${clase.entrenador.apellido}`
                    : "Sin entrenador"}
                </td>
                <td>{clase.horario}</td>
                <td>{clase.capacidad}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => navigate(`/clases/editar/${clase._id}`)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleEliminar(clase._id)}
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
  );
};

export default Clases;
