import React, { useState, useEffect } from "react";
import { Table, Button, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { obtenerClases, eliminarClase } from "../../api/axios";

const ListaClases = () => {
  const [clases, setClases] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClases = async () => {
      setIsLoading(true);
      try {
        const response = await obtenerClases();
        console.log("Clases cargadas (estructura):", response.data);
        setClases(response.data);
      } catch (err) {
        setError("Error al cargar clases: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClases();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta clase?")) {
      setIsLoading(true);
      try {
        await eliminarClase(id);
        setClases(clases.filter((clase) => clase._id !== id));
      } catch (err) {
        setError("Error al eliminar la clase: " + err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lista de Clases</h2>

      {isLoading && <Alert variant="info">Cargando...</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      {!isLoading && clases.length === 0 && !error && (
        <Alert variant="info">No hay clases para mostrar.</Alert>
      )}

      <Card>
        <Card.Body>
          <Button
            variant="primary"
            className="mb-3"
            onClick={() => navigate("/clases/crear")}
            disabled={isLoading}
          >
            Crear Nueva Clase
          </Button>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Días y Horarios</th>
                <th>Capacidad Máxima</th>
                <th>Entrenador</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clases.map((clase) => (
                <tr key={clase._id}>
                  <td>{clase.nombreClase}</td>
                  <td>
                    {clase.dias &&
                    Array.isArray(clase.dias) &&
                    clase.dias.length > 0
                      ? clase.dias.map((dia, index) => (
                          <div key={index}>
                            {dia.dia.charAt(0).toUpperCase() + dia.dia.slice(1)}
                            : {dia.horarioInicio} - {dia.horarioFin}
                          </div>
                        ))
                      : "Sin horario"}
                  </td>
                  <td>{clase.capacidadMaxima}</td>
                  <td>
                    {clase.entrenador
                      ? `${clase.entrenador.nombre} ${clase.entrenador.apellido}`
                      : "Sin entrenador"}
                  </td>
                  <td>{clase.estado}</td>
                  <td>
                    <Button
                      variant="warning"
                      className="me-2"
                      onClick={() => navigate(`/clases/editar/${clase._id}`)}
                      disabled={isLoading}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(clase._id)}
                      disabled={isLoading}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ListaClases;
