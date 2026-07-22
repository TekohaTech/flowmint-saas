import React from "react";
import { Row, Col, InputGroup, Form, Button } from "react-bootstrap";
import { Search, Plus } from "lucide-react";
import PropTypes from "prop-types";

const SearchBar = ({ placeholder, searchTerm, onSearchChange, onAdd, addLabel }) => {
  return (
    <Row className="mb-4">
      <Col md={8}>
        <InputGroup>
          <InputGroup.Text
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border-color)",
              color: "var(--neon-cyan)",
            }}
          >
            <Search size={20} />
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label={placeholder || "Buscar"}
            style={{
              background: "var(--bg-card)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          />
        </InputGroup>
      </Col>
      <Col md={4} className="text-end">
        <Button
          variant="success"
          onClick={onAdd}
          className="btn-success"
          aria-label={addLabel || "Agregar nuevo"}
          style={{ textTransform: "uppercase", fontWeight: "bold" }}
        >
          <Plus size={20} className="me-2" />
          {addLabel}
        </Button>
      </Col>
    </Row>
  );
};

SearchBar.propTypes = {
  placeholder: PropTypes.string.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  addLabel: PropTypes.string.isRequired,
};

export default SearchBar;
