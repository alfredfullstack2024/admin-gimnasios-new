import React, { useState } from "react";
import axios from "axios";

const ConsultarRutina = () => {
  const [numeroIdentificacion, setNumeroIdentificacion] = useState("");
  const [rutina, setRutina] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(
        `http://localhost:5000/api/rutinas/consultar/${numeroIdentificacion}`
      );
      setRutina(response.data);
      setError("");
    } catch (err) {
      setError("Error: " + err.response.data.mensaje);
      setRutina(null);
    }
  };

  return (
    <div>
      <h2>Consultar Rutina</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Número de Identificación:</label>
          <input
            type="text"
            value={numeroIdentificacion}
            onChange={(e) => setNumeroIdentificacion(e.target.value)}
            required
          />
        </div>
        <button type="submit">Consultar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {rutina && (
        <div>
          <h3>Rutina Asignada</h3>
          <p>
            <strong>Cliente:</strong> {rutina.clienteId.nombre}
          </p>
          <p>
            <strong>Ejercicio:</strong> {rutina.rutinaId.nombreEjercicio} (
            {rutina.rutinaId.grupoMuscular})
          </p>
          <p>
            <strong>Series:</strong> {rutina.rutinaId.series}
          </p>
          <p>
            <strong>Repeticiones:</strong> {rutina.rutinaId.repeticiones}
          </p>
          <p>
            <strong>Días de Entrenamiento:</strong>{" "}
            {rutina.diasEntrenamiento.join(", ")}
          </p>
          <p>
            <strong>Días de Descanso:</strong> {rutina.diasDescanso.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default ConsultarRutina;
