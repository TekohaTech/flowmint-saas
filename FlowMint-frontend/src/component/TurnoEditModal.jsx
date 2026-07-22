import React from "react";
import { Row, Col, Button, Modal, Form } from "react-bootstrap";
import PropTypes from "prop-types";

const TurnoEditModal = ({
  show,
  handleClose,
  turnoEditando,
  setTurnoEditando,
  clientes,
  empleados,
  servicios,
  cargando,
  handleActualizarTurno,
  onEliminarClick,
}) => (
  <Modal show={show} onHide={handleClose} size="lg">
    <Modal.Header closeButton>
      <Modal.Title>Editar Turno</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Cliente</Form.Label>
              <Form.Select
                value={turnoEditando.cliente_id}
                onChange={(e) =>
                  setTurnoEditando({
                    ...turnoEditando,
                    cliente_id: e.target.value,
                  })
                }
              >
                <option value="">Seleccione un cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.cliente_id} value={cliente.cliente_id}>
                    {cliente.nombre} {cliente.apellido}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Empleado</Form.Label>
              <Form.Select
                value={turnoEditando.empleado_id}
                onChange={(e) =>
                  setTurnoEditando({
                    ...turnoEditando,
                    empleado_id: e.target.value,
                  })
                }
              >
                <option value="">Seleccione un empleado</option>
                {empleados.map((empleado) => (
                  <option
                    key={empleado.empleado_id}
                    value={empleado.empleado_id}
                  >
                    {empleado.nombre} {empleado.apellido} ({empleado.puesto})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Servicio</Form.Label>
              <Form.Select
                value={turnoEditando.servicio_id}
                onChange={(e) =>
                  setTurnoEditando({
                    ...turnoEditando,
                    servicio_id: e.target.value,
                  })
                }
              >
                <option value="">Seleccione un servicio</option>
                {servicios.map((servicio) => (
                  <option
                    key={servicio.servicio_id}
                    value={servicio.servicio_id}
                  >
                    {servicio.nombre} - ${servicio.precio} (
                    {servicio.duracion} min)
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha y Hora</Form.Label>
              <Form.Control
                type="datetime-local"
                value={
                  turnoEditando.fecha_hora
                    ? turnoEditando.fecha_hora.split(".")[0].substring(0, 16)
                    : ""
                }
                onChange={(e) =>
                  setTurnoEditando({
                    ...turnoEditando,
                    fecha_hora: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={turnoEditando.estado}
                onChange={(e) =>
                  setTurnoEditando({
                    ...turnoEditando,
                    estado: e.target.value,
                  })
                }
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmado">Confirmado</option>
                <option value="cancelado">Cancelado</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button
        variant="danger"
        onClick={onEliminarClick}
        className="me-auto"
        disabled={cargando}
      >
        Eliminar
      </Button>
      <Button variant="secondary" onClick={handleClose} disabled={cargando}>
        Cancelar
      </Button>
      <Button
        variant="primary"
        onClick={handleActualizarTurno}
        disabled={cargando}
      >
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
          "Actualizar Turno"
        )}
      </Button>
    </Modal.Footer>
  </Modal>
);

TurnoEditModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  turnoEditando: PropTypes.object.isRequired,
  setTurnoEditando: PropTypes.func.isRequired,
  clientes: PropTypes.array.isRequired,
  empleados: PropTypes.array.isRequired,
  servicios: PropTypes.array.isRequired,
  cargando: PropTypes.bool.isRequired,
  handleActualizarTurno: PropTypes.func.isRequired,
  onEliminarClick: PropTypes.func.isRequired,
};

export default TurnoEditModal;
