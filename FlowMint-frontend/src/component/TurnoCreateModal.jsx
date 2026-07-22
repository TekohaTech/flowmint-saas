import React from "react";
import { Row, Col, Button, Modal, Form } from "react-bootstrap";
import PropTypes from "prop-types";

const TurnoCreateModal = ({
  show,
  handleClose,
  nuevoTurno,
  setNuevoTurno,
  clientes,
  empleados,
  servicios,
  cargando,
  handleCrearTurno,
}) => (
  <Modal show={show} onHide={handleClose} size="lg" role="dialog" aria-labelledby="turno-create-title">
    <Modal.Header closeButton>
      <Modal.Title id="turno-create-title">Crear Nuevo Turno</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <Form aria-label="Formulario de creación de turno">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Cliente</Form.Label>
              <Form.Select
                value={nuevoTurno.cliente_id}
                onChange={(e) =>
                  setNuevoTurno({ ...nuevoTurno, cliente_id: e.target.value })
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
                value={nuevoTurno.empleado_id}
                onChange={(e) =>
                  setNuevoTurno({
                    ...nuevoTurno,
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
                value={nuevoTurno.servicio_id}
                onChange={(e) =>
                  setNuevoTurno({
                    ...nuevoTurno,
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
                value={nuevoTurno.fecha_hora}
                onChange={(e) =>
                  setNuevoTurno({ ...nuevoTurno, fecha_hora: e.target.value })
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
                value={nuevoTurno.estado}
                onChange={(e) =>
                  setNuevoTurno({ ...nuevoTurno, estado: e.target.value })
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
      <Button variant="secondary" onClick={handleClose} disabled={cargando}>
        Cancelar
      </Button>
      <Button
        variant="primary"
        onClick={handleCrearTurno}
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
          "Crear Turno"
        )}
      </Button>
    </Modal.Footer>
  </Modal>
);

TurnoCreateModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  nuevoTurno: PropTypes.object.isRequired,
  setNuevoTurno: PropTypes.func.isRequired,
  clientes: PropTypes.array.isRequired,
  empleados: PropTypes.array.isRequired,
  servicios: PropTypes.array.isRequired,
  cargando: PropTypes.bool.isRequired,
  handleCrearTurno: PropTypes.func.isRequired,
};

export default TurnoCreateModal;
