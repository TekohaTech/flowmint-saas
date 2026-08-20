import { useState, useEffect } from "react";
import { format, parse, startOfDay, addHours, isWithinInterval, isValid } from "date-fns";
import api from "../services/api";

const useTurnos = () => {
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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState("success");
  const [selectedTurno, setSelectedTurno] = useState(null);
  const [currentView, setCurrentView] = useState("month");
  const [cargando, setCargando] = useState(false);

  const [nuevoTurno, setNuevoTurno] = useState({
    cliente_id: "",
    empleado_id: "",
    servicio_id: "",
    fecha_hora: "",
    estado: "pendiente",
  });

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

  const showToastMessage = (msg, type) => {
    setMensaje(msg);
    setToastType(type);
    setShowToast(true);
  };

  const handleCrearTurno = async () => {
    const validationErrors = validateTurno(nuevoTurno);
    if (validationErrors.length > 0) {
      showToastMessage(validationErrors.join(" "), "error");
      return;
    }

    try {
      setCargando(true);

      const fechaParsed = parse(
        nuevoTurno.fecha_hora,
        "yyyy-MM-dd'T'HH:mm",
        new Date(),
      );
      if (!isValid(fechaParsed)) {
        showToastMessage(
          "El formato de la fecha y hora no es válido. Por favor, utilice el selector o el formato AAAA-MM-DDTHH:mm.",
          "error",
        );
        setCargando(false);
        return;
      }

      const payload = {
        cliente_id: parseInt(nuevoTurno.cliente_id),
        empleado_id: parseInt(nuevoTurno.empleado_id),
        servicio_id: parseInt(nuevoTurno.servicio_id),
        fecha_hora: fechaParsed.toISOString(),
        estado: nuevoTurno.estado,
      };

      await api.post("/turnos", payload);
      showToastMessage("Turno creado exitosamente", "success");
      setShowCrearTurnoModal(false);
      setNuevoTurno({
        cliente_id: "",
        empleado_id: "",
        servicio_id: "",
        fecha_hora: "",
        estado: "pendiente",
      });
      setTimeout(() => setShowToast(false), 3000);
      cargarDatos();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error al crear el turno.";
      if (typeof errorMessage === "string") {
        showToastMessage(errorMessage, "error");
      } else if (Array.isArray(errorMessage)) {
        showToastMessage(errorMessage.join(", "), "error");
      } else {
        showToastMessage("Ocurrió un error inesperado al crear el turno.", "error");
      }
    } finally {
      setCargando(false);
    }
  };

  const handleActualizarTurno = async () => {
    const validationErrors = validateTurno(turnoEditando);
    if (validationErrors.length > 0) {
      showToastMessage(validationErrors.join(" "), "error");
      return;
    }

    try {
      setCargando(true);

      const fechaParsed = parse(
        turnoEditando.fecha_hora,
        "yyyy-MM-dd'T'HH:mm",
        new Date(),
      );
      if (!isValid(fechaParsed)) {
        showToastMessage(
          "El formato de la fecha y hora no es válido. Por favor, utilice el selector o el formato AAAA-MM-DDTHH:mm.",
          "error",
        );
        setCargando(false);
        return;
      }

      const payload = {
        cliente_id: parseInt(turnoEditando.cliente_id),
        empleado_id: parseInt(turnoEditando.empleado_id),
        servicio_id: parseInt(turnoEditando.servicio_id),
        fecha_hora: fechaParsed.toISOString(),
        estado: turnoEditando.estado,
      };

      await api.patch(`/turnos/${turnoEditando.turno_id}`, payload);
      showToastMessage("Turno actualizado exitosamente", "success");
      setShowEditarTurnoModal(false);
      setTimeout(() => setShowToast(false), 3000);
      cargarDatos();
    } catch (error) {
      console.error("Error al actualizar turno:", error);
      const errorMessage =
        error.response?.data?.message || "Error al actualizar el turno.";
      if (typeof errorMessage === "string") {
        showToastMessage(errorMessage, "error");
      } else if (Array.isArray(errorMessage)) {
        showToastMessage(errorMessage.join(", "), "error");
      } else {
        showToastMessage("Ocurrió un error inesperado al actualizar el turno.", "error");
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
      showToastMessage("Turno eliminado exitosamente", "success");
      setSelectedTurno(null);
      setShowConfirmarEliminarModal(false);
      setTimeout(() => setShowToast(false), 3000);
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar turno:", error);
      showToastMessage("Error al eliminar turno. Por favor intente nuevamente.", "error");
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
      fecha_hora: format(new Date(turno.fecha_hora), "yyyy-MM-dd'T'HH:mm"),
      estado: turno.estado,
    });
    setShowDetailsModal(true);
  };

  const handleSlotClick = (slotInfo) => {
    const clickedTime = new Date(slotInfo.start);
    const existingEvent = turnos.map((turno) => {
      const startDate = new Date(turno.fecha_hora);
      const duracion = turno.servicio?.duracion || 60;
      const endDate = new Date(startDate.getTime() + duracion * 60000);
      return {
        start: startDate,
        end: endDate,
        turno_data: turno,
      };
    }).find((event) =>
      isWithinInterval(clickedTime, { start: event.start, end: event.end }),
    );

    if (existingEvent) {
      handleSeleccionarTurno(existingEvent);
    } else {
      const inicio = format(clickedTime, "yyyy-MM-dd'T'HH:mm");
      setNuevoTurno((prev) => ({
        ...prev,
        fecha_hora: inicio,
      }));
      setShowCrearTurnoModal(true);
    }
  };

  const handleDateSelect = ({ start }) => {
    setCurrentView("day");
    const firstSlot = addHours(startOfDay(new Date(start)), 8);
    setNuevoTurno((prev) => ({
      ...prev,
      fecha_hora: format(firstSlot, "yyyy-MM-dd'T'HH:mm"),
    }));
  };

  return {
    // State
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
    // Setters
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
    // Handlers
    handleCrearTurno,
    handleActualizarTurno,
    handleEliminarTurno,
    handleSeleccionarTurno,
    handleSlotClick,
    handleDateSelect,
  };
};

export default useTurnos;
