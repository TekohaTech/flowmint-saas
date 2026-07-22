import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
import PropTypes from "prop-types";

const CrudModal = ({
  show,
  onHide,
  title,
  children,
  onSubmit,
  editingItem,
  entityName,
  accentColor = "var(--neon-green)",
}) => {
  const displayTitle = title || (editingItem ? `EDITAR ${entityName}` : `NUEVO ${entityName}`);

  return (
    <Modal show={show} onHide={onHide} centered contentClassName="modal-content" role="dialog" aria-labelledby="crud-modal-title">
      <Modal.Header
        closeButton
        style={{
          background: "var(--bg-card)",
          borderBottom: "2px solid var(--border-color)",
        }}
      >
        <Modal.Title id="crud-modal-title" style={{ color: accentColor }}>
          {displayTitle}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ background: "var(--bg-card)" }}>
        <Form onSubmit={onSubmit}>
          {children}
          <div className="d-flex gap-2 justify-content-end">
            <Button
              variant="secondary"
              onClick={onHide}
              style={{
                borderColor: "var(--text-muted)",
                color: "var(--text-muted)",
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="success" className="btn-success">
              {editingItem ? `Actualizar ${entityName}` : `Crear ${entityName}`}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

CrudModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
  editingItem: PropTypes.object,
  entityName: PropTypes.string.isRequired,
  accentColor: PropTypes.string,
};

export default CrudModal;
