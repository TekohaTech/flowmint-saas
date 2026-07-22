import React from "react";
import { Button, Modal } from "react-bootstrap";
import PropTypes from "prop-types";

const TurnoConfirmDelete = ({
  show,
  handleClose,
  handleEliminar,
  selectedTurno,
  cargando,
}) => (
  <Modal show={show} onHide={handleClose} role="alertdialog" aria-labelledby="turno-delete-title">
    <Modal.Header closeButton>
      <Modal.Title id="turno-delete-title">Confirmar Eliminación</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <p>¿Estás seguro de que deseas eliminar este turno?</p>
      {selectedTurno && (
        <p>
          <strong>Cliente:</strong> {selectedTurno.cliente?.nombre}{" "}
          {selectedTurno.cliente?.apellido}
          <br />
          <strong>Servicio:</strong> {selectedTurno.servicio?.nombre}
          <br />
          <strong>Fecha y Hora:</strong>{" "}
          {new Date(selectedTurno.fecha_hora).toLocaleString()}
          <br />
        </p>
      )}
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose} disabled={cargando}>
        Cancelar
      </Button>
      <Button variant="danger" onClick={handleEliminar} disabled={cargando}>
        {cargando ? (
          <>
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>{" "}
            Cargando...
          </>
        ) : (
          "Eliminar"
        )}
      </Button>
    </Modal.Footer>
  </Modal>
);

TurnoConfirmDelete.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleEliminar: PropTypes.func.isRequired,
  selectedTurno: PropTypes.object,
  cargando: PropTypes.bool.isRequired,
};

export default TurnoConfirmDelete;
