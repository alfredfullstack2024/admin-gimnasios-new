import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar usuario al iniciar
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token encontrado en localStorage:", token); // Depuración
    if (token) {
      api
        .get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("Respuesta de /auth/me:", response.data); // Depuración
          setUser(response.data.user);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error al cargar el usuario:", error); // Depuración
          localStorage.removeItem("token");
          setUser(null);
          setLoading(false);
        });
    } else {
      console.log("No hay token, usuario no autenticado."); // Depuración
      setLoading(false);
    }
  }, []);

  // Login
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      console.log("Respuesta de /auth/login:", response.data); // Depuración
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
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
      console.log("Respuesta de /auth/register:", response.data); // Depuración
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
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
    navigate("/login");
  };

  // Verificar permisos
  const hasPermission = (requiredRole) => {
    if (!user) return false;
    console.log("Rol del usuario:", user.rol, "Rol requerido:", requiredRole); // Depuración
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
