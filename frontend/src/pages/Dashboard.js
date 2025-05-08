import React from "react";
import { Container, Card } from "react-bootstrap";

const Dashboard = () => {
  return (
    <Container className="mt-4">
      <Card>
        <Card.Body>
          <Card.Title>Bienvenido al Dashboard</Card.Title>
          <Card.Text>
            Este es el panel principal de la aplicación. Desde aquí puedes
            navegar a las diferentes secciones como Clientes, Pagos,
            Contabilidad, etc.
          </Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;
