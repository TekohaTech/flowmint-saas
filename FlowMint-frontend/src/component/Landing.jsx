import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, Users, DollarSign, Smartphone, Zap, 
  CheckCircle, ArrowRight, Store, Scissors, Sparkles
} from 'lucide-react';
import { Logo, HeroIllustration } from './VisualAssets';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Calendar,
      title: 'Gestión de Turnos',
      description: 'Agenda turnos de forma simple y visual. Nunca más te olvidés de una cita.'
    },
    {
      icon: Users,
      title: 'Clientes y Empleados',
      description: 'Mantené organizados tus clientes y empleados en un solo lugar.'
    },
    {
      icon: DollarSign,
      title: 'Reportes de Ganancias',
      description: 'Visualizá tus ingresos diarios, semanales y mensuales con gráficos claros.'
    },
    {
      icon: Smartphone,
      title: 'Accedé desde cualquier lado',
      description: 'Funciona en celular, tablet y computadora. Siempre disponible.'
    }
  ];

  const planes = [
    {
      nombre: 'Básico',
      precio: 'Gratis',
      periodo: 'por 30 días',
      features: [
        'Hasta 100 turnos/mes',
        '1 usuario',
        'Reportes básicos',
        'Soporte por email'
      ],
      destacado: false
    },
    {
      nombre: 'Profesional',
      precio: '$2.999',
      periodo: '/mes',
      features: [
        'Turnos ilimitados',
        'Usuarios ilimitados',
        'Reportes avanzados',
        'Soporte prioritario',
        'Backup automático'
      ],
      destacado: true
    }
  ];

  return (
    <div className="min-vh-100" style={{ background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)' }}>
      {/* Header */}
      <nav className="d-flex justify-content-between align-items-center px-4 py-3" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <Logo />
        <div className="d-flex gap-3">
          <button 
            className="btn btn-outline-info"
            onClick={() => navigate('/login')}
          >
            Iniciar Sesión
          </button>
          <button 
            className="btn"
            style={{ background: 'var(--neon-green)', color: 'black' }}
            onClick={() => navigate('/login')}
          >
            Comenzar Gratis
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-5 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4">
            <span className="badge px-3 py-2" style={{ background: 'rgba(0, 243, 255, 0.1)', color: 'var(--neon-cyan)', border: '1px solid var(--neon-cyan)' }}>
              <Sparkles size={14} className="me-1" /> Sistema de gestión para peluquerías y barberías
            </span>
          </div>
          
          <h1 className="display-3 fw-bold text-white mb-4">
            Gestioná tu negocio<br />
            <span style={{ color: 'var(--neon-cyan)' }}>de forma simple</span>
          </h1>
          
          <p className="lead text-light opacity-75 mb-5" style={{ maxWidth: '600px', margin: '0 auto' }}>
            Turnos, clientes, empleados y ganancias. Todo en un solo lugar. 
            Diseñado especialmente para peluquerías, barberías y centros de belleza.
          </p>

          <div className="d-flex gap-3 justify-content-center mb-5">
            <button 
              className="btn btn-lg px-5"
              style={{ background: 'var(--neon-green)', color: 'black', fontWeight: 'bold' }}
              onClick={() => navigate('/login')}
            >
              Comenzar Gratis <ArrowRight size={18} className="ms-2" />
            </button>
          </div>

          {/* Preview Image */}
          <div className="position-relative" style={{ maxWidth: '900px', margin: '0 auto' }}>
            <HeroIllustration />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container py-5">
        <h2 className="text-center text-white mb-5">Todo lo que necesitás</h2>
        <div className="row g-4">
          {features.map((feature, index) => (
            <div key={index} className="col-md-6 col-lg-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card h-100 border-0"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <div className="card-body text-center p-4">
                  <div 
                    className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                    style={{ width: '60px', height: '60px', background: 'rgba(0, 243, 255, 0.1)' }}
                  >
                    <feature.icon size={28} style={{ color: 'var(--neon-cyan)' }} />
                  </div>
                  <h5 className="text-white mb-2">{feature.title}</h5>
                  <p className="text-light opacity-75 small mb-0">{feature.description}</p>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container py-5">
        <h2 className="text-center text-white mb-3">Planes simples</h2>
        <p className="text-center text-light opacity-75 mb-5">Sin sorpresas. Sin costos ocultos.</p>
        <div className="row g-4 justify-content-center">
          {planes.map((plan, index) => (
            <div key={index} className="col-md-5 col-lg-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`card h-100 border-0 ${plan.destacado ? 'position-relative' : ''}`}
                style={{ 
                  background: plan.destacado ? 'rgba(22, 242, 179, 0.05)' : 'rgba(255,255,255,0.03)',
                  border: plan.destacado ? '2px solid var(--neon-green)' : '1px solid rgba(255,255,255,0.1)'
                }}
              >
                {plan.destacado && (
                  <span 
                    className="badge position-absolute"
                    style={{ 
                      top: '-12px', 
                      left: '50%', 
                      transform: 'translateX(-50%)',
                      background: 'var(--neon-green)',
                      color: 'black'
                    }}
                  >
                    Más popular
                  </span>
                )}
                <div className="card-body text-center p-4">
                  <h5 className="text-white mb-3">{plan.nombre}</h5>
                  <div className="mb-3">
                    <span className="display-4 fw-bold text-white">{plan.precio}</span>
                    <span className="text-light opacity-75"> {plan.periodo}</span>
                  </div>
                  <ul className="list-unstyled mb-4">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="d-flex align-items-center gap-2 mb-2 text-light opacity-75">
                        <CheckCircle size={16} style={{ color: 'var(--neon-green)' }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button 
                    className={`btn w-100 ${plan.destacado ? '' : 'btn-outline-info'}`}
                    style={plan.destacado ? { background: 'var(--neon-green)', color: 'black' } : {}}
                    onClick={() => navigate('/login')}
                  >
                    {plan.destacado ? 'Comenzar ahora' : 'Probar gratis'}
                  </button>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-5 text-center">
        <div 
          className="rounded-4 p-5"
          style={{ 
            background: 'linear-gradient(135deg, rgba(0, 243, 255, 0.1) 0%, rgba(22, 242, 179, 0.1) 100%)',
            border: '1px solid rgba(0, 243, 255, 0.2)'
          }}
        >
          <h3 className="text-white mb-3">¿Listo para empezar?</h3>
          <p className="text-light opacity-75 mb-4">Registrate en segundos y empezá a gestionar tu negocio hoy mismo.</p>
          <button 
            className="btn btn-lg px-5"
            style={{ background: 'var(--neon-cyan)', color: 'black', fontWeight: 'bold' }}
            onClick={() => navigate('/login')}
          >
            Crear mi cuenta gratis <ArrowRight size={18} className="ms-2" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 text-center" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <p className="text-light opacity-75 mb-0 small">
          © 2026 FlowMint. Sistema de gestión para peluquerías y barberías.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
