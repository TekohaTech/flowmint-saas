import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Container, Row, Col, Form, Button, Alert, Spinner
} from 'react-bootstrap';
import { 
  Zap, Store, MapPin, Phone, Mail, Tag, ArrowRight, CheckCircle
} from 'lucide-react';
import api from '../services/api';

const CompletarRegistro = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    nombreComercio: '',
    direccion: '',
    telefono: '',
    emailComercio: '',
    categoria: ''
  });

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      setUserData(user);
      
      if (user.comercio_id) {
        navigate('/pendiente-activacion');
      }
    } catch (e) {
      navigate('/login');
    }
  }, [navigate]);

  const categorias = [
    { value: 'barberia', label: 'Barbería' },
    { value: 'peluqueria', label: 'Peluquería' },
    { value: 'spa', label: 'Spa / Centro de belleza' },
    { value: 'unias', label: 'Salón de uñas' },
    { value: 'otro', label: 'Otro' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        email: userData?.correo || userData?.user,
        nombreComercio: formData.nombreComercio,
        direccion: formData.direccion,
        telefono: formData.telefono || null,
        emailComercio: formData.emailComercio || null,
        categoria: formData.categoria || null
      };

      const response = await api.post('/auth/completar-registro', payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('[CompletarRegistro] Response:', response.data);
      setSuccess(true);

      setTimeout(() => {
        navigate('/pendiente-activacion');
      }, 3000);

    } catch (err) {
      console.error('[CompletarRegistro] Error:', err);
      setError(err.response?.data?.message || 'Error al completar el registro. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div 
            className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4"
            style={{ width: '80px', height: '80px', background: 'rgba(22, 242, 179, 0.1)' }}
          >
            <CheckCircle size={40} style={{ color: 'var(--neon-green)' }} />
          </div>
          <h2 className="text-white mb-3">¡Registro completado!</h2>
          <p className="text-light opacity-75">Redirigiendo...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)' }}>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card border-0"
              style={{ background: 'rgba(26, 26, 62, 0.95)', borderRadius: '16px' }}
            >
              <div className="card-body p-4 p-md-5">
                {/* Header */}
                <div className="text-center mb-4">
                  <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                    <Zap size={32} style={{ color: 'var(--neon-cyan)' }} />
                    <span className="fs-4 fw-bold text-white">FlowMint</span>
                  </div>
                  
                  {userData && (
                    <p className="text-light opacity-75 mb-0">
                      ¡Hola <strong className="text-white">{userData.nombre}</strong>! Completá los datos de tu negocio
                    </p>
                  )}
                </div>

                {error && (
                  <Alert variant="danger" className="mb-4">
                    {error}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Datos del Comercio */}
                  <div className="mb-4">
                    <h6 className="text-neon-cyan mb-3">
                      <Store size={18} className="me-2" />
                      Datos del Comercio
                    </h6>
                    
                    <Form.Group className="mb-3">
                      <Form.Label className="text-light small">Nombre del negocio *</Form.Label>
                      <div className="position-relative">
                        <span className="position-absolute start-0 top-50 translate-middle-y ps-3 text-light opacity-75">
                          <Store size={16} />
                        </span>
                        <Form.Control
                          type="text"
                          name="nombreComercio"
                          value={formData.nombreComercio}
                          onChange={handleChange}
                          placeholder="Ej: Barbería Don Juan"
                          className="bg-dark text-white border-secondary ps-5"
                          style={{ borderRadius: '8px' }}
                          required
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="text-light small">Dirección *</Form.Label>
                      <div className="position-relative">
                        <span className="position-absolute start-0 top-50 translate-middle-y ps-3 text-light opacity-75">
                          <MapPin size={16} />
                        </span>
                        <Form.Control
                          type="text"
                          name="direccion"
                          value={formData.direccion}
                          onChange={handleChange}
                          placeholder="Ej: Av. Libertad 123"
                          className="bg-dark text-white border-secondary ps-5"
                          style={{ borderRadius: '8px' }}
                          required
                        />
                      </div>
                    </Form.Group>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="text-light small">Teléfono</Form.Label>
                          <div className="position-relative">
                            <span className="position-absolute start-0 top-50 translate-middle-y ps-3 text-light opacity-75">
                              <Phone size={16} />
                            </span>
                            <Form.Control
                              type="text"
                              name="telefono"
                              value={formData.telefono}
                              onChange={handleChange}
                              placeholder="Ej: 3764-123456"
                              className="bg-dark text-white border-secondary ps-5"
                              style={{ borderRadius: '8px' }}
                            />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label className="text-light small">Email del negocio</Form.Label>
                          <div className="position-relative">
                            <span className="position-absolute start-0 top-50 translate-middle-y ps-3 text-light opacity-75">
                              <Mail size={16} />
                            </span>
                            <Form.Control
                              type="email"
                              name="emailComercio"
                              value={formData.emailComercio}
                              onChange={handleChange}
                              placeholder="contacto@negocio.com"
                              className="bg-dark text-white border-secondary ps-5"
                              style={{ borderRadius: '8px' }}
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Form.Group className="mb-3">
                      <Form.Label className="text-light small">Categoría</Form.Label>
                      <div className="position-relative">
                        <span className="position-absolute start-0 top-50 translate-middle-y ps-3 text-light opacity-75">
                          <Tag size={16} />
                        </span>
                        <Form.Select
                          name="categoria"
                          value={formData.categoria}
                          onChange={handleChange}
                          className="bg-dark text-white border-secondary ps-5"
                          style={{ borderRadius: '8px' }}
                        >
                          <option value="">Seleccioná una categoría</option>
                          {categorias.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                          ))}
                        </Form.Select>
                      </div>
                    </Form.Group>
                  </div>

                  <Button
                    type="submit"
                    className="w-100 py-2 fw-bold"
                    style={{ background: 'var(--neon-green)', color: 'black', borderRadius: '8px' }}
                    disabled={loading || !formData.nombreComercio || !formData.direccion}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        Finalizar Registro <ArrowRight size={18} className="ms-2" />
                      </>
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <p className="text-light opacity-75 small mb-0">
                    Al continuar, aceptás los términos y condiciones del servicio.
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

export default CompletarRegistro;
