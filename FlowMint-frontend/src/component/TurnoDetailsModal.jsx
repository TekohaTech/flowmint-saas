import React from "react";
import { Button, Modal, Badge } from "react-bootstrap";
import PropTypes from "prop-types";

const statusColors = {
  confirmado: "success",
  pendiente: "warning",
  cancelado: "danger",
  completado: "info",
};

const TurnoDetailsModal = ({
  show,
  handleClose,
  turno,
  onEditarClick,
}) => {
  if (!turno) return null;

  const fecha = new Date(turno.fecha_hora);
  const fechaStr = fecha.toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const horaStr = fecha.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Modal show={show} onHide={handleClose} centered contentClassName="bg-dark text-white border-secondary">
      <Modal.Header closeButton closeVariant="white" className="border-secondary">
        <Modal.Title style={{ color: "var(--neon-cyan)" }}>
          Detalle del Turno
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column gap-3">
          <div>
            <small className="text-muted">Cliente</small>
            <div className="fw-bold fs-5">
              {turno.cliente?.nombre} {turno.cliente?.apellido}
            </div>
          </div>
          <div>
            <small className="text-muted">Servicio</small>
            <div className="fw-bold">
              {turno.servicio?.nombre}
              {turno.servicio?.duracion && (
                <span className="text-muted ms-2" style={{ fontSize: "0.85rem" }}>
                  ({turno.servicio.duracion} min)
                </span>
              )}
            </div>
          </div>
          <div>
            <small className="text-muted">Empleado</small>
            <div className="fw-bold">
              {turno.empleado?.nombre} {turno.empleado?.apellido}
            </div>
          </div>
          <hr className="border-secondary my-1" />
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <small className="text-muted">Fecha</small>
              <div className="fw-bold">{fechaStr}</div>
            </div>
            <div className="text-end">
              <small className="text-muted">Hora</small>
              <div className="fw-bold fs-5" style={{ color: "var(--neon-green)" }}>{horaStr}</div>
            </div>
          </div>
          <div>
            <small className="text-muted">Estado</small>
            <div>
              <Badge bg={statusColors[turno.estado] || "secondary"} className="text-capitalize fs-6">
                {turno.estado}
              </Badge>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-secondary">
        <Button variant="outline-secondary" onClick={handleClose}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={onEditarClick} style={{ background: "var(--neon-cyan)", borderColor: "var(--neon-cyan)", color: "black" }}>
          Editar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

TurnoDetailsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  turno: PropTypes.object,
  onEditarClick: PropTypes.func.isRequired,
};

export default TurnoDetailsModal;
