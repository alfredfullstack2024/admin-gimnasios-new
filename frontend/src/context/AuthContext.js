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
      console.log("Token configurado en headers:", token);
    } else {
      delete api.defaults.headers.common["Authorization"];
      console.log("No hay token para configurar en headers");
    }
  }, [user]);

  // Cargar usuario al iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token en localStorage al iniciar:", token);
    if (token) {
      api
        .get("/auth/me")
        .then((response) => {
          console.log("Datos de /auth/me:", response.data);
          setUser({ ...response.data, token }); // Ajustado para usar response.data directamente
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error en /auth/me:", error.message);
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
      if (!token) {
        throw new Error("No se recibió un token en la respuesta.");
      }
      localStorage.setItem("token", token);
      setUser({ ...response.data.user, token });
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      // Forzar renderizado antes de navegar
      setTimeout(() => navigate("/dashboard"), 0);
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      throw new Error(
        error.response?.data?.message || "Error al iniciar sesión"
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
        role: rol,
      });
      console.log("Respuesta de /auth/register:", response.data);
      const token = response.data.token;
      if (!token) {
        throw new Error("No se recibió un token en la respuesta.");
      }
      localStorage.setItem("token", token);
      setUser({ ...response.data.user, token });
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setTimeout(() => navigate("/dashboard"), 0);
    } catch (error) {
      console.error("Error al registrar usuario:", error.message);
      throw new Error(
        error.response?.data?.message || "Error al registrar usuario"
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
    console.log("Rol del usuario:", user.role, "Rol requerido:", requiredRole);
    if (user.role === "admin") return true; // Admin tiene acceso a todo
    return user.role === requiredRole;
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
