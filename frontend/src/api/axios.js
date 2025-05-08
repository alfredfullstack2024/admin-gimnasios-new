import axios from "axios";

// Crear una instancia de Axios con la configuración base
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      return Promise.reject(
        new Error("Sesión expirada. Por favor, inicia sesión nuevamente.")
      );
    }

    if (error.response?.status === 403) {
      return Promise.reject(
        new Error("No tienes permisos para realizar esta acción.")
      );
    }

    if (error.response?.status === 404) {
      return Promise.reject(new Error("Recurso no encontrado."));
    }

    if (!error.response) {
      return Promise.reject(
        new Error(
          "Error de conexión. Por favor, verifica tu conexión a internet."
        )
      );
    }

    const errorMessage = error.response?.data?.mensaje || "Error desconocido";
    const statusCode = error.response?.status || "desconocido";
    return Promise.reject(new Error(`Error ${statusCode}: ${errorMessage}`));
  }
);

// Funciones específicas para cada entidad

// Clientes
export const obtenerClientes = () => api.get("/clientes");
export const obtenerClientePorId = (id) => api.get(`/clientes/${id}`);
export const crearCliente = (data) => api.post("/clientes", data);
export const editarCliente = (id, data) => api.put(`/clientes/${id}`, data);
export const eliminarCliente = (id) => api.delete(`/clientes/${id}`);

// Productos
export const obtenerProductos = () => api.get("/productos");
export const obtenerProductoPorId = (id) => api.get(`/productos/${id}`);
export const crearProducto = (data) => api.post("/productos", data);
export const editarProducto = (id, data) => api.put(`/productos/${id}`, data);
export const eliminarProducto = (id) => api.delete(`/productos/${id}`);

// Membresías
export const obtenerMembresias = () => api.get("/membresias");
export const obtenerMembresiaPorId = (id) => api.get(`/membresias/${id}`);
export const crearMembresia = (data) => api.post("/membresias", data);
export const editarMembresia = (id, data) => api.put(`/membresias/${id}`, data);
export const eliminarMembresia = (id) => api.delete(`/membresias/${id}`);

// Pagos
export const obtenerPagos = (params) => api.get("/pagos", { params });
export const obtenerPagoPorId = (id) => api.get(`/pagos/${id}`);
export const crearPago = (data) => api.post("/pagos", data);
export const editarPago = (id, data) => api.put(`/pagos/${id}`, data);
export const eliminarPago = (id) => api.delete(`/pagos/${id}`);

// Transacciones
export const obtenerTransacciones = (params) =>
  api.get("/transacciones", { params });
export const obtenerTransaccionPorId = (id) => api.get(`/transacciones/${id}`);
export const crearTransaccion = (data) => api.post("/transacciones", data);
export const editarTransaccion = (id, data) =>
  api.put(`/transacciones/${id}`, data);
export const eliminarTransaccion = (id) => api.delete(`/transacciones/${id}`);

// Entrenadores
export const obtenerEntrenadores = () => api.get("/entrenadores");
export const obtenerEntrenadorPorId = (id) => api.get(`/entrenadores/${id}`);
export const crearEntrenador = (data) => api.post("/entrenadores", data);
export const editarEntrenador = (id, data) =>
  api.put(`/entrenadores/${id}`, data);
export const eliminarEntrenador = (id) => api.delete(`/entrenadores/${id}`);

// Rutinas
export const obtenerRutinas = () => api.get("/rutinas");
export const crearRutina = (data) => api.post("/rutinas", data);
export const editarRutina = (id, data) => api.put(`/rutinas/${id}`, data);
export const asignarRutina = (data) => api.post("/rutinas/asignar", data);
export const editarAsignacionRutina = (id, data) =>
  api.put(`/rutinas/asignar/${id}`, data);
export const eliminarAsignacionRutina = (id) =>
  api.delete(`/rutinas/asignar/${id}`);
export const consultarRutinaPorNumeroIdentificacion = (numeroIdentificacion) =>
  api.get(`/rutinas/consultar/${numeroIdentificacion}`);

// Autenticación
export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);

export default api;
