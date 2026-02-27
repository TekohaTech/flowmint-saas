import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button } from 'react-bootstrap';
import { FaUserFriends, FaCalendarAlt, FaCut, FaUserTie, FaDollarSign } from 'react-icons/fa';
import { Crown, CheckCircle, XCircle, Users, Power, Store } from 'lucide-react';
import api, { authAPI } from '../services/api';

function DashboardHome() {
  const [stats, setStats] = useState({
    totalClientes: 0,
    turnosHoy: 0,
    totalServicios: 0,
    totalEmpleados: 0,
    ingresosMensuales: 0,
    proximosTurnos: [],
    totalComercios: 0,
    comerciosActivos: 0,
    totalUsuariosGlobal: 0
  });
  const [loading, setLoading] = useState(true);
  const currentUser = authAPI.getCurrentUser();
  const isSuperAdmin = currentUser?.rol === 'SUPERADMIN';

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        if (isSuperAdmin) {
          const [comerciosRes, usuariosRes] = await Promise.all([
            api.get('/comercios'),
            api.get('/usuarios')
          ]);
          setStats({
            totalComercios: comerciosRes.data.length,
            comerciosActivos: comerciosRes.data.filter(c => c.activo).length,
            totalUsuariosGlobal: usuariosRes.data.length,
          });
        } else {
          const [clientesRes, turnosRes, serviciosRes, empleadosRes] = await Promise.all([
            api.get('/clientes'),
            api.get('/turnos'),
            api.get('/servicios'),
            api.get('/empleados')
          ]);

          const hoy = new Date();
          const turnosHoy = turnosRes.data.filter(turno => {
            const fecha = new Date(turno.fecha_hora);
            return fecha.toDateString() === hoy.toDateString();
          }).length;

          const proximosTurnos = turnosRes.data
            .filter(t => new Date(t.fecha_hora) >= hoy)
            .sort((a, b) => new Date(a.fecha_hora) - new Date(b.fecha_hora))
            .slice(0, 3)
            .map(turno => ({
              ...turno,
              fechaFormateada: new Date(turno.fecha_hora).toLocaleString('es-ES', {
                day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
              })
            }));

          const mesActual = hoy.getMonth();
          const anioActual = hoy.getFullYear();
          const ingresosMensuales = turnosRes.data
            .filter(turno => {
              const fecha = new Date(turno.fecha_hora);
              return fecha.getMonth() === mesActual && 
                     fecha.getFullYear() === anioActual && 
                     turno.estado !== 'cancelado';
            })
            .reduce((total, turno) => {
              const servicio = serviciosRes.data.find(s => s.servicio_id === turno.servicio_id);
              return total + (servicio?.precio || 0);
            }, 0);

          setStats({
            totalClientes: clientesRes.data.length,
            turnosHoy,
            totalServicios: serviciosRes.data.length,
            totalEmpleados: empleadosRes.data.length,
            ingresosMensuales,
            proximosTurnos
          });
        }
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [isSuperAdmin]);

  if (loading) {
    return (
      <Container fluid className="px-3 px-md-4 d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="info" />
      </Container>
    );
  }

  if (isSuperAdmin) {
    return (
      <Container fluid className="px-3 px-md-4 py-3 py-md-4">
        <div className="mb-4">
          <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2 gap-sm-3">
            <Crown size={32} className="text-warning" />
            <div>
              <h2 className="text-white mb-0 fs-4 fs-md-2">Panel de SuperAdmin</h2>
              <p className="text-light mb-0 small opacity-75">Gestiona las licencias de los comercios suscriptos</p>
            </div>
          </div>
        </div>

        <Row className="g-3 mb-4">
          <Col xs={12} sm={4}>
            <Card className="border-0 h-100" style={{ background: 'var(--bg-card)' }}>
              <Card.Body className="d-flex align-items-center gap-3 py-3">
                <div className="rounded-circle bg-success bg-opacity-25 p-2 p-md-3">
                  <CheckCircle size={24} className="text-success" />
                </div>
                <div>
                  <div className="text-light small">Activos</div>
                  <div className="fs-2 fw-bold text-success">{stats.comerciosActivos}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={4}>
            <Card className="border-0 h-100" style={{ background: 'var(--bg-card)' }}>
              <Card.Body className="d-flex align-items-center gap-3 py-3">
                <div className="rounded-circle bg-warning bg-opacity-25 p-2 p-md-3">
                  <XCircle size={24} className="text-warning" />
                </div>
                <div>
                  <div className="text-light small">Inactivos</div>
                  <div className="fs-2 fw-bold text-warning">{stats.totalComercios - stats.comerciosActivos}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} sm={4}>
            <Card className="border-0 h-100" style={{ background: 'var(--bg-card)' }}>
              <Card.Body className="d-flex align-items-center gap-3 py-3">
                <div className="rounded-circle bg-info bg-opacity-25 p-2 p-md-3">
                  <Users size={24} className="text-info" />
                </div>
                <div>
                  <div className="text-light small">Usuarios</div>
                  <div className="fs-2 fw-bold text-info">{stats.totalUsuariosGlobal}</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="border-secondary mb-4" style={{ background: 'var(--bg-card)' }}>
          <Card.Body className="p-3 p-md-4">
            <h5 className="text-white mb-3 d-flex align-items-center gap-2">
              <Power size={18} className="text-success" />
              ¿Qué puedes hacer?
            </h5>
            <Row className="g-3">
              <Col xs={12} md={4}>
                <div className="d-flex align-items-start gap-2">
                  <CheckCircle size={18} className="text-success mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-white fw-bold">Activar Licencias</div>
                    <small className="text-light opacity-75">Habilita acceso a nuevos comercios</small>
                  </div>
                </div>
              </Col>
              <Col xs={12} md={4}>
                <div className="d-flex align-items-start gap-2">
                  <XCircle size={18} className="text-warning mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-white fw-bold">Suspender Acceso</div>
                    <small className="text-light opacity-75">Desactiva comercios sin suscripción</small>
                  </div>
                </div>
              </Col>
              <Col xs={12} md={4}>
                <div className="d-flex align-items-start gap-2">
                  <Users size={18} className="text-info mt-1 flex-shrink-0" />
                  <div>
                    <div className="text-white fw-bold">Gestionar Usuarios</div>
                    <small className="text-light opacity-75">Administra cuentas de todos</small>
                  </div>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <Card className="border-0" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)' }}>
          <Card.Body className="p-4 text-center">
            <Store size={40} className="text-info mb-3" />
            <h4 className="text-white mb-2">Gestionar Comercios</h4>
            <p className="text-light opacity-75 mb-3 small">Activa o desactiva el acceso de los negocios</p>
            <Button variant="success" size="lg" className="w-100 w-sm-auto" href="/dashboard/comercios">
              <Store size={18} className="me-2" />
              Ir a Comercios
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container fluid className="px-3 px-md-4 py-3 py-md-4">
      <h2 className="mb-4 text-white d-flex align-items-center gap-2 fs-4 fs-md-2">
        Panel de Control
      </h2>

      <Row className="g-3 mb-4">
        <Col xs={6} lg={3}>
          <Card className="text-white h-100" style={{ background: 'var(--bg-card)' }}>
            <Card.Body className="py-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <FaUserFriends className="text-info" />
                <small className="text-light opacity-75">Clientes</small>
              </div>
              <div className="fs-2 fw-bold text-white">{stats.totalClientes}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} lg={3}>
          <Card className="text-white h-100" style={{ background: 'var(--bg-card)' }}>
            <Card.Body className="py-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <FaCalendarAlt className="text-warning" />
                <small className="text-light opacity-75">Turnos Hoy</small>
              </div>
              <div className="fs-2 fw-bold text-white">{stats.turnosHoy}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} lg={3}>
          <Card className="text-white h-100" style={{ background: 'var(--bg-card)' }}>
            <Card.Body className="py-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <FaCut className="text-pink" />
                <small className="text-light opacity-75">Servicios</small>
              </div>
              <div className="fs-2 fw-bold text-white">{stats.totalServicios}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} lg={3}>
          <Card className="text-white h-100" style={{ background: 'var(--bg-card)' }}>
            <Card.Body className="py-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <FaUserTie className="text-success" />
                <small className="text-light opacity-75">Empleados</small>
              </div>
              <div className="fs-2 fw-bold text-white">{stats.totalEmpleados}</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col xs={12} lg={6}>
          <Card className="text-white h-100" style={{ background: 'var(--bg-card)' }}>
            <Card.Body className="py-3">
              <div className="d-flex align-items-center gap-2 mb-2">
                <FaDollarSign className="text-success" />
                <small className="text-light opacity-75">Ingresos del Mes</small>
              </div>
              <div className="fs-1 fw-bold text-success">${stats.ingresosMensuales?.toLocaleString() || '0'}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} lg={6}>
          <Card className="text-white h-100" style={{ background: 'var(--bg-card)' }}>
            <Card.Body className="py-3">
              <div className="d-flex align-items-center gap-2 mb-3">
                <FaCalendarAlt className="text-info" />
                <small className="text-light opacity-75">Próximos Turnos</small>
              </div>
              {stats.proximosTurnos.length > 0 ? (
                stats.proximosTurnos.map((turno, i) => (
                  <div key={turno.turno_id} className={`d-flex justify-content-between ${i > 0 ? 'mt-2 pt-2 border-top border-secondary' : ''}`}>
                    <span className="text-white small">{turno.fechaFormateada}</span>
                    <span className="text-light opacity-75 small">Cliente #{turno.cliente_id}</span>
                  </div>
                ))
              ) : (
                <div className="text-light opacity-50 small">No hay turnos próximos</div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style>{`.text-pink { color: #ec4899 !important; }`}</style>
    </Container>
  );
}

export default DashboardHome;
