import { useState, useEffect, useRef } from "react";

const WELCOME_MESSAGE = {
  id: 1,
  text: "¡Hola! 👋 Soy el Asistente AI de FlowMint\n\nEstoy aquí para ayudarte a gestionar tu peluquería/barbería/spa. Puedo:\n\n📅 Crear y gestionar turnos\n👥 Buscar y atender clientes\n👨‍💼 Controlar horarios de empleados\n💰 Ver reportes de ganancias\n🎂 Generar mensajes para clientes (cumpleaños, recordatorios)\n\n¿En qué puedo ayudarte hoy?",
  sender: "bot",
  timestamp: new Date(),
};

const QUICK_ACTIONS = [
  { text: "Crear turno para cliente", icon: "📅" },
  { text: "Buscar cliente frecuente", icon: "🔍" },
  { text: "Ver estadísticas del mes", icon: "📊" },
  { text: "Horario de empleados", icon: "👨‍💼" },
  { text: "Servicios más pedidos", icon: "✂️" },
  { text: "Plantilla cumpleaños", icon: "🎂" },
];

const TEMPLATES = {
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

const useAIChat = () => {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = async (userMessage) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        return "No estás autenticado. Por favor, inicia sesión para usar el asistente de IA.";
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("token");
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

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

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

  return {
    messages,
    inputMessage,
    setInputMessage,
    isTyping,
    showTemplates,
    setShowTemplates,
    messagesEndRef,
    handleSendMessage,
    handleClearChat,
    formatTime,
    QUICK_ACTIONS,
    TEMPLATES,
  };
};

export default useAIChat;
