import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const DashboardLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/dashboard", name: "Panel", icon: "bi-house" },
    { path: "/clientes", name: "Clientes", icon: "bi-people" },
    { path: "/productos", name: "Productos", icon: "bi-box" },
    { path: "/membresias", name: "Membresías", icon: "bi-card-list" },
    { path: "/pagos", name: "Pagos", icon: "bi-cash" },
    { path: "/contabilidad", name: "Contabilidad", icon: "bi-calculator" },
    { path: "/usuarios", name: "Usuarios", icon: "bi-person" },
    { path: "/entrenadores", name: "Entrenadores", icon: "bi-person-check" },
    { path: "/clases", name: "Clases", icon: "bi-clock" },
    {
      path: "/asistencias/registrar",
      name: "Registrar Asistencia",
      icon: "bi-clipboard-check",
    },
    { path: "/suscripcion", name: "Suscripción", icon: "bi-star" },
    { path: "/indicadores", name: "Indicadores", icon: "bi-bar-chart" },
    { path: "/rutinas/crear", name: "Crear Rutina", icon: "bi-plus-square" }, // Nueva opción
    {
      path: "/rutinas/asignar",
      name: "Asignar Rutina",
      icon: "bi-check-square",
    }, // Nueva opción
    {
      path: "/consulta-usuario",
      name: "Consulta de Usuario",
      icon: "bi-search",
    }, // Nueva opción para ConsultaUsuario
  ];

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand>Bienvenido, Ariana</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse className="justify-content-end">
          <Button variant="danger" onClick={logout}>
            Cerrar Sesión
          </Button>
        </Navbar.Collapse>
      </Navbar>
      <div style={{ display: "flex" }}>
        <Nav
          className="flex-column bg-dark text-white p-3"
          style={{ width: "200px", height: "100vh" }}
        >
          {menuItems.map((item) => (
            <Nav.Link
              key={item.path}
              href="#"
              onClick={() => navigate(item.path)}
              className="text-white"
              active={window.location.pathname === item.path}
            >
              <i className={`bi ${item.icon} me-2`}></i>
              {item.name}
            </Nav.Link>
          ))}
        </Nav>
        <div style={{ flex: 1, padding: "20px" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
