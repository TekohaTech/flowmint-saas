import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

moment.locale("es-ES");
const localizer = momentLocalizer(moment);

const TurnoList = ({
  turnos,
  currentView,
  setCurrentView,
  onSelectEvent,
  onSelectSlot,
}) => {
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

  return (
    <Row>
      <Col xs={12}>
        <div style={{ height: "600px" }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            onSelectEvent={onSelectEvent}
            onSelectSlot={onSelectSlot}
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
  );
};

export default TurnoList;
