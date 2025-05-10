import React, { useState, useEffect } from "react";
import { Table, Button, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "../api/axios";

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/clientes", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const clientesData = Array.isArray(response.data) ? response.data : [];
        console.log("Datos de clientes recibidos:", clientesData); // Depuración
        setClientes(clientesData);
      } catch (err) {
        setError(`❌ Error al cargar los clientes: ${err.message}`);
      } finally {
        setCargando(false);
      }
    };
    fetchClientes();
  }, []);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`/clientes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setClientes(clientes.filter((cliente) => cliente._id !== id));
      } catch (err) {
        setError(`❌ Error al eliminar el cliente: ${err.message}`);
      }
    }
  };

  if (cargando) {
    return <Spinner animation="border" variant="primary" />;
  }

  return (
    <div>
      <h2>Lista de clientes</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Link to="/clientes/crear">
        <Button variant="primary" className="mb-3">
          Agregar cliente
        </Button>
      </Link>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Correo electrónico</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Estado</th>
            <th>Número de Cédula</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length > 0 ? (
            clientes.map((cliente) => (
              <tr key={cliente._id}>
                <td>{cliente.nombre || "No especificado"}</td>
                <td>{cliente.apellido || "No especificado"}</td>
                <td>{cliente.email || "No especificado"}</td>
                <td>{cliente.telefono || "No especificado"}</td>
                <td>{cliente.direccion || "No especificado"}</td>
                <td>{cliente.estado || "No especificado"}</td>
                <td>{cliente.numeroIdentificacion || "No especificado"}</td>
                <td>
                  <Link to={`/clientes/editar/${cliente._id}`}>
                    <Button variant="warning" className="me-2">
                      Editar
                    </Button>
                  </Link>
                  <Button
                    variant="danger"
                    onClick={() => handleEliminar(cliente._id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
                No hay clientes registrados
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default ListaClientes;
