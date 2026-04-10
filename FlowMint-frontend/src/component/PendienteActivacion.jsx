import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Zap, Clock, CheckCircle, LogOut } from 'lucide-react';

const PendienteActivacion = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              {/* Logo */}
              <div className="d-flex align-items-center justify-content-center gap-2 mb-4">
                <Zap size={40} style={{ color: 'var(--neon-cyan)' }} />
                <span className="fs-3 fw-bold text-white">FlowMint</span>
              </div>

              {/* Card principal */}
              <div 
                className="card border-0 p-4 p-md-5"
                style={{ 
                  background: 'rgba(26, 26, 62, 0.95)', 
                  borderRadius: '16px',
                  border: '1px solid rgba(0, 243, 255, 0.2)'
                }}
              >
                {/* Icono animado */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="mb-4"
                >
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ 
                      width: '100px', 
                      height: '100px', 
                      background: 'linear-gradient(135deg, rgba(255, 214, 10, 0.2) 0%, rgba(255, 214, 10, 0.05) 100%)',
                      border: '2px solid var(--neon-yellow)'
                    }}
                  >
                    <Clock size={48} style={{ color: 'var(--neon-yellow)' }} />
                  </div>
                </motion.div>

                {/* Título */}
                <h2 className="text-white mb-3">¡Registro completado!</h2>
                
                {/* Mensaje principal */}
                <p className="text-light opacity-75 mb-4" style={{ fontSize: '1.1rem' }}>
                  Su cuenta está <strong className="text-warning">pendiente de activación</strong>.
                </p>

                {/* Info adicional */}
                <div 
                  className="p-3 rounded mb-4"
                  style={{ background: 'rgba(0, 243, 255, 0.05)', border: '1px solid rgba(0, 243, 255, 0.1)' }}
                >
                  <p className="text-light opacity-75 mb-2 small">
                    <CheckCircle size={14} className="me-2" style={{ color: 'var(--neon-green)' }} />
                    Verificamos tu cuenta de Google
                  </p>
                  <p className="text-light opacity-75 mb-2 small">
                    <CheckCircle size={14} className="me-2" style={{ color: 'var(--neon-green)' }} />
                    Registraste los datos de tu comercio
                  </p>
                  <p className="text-light opacity-75 mb-0 small">
                    <Clock size={14} className="me-2" style={{ color: 'var(--neon-yellow)' }} />
                    Esperando activación del administrador
                  </p>
                </div>

                {/* Mensaje de espera */}
                <p className="text-light opacity-75 small mb-4">
                  Le avisaremos por email cuando su cuenta esté activa y pueda comenzar a usar el sistema.
                </p>

                {/* Acciones */}
                <div className="d-flex gap-3 justify-content-center">
                  <Button
                    variant="outline-secondary"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} className="me-2" />
                    Cerrar sesión
                  </Button>
                </div>

                {/* Contacto */}
                <div className="mt-4 pt-4 border-top border-secondary">
                  <p className="text-light opacity-75 small mb-0">
                    ¿Tenés dudas? Contactanos a{' '}
                    <a href="mailto:tekohatech@gmail.com" style={{ color: 'var(--neon-cyan)' }}>
                      tekohatech@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PendienteActivacion;
