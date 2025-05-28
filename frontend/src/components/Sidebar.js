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
  console.log("Usuario en Sidebar:", user);

  // Definir los ítems del menú según el rol
  const menuItems = {
    admin: [
      { label: "📊 Panel", path: "/dashboard" },
      { label: "🧍 Clientes", path: "/clientes" },
      { label: "📦 Productos", path: "/productos" },
      { label: "🎟️ Membresías", path: "/membresias" },
      { label: "💵 Pagos", path: "/pagos" },
      { label: "📊 Contabilidad", path: "/contabilidad" },
      { label: "👥 Usuarios", path: "/usuarios" },
      { label: "🏋️‍♂️ Entrenadores", path: "/entrenadores" },
      { label: "🕒 Clases", path: "/clases" },
      { label: "📋 Registrar Asistencia", path: "/registrar-asistencia" },
      { label: "📝 Suscripción", path: "/suscripcion" },
      { label: "📈 Indicadores", path: "/indicadores" },
      { label: "🏋️ Rutinas", path: "/rutinas/crear" },
      { label: "📋 Asignar Rutina", path: "/rutinas/asignar" },
      { label: "📏 Composición Corporal", path: "/composicion-corporal" },
      {
        label: "🔍 Consultar Composición",
        path: "/consultar-composicion-corporal",
      },
      { label: "🎥 Videos Entrenamiento", path: "/videos-entrenamiento" },
    ],
    entrenador: [
      { label: "🏋️ Rutinas", path: "/rutinas/crear" },
      {
        label: "📋 Asignliteral: true Asignar Rutina",
        path: "/rutinas/asignar",
      },
      { label: "📏 Composición Corporal", path: "/composicion-corporal" },
      {
        label: "🔍 Consultar Composición",
        path: "/consultar-composicion-corporal",
      },
      { label: "🎥 Videos Entrenamiento", path: "/videos-entrenamiento" },
    ],
  };

  // Seleccionar los ítems según el rol del usuario
  const itemsToShow = user ? menuItems[user.rol] || menuItems.entrenador : [];

  console.log(
    "Renderizando Sidebar... Items:",
    itemsToShow.map((item) => item.label)
  );

  return (
    <div className="sidebar p-3 bg-dark text-white vh-100">
      <h4 className="text-center mb-4">🏋️ Admin Gym</h4>
      <ListGroup variant="flush">
        {itemsToShow.map((item) => (
          <ListGroup.Item
            key={item.path}
            as={NavLink}
            to={item.path}
            className={({ isActive }) =>
              isActive ? "sidebar-item active" : "sidebar-item"
            }
          >
            {item.label}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default Sidebar;
