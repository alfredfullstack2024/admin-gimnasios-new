const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { iniciarNotificaciones } = require("./jobs/notificacionJob");
const { protect } = require("./middleware/authMiddleware");

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Validar variables de entorno
if (!process.env.MONGO_URI) {
  console.error(
    "❌ Error: La variable de entorno MONGO_URI no está definida. Verifica tu archivo .env"
  );
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Middleware para registrar solicitudes entrantes
app.use((req, res, next) => {
  console.log(`📩 Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

// Conexión a MongoDB usando MONGO_URI desde .env
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conexión a MongoDB exitosa"))
  .catch((err) => {
    console.error("❌ Error al conectar a MongoDB:", err);
    process.exit(1);
  });

// Importar rutas
console.log("Configurando rutas...");
const clienteRoutes = require("./routes/clienteRoutes");
const membresiaRoutes = require("./routes/membresiaRoutes");
const entrenadorRoutes = require("./routes/entrenadorRoutes");
const productRoutes = require("./routes/productRoutes");
const pagoRoutes = require("./routes/pagoRoutes");
const transaccionRoutes = require("./routes/transaccionRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const claseRoutes = require("./routes/claseRoutes");
const contabilidadRoutes = require("./routes/contabilidad");
const indicadorRoutes = require("./routes/indicadorRoutes");
const asistenciaRoutes = require("./routes/asistenciaRoutes");
const rutinaRoutes = require("./routes/rutinas");

// Rutas
app.use("/api/clientes", clienteRoutes);
app.use("/api/membresias", membresiaRoutes);
app.use("/api/entrenadores", entrenadorRoutes);
app.use("/api/productos", productRoutes);
app.use("/api/pagos", pagoRoutes);
app.use("/api/transacciones", protect, transaccionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", protect, userRoutes);
app.use("/api/clases", protect, claseRoutes);
app.use("/api/contabilidad", protect, contabilidadRoutes);
app.use("/api/indicadores", protect, indicadorRoutes);
app.use("/api/asistencias", protect, asistenciaRoutes);
app.use("/api/rutinas", protect, rutinaRoutes); // Unificamos y protegemos esta ruta

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
  res
    .status(500)
    .json({ mensaje: "Error interno del servidor", error: err.message });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  if (!process.env.SENDGRID_API_KEY) {
    console.log("⚠️ Notificaciones no iniciadas: Falta la clave de SendGrid.");
  } else {
    // iniciarNotificaciones();
    console.log("✅ Notificaciones configuradas (descomentar para habilitar).");
  }
});
