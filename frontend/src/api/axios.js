import axios from "axios";

// Configura la URL base del backend (usa esto temporalmente para depuración)
const api = axios.create({
  baseURL: "http://localhost:5000/api", // URL fija para pruebas
  headers: {
    "Content-Type": "application/json",
  },
});
console.log("Base URL del API configurada:", api.defaults.baseURL);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("Token añadido a la solicitud:", token);
    } else {
      console.log("No se encontró token en localStorage.");
    }
    console.log("Solicitud enviada a:", config.url);
    return config;
  },
  (error) => {
    console.error("Error en el interceptor de solicitud:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Sesión expirada, redirigiendo a login...");
      localStorage.removeItem("token");
      window.location.href = "/login";
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
      return Promise.reject(
        new Error(
          "Recurso no encontrado. Verifica la ruta o los datos enviados."
        )
      );
    }
    if (!error.response) {
      return Promise.reject(
        new Error(
          "Error de conexión. Por favor, verifica tu conexión a internet."
        )
      );
    }
    const errorMessage =
      error.response?.data?.mensaje ||
      error.response?.data?.message ||
      "Error desconocido";
    const statusCode = error.response?.status || "desconocido";
    console.error("Error en la respuesta del servidor:", {
      statusCode,
      errorMessage,
      data: error.response?.data,
    });
    return Promise.reject(new Error(`Error ${statusCode}: ${errorMessage}`));
  }
);

export const obtenerClientes = (config) => api.get("/clientes", config);
export const consultarClientePorCedula = (numeroIdentificacion, config) =>
  api.get(`/clientes/consultar/${numeroIdentificacion}`, config);
export const obtenerClientePorId = (id, config) =>
  api.get(`/clientes/${id}`, config);
export const crearCliente = (data, config) =>
  api.post("/clientes", data, config);
export const editarCliente = (id, data, config) =>
  api.put(`/clientes/${id}`, data, config);
export const eliminarCliente = (id, config) =>
  api.delete(`/clientes/${id}`, config);
export const obtenerClientesActivos = async (config = {}) => {
  try {
    const response = await api.get("/clientes/activos", config);
    return response;
  } catch (error) {
    throw error;
  }
};

export const obtenerProductos = (config) => api.get("/productos", config);
export const obtenerProductoPorId = (id, config) =>
  api.get(`/productos/${id}`, config);
export const crearProducto = (data, config) =>
  api.post("/productos", data, config);
export const editarProducto = (id, data, config) =>
  api.put(`/productos/${id}`, data, config);
export const eliminarProducto = (id, config) =>
  api.delete(`/productos/${id}`, config);

export const obtenerMembresias = (config) => api.get("/membresias", config);
export const obtenerMembresiaPorId = (id, config) =>
  api.get(`/membresias/${id}`, config);
export const crearMembresia = (data, config) =>
  api.post("/membresias", data, config);
export const editarMembresia = (id, data, config) =>
  api.put(`/membresias/${id}`, data, config);
export const eliminarMembresia = (id, config) =>
  api.delete(`/membresias/${id}`, config);

export const obtenerPagos = (params, config) =>
  api.get("/pagos", { ...config, params });
export const consultarPagosPorCedula = (numeroIdentificacion, config) =>
  api.get(`/pagos/consultar/${numeroIdentificacion}`, config);
export const obtenerPagoPorId = (id, config) => api.get(`/pagos/${id}`, config);
export const crearPago = (data, config) => api.post("/pagos", data, config);
export const editarPago = (id, data, config) =>
  api.put(`/pagos/${id}`, data, config);
export const eliminarPago = (id, config) => api.delete(`/pagos/${id}`, config);

export const obtenerTransacciones = (params, config) =>
  api.get("/contabilidad", { ...config, params });
export const obtenerTransaccionPorId = (id, config) =>
  api.get(`/contabilidad/${id}`, config);
export const crearTransaccion = (data, config) =>
  api.post("/contabilidad", data, config);
export const editarTransaccion = (id, data, config) =>
  api.put(`/contabilidad/${id}`, data, config);
export const eliminarTransaccion = (id, config) =>
  api.delete(`/contabilidad/${id}`, config);

export const obtenerEntrenadores = (config) => api.get("/entrenadores", config);
export const obtenerEntrenadorPorId = (id, config) =>
  api.get(`/entrenadores/${id}`, config);
export const crearEntrenador = (data, config) =>
  api.post("/entrenadores", data, config);
export const editarEntrenador = (id, data, config) =>
  api.put(`/entrenadores/${id}`, data, config);
export const eliminarEntrenador = (id, config) =>
  api.delete(`/entrenadores/${id}`, config);

export const obtenerRutinas = (config) => api.get("/rutinas", config);
export const crearRutina = (data, config) => api.post("/rutinas", data, config);
export const editarRutina = (id, data, config) =>
  api.put(`/rutinas/${id}`, data, config);
export const asignarRutina = (data, config) =>
  api.post("/rutinas/asignar", data, config);
export const editarAsignacionRutina = (id, data, config) =>
  api.put(`/rutinas/asignar/${id}`, data, config);
export const eliminarAsignacionRutina = (id, config) =>
  api.delete(`/rutinas/asignar/${id}`, config);
export const consultarRutinaPorNumeroIdentificacion = (
  numeroIdentificacion,
  config
) =>
  api.get(
    `/rutinas/consultarRutinasPorNumeroIdentificacion/${numeroIdentificacion}`,
    config
  );

export const obtenerClasesDisponibles = (config) =>
  api.get("/clases/disponibles", config);
export const registrarClienteEnClase = (data, config) =>
  api.post("/clases/registrar", data, config);
export const consultarClasesPorNumeroIdentificacion = (
  numeroIdentificacion,
  config
) => api.get(`/clases/consultar/${numeroIdentificacion}`, config);

export const obtenerUsuarios = (config) => api.get("/users", config);

export const crearComposicionCorporal = (data, config) =>
  api.post("/composicion-corporal", data, config);
export const consultarComposicionPorCliente = (identificacion, config) =>
  api.get(`/composicion-corporal/cliente/${identificacion}`, config);

export const login = (data) => api.post("/auth/login", data);
export const registrarse = (data) => api.post("/auth/register", data);

export const editarUsuario = (id, data, config) =>
  api.put(`/users/${id}`, data, config);

export default api;
