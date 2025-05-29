require("dotenv").config();
console.log("Variables de entorno cargadas:", process.env.MONGODB_URI);

const express = require("express");
const cors = require("cors");
const { connectDB, mongoose } = require("./config/db");
const { protect } = require("./middleware/authMiddleware");

// Validar variables de entorno
if (!process.env.MONGODB_URI) {
  console.error(
    "❌ Error: La variable de entorno MONGODB_URI no está definida. Verifica tu archivo .env"
  );
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Middleware para registrar solicitudes entrantes
app.use((req, res, next) => {
  console.log(
    `📩 Solicitud recibida: ${req.method} ${
      req.url
    } - Headers: ${JSON.stringify(req.headers)}`
  );
  next();
});

// Importar y registrar modelos sin declarar mongoose nuevamente
require("./models/Usuario");
require("./models/Contabilidad");
require("./models/Entrenador");
require("./models/Cliente");
require("./models/RegistroClases");
require("./models/ComposicionCorporal");

// Conectar a MongoDB
console.log("Iniciando conexión a MongoDB...");
connectDB();

// Importar rutas
console.log("Configurando rutas...");
const clienteRoutes = require("./routes/clienteRoutes");
const membresiaRoutes = require("./routes/membresiaRoutes");
const entrenadorRoutes = require("./routes/entrenadorRoutes");
const productRoutes = require("./routes/productRoutes");
const pagoRoutes = require("./routes/pagoRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const claseRoutes = require("./routes/claseRoutes");
const contabilidad = require("./routes/contabilidad");
const indicadorRoutes = require("./routes/indicadorRoutes");
const asistenciaRoutes = require("./routes/asistenciaRoutes");
const rutinaRoutes = require("./routes/rutinas");
const composicionCorporalRoutes = require("./routes/composicionCorporal");
console.log("Rutas cargadas:", {
  clienteRoutes: clienteRoutes.name || "clienteRoutes",
  membresiaRoutes: membresiaRoutes.name || "membresiaRoutes",
  entrenadorRoutes: entrenadorRoutes.name || "entrenadorRoutes",
  productRoutes: productRoutes.name || "productRoutes",
  pagoRoutes: pagoRoutes.name || "pagoRoutes",
  authRoutes: authRoutes.name || "authRoutes",
  userRoutes: userRoutes.name || "userRoutes",
  claseRoutes: claseRoutes.name || "claseRoutes",
  contabilidad: contabilidad.name || "contabilidad",
  indicadorRoutes: indicadorRoutes.name || "indicadorRoutes",
  asistenciaRoutes: asistenciaRoutes.name || "asistenciaRoutes",
  rutinaRoutes: rutinaRoutes.name || "rutinas",
  composicionCorporalRoutes:
    composicionCorporalRoutes.name || "composicionCorporalRoutes",
});

// Rutas
app.use("/api/clientes", clienteRoutes);
app.use("/api/membresias", membresiaRoutes);
app.use("/api/entrenadores", entrenadorRoutes);
app.use("/api/productos", productRoutes);
app.use("/api/pagos", pagoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", protect, userRoutes);
app.use("/api/clases", protect, claseRoutes);
app.use("/api/contabilidad", protect, contabilidad);
app.use("/api/indicadores", protect, indicadorRoutes);
app.use("/api/asistencias", protect, asistenciaRoutes);
app.use("/api/rutinas", protect, rutinaRoutes);
app.use("/api/composicion-corporal", protect, composicionCorporalRoutes);

// Ruta raíz para verificar que el servidor está funcionando
app.get("/", (req, res) => {
  res.json({
    mensaje: "¡Servidor de Admin-Gimnasios funcionando correctamente!",
  });
});

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  console.log(`⚠️ Ruta no encontrada: ${req.method} ${req.url}`);
  res
    .status(404)
    .json({ mensaje: `Ruta no encontrada: ${req.method} ${req.url}` });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error("❌ Error en el servidor:", err.stack);
  res.status(500).json({
    mensaje: "Error interno del servidor",
    error: err.message || "Error desconocido",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  if (!process.env.SENDGRID_API_KEY) {
    console.log("⚠️ Notificaciones no iniciadas: Falta la clave de SendGrid.");
  } else {
    console.log("✅ Notificaciones configuradas (descomentar para habilitar).");
  }
});
