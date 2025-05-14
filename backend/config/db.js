const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("La variable de entorno MONGO_URI no está definida.");
    }
    console.log("Intentando conectar a:", process.env.MONGO_URI);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error en la conexión a MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
