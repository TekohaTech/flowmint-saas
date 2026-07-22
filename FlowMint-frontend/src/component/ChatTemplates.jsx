import React from "react";
import PropTypes from "prop-types";

const TEMPLATE_META = [
  { key: "cumpleanos", label: "🎂 Cumpleaños", color: "var(--neon-pink)" },
  { key: "recordatorio", label: "📅 Recordatorio", color: "var(--neon-yellow)" },
  { key: "promocion", label: "🔥 Promoción", color: "var(--neon-cyan)" },
];

const copyButtonStyle = {
  background: "var(--neon-green)",
  border: "none",
  color: "#000",
  padding: "0.25rem 0.75rem",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "0.75rem",
  fontWeight: "bold",
};

const preStyle = {
  color: "var(--text-secondary)",
  fontSize: "0.75rem",
  background: "var(--bg-primary)",
  padding: "0.5rem",
  borderRadius: "6px",
  whiteSpace: "pre-wrap",
  margin: 0,
  maxHeight: "100px",
  overflow: "auto",
};

const ChatTemplates = ({ showTemplates, setShowTemplates, templates }) => {
  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={() => setShowTemplates(!showTemplates)}
        style={{
          background: "transparent",
          border: "2px solid var(--neon-purple)",
          color: "var(--neon-purple)",
          padding: "0.5rem 1rem",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "0.85rem",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        📋 {showTemplates ? "Ocultar Plantillas" : "Ver Plantillas para Clientes"}
      </button>

      {showTemplates && (
        <div
          className="mt-3"
          style={{
            background: "var(--bg-tertiary)",
            padding: "1rem",
            borderRadius: "12px",
            border: "2px solid var(--border-color)",
          }}
        >
          <small
            style={{
              color: "var(--neon-cyan)",
              textTransform: "uppercase",
              fontSize: "0.7rem",
              letterSpacing: "1px",
            }}
          >
            Mensajes listos para copiar
          </small>

          {TEMPLATE_META.map(({ key, label, color }) => (
            <div key={key} className="mt-2 mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span
                  style={{
                    color,
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                  }}
                >
                  {label}
                </span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard.writeText(templates[key])}
                  style={copyButtonStyle}
                >
                  📋 Copiar
                </button>
              </div>
              <pre style={preStyle}>{templates[key]}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ChatTemplates.propTypes = {
  showTemplates: PropTypes.bool.isRequired,
  setShowTemplates: PropTypes.func.isRequired,
  templates: PropTypes.object.isRequired,
};

export default ChatTemplates;
