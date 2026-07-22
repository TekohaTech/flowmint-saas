import React from 'react';
import { Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';

function LoadingSpinner() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Cargando contenido"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
      }}
    >
      <Spinner animation="border" variant="info" role="status">
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
    </div>
  );
}

LoadingSpinner.propTypes = {
  message: PropTypes.string,
};

export default LoadingSpinner;
