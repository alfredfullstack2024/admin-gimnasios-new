import React, { useState, useEffect } from "react";
import { Table, Button, Alert, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { obtenerSesiones } from "../../api/axios";

const ListaSesiones = () => {
  const [sesiones, setSesiones] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSesiones = async () => {
      setIsLoading(true);
      try {
        const response = await obtenerSesiones();
        setSesiones(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSesiones();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Lista de Sesiones</h2>
      {isLoading && <Alert variant="info">Cargando...</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Card>
        <Card.Body>
          <Button
            variant="primary"
            className="mb-3"
            onClick={() => navigate("/sesiones/crear")}
            disabled={isLoading}
          >
            Crear Nueva Sesión
          </Button>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Profesor</th>
                <th>Horarios</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sesiones.map((s) => (
                <tr key={s._id}>
                  <td>
                    {s.profesor.nombre} {s.profesor.apellido}
                  </td>
                  <td>
                    {s.horarios.map((h) => (
                      <div key={h._id}>
                        {h.dia.charAt(0).toUpperCase() + h.dia.slice(1)}:{" "}
                        {h.hora}
                      </div>
                    ))}
                  </td>
                  <td>{s.estado}</td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => navigate(`/sesiones/editar/${s._id}`)}
                      disabled={isLoading}
                    >
                      Editar
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

export default ListaSesiones;
