// Estilos para el calendario de turnos
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

export default customStyles;
