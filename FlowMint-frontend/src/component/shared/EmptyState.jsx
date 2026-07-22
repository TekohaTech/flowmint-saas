import React from "react";
import { Button } from "react-bootstrap";
import { Plus } from "lucide-react";

const EmptyState = ({ IconComponent, entityName, searchTerm, onAdd, addLabel }) => {
  return (
    <div className="text-center p-5">
      <IconComponent
        size={64}
        style={{ color: "var(--text-muted)", opacity: 0.3 }}
        className="mb-3"
      />
      <h4 style={{ color: "var(--text-muted)" }}>
        No se encontraron {entityName.toLowerCase()}s
      </h4>
      <p style={{ color: "var(--text-muted)" }}>
        {searchTerm
          ? "Intenta ajustar tu búsqueda"
          : `Comienza agregando tu primer ${entityName.toLowerCase()}`}
      </p>
      {!searchTerm && (
        <Button variant="primary" onClick={onAdd} className="mt-3">
          <Plus size={20} className="me-2" />
          {addLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
