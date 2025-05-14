import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Nav, Container, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import {
  FaTachometerAlt,
  FaUsers,
  FaIdCard,
  FaShoppingCart,
  FaMoneyBillWave,
  FaChartBar,
  FaUserCheck,
  FaDumbbell,
  FaUsersCog,
  FaChartPie,
} from "react-icons/fa";

const DashboardLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Menú Lateral */}
      <div
        style={{
          width: "250px",
          backgroundColor: "#343a40",
          color: "white",
          paddingTop: "20px",
          position: "fixed",
          height: "100%",
          overflowY: "auto",
        }}
      >
        <div className="text-center mb-4">
          <img
            src="/logo.png"
            alt="Logo"
            style={{ width: "150px", marginBottom: "10px" }}
          />
          <h5>Admin Gimnasios</h5>
        </div>
        <Nav className="flex-column">
          <Nav.Link as={NavLink} to="/dashboard" className="text-white">
            <FaTachometerAlt className="me-2" /> Dashboard
          </Nav.Link>
          <Nav.Link as={NavLink} to="/suscripcion" className="text-white">
            <FaIdCard className="me-2" /> Suscripción
          </Nav.Link>
          <Nav.Link as={NavLink} to="/clientes" className="text-white">
            <FaUsers className="me-2" /> Clientes
          </Nav.Link>
          <Nav.Link as={NavLink} to="/membresias" className="text-white">
            <FaIdCard className="me-2" /> Membresías
          </Nav.Link>
          <Nav.Link as={NavLink} to="/entrenadores" className="text-white">
            <FaUsersCog className="me-2" /> Entrenadores
          </Nav.Link>
          <Nav.Link as={NavLink} to="/productos" className="text-white">
            <FaShoppingCart className="me-2" /> Productos
          </Nav.Link>
          <Nav.Link as={NavLink} to="/pagos" className="text-white">
            <FaMoneyBillWave className="me-2" /> Pagos
          </Nav.Link>
          <Nav.Link as={NavLink} to="/contabilidad" className="text-white">
            <FaChartBar className="me-2" /> Contabilidad
          </Nav.Link>
          <Nav.Link as={NavLink} to="/sesiones" className="text-white">
            <FaDumbbell className="me-2" /> Sesiones
          </Nav.Link>
          <Nav.Link as={NavLink} to="/asistencias" className="text-white">
            <FaUserCheck className="me-2" /> Asistencias
          </Nav.Link>
          <Nav.Link as={NavLink} to="/rutinas/crear" className="text-white">
            <FaDumbbell className="me-2" /> Rutinas
          </Nav.Link>
          <Nav.Link as={NavLink} to="/usuarios" className="text-white">
            <FaUsersCog className="me-2" /> Usuarios
          </Nav.Link>
          <Nav.Link as={NavLink} to="/indicadores" className="text-white">
            <FaChartPie className="me-2" /> Indicadores
          </Nav.Link>
          <Button
            variant="danger"
            className="mt-4 w-75 mx-auto"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </Nav>
      </div>
      {/* Contenido Principal */}
      <div style={{ marginLeft: "250px", width: "calc(100% - 250px)" }}>
        <Container className="mt-4">
          <Outlet />
        </Container>
      </div>
    </div>
  );
};

export default DashboardLayout;
