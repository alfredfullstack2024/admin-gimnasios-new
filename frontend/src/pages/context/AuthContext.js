import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Configurar axios para incluir el token en todas las solicitudes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [user]);

  // Cargar usuario al iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token encontrado en localStorage:", token);
    if (token) {
      api
        .get("/auth/me")
        .then((response) => {
          console.log("Respuesta de /auth/me:", response.data);
          setUser({ ...response.data.user, token }); // Asegurar que el token esté en user
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error al cargar el usuario:", error);
          localStorage.removeItem("token");
          setUser(null);
          setLoading(false);
        });
    } else {
      console.log("No hay token, usuario no autenticado.");
      setLoading(false);
    }
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      console.log("Respuesta de /auth/login:", response.data);
      const token = response.data.token;
      localStorage.setItem("token", token);
      setUser({ ...response.data.user, token }); // Incluir token en user
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      navigate("/dashboard");
    } catch (error) {
      throw new Error(
        error.response?.data?.mensaje || "Error al iniciar sesión"
      );
    }
  };

  // Registro
  const register = async (nombre, email, password, rol) => {
    try {
      const response = await api.post("/auth/register", {
        nombre,
        email,
        password,
        rol,
      });
      console.log("Respuesta de /auth/register:", response.data);
      const token = response.data.token;
      localStorage.setItem("token", token);
      setUser({ ...response.data.user, token }); // Incluir token en user
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      navigate("/dashboard");
    } catch (error) {
      throw new Error(
        error.response?.data?.mensaje || "Error al registrar usuario"
      );
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
    navigate("/login");
  };

  // Verificar permisos
  const hasPermission = (requiredRole) => {
    if (!user) return false;
    console.log("Rol del usuario:", user.rol, "Rol requerido:", requiredRole);
    if (user.rol === "admin") return true; // Admin tiene acceso a todo
    return user.rol === requiredRole;
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, loading, login, register, logout, hasPermission }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };

