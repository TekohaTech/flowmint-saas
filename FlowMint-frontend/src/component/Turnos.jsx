import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Alert,
  Toast,
} from "react-bootstrap";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import api from "../services/api";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Configurar localización en español
moment.locale("es-ES");
const localizer = momentLocalizer(moment);

// Estilos para el calendario
const customStyles = `
  .rbc-calendar {
    background-color: #1a1a1a;
    color: #fff;
  }

  .rbc-header {
    background-color: #2a2a2a;
    color: #00ffff;
    border: 1px solid #444;
    padding: 8px;
    font-weight: bold;
  }

  .rbc-day-bg {
    border: 1px solid #333;
  }

  .rbc-month-view {
    border: 1px solid #444;
  }

  .rbc-month-row {
    border-bottom: 1px solid #444;
  }

  .rbc-date-cell {
    padding: 5px;
  }

  .rbc-date-cell a {
    color: #fff;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .rbc-date-cell a:hover {
    color: #00ffff;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
  }

  .rbc-off-range-bg {
    background-color: #222;
  }

  .rbc-today {
    background-color: rgba(0, 255, 255, 0.1) !important;
  }

  .rbc-event {
    background-color: #0d6efd;
    border: none;
    border-radius: 4px;
    padding: 4px;
    font-size: 12px;
    transition: all 0.3s ease;
  }

  .rbc-event:hover {
    transform: scale(1.02);
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }

  .rbc-time-content {
    border: 1px solid #444;
  }

  .rbc-time-header {
    border-bottom: 2px solid #00ffff;
  }

  .rbc-time-header-content {
    border-left: 1px solid #444;
  }

  .rbc-time-slot {
    border-top: 1px solid #333;
  }

  .rbc-timeslot-group {
    min-height: 60px;
  }

  .rbc-toolbar {
    color: #00ffff;
    margin-bottom: 20px;
  }

  .rbc-toolbar button {
    background-color: #0d6efd;
    border: 1px solid #00ffff;
    color: white;
    padding: 5px 15px;
    margin: 0 5px;
    border-radius: 4px;
    transition: all 0.3s ease;
  }

  .rbc-toolbar button:hover {
    background-color: #00ffff;
    color: #000;
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
  }

  .rbc-toolbar button:active, .rbc-toolbar button.rbc-active {
    background-color: #00ffff;
    color: #000;
    border-color: #00ffff;
  }

  .rbc-toolbar-label {
    font-size: 1.5rem;
    color: #00ffff;
    text-shadow: 0 0 10px rgba(0, 255, 255, 0.7);
  }

  .rbc-event-label {
    font-size: 0.8rem;
  }

  .rbc-time-view-resources .rbc-time-gutter,
  .rbc-time-view-resources .rbc-time-header-gutter {
    border-right: 1px solid #444;
  }
`;

const Turnos = ({ visible = true }) => {
  const [turnos, setTurnos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [showCrearTurnoModal, setShowCrearTurnoModal] = useState(false);
  const [showEditarTurnoModal, setShowEditarTurnoModal] = useState(false);
  const [showConfirmarEliminarModal, setShowConfirmarEliminarModal] =
    useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("success"); // 'success' or 'error'
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [currentView, setCurrentView] = useState("month"); // Estado para controlar la vista actual

  // Estado para el nuevo turno
  const [nuevoTurno, setNuevoTurno] = useState({
    cliente_id: "",
    empleado_id: "",
    servicio_id: "",
    fecha_hora: "",
    estado: "pendiente",
  });

  // Estado para el turno a editar
  const [turnoEditando, setTurnoEditando] = useState({
    turno_id: "",
    cliente_id: "",
    empleado_id: "",
    servicio_id: "",
    fecha_hora: "",
    estado: "pendiente",
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    console.log('[Turnos] Cargando datos...');
    console.log('[Turnos] Token:', localStorage.getItem('token'));
    try {
      const [
        turnosResponse,
        clientesResponse,
        empleadosResponse,
        serviciosResponse,
      ] = await Promise.all([
        api.get("/turnos"),
        api.get("/clientes"),
        api.get("/empleados"),
        api.get("/servicios"),
      ]);

      console.log('[Turnos] Datos cargados:', {
        turnos: turnosResponse.data,
        clientes: clientesResponse.data,
        empleados: empleadosResponse.data,
        servicios: serviciosResponse.data
      });

      setTurnos(turnosResponse.data);
      setClientes(clientesResponse.data);
      setEmpleados(empleadosResponse.data);
      setServicios(serviciosResponse.data);
    } catch (err) {
      console.error("Error al cargar los datos:", err);
      if (err.response?.status === 401) {
        setMensaje("Su sesión ha expirado. Por favor, inicie sesión de nuevo.");
        setToastType("error");
        setShowToast(true);
      } else {
        const errorMessage =
          err.response?.data?.message ||
          "Error de red al cargar datos. Verifique la conexión con el servidor y que todos los servicios estén funcionando.";
        setMensaje(errorMessage);
        setToastType("error");
        setShowToast(true);
      }
    }
  };

  const [cargando, setCargando] = useState(false); // Estado para mostrar indicador de carga

  const validateTurno = (turno) => {
    const errors = [];
    if (!turno.fecha_hora) {
      errors.push("Debe seleccionar una fecha y hora.");
    }
    if (!turno.cliente_id || isNaN(parseInt(turno.cliente_id))) {
      errors.push("Debe seleccionar un cliente.");
    }
    if (!turno.empleado_id || isNaN(parseInt(turno.empleado_id))) {
      errors.push("Debe seleccionar un empleado.");
    }
    if (!turno.servicio_id || isNaN(parseInt(turno.servicio_id))) {
      errors.push("Debe seleccionar un servicio.");
    }
    return errors;
  };

  const handleCrearTurno = async () => {
    const validationErrors = validateTurno(nuevoTurno);
    if (validationErrors.length > 0) {
      setMensaje(validationErrors.join(" "));
      setToastType("error");
      setShowToast(true);
      return;
    }

    try {
      setCargando(true);

      const fechaMoment = moment(
        nuevoTurno.fecha_hora,
        "YYYY-MM-DDTHH:mm",
        true,
      );
      if (!fechaMoment.isValid()) {
        setMensaje(
          "El formato de la fecha y hora no es válido. Por favor, utilice el selector o el formato AAAA-MM-DDTHH:mm.",
        );
        setToastType("error");
        setShowToast(true);
        setCargando(false);
        return;
      }

      const payload = {
        cliente_id: parseInt(nuevoTurno.cliente_id),
        empleado_id: parseInt(nuevoTurno.empleado_id),
        servicio_id: parseInt(nuevoTurno.servicio_id),
        fecha_hora: fechaMoment.toISOString(),
        estado: nuevoTurno.estado,
      };

      await api.post("/turnos", payload);
      setMensaje("Turno creado exitosamente");
      setToastType("success");
      setShowToast(true);
      setShowCrearTurnoModal(false);
      setNuevoTurno({
        cliente_id: "",
        empleado_id: "",
        servicio_id: "",
        fecha_hora: "",
        estado: "pendiente",
      });
      // Clear toast after a short delay to allow user to see the success message
      setTimeout(() => setShowToast(false), 3000);
      cargarDatos();
    } catch (error) {
      console.error("Error al crear turno:", error);
      // Log more specific details to find the validation error
      console.error("Mensaje del backend:", error.response?.data?.message);
      console.error(
        "Respuesta completa del backend:",
        JSON.stringify(error.response?.data, null, 2),
      );
      const errorMessage =
        error.response?.data?.message || "Error al crear el turno.";
      if (typeof errorMessage === "string") {
        setMensaje(errorMessage);
        setToastType("error");
        setShowToast(true);
      } else if (Array.isArray(errorMessage)) {
        setMensaje(errorMessage.join(", "));
        setToastType("error");
        setShowToast(true);
      } else {
        setMensaje("Ocurrió un error inesperado al crear el turno.");
        setToastType("error");
        setShowToast(true);
      }
    } finally {
      setCargando(false);
    }
  };

  const handleActualizarTurno = async () => {
    const validationErrors = validateTurno(turnoEditando);
    if (validationErrors.length > 0) {
      setMensaje(validationErrors.join(" "));
      setToastType("error");
      setShowToast(true);
      return;
    }

    try {
      setCargando(true);

      const fechaMoment = moment(
        turnoEditando.fecha_hora,
        "YYYY-MM-DDTHH:mm",
        true,
      );
      if (!fechaMoment.isValid()) {
        setMensaje(
          "El formato de la fecha y hora no es válido. Por favor, utilice el selector o el formato AAAA-MM-DDTHH:mm.",
        );
        setToastType("error");
        setShowToast(true);
        setCargando(false);
        return;
      }

      const payload = {
        cliente_id: parseInt(turnoEditando.cliente_id),
        empleado_id: parseInt(turnoEditando.empleado_id),
        servicio_id: parseInt(turnoEditando.servicio_id),
        fecha_hora: fechaMoment.toISOString(),
        estado: turnoEditando.estado,
      };

      await api.patch(`/turnos/${turnoEditando.turno_id}`, payload);

      setMensaje("Turno actualizado exitosamente");
      setToastType("success");
      setShowToast(true);
      setShowEditarTurnoModal(false);
      // Clear toast after a short delay to allow user to see the success message
      setTimeout(() => setShowToast(false), 3000);
      cargarDatos();
    } catch (error) {
      console.error("Error al actualizar turno:", error);
      const errorMessage =
        error.response?.data?.message || "Error al actualizar el turno.";
      if (typeof errorMessage === "string") {
        setMensaje(errorMessage);
        setToastType("error");
        setShowToast(true);
      } else if (Array.isArray(errorMessage)) {
        setMensaje(errorMessage.join(", "));
        setToastType("error");
        setShowToast(true);
      } else {
        setMensaje("Ocurrió un error inesperado al actualizar el turno.");
        setToastType("error");
        setShowToast(true);
      }
    } finally {
      setCargando(false);
    }
  };

  const handleEliminarTurno = async () => {
    try {
      setCargando(true);
      setError("");

      await api.delete(`/turnos/${selectedTurno.turno_id}`);
      setMensaje("Turno eliminado exitosamente");
      setToastType("success");
      setShowToast(true);
      setSelectedTurno(null);
      setShowConfirmarEliminarModal(false);
      // Clear toast after a short delay to allow user to see the success message
      setTimeout(() => setShowToast(false), 3000);
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar turno:", error);
      setMensaje("Error al eliminar turno. Por favor intente nuevamente.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setCargando(false);
    }
  };

  const handleSeleccionarTurno = (event) => {
    const turno = event.turno_data;
    setSelectedTurno(turno);
    setTurnoEditando({
      turno_id: turno.turno_id,
      cliente_id: turno.cliente_id,
      empleado_id: turno.empleado_id,
      servicio_id: turno.servicio_id,
      fecha_hora: moment(turno.fecha_hora).format("YYYY-MM-DDTHH:mm"),
      estado: turno.estado,
    });
    setShowEditarTurnoModal(true);
  };

  const handleSlotClick = (slotInfo) => {
    const clickedTime = moment(slotInfo.start);
    const existingEvent = events.find((event) =>
      clickedTime.isBetween(moment(event.start), moment(event.end), null, "[]"),
    );

    if (existingEvent) {
      handleSeleccionarTurno(existingEvent);
    } else {
      const inicio = clickedTime.format("YYYY-MM-DDTHH:mm");
      setNuevoTurno({
        ...nuevoTurno,
        fecha_hora: inicio,
      });
      setShowCrearTurnoModal(true);
    }
  };

  const handleDateSelect = ({ start }) => {
    setCurrentView("day");
    const today = moment(start);
    const firstSlot = today.startOf("day").add(8, "hours");
    setNuevoTurno((prev) => ({
      ...prev,
      fecha_hora: firstSlot.format("YYYY-MM-DDTHH:mm"),
    }));
  };

  const events = turnos.map((turno) => {
    const startDate = new Date(turno.fecha_hora);
    const duracion = turno.servicio?.duracion || 60;
    const endDate = new Date(startDate.getTime() + duracion * 60000);

    return {
      id: turno.turno_id,
      title: `${turno.servicio?.nombre || "Servicio"} con ${turno.cliente?.nombre || "Cliente"} ${turno.cliente?.apellido || ""}`,
      start: startDate,
      end: endDate,
      turno_data: turno,
    };
  });

  const ModalCrearTurno = ({ show, handleClose }) => (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Crear Nuevo Turno</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
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

  const ModalEditarTurno = ({ show, handleClose }) => (
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
          onClick={() => {
            setShowEditarTurnoModal(false);
            setShowConfirmarEliminarModal(true);
          }}
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

  const ModalConfirmarEliminar = ({ show, handleClose, handleEliminar }) => (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
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

  if (!visible) return null;

  return (
    <>
      <style>{customStyles}</style>
      <Container fluid className="px-4 py-4">
        <h2 className="mb-4 text-center" style={{ color: 'white', textShadow: '0 0 10px rgba(0, 243, 255, 0.3)' }}>
          Calendario de Turnos
        </h2>

        {error && (
          <Alert
            variant="danger"
            onClose={() => setError("")}
            dismissible
            className="alert-error"
          >
            {error}
          </Alert>
        )}

        <Row>
          <Col xs={12}>
            <div style={{ height: "600px" }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }}
                onSelectEvent={handleSeleccionarTurno}
                onSelectSlot={handleSlotClick}
                selectable
                defaultView="month"
                view={currentView}
                onView={setCurrentView}
                views={["month", "week", "day"]}
                messages={{
                  date: "Fecha",
                  time: "Hora",
                  event: "Evento",
                  allDay: "Todo el día",
                  week: "Semana",
                  work_week: "Semana laboral",
                  day: "Día",
                  month: "Mes",
                  previous: "Anterior",
                  next: "Siguiente",
                  today: "Hoy",
                  agenda: "Agenda",
                }}
                eventPropGetter={(event) => ({
                  style: {
                    backgroundColor:
                      event.turno_data.estado === "confirmado"
                        ? "#28a745"
                        : event.turno_data.estado === "cancelado"
                          ? "#dc3545"
                          : "#ffc107",
                    borderRadius: "5px",
                    border: "none",
                    color: "white",
                    margin: "1px",
                    padding: "2px",
                    fontSize: "0.8rem",
                  },
                })}
              />
            </div>
          </Col>
        </Row>
      </Container>
      {/* Modales */}f
      <ModalCrearTurno
        show={showCrearTurnoModal}
        handleClose={() => setShowCrearTurnoModal(false)}
      />
      <ModalEditarTurno
        show={showEditarTurnoModal}
        handleClose={() => setShowEditarTurnoModal(false)}
      />
      <ModalConfirmarEliminar
        show={showConfirmarEliminarModal}
        handleClose={() => setShowConfirmarEliminarModal(false)}
        handleEliminar={handleEliminarTurno}
      />
      {/* Toast de notificaciones */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        className={`position-fixed top-0 end-0 m-3 toast-notification ${toastType === "error" ? "bg-danger" : "bg-success"}`}
        style={{ zIndex: 9999, maxWidth: "400px" }}
        delay={5000}
        autohide
      >
        <Toast.Header className="fw-bold">
          <strong className="me-auto text-neon-cyan">Notificación</strong>
          <button
            type="button"
            className="btn-close btn-close-white"
            aria-label="Close"
            onClick={() => setShowToast(false)}
          ></button>
        </Toast.Header>
        <Toast.Body className="fw-semibold">{mensaje}</Toast.Body>
      </Toast>
    </>
  );
};

export default Turnos;
