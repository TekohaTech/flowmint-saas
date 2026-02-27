import React, { useState, useEffect } from 'react';
import { 
    Container, Row, Col, Card, Badge, Button, 
    Form, InputGroup, Modal, Spinner, Alert 
} from 'react-bootstrap';
import { 
    Store, CheckCircle, XCircle, Search, Trash2,
    Phone, MapPin, Mail, RefreshCw, Plus, Edit, Building, Power, Crown,
    Clock, User, Calendar, Tag
} from 'lucide-react';
import { comerciosAPI } from '../services/api';

const Comercios = () => {
    const [comercios, setComercios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [filterEstado, setFilterEstado] = useState('todos');

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [comercioToDelete, setComercioToDelete] = useState(null);
    
    const [showFormModal, setShowFormModal] = useState(false);
    const [formData, setFormData] = useState({
        comercio_id: null,
        nombre: '',
        direccion: '',
        telefono: '',
        email: '',
        activo: false,
        categoria: ''
    });
    const [isEditMode, setIsEditMode] = useState(false);

    const fetchComercios = async () => {
        setLoading(true);
        try {
            const data = await comerciosAPI.getAll();
            setComercios(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar los comercios');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComercios();
    }, []);

    const handleToggleStatus = async (comercio) => {
        console.log('=== DEBUG handleToggleStatus ===');
        console.log('Comercio:', comercio);
        console.log('Estado actual:', comercio.estado, 'Activo:', comercio.activo);
        
        setActionLoading(comercio.comercio_id);
        try {
            const nuevoActivo = !comercio.activo;
            const nuevoEstado = nuevoActivo ? 'activo' : 'suspendido';
            
            console.log('Cambiando a:', { activo: nuevoActivo, estado: nuevoEstado });
            
            await comerciosAPI.update(comercio.comercio_id, { 
                activo: nuevoActivo,
                estado: nuevoEstado
            });
            
            console.log('API llamada exitosamente');
            await fetchComercios();
        } catch (err) {
            console.error('Error en handleToggleStatus:', err);
            alert('Error al cambiar el estado: ' + (err.response?.data?.message || err.message));
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteClick = (comercio) => {
        setComercioToDelete(comercio);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!comercioToDelete) return;
        setActionLoading(comercioToDelete.comercio_id);
        setShowDeleteModal(false);
        try {
            await comerciosAPI.delete(comercioToDelete.comercio_id);
            await fetchComercios();
        } catch (err) {
            alert('Error al eliminar el comercio');
        } finally {
            setActionLoading(null);
            setComercioToDelete(null);
        }
    };

    const handleShowCreateModal = () => {
        setIsEditMode(false);
        setFormData({
            comercio_id: null,
            nombre: '',
            direccion: '',
            telefono: '',
            email: '',
            activo: true
        });
        setShowFormModal(true);
    };

    const handleShowEditModal = (comercio) => {
        setIsEditMode(true);
        setFormData({
            comercio_id: comercio.comercio_id,
            nombre: comercio.nombre,
            direccion: comercio.direccion || '',
            telefono: comercio.telefono || '',
            email: comercio.email || '',
            activo: comercio.activo
        });
        setShowFormModal(true);
    };

    const handleFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setActionLoading(formData.comercio_id || 'new');
        try {
            if (isEditMode) {
                await comerciosAPI.update(formData.comercio_id, formData);
            } else {
                await comerciosAPI.create(formData);
            }
            await fetchComercios();
            setShowFormModal(false);
        } catch (err) {
            alert(`Error al ${isEditMode ? 'actualizar' : 'crear'} el comercio`);
        } finally {
            setActionLoading(null);
        }
    };

    const filteredComercios = comercios.filter(c => {
        const matchSearch = c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.dueno_nombre?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchEstado = filterEstado === 'todos' || c.estado === filterEstado;
        
        return matchSearch && matchEstado;
    });

    const pendientes = comercios.filter(c => c.estado === 'pendiente' || (!c.estado && !c.activo)).length;
    const activos = comercios.filter(c => c.estado === 'activo' || (!c.estado && c.activo)).length;
    const suspendidos = comercios.filter(c => c.estado === 'suspendido').length;

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <Spinner animation="border" variant="info" />
        </div>
    );

    return (
        <Container fluid className="px-3 px-md-4 py-3 py-md-4">
            <div className="mb-4">
                <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2 gap-sm-3">
                    <Crown size={32} className="text-warning" />
                    <div>
                        <h2 className="text-white mb-0 fs-4 fs-md-2">Administración de Licencias</h2>
                        <p className="text-light opacity-75 mb-0 small">Activa o desactiva el acceso de los comercios</p>
                    </div>
                </div>
            </div>

            <Row className="g-3 mb-4">
                <Col xs={4}>
                    <Card className="bg-dark border-0 text-center h-100">
                        <Card.Body className="py-3 py-md-4">
                            <Store size={24} className="text-info mb-2" />
                            <div className="fs-3 fw-bold text-white">{comercios.length}</div>
                            <small className="text-light opacity-75">Total</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={4}>
                    <Card 
                        className="bg-dark border-0 text-center h-100" 
                        style={{ cursor: 'pointer' }}
                        onClick={() => setFilterEstado(filterEstado === 'activo' ? 'todos' : 'activo')}
                    >
                        <Card.Body className="py-3 py-md-4">
                            <CheckCircle size={24} className="text-success mb-2" />
                            <div className="fs-3 fw-bold text-success">{activos}</div>
                            <small className="text-light opacity-75">Activos</small>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={4}>
                    <Card 
                        className="bg-dark border-0 text-center h-100"
                        style={{ cursor: 'pointer' }}
                        onClick={() => setFilterEstado(filterEstado === 'pendiente' ? 'todos' : 'pendiente')}
                    >
                        <Card.Body className="py-3 py-md-4">
                            <Clock size={24} className="text-warning mb-2" />
                            <div className="fs-3 fw-bold text-warning">{pendientes}</div>
                            <small className="text-light opacity-75">Pendientes</small>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {filterEstado !== 'todos' && (
                <div className="mb-3">
                    <Button variant="outline-secondary" size="sm" onClick={() => setFilterEstado('todos')}>
                        ✕ Limpiar filtro: {filterEstado}
                    </Button>
                </div>
            )}

            <Card className="bg-dark border-secondary mb-4">
                <Card.Body className="py-3">
                    <Row className="g-2 align-items-center">
                        <Col xs={12} sm={6} lg={7}>
                            <InputGroup>
                                <InputGroup.Text className="bg-black border-secondary text-light opacity-75">
                                    <Search size={18} />
                                </InputGroup.Text>
                                <Form.Control
                                    placeholder="Buscar comercio..."
                                    className="bg-black border-secondary text-white"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <Col xs={6} sm={3} lg={{ span: 2, offset: 1 }}>
                            <Button variant="outline-secondary" className="w-100" onClick={fetchComercios}>
                                <RefreshCw size={16} className={loading ? 'spin' : ''} />
                            </Button>
                        </Col>
                        <Col xs={6} sm={3} lg={2}>
                            <Button variant="success" className="w-100" onClick={handleShowCreateModal}>
                                <Plus size={16} className="me-1" /> Agregar
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {error && <Alert variant="danger">{error}</Alert>}

            <Row className="g-3">
                {filteredComercios.map(comercio => {
                    let estado = comercio.estado;
                    if (!estado) {
                        estado = comercio.activo ? 'activo' : 'pendiente';
                    }
                    const estadoConfig = {
                        pendiente: { color: 'warning', bg: 'bg-warning', text: 'Pendiente', icon: Clock, btnVariant: 'success', btnText: 'Activar' },
                        activo: { color: 'success', bg: 'bg-success', text: 'Activo', icon: CheckCircle, btnVariant: 'outline-danger', btnText: 'Suspender' },
                        suspendido: { color: 'danger', bg: 'bg-danger', text: 'Suspendido', icon: XCircle, btnVariant: 'success', btnText: 'Reactivar' }
                    };
                    const config = estadoConfig[estado] || estadoConfig.pendiente;
                    const EstadoIcon = config.icon;
                    
                    return (
                    <Col key={comercio.comercio_id} xs={12} md={6} xl={4}>
                        <Card className={`h-100 border-2 bg-dark ${estado === 'activo' ? 'border-success' : estado === 'pendiente' ? 'border-warning' : 'border-secondary'}`}>
                            <Card.Body className="p-3">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className={`rounded-circle p-2 ${config.bg}`}>
                                            <Building size={18} className="text-white" />
                                        </div>
                                        <div>
                                            <h6 className="text-white mb-0">{comercio.nombre}</h6>
                                            {comercio.categoria && (
                                                <small className="text-light opacity-75 d-flex align-items-center gap-1">
                                                    <Tag size={12} /> {comercio.categoria}
                                                </small>
                                            )}
                                        </div>
                                    </div>
                                    <Badge bg={config.color} pill className="d-flex align-items-center gap-1">
                                        <EstadoIcon size={12} /> {config.text}
                                    </Badge>
                                </div>

                                {(comercio.dueno_nombre || comercio.dueno_email) && (
                                    <div className="mb-3 p-2 rounded" style={{ background: 'rgba(0,0,0,0.3)' }}>
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <User size={14} className="text-info" />
                                            <small className="text-white">
                                                {comercio.dueno_nombre} {comercio.dueno_apellido}
                                            </small>
                                        </div>
                                        {comercio.dueno_email && (
                                            <div className="d-flex align-items-center gap-2">
                                                <Mail size={14} className="text-light opacity-75" />
                                                <small className="text-light opacity-75">{comercio.dueno_email}</small>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {comercio.direccion && (
                                    <div className="d-flex align-items-center gap-2 mb-2">
                                        <MapPin size={14} className="text-light opacity-75" />
                                        <small className="text-light opacity-75">{comercio.direccion}</small>
                                    </div>
                                )}

                                <div className="d-flex gap-2 mb-3 text-center">
                                    <div className="flex-grow-1 py-2 bg-black rounded">
                                        <div className="fw-bold text-info fs-5">{comercio._count?.usuarios || 0}</div>
                                        <small className="text-light opacity-75" style={{ fontSize: '0.65rem' }}>Usuarios</small>
                                    </div>
                                    <div className="flex-grow-1 py-2 bg-black rounded">
                                        <div className="fw-bold text-warning fs-5">{comercio._count?.clientes || 0}</div>
                                        <small className="text-light opacity-75" style={{ fontSize: '0.65rem' }}>Clientes</small>
                                    </div>
                                    <div className="flex-grow-1 py-2 bg-black rounded">
                                        <div className="fw-bold text-info fs-5">{comercio._count?.turnos || 0}</div>
                                        <small className="text-light opacity-75" style={{ fontSize: '0.65rem' }}>Turnos</small>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant={config.btnVariant}
                                    className="w-100 mb-2"
                                    disabled={actionLoading === comercio.comercio_id}
                                    onClick={() => handleToggleStatus(comercio)}
                                >
                                    {actionLoading === comercio.comercio_id ? (
                                        <Spinner size="sm" />
                                    ) : (
                                        <>
                                            <Power size={18} className="me-2" />
                                            {config.btnText}
                                        </>
                                    )}
                                </Button>
                                
                                <div className="d-flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline-secondary"
                                        size="sm"
                                        className="flex-grow-1"
                                        onClick={() => handleShowEditModal(comercio)}
                                    >
                                        <Edit size={14} className="me-1" /> Editar
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDeleteClick(comercio)}
                                        disabled={actionLoading === comercio.comercio_id}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    );
                })}
            </Row>

            {filteredComercios.length === 0 && (
                <div className="text-center py-5 text-light opacity-75">
                    <Store size={48} className="mb-3 opacity-50" />
                    <p>No hay comercios</p>
                </div>
            )}

            <Modal show={showFormModal} onHide={() => setShowFormModal(false)} centered contentClassName="bg-dark border-secondary text-white">
                <Modal.Header closeButton closeVariant="white" className="border-secondary">
                    <Modal.Title className="fs-5">
                        {isEditMode ? 'Editar Comercio' : 'Nuevo Comercio'}
                    </Modal.Title>
                </Modal.Header>
                <Form onSubmit={handleFormSubmit}>
                    <Modal.Body className="p-3 p-md-4">
                        <Row className="g-3">
                            <Col xs={12}>
                                <Form.Label className="text-light opacity-75 small">Nombre *</Form.Label>
                                <Form.Control 
                                    className="bg-black border-secondary text-white" 
                                    type="text" 
                                    name="nombre"
                                    value={formData.nombre}
                                    onChange={handleFormChange}
                                    placeholder="Nombre del negocio"
                                    required 
                                />
                            </Col>
                            <Col xs={12}>
                                <Form.Label className="text-light opacity-75 small">Email</Form.Label>
                                <Form.Control 
                                    className="bg-black border-secondary text-white" 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                    placeholder="contacto@negocio.com" 
                                />
                            </Col>
                            <Col xs={6}>
                                <Form.Label className="text-light opacity-75 small">Teléfono</Form.Label>
                                <Form.Control 
                                    className="bg-black border-secondary text-white" 
                                    type="text" 
                                    name="telefono"
                                    value={formData.telefono}
                                    onChange={handleFormChange}
                                    placeholder="Teléfono" 
                                />
                            </Col>
                            <Col xs={6}>
                                <Form.Label className="text-light opacity-75 small">Dirección</Form.Label>
                                <Form.Control 
                                    className="bg-black border-secondary text-white" 
                                    type="text" 
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleFormChange}
                                    placeholder="Dirección" 
                                />
                            </Col>
                            <Col xs={12}>
                                <Form.Check 
                                    type="switch"
                                    id="activo-switch"
                                    name="activo"
                                    checked={formData.activo}
                                    onChange={handleFormChange}
                                    label={formData.activo ? 
                                        <span className="text-success">Acceso activado</span> : 
                                        <span className="text-warning">Acceso desactivado</span>
                                    }
                                />
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer className="border-secondary">
                        <Button variant="outline-light" onClick={() => setShowFormModal(false)}>Cancelar</Button>
                        <Button variant="success" type="submit" disabled={actionLoading === formData.comercio_id || actionLoading === 'new'}>
                            {actionLoading === formData.comercio_id || actionLoading === 'new' ? <Spinner size="sm" /> : 'Guardar'}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered contentClassName="bg-dark border-danger text-white">
                <Modal.Header closeButton closeVariant="white" className="border-secondary">
                    <Modal.Title className="text-danger fs-5">Eliminar Comercio</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="mb-2">¿Eliminar <strong>{comercioToDelete?.nombre}</strong>?</p>
                    <Alert variant="danger" className="small py-2">
                        Se eliminarán {comercioToDelete?._count?.clientes || 0} clientes, {comercioToDelete?._count?.turnos || 0} turnos y datos asociados.
                    </Alert>
                </Modal.Body>
                <Modal.Footer className="border-secondary">
                    <Button variant="outline-light" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={confirmDelete}>Eliminar</Button>
                </Modal.Footer>
            </Modal>

            <style>
                {`
                    .spin { animation: spin 1s linear infinite; }
                    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                `}
            </style>
        </Container>
    );
};

export default Comercios;
