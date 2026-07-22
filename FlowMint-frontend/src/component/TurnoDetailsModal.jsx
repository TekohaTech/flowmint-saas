import React from "react";
import { Button, Modal } from "react-bootstrap";

const TurnoDetailsModal = ({
  show,
  handleClose,
  turno,
  onEditarClick,
}) => {
  if (!turno) return null;

  const fechaFormateada = new Date(turno.fecha_hora).toLocaleString();

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Turno</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <strong>Cliente:</strong> {turno.cliente?.nombre}{" "}
          {turno.cliente?.apellido}
        </p>
        <p>
          <strong>Empleado:</strong> {turno.empleado?.nombre}{" "}
          {turno.empleado?.apellido}
        </p>
        <p>
          <strong>Servicio:</strong> {turno.servicio?.nombre}
        </p>
        <p>
          <strong>Fecha y Hora:</strong> {fechaFormateada}
        </p>
        <p>
          <strong>Estado:</strong>{" "}
          <span
            className={`badge ${
              turno.estado === "confirmado"
                ? "bg-success"
                : turno.estado === "cancelado"
                  ? "bg-danger"
                  : "bg-warning"
            }`}
          >
            {turno.estado}
          </span>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={onEditarClick}>
          Editar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TurnoDetailsModal;
