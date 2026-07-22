import React from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { Send, Sparkles } from "lucide-react";
import PropTypes from "prop-types";

const ChatInput = ({ inputMessage, setInputMessage, handleSendMessage, isTyping }) => {
  return (
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
  );
};

ChatInput.propTypes = {
  inputMessage: PropTypes.string.isRequired,
  setInputMessage: PropTypes.func.isRequired,
  handleSendMessage: PropTypes.func.isRequired,
  isTyping: PropTypes.bool.isRequired,
};

export default ChatInput;
