import React, { useState, useEffect } from "react";
import { obtenerClientes, crearComposicionCorporal } from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Alert } from "react-bootstrap";

const ComposicionCorporal = () => {
  const [formData, setFormData] = useState({
    clienteId: "",
    peso: "",
    medidas: {
      brazoDerecho: "",
      brazoIzquierdo: "",
      pecho: "",
      cintura: "",
      cadera: "",
      piernaDerecha: "",
      piernaIzquierda: "",
    },
    porcentajeGrasa: "",
    masaMuscular: "",
    objetivo: "",
    antecedentesMedicos: {
      problemasFisicos: "",
      notasAdicionales: "",
    },
  });
  const [clientes, setClientes] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await obtenerClientes();
        setClientes(response.data);
      } catch (err) {
        setError("Error al cargar los clientes: " + err.message);
      }
    };
    fetchClientes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("medidas.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        medidas: { ...prev.medidas, [field]: Number(value) || "" },
      }));
    } else if (name.startsWith("antecedentesMedicos.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        antecedentesMedicos: { ...prev.antecedentesMedicos, [field]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "peso" ||
          name === "porcentajeGrasa" ||
          name === "masaMuscular"
            ? Number(value)
            : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const dataToSend = {
        ...formData,
        peso: Number(formData.peso),
        porcentajeGrasa: Number(formData.porcentajeGrasa),
        masaMuscular: Number(formData.masaMuscular),
      };
      await crearComposicionCorporal(dataToSend);
      setSuccess("Composición corporal guardada con éxito!");
      setFormData({
        clienteId: "",
        peso: "",
        medidas: {
          brazoDerecho: "",
          brazoIzquierdo: "",
          pecho: "",
          cintura: "",
          cadera: "",
          piernaDerecha: "",
          piernaIzquierda: "",
        },
        porcentajeGrasa: "",
        masaMuscular: "",
        objetivo: "",
        antecedentesMedicos: { problemasFisicos: "", notasAdicionales: "" },
      });
    } catch (err) {
      setError(err.message || "Error al guardar la composición corporal.");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Composición Corporal</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Cliente</Form.Label>
          <Form.Select
            name="clienteId"
            value={formData.clienteId}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un cliente</option>
            {clientes.map((cliente) => (
              <option key={cliente._id} value={cliente._id}>
                {cliente.nombre} {cliente.apellido}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Peso (kg)</Form.Label>
          <Form.Control
            type="number"
            name="peso"
            value={formData.peso}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Medidas (cm)</Form.Label>
          {Object.keys(formData.medidas).map((key) => (
            <Form.Control
              key={key}
              type="number"
              name={`medidas.${key}`}
              placeholder={key}
              value={formData.medidas[key]}
              onChange={handleChange}
            />
          ))}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Porcentaje de Grasa (%)</Form.Label>
          <Form.Control
            type="number"
            name="porcentajeGrasa"
            value={formData.porcentajeGrasa}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Masa Muscular (kg)</Form.Label>
          <Form.Control
            type="number"
            name="masaMuscular"
            value={formData.masaMuscular}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Objetivo</Form.Label>
          <Form.Select
            name="objetivo"
            value={formData.objetivo}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione un objetivo</option>
            <option value="Cardio">Cardio</option>
            <option value="Pérdida de peso">Pérdida de peso</option>
            <option value="Ganar músculo">Ganar músculo</option>
            <option value="Mejorar resistencia">Mejorar resistencia</option>
            <option value="Rehabilitación">Rehabilitación</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Problemas Físicos</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="antecedentesMedicos.problemasFisicos"
            value={formData.antecedentesMedicos.problemasFisicos}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Notas Adicionales</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="antecedentesMedicos.notasAdicionales"
            value={formData.antecedentesMedicos.notasAdicionales}
            onChange={handleChange}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Guardar Composición Corporal
        </Button>
      </Form>
    </Container>
  );
};

export default ComposicionCorporal;
