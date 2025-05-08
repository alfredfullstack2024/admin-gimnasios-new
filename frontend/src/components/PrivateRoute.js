import { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = () => {
  const { user, loading, setUser } = useContext(AuthContext);

  // Validar token al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      console.log(
        "Token encontrado, pero usuario no está seteado. Validando..."
      );
      setUser({ token }); // Esto depende de cómo manejes el usuario en AuthContext
    }
  }, [user, setUser]);

  console.log("PrivateRoute - Estado:", { user, loading }); // Depuración

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h4 className="text-muted">Cargando... 🌀</h4>
      </div>
    );
  }

  if (!user) {
    console.log("Usuario no autenticado, redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // Usa Outlet para renderizar las rutas hijas
};

export default PrivateRoute; // Exportación por defecto corregida
