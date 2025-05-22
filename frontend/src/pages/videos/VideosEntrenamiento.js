import React, { useState } from "react";
import { Container, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const VideosEntrenamiento = () => {
  const [videoUrl, setVideoUrl] = useState(
    "https://www.youtube.com/embed/dQw4w9WgXcQ"
  ); // Video por defecto (Rick Astley para probar)
  const navigate = useNavigate();

  const ejerciciosPorGrupo = {
    Pecho: [
      "Press de banca",
      "Flexiones",
      "Aperturas con mancuernas",
      "Press inclinado",
      "Cruces en polea",
      "Fondos en paralelas",
      "Press declinado",
      "Pullover con mancuerna",
      "Push-up diamante",
      "Press con mancuernas",
    ],
    Piernas: [
      "Sentadillas",
      "Peso muerto",
      "Zancadas",
      "Prensa de piernas",
      "Extensiones de cuádriceps",
      "Peso muerto sumo",
      "Elevación de talones",
      "Step-ups",
      "Sentadilla frontal",
      "Curl femoral",
    ],
    Espalda: [
      "Dominadas",
      "Remo con barra",
      "Jalón al pecho",
      "Remo con mancuerna",
      "Peso muerto rumano",
      "Remo en máquina",
      "Face pull",
      "Pull-over con barra",
      "Hiperextensiones",
      "Jalón tras nuca",
    ],
    Brazos: [
      "Curl de bíceps con mancuernas",
      "Extensiones de tríceps en polea",
      "Martillo con mancuernas",
      "Press francés",
      "Curl de bíceps con barra",
      "Dips para tríceps",
      "Curl concentrado",
      "Extensiones sobre la cabeza",
      "Curl martillo con barra",
      "Kickback de tríceps",
    ],
    Hombros: [
      "Press militar",
      "Elevaciones laterales",
      "Elevaciones frontales",
      "Encogimientos de hombros",
      "Remo al mentón",
      "Press Arnold",
      "Elevaciones traseras",
      "Press con mancuernas", // Mantenemos una sola instancia
      "Rotaciones externas",
      "Plancha con elevación",
    ],
    Abdomen: [
      "Plancha",
      "Crunches",
      "Elevaciones de piernas",
      "Russian twists",
      "Bicicleta abdominal",
      "Plancha lateral",
      "Mountain climbers",
      "Ab rollouts",
      "Leg raises colgando",
      "Vacío abdominal",
    ],
  };

  const videoMap = {
    "Press de banca": "https://www.youtube.com/embed/S7NrsueBHhA",
    Flexiones: "https://www.youtube.com/embed/cWrJFIdTje0",
    "Aperturas con mancuernas": "https://www.youtube.com/embed/qpqXWkXh7_Q",
    "Press inclinado": "https://www.youtube.com/embed/zCqpvX8EneU",
    "Cruces en polea": "https://www.youtube.com/embed/QEW6RO0O-ak",
    "Fondos en paralelas": "https://www.youtube.com/embed/hmqT0p_3BLY",
    "Press declinado": "https://www.youtube.com/embed/cJYRrM5cpbo",
    "Pullover con mancuerna": "https://www.youtube.com/embed/r_KKz9i5x-E",
    "Push-up diamante": "https://www.youtube.com/embed/ryOSB7evhiI",
    "Press con mancuernas": "https://www.youtube.com/embed/R3eCn7-9wC0", // Usamos una sola URL para ambos grupos
    Sentadillas: "https://www.youtube.com/embed/Ur-zj6AiO44",
    "Peso muerto": "https://www.youtube.com/embed/VLW-vK6ZF94",
    Zancadas: "https://www.youtube.com/embed/lT-oysQ-qKY",
    "Prensa de piernas": "https://www.youtube.com/embed/x1JEd6PJ2OA",
    "Extensiones de cuádriceps": "https://www.youtube.com/embed/oQM875T39M4",
    "Peso muerto sumo": "https://www.youtube.com/embed/Nps3w-hl3HU",
    "Elevación de talones": "https://www.youtube.com/embed/JhDqNv2DoAU",
    "Step-ups": "https://www.youtube.com/embed/8q9LVgN2RD4",
    "Sentadilla frontal": "https://www.youtube.com/embed/v_nvYjpX-iY",
    "Curl femoral": "https://www.youtube.com/embed/Tz1XM1y1aEQ",
    Dominadas: "https://www.youtube.com/embed/amSuLWswuI0",
    "Remo con barra": "https://www.youtube.com/embed/sr_U0jBE89A",
    "Jalón al pecho": "https://www.youtube.com/embed/W2x6zP9k7SM",
    "Remo con mancuerna": "https://www.youtube.com/embed/cA07hN6sUvY",
    "Peso muerto rumano": "https://www.youtube.com/embed/VLW-vK6ZF94",
    "Remo en máquina": "https://www.youtube.com/embed/4o8scFhoDdE",
    "Face pull": "https://www.youtube.com/embed/IeOqdw9WI90",
    "Pull-over con barra": "https://www.youtube.com/embed/r4k1Wm_RjGc",
    Hiperextensiones: "https://www.youtube.com/embed/vZ65hayXv9k",
    "Jalón tras nuca": "https://www.youtube.com/embed/qwbHWsm0EPw",
    "Curl de bíceps con mancuernas":
      "https://www.youtube.com/embed/C3qnIazrNFI",
    "Extensiones de tríceps en polea":
      "https://www.youtube.com/embed/23qUSrn8lIU",
    "Martillo con mancuernas": "https://www.youtube.com/embed/1pTUHKXGaSs",
    "Press francés": "https://www.youtube.com/embed/BTkLgHG7kzo",
    "Curl de bíceps con barra": "https://www.youtube.com/embed/QejmaMkb7eo",
    "Dips para tríceps": "https://www.youtube.com/embed/W-CYc8UVPNw",
    "Curl concentrado": "https://www.youtube.com/embed/oI7LxnEFmZU",
    "Extensiones sobre la cabeza": "https://www.youtube.com/embed/8GkV8XvGev4",
    "Curl martillo con barra": "https://www.youtube.com/embed/WnDxMH-adp8",
    "Kickback de tríceps": "https://www.youtube.com/embed/XJV627mCN3s",
    "Press militar": "https://www.youtube.com/embed/895PvlhMpTQ",
    "Elevaciones laterales": "https://www.youtube.com/embed/HFf5WDmtHuE",
    "Elevaciones frontales": "https://www.youtube.com/embed/HciAFZSN2Qo",
    "Encogimientos de hombros": "https://www.youtube.com/embed/QgokS_HikVo",
    "Remo al mentón": "https://www.youtube.com/embed/ex_G8ddt_8U",
    "Press Arnold": "https://www.youtube.com/embed/qZqK_ZjV7lo",
    "Elevaciones traseras": "https://www.youtube.com/embed/kPn1dUB8KDs",
    "Rotaciones externas": "https://www.youtube.com/embed/ugBH8iGcDVY",
    "Plancha con elevación": "https://www.youtube.com/embed/XNxzAWnkvH0",
    Plancha: "https://www.youtube.com/embed/3AM7L2k7BEw",
    Crunches: "https://www.youtube.com/embed/dNuGXV0nXGA",
    "Elevaciones de piernas": "https://www.youtube.com/embed/OtP14FBny08",
    "Russian twists": "https://www.youtube.com/embed/-cPtvFdT8dc",
    "Bicicleta abdominal": "https://www.youtube.com/embed/TvILqQEdf00",
    "Plancha lateral": "https://www.youtube.com/embed/xyaLDfd9ZfI",
    "Mountain climbers": "https://www.youtube.com/embed/7W4JEfEKuC4",
    "Ab rollouts": "https://www.youtube.com/embed/kISuoI7QCYk",
    "Leg raises colgando": "https://www.youtube.com/embed/Gw_3oAQyHXA",
    "Vacío abdominal": "https://www.youtube.com/embed/JinLnX6C1tU",
  };

  const loadVideo = (ejercicio) => {
    const url =
      videoMap[ejercicio] || "https://www.youtube.com/embed/dQw4w9WgXcQ";
    console.log(`Cargando video para ${ejercicio}: ${url}`); // Para depurar
    setVideoUrl(url);
  };

  return (
    <Container className="mt-4">
      <h2>Videos de Entrenamiento</h2>
      <Button
        variant="secondary"
        className="mb-3"
        onClick={() => navigate("/dashboard")}
      >
        Volver al Inicio
      </Button>

      {Object.keys(ejerciciosPorGrupo).map((grupo) => (
        <div key={grupo} className="mb-4">
          <h3>{grupo}</h3>
          <Row>
            {ejerciciosPorGrupo[grupo].map((ejercicio) => (
              <Col key={ejercicio} xs={6} md={4} lg={3} className="mb-2">
                <Button
                  variant="outline-primary"
                  onClick={() => loadVideo(ejercicio)}
                  block
                >
                  {ejercicio}
                </Button>
              </Col>
            ))}
          </Row>
        </div>
      ))}

      <div>
        <h4>Video Tutorial</h4>
        <p>URL actual: {videoUrl}</p>
        {videoUrl ? (
          <iframe
            width="100%"
            height="450"
            src={videoUrl}
            title="Video de entrenamiento"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <p>Selecciona un ejercicio para ver el video.</p>
        )}
      </div>
    </Container>
  );
};

export default VideosEntrenamiento;
