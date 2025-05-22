import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import DashboardLayout from "./layouts/DashboardLayout";
import PrivateRoute from "./components/PrivateRoute";

// Páginas Públicas
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ConsultaUsuario from "./pages/ConsultaUsuario";

// Páginas Protegidas
import Dashboard from "./pages/Dashboard";
import Suscripcion from "./pages/Suscripcion";
import ConsultarRutina from "./pages/ConsultarRutina";
import VideosEntrenamiento from "./pages/videos/VideosEntrenamiento"; // Importación corregida

// Clientes
import ListaClientes from "./pages/ListaClientes";
import CrearCliente from "./pages/CrearCliente";
import EditarCliente from "./pages/EditarCliente";

// Membresías
import Membresias from "./pages/Membresias";
import CrearMembresia from "./pages/CrearMembresia";
import EditarMembresia from "./pages/EditarMembresia";

// Entrenadores
import Entrenadores from "./pages/Entrenadores";
import CrearEntrenador from "./pages/CrearEntrenador";
import EditarEntrenador from "./pages/EditarEntrenador";

// Productos
import Productos from "./pages/Productos";
import CrearProducto from "./pages/CrearProducto";
import EditarProducto from "./pages/EditarProducto";

// Pagos
import Pagos from "./pages/pagos/Pagos";
import CrearPago from "./pages/pagos/CrearPago";
import EditarPago from "./pages/pagos/EditarPago";

// Contabilidad
import Contabilidad from "./pages/contabilidad/Contabilidad";
import CrearTransaccion from "./pages/contabilidad/CrearTransaccion";
import EditarTransaccion from "./pages/contabilidad/EditarTransaccion";

// Clases
import ListaClases from "./pages/sesiones/ListaClases";

// Usuarios
import Usuarios from "./pages/Usuarios";
import CrearUsuario from "./pages/usuarios/CrearUsuario";
import EditarUsuario from "./pages/usuarios/EditarUsuario";

// Asistencias
import Asistencias from "./pages/asistencias/Asistencias";
import RegistrarAsistencia from "./pages/asistencias/RegistrarAsistencia";

// Rutinas
import CrearRutina from "./pages/rutinas/CrearRutina";
import AsignarRutina from "./pages/rutinas/AsignarRutina";

// Composición Corporal
import ComposicionCorporal from "./pages/ComposicionCorporal";
import ConsultarComposicionCorporal from "./pages/ConsultarComposicionCorporal";

// Indicadores
import Indicadores from "./pages/Indicadores";

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/consulta-usuario" element={<ConsultaUsuario />} />
          <Route
            path="/"
            element={
              <Navigate
                to={localStorage.getItem("token") ? "/dashboard" : "/login"}
                replace
              />
            }
          />
          {/* Rutas Protegidas dentro del DashboardLayout */}
          <Route element={<PrivateRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/suscripcion" element={<Suscripcion />} />
              <Route path="/consultar-rutina" element={<ConsultarRutina />} />
              <Route path="/rutinas/consultar" element={<ConsultarRutina />} />
              {/* Clientes */}
              <Route path="/clientes" element={<ListaClientes />} />
              <Route path="/clientes/crear" element={<CrearCliente />} />
              <Route path="/clientes/editar/:id" element={<EditarCliente />} />
              {/* Membresías */}
              <Route path="/membresias" element={<Membresias />} />
              <Route path="/membresias/crear" element={<CrearMembresia />} />
              <Route
                path="/membresias/editar/:id"
                element={<EditarMembresia />}
              />
              {/* Entrenadores */}
              <Route path="/entrenadores" element={<Entrenadores />} />
              <Route path="/entrenadores/crear" element={<CrearEntrenador />} />
              <Route
                path="/entrenadores/editar/:id"
                element={<EditarEntrenador />}
              />
              {/* Productos */}
              <Route path="/productos" element={<Productos />} />
              <Route path="/productos/crear" element={<CrearProducto />} />
              <Route
                path="/productos/editar/:id"
                element={<EditarProducto />}
              />
              {/* Pagos */}
              <Route path="/pagos" element={<Pagos />} />
              <Route path="/pagos/crear" element={<CrearPago />} />
              <Route path="/pagos/editar/:id" element={<EditarPago />} />
              {/* Contabilidad */}
              <Route path="/contabilidad" element={<Contabilidad />} />
              <Route
                path="/contabilidad/crear-transaccion"
                element={<CrearTransaccion />}
              />
              <Route
                path="/contabilidad/editar-transaccion/:id"
                element={<EditarTransaccion />}
              />
              {/* Clases */}
              <Route path="/clases" element={<ListaClases />} />
              {/* Asistencias */}
              <Route path="/asistencias" element={<Asistencias />} />
              <Route
                path="/asistencias/registrar"
                element={<RegistrarAsistencia />}
              />
              {/* Rutinas */}
              <Route path="/rutinas/crear" element={<CrearRutina />} />
              <Route path="/rutinas/asignar" element={<AsignarRutina />} />
              {/* Composición Corporal */}
              <Route
                path="/composicion-corporal"
                element={<ComposicionCorporal />}
              />
              <Route
                path="/consultar-composicion-corporal"
                element={<ConsultarComposicionCorporal />}
              />
              {/* Usuarios */}
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/usuarios/crear" element={<CrearUsuario />} />
              <Route path="/usuarios/editar/:id" element={<EditarUsuario />} />
              {/* Indicadores */}
              <Route path="/indicadores" element={<Indicadores />} />
              {/* Videos de Entrenamiento */}
              <Route
                path="/videos-entrenamiento"
                element={<VideosEntrenamiento />}
              />
            </Route>
          </Route>
          {/* Ruta 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
