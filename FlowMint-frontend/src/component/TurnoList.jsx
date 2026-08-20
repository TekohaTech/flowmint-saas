import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { es } from "date-fns/locale";
import PropTypes from "prop-types";

const locales = { es };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
};

const TurnoList = ({
  turnos,
  currentView,
  setCurrentView,
  onSelectEvent,
  onSelectSlot,
}) => {
  const isMobile = useIsMobile();

  const events = turnos.map((turno) => {
    const startDate = new Date(turno.fecha_hora);
    const duracion = turno.servicio?.duracion || 60;
    const endDate = new Date(startDate.getTime() + duracion * 60000);

    return {
      id: turno.turno_id,
      title: isMobile
        ? `${turno.cliente?.nombre || "C"} ${turno.cliente?.apellido || ""}`
        : `${turno.servicio?.nombre || "Servicio"} con ${turno.cliente?.nombre || "Cliente"} ${turno.cliente?.apellido || ""}`,
      start: startDate,
      end: endDate,
      turno_data: turno,
    };
  });

  return (
    <Row>
      <Col xs={12}>
        <div style={{ height: isMobile ? "420px" : "600px" }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            onSelectEvent={onSelectEvent}
            onSelectSlot={onSelectSlot}
            selectable
            defaultView={isMobile ? "week" : "month"}
            view={currentView}
            onView={setCurrentView}
            views={["month", "week", "day"]}
            toolbar={true}
            aria-label="Calendario de turnos"
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
                padding: isMobile ? "1px 2px" : "2px",
                fontSize: isMobile ? "0.65rem" : "0.8rem",
                lineHeight: isMobile ? "1.1" : "1.3",
              },
            })}
          />
        </div>
      </Col>
    </Row>
  );
};

TurnoList.propTypes = {
  turnos: PropTypes.array.isRequired,
  currentView: PropTypes.string.isRequired,
  setCurrentView: PropTypes.func.isRequired,
  onSelectEvent: PropTypes.func.isRequired,
  onSelectSlot: PropTypes.func.isRequired,
};

export default TurnoList;
