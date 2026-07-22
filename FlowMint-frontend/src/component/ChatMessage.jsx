import React from "react";
import { Bot, User } from "lucide-react";
import PropTypes from "prop-types";

const ChatMessage = ({ message, formatTime }) => {
  const isUser = message.sender === "user";

  return (
    <div
      className={`d-flex ${isUser ? "justify-content-end" : "justify-content-start"} align-items-start gap-2`}
    >
      {!isUser && (
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
          background: isUser ? "var(--neon-cyan)" : "var(--bg-card)",
          color: isUser ? "#000000" : "var(--text-primary)",
          border: !isUser ? "2px solid var(--border-color)" : "none",
          boxShadow: isUser
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
            textAlign: isUser ? "right" : "left",
          }}
        >
          {formatTime(message.timestamp)}
        </div>
      </div>

      {isUser && (
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
  );
};

ChatMessage.propTypes = {
  message: PropTypes.object.isRequired,
  formatTime: PropTypes.func.isRequired,
};

export default ChatMessage;
