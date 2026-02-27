import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Form,
  Button,
  InputGroup,
  Badge,
  ListGroup,
} from "react-bootstrap";
import {
  MessageSquare,
  Send,
  Bot,
  User,
  X,
  Sparkles,
  Trash2,
} from "lucide-react";
import { Groq } from 'groq-sdk';

const AIChat = ({ show, onHide }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "¡Hola! 👋 Soy el Asistente AI de FlowMint\n\nEstoy aquí para ayudarte a gestionar tu peluquería/barbería/spa. Puedo:\n\n📅 Crear y gestionar turnos\n👥 Buscar y atender clientes\n👨‍💼 Controlar horarios de empleados\n💰 Ver reportes de ganancias\n🎂 Generar mensajes para clientes (cumpleaños, recordatorios)\n\n¿En qué puedo ayudarte hoy?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to get AI response from backend API
  const getAIResponse = async (userMessage) => {
    try {
      const token = localStorage.getItem('token');

      // Check if token exists
      if (!token) {
        return "No estás autenticado. Por favor, inicia sesión para usar el asistente de IA.";
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include auth token if available
        },
        body: JSON.stringify({ message: userMessage })
      });

      if (!response.ok) {
        // Handle different error statuses
        if (response.status === 401) {
          // Token might be expired, redirect to login
          localStorage.removeItem('token');
          // Instead of redirecting, return an error message
          return "Sesión expirada. Por favor, inicia sesión nuevamente.";
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.response || "Lo siento, no pude procesar tu solicitud en este momento.";
    } catch (error) {
      console.error("Error calling backend AI API:", error);
      return "Lo siento, tuve un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.";
    }
  };

  // State for model selection (maintaining the rotation functionality)
  const [modelCounter, setModelCounter] = useState(0);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      // Get response from backend AI API
      const aiResponse = await getAIResponse(inputMessage);
      const botMessage = {
        id: messages.length + 2,
        text: aiResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage = {
        id: messages.length + 2,
        text: "Lo siento, tuve un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm("¿Estás seguro de que deseas borrar el historial de chat?")) {
      setMessages([
        {
          id: 1,
          text: "¡Chat borrado! ¿Cómo puedo ayudarte?",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const quickActions = [
    { text: "Crear turno para cliente", icon: "📅" },
    { text: "Buscar cliente frecuente", icon: "🔍" },
    { text: "Ver estadísticas del mes", icon: "📊" },
    { text: "Horario de empleados", icon: "👨‍💼" },
    { text: "Servicios más pedidos", icon: "✂️" },
    { text: "Plantilla cumpleaños", icon: "🎂" },
  ];

  const templates = {
    cumpleanos: `🎂¡Feliz Cumpleaños! 🎉

Querido cliente, en tu día especial queremos mimarte.

🎁 Te regalamos un [descuento/servicio gratis] en tu próximo turno.

📞 Reserva tu cita respondiendo este mensaje o llamanos.

¡Te esperamos! 🎈`,
    
    recordatorio: `📅 Recordatorio de tu turno

Hola [nombre], te recordamos que tienes un turno mañana a las [hora] en [nombre del negocio].

¿Necesitas cambiarlo? Responde este mensaje.

¡Nos vemos pronto! ✂️`,
    
    promocion: `🔥[Nombre del servicio] - Oferta especial!

Ahora por tiempo limitado: [descuento] en tu próximo turno de [servicio].

📞 Reserva tu cita ahora!

[Nombre del negocio]`,
  };

  const [showTemplates, setShowTemplates] = useState(false);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      contentClassName="modal-content"
      style={{ maxHeight: "90vh" }}
    >
      {/* Header */}
      <Modal.Header
        style={{
          background: "var(--bg-card)",
          borderBottom: "2px solid var(--border-color)",
          padding: "1rem 1.5rem",
        }}
      >
        <div className="d-flex align-items-center gap-3 w-100">
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{
              width: "48px",
              height: "48px",
              background:
                "linear-gradient(135deg, var(--neon-cyan), var(--neon-green))",
              border: "2px solid var(--neon-cyan)",
              boxShadow: "var(--shadow-glow)",
            }}
          >
            <Bot size={24} />
          </div>
          <div className="flex-grow-1">
            <h5
              className="mb-0"
              style={{
                color: "var(--neon-green)",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              FlowMint AI Assistant
            </h5>
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--neon-green)",
                  boxShadow: "0 0 10px var(--neon-green)",
                }}
              />
              <small style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                Online - Ready to help
              </small>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
            style={{
              borderColor: "var(--neon-yellow)",
              color: "var(--neon-yellow)",
            }}
            title="Clear chat"
          >
            <Trash2 size={18} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onHide}
            style={{
              borderColor: "var(--neon-pink)",
              color: "var(--neon-pink)",
            }}
          >
            <X size={18} />
          </Button>
        </div>
      </Modal.Header>

      {/* Chat Messages */}
      <Modal.Body
        style={{
          background: "var(--bg-primary)",
          padding: "1.5rem",
          maxHeight: "60vh",
          overflowY: "auto",
        }}
      >
        <div className="d-flex flex-column gap-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`d-flex ${message.sender === "user" ? "justify-content-end" : "justify-content-start"} align-items-start gap-2`}
            >
              {message.sender === "bot" && (
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{
                    width: "36px",
                    height: "36px",
                    background: "var(--neon-green)",
                    border: "2px solid var(--neon-cyan)",
                  }}
                >
                  <Bot size={20} style={{ color: "var(--bg-primary)" }} />
                </div>
              )}

              <div
                style={{
                  maxWidth: "75%",
                  padding: "0.875rem 1.125rem",
                  borderRadius: "12px",
                  background:
                    message.sender === "user"
                      ? "var(--neon-cyan)"
                      : "var(--bg-card)",
                  color:
                    message.sender === "user"
                      ? "#000000"  // Negro para mejor contraste con fondo cian
                      : "var(--text-primary)",
                  border:
                    message.sender === "bot"
                      ? "2px solid var(--border-color)"
                      : "none",
                  boxShadow:
                    message.sender === "user"
                      ? "var(--shadow-glow)"
                      : "0 2px 8px rgba(0,0,0,0.2)",
                }}
              >
                <div
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    lineHeight: "1.5",
                    fontSize: "0.95rem",
                  }}
                >
                  {message.text}
                </div>
                <div
                  className="mt-2"
                  style={{
                    fontSize: "0.7rem",
                    opacity: 0.7,
                    textAlign: message.sender === "user" ? "right" : "left",
                  }}
                >
                  {formatTime(message.timestamp)}
                </div>
              </div>

              {message.sender === "user" && (
                <div
                  className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
                  style={{
                    width: "36px",
                    height: "36px",
                    background:
                      "linear-gradient(135deg, var(--neon-pink), var(--neon-purple))",
                    border: "2px solid var(--neon-pink)",
                  }}
                >
                  <User size={20} />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="d-flex justify-content-start align-items-start gap-2">
              <div
                className="d-flex align-items-center justify-content-center rounded-circle"
                style={{
                  width: "36px",
                  height: "36px",
                  background: "var(--neon-green)",
                  border: "2px solid var(--neon-cyan)",
                }}
              >
                <Bot size={20} style={{ color: "var(--bg-primary)" }} />
              </div>
              <div
                style={{
                  padding: "0.875rem 1.125rem",
                  borderRadius: "12px",
                  background: "var(--bg-card)",
                  border: "2px solid var(--border-color)",
                }}
              >
                <div className="d-flex gap-2 align-items-center">
                  <div
                    className="spinner"
                    style={{ width: "8px", height: "8px" }}
                  ></div>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    El AI está pensando...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        {messages.length === 1 && (
          <div className="mt-4">
            <small
              style={{
                color: "var(--text-muted)",
                textTransform: "uppercase",
                fontSize: "0.75rem",
                letterSpacing: "1px",
              }}
            >
              Acciones Rápidas
            </small>
            <div className="d-flex flex-wrap gap-2 mt-2">
              {quickActions.map((action, index) => (
                <Badge
                  key={index}
                  bg="secondary"
                  className="badge-primary"
                  style={{
                    cursor: "pointer",
                    padding: "0.5rem 1rem",
                    fontSize: "0.85rem",
                    fontWeight: "normal",
                    border: "2px solid var(--neon-cyan)",
                    background: "transparent",
                    color: "var(--neon-cyan)",
                  }}
                  onClick={() => setInputMessage(action.text)}
                >
                  {action.icon} {action.text}
                </Badge>
              ))}
            </div>
            
            {/* Botón de Plantillas */}
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
            </div>

            {/* Plantillas para Copiar */}
            {showTemplates && (
              <div className="mt-3" style={{ background: "var(--bg-tertiary)", padding: "1rem", borderRadius: "12px", border: "2px solid var(--border-color)" }}>
                <small style={{ color: "var(--neon-cyan)", textTransform: "uppercase", fontSize: "0.7rem", letterSpacing: "1px" }}>
                  Mensajes listos para copiar
                </small>
                
                {/* Plantilla Cumpleaños */}
                <div className="mt-2 mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span style={{ color: "var(--neon-pink)", fontWeight: "bold", fontSize: "0.9rem" }}>🎂 Cumpleaños</span>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(templates.cumpleanos)}
                      style={{
                        background: "var(--neon-green)",
                        border: "none",
                        color: "#000",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      }}
                    >
                      📋 Copiar
                    </button>
                  </div>
                  <pre style={{ 
                    color: "var(--text-secondary)", 
                    fontSize: "0.75rem", 
                    background: "var(--bg-primary)", 
                    padding: "0.5rem", 
                    borderRadius: "6px",
                    whiteSpace: "pre-wrap",
                    margin: 0,
                    maxHeight: "120px",
                    overflow: "auto"
                  }}>
{templates.cumpleanos}
                  </pre>
                </div>

                {/* Plantilla Recordatorio */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span style={{ color: "var(--neon-yellow)", fontWeight: "bold", fontSize: "0.9rem" }}>📅 Recordatorio</span>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(templates.recordatorio)}
                      style={{
                        background: "var(--neon-green)",
                        border: "none",
                        color: "#000",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      }}
                    >
                      📋 Copiar
                    </button>
                  </div>
                  <pre style={{ 
                    color: "var(--text-secondary)", 
                    fontSize: "0.75rem", 
                    background: "var(--bg-primary)", 
                    padding: "0.5rem", 
                    borderRadius: "6px",
                    whiteSpace: "pre-wrap",
                    margin: 0,
                    maxHeight: "100px",
                    overflow: "auto"
                  }}>
{templates.recordatorio}
                  </pre>
                </div>

                {/* Plantilla Promoción */}
                <div>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span style={{ color: "var(--neon-cyan)", fontWeight: "bold", fontSize: "0.9rem" }}>🔥 Promoción</span>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(templates.promocion)}
                      style={{
                        background: "var(--neon-green)",
                        border: "none",
                        color: "#000",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                      }}
                    >
                      📋 Copiar
                    </button>
                  </div>
                  <pre style={{ 
                    color: "var(--text-secondary)", 
                    fontSize: "0.75rem", 
                    background: "var(--bg-primary)", 
                    padding: "0.5rem", 
                    borderRadius: "6px",
                    whiteSpace: "pre-wrap",
                    margin: 0,
                    maxHeight: "100px",
                    overflow: "auto"
                  }}>
{templates.promocion}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal.Body>

      {/* Input Footer */}
      <Modal.Footer
        style={{
          background: "var(--bg-card)",
          borderTop: "2px solid var(--border-color)",
          padding: "1rem 1.5rem",
        }}
      >
        <Form onSubmit={handleSendMessage} className="w-100">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Escribe tu mensaje aquí..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isTyping}
              style={{
                background: "var(--bg-primary)",
                border: "2px solid var(--border-color)",
                color: "var(--text-primary)",
                padding: "0.75rem 1rem",
              }}
            />
            <Button
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className="btn-primary"
              style={{
                borderColor: "var(--neon-cyan)",
                background: "var(--neon-cyan)",
                color: "var(--bg-primary)",
                padding: "0.75rem 1.5rem",
              }}
            >
              <Send size={20} />
            </Button>
          </InputGroup>
          <div className="d-flex align-items-center gap-2 mt-2">
            <Sparkles
              size={14}
              style={{ color: "var(--neon-yellow)" }}
            />
            <small style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
              Potenciado por AI - Pregúntame cualquier cosa sobre FlowMint
            </small>
          </div>
        </Form>
      </Modal.Footer>
    </Modal>
  );
};

export default AIChat;
