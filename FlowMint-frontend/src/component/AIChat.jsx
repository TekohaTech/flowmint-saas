import React from "react";
import { Modal, Badge, Button } from "react-bootstrap";
import { Bot, X, Trash2 } from "lucide-react";
import useAIChat from "./useAIChat";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ChatTemplates from "./ChatTemplates";

const AIChat = ({ show, onHide }) => {
  const {
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
  } = useAIChat();

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
            <ChatMessage
              key={message.id}
              message={message}
              formatTime={formatTime}
            />
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
              {QUICK_ACTIONS.map((action, index) => (
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

            <ChatTemplates
              showTemplates={showTemplates}
              setShowTemplates={setShowTemplates}
              templates={TEMPLATES}
            />
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
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          isTyping={isTyping}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default AIChat;
