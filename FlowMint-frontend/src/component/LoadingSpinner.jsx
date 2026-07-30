import React from 'react';
import { Spinner } from 'react-bootstrap';

function LoadingSpinner() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Cargando contenido"
      className="loading-overlay"
    >
      <Spinner animation="border" variant="info" role="status">
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
    </div>
  );
}

export default LoadingSpinner;
