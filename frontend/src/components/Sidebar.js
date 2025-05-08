import { NavLink } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Sidebar.css";

const Sidebar = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.error("AuthContext no está disponible en Sidebar.js");
    return null;
  }
  const { user } = context;
  console.log("Usuario en Sidebar:", user); // Depuración
  console.log(
    "Renderizando Sidebar... Items:",
    [
      "Panel",
      "Clientes",
      "Productos",
      "Membresías",
      "Pagos",
      user && user.rol === "admin" ? ["Contabilidad", "Usuarios"] : [],
      "Entrenadores",
      "Clases",
      "Registrar Asistencia",
      "Suscripción",
      "Indicadores",
    ].flat()
  ); // Depuración de items renderizados

  // Permiso para administrador
  const esAdmin = user && user.rol === "admin";

  return (
    <div className="sidebar p-3 bg-dark text-white vh-100">
      <h4 className="text-center mb-4">🏋️ Admin Gym</h4>
      <ListGroup variant="flush">
        <ListGroup.Item
          as={NavLink}
          to="/dashboard"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          📊 Panel
        </ListGroup.Item>
        <ListGroup.Item
          as={NavLink}
          to="/clientes"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          🧍 Clientes
        </ListGroup.Item>
        <ListGroup.Item
          as={NavLink}
          to="/productos"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          📦 Productos
        </ListGroup.Item>
        <ListGroup.Item
          as={NavLink}
          to="/membresias"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          🎟️ Membresías
        </ListGroup.Item>
        <ListGroup.Item
          as={NavLink}
          to="/pagos"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          💵 Pagos
        </ListGroup.Item>

        {/* Secciones exclusivas para administradores */}
        {esAdmin && (
          <>
            <ListGroup.Item
              as={NavLink}
              to="/contabilidad"
              className={({ isActive }) =>
                isActive ? "sidebar-item active" : "sidebar-item"
              }
            >
              📊 Contabilidad
            </ListGroup.Item>
            <ListGroup.Item
              as={NavLink}
              to="/usuarios"
              className={({ isActive }) =>
                isActive ? "sidebar-item active" : "sidebar-item"
              }
            >
              👥 Usuarios
            </ListGroup.Item>
          </>
        )}

        <ListGroup.Item
          as={NavLink}
          to="/entrenadores"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          🏋️‍♂️ Entrenadores
        </ListGroup.Item>
        <ListGroup.Item
          as={NavLink}
          to="/clases"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          🕒 Clases
        </ListGroup.Item>
        <ListGroup.Item
          as={NavLink}
          to="/registrar-asistencia"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          📋 Registrar Asistencia
        </ListGroup.Item>
        <ListGroup.Item
          as={NavLink}
          to="/suscripcion"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          📝 Suscripción
        </ListGroup.Item>
        <ListGroup.Item
          as={NavLink}
          to="/indicadores"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          📈 Indicadores
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
};

export default Sidebar;
