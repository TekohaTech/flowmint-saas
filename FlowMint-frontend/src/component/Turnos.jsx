import React from "react";
import { Container, Alert, Toast } from "react-bootstrap";
import "react-big-calendar/lib/css/react-big-calendar.css";

import useTurnos from "./useTurnos";
import TurnoList from "./TurnoList";
import TurnoCreateModal from "./TurnoCreateModal";
import TurnoEditModal from "./TurnoEditModal";
import TurnoDetailsModal from "./TurnoDetailsModal";
import TurnoConfirmDelete from "./TurnoConfirmDelete";
import customStyles from "./turnosStyles";

const Turnos = ({ visible = true }) => {
  const {
    turnos,
    clientes,
    empleados,
    servicios,
    mensaje,
    error,
    showToast,
    toastType,
    selectedTurno,
    currentView,
    cargando,
    nuevoTurno,
    turnoEditando,
    showCrearTurnoModal,
    showEditarTurnoModal,
    showConfirmarEliminarModal,
    showDetailsModal,
    setError,
    setNuevoTurno,
    setTurnoEditando,
    setCurrentView,
    setSelectedTurno,
    setShowCrearTurnoModal,
    setShowEditarTurnoModal,
    setShowConfirmarEliminarModal,
    setShowDetailsModal,
    setShowToast,
    handleCrearTurno,
    handleActualizarTurno,
    handleEliminarTurno,
    handleSeleccionarTurno,
    handleSlotClick,
  } = useTurnos();

  if (!visible) return null;

  return (
    <>
      <style>{customStyles}</style>
      <Container fluid className="px-4 py-4">
        <h2
          className="mb-4 text-center"
          style={{
            color: "white",
            textShadow: "0 0 10px rgba(0, 243, 255, 0.3)",
          }}
        >
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

        <TurnoList
          turnos={turnos}
          currentView={currentView}
          setCurrentView={setCurrentView}
          onSelectEvent={handleSeleccionarTurno}
          onSelectSlot={handleSlotClick}
        />
      </Container>

      <TurnoCreateModal
        show={showCrearTurnoModal}
        handleClose={() => setShowCrearTurnoModal(false)}
        nuevoTurno={nuevoTurno}
        setNuevoTurno={setNuevoTurno}
        clientes={clientes}
        empleados={empleados}
        servicios={servicios}
        cargando={cargando}
        handleCrearTurno={handleCrearTurno}
      />

      <TurnoEditModal
        show={showEditarTurnoModal}
        handleClose={() => setShowEditarTurnoModal(false)}
        turnoEditando={turnoEditando}
        setTurnoEditando={setTurnoEditando}
        clientes={clientes}
        empleados={empleados}
        servicios={servicios}
        cargando={cargando}
        handleActualizarTurno={handleActualizarTurno}
        onEliminarClick={() => {
          setShowEditarTurnoModal(false);
          setShowConfirmarEliminarModal(true);
        }}
      />

      <TurnoDetailsModal
        show={showDetailsModal}
        handleClose={() => setShowDetailsModal(false)}
        turno={selectedTurno}
        onEditarClick={() => {
          setShowDetailsModal(false);
          if (selectedTurno) {
            setTurnoEditando({
              turno_id: selectedTurno.turno_id,
              cliente_id: selectedTurno.cliente_id,
              empleado_id: selectedTurno.empleado_id,
              servicio_id: selectedTurno.servicio_id,
              fecha_hora: selectedTurno.fecha_hora
                .split(".")[0]
                .substring(0, 16),
              estado: selectedTurno.estado,
            });
            setShowEditarTurnoModal(true);
          }
        }}
      />

      <TurnoConfirmDelete
        show={showConfirmarEliminarModal}
        handleClose={() => setShowConfirmarEliminarModal(false)}
        handleEliminar={handleEliminarTurno}
        selectedTurno={selectedTurno}
        cargando={cargando}
      />

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
