import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal, Table, Form, Alert, Spinner, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus, FaKey } from 'react-icons/fa';
import { authAPI, usersAPI } from '../services/api';
import api from '../services/api';
import './Usuarios.css'; 

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [comercios, setComercios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [error, setError] = useState('');
    
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState({
        usuario_id: null,
        nombre: '',
        apellido: '',
        user: '',
        pass: '',
        correo: '',
        rol_id: null,
        comercio_id: null
    });
    const [isEditMode, setIsEditMode] = useState(false);
    
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    // PIN modal state
    const [showPinModal, setShowPinModal] = useState(false);
    const [pinValue, setPinValue] = useState('');
    const [pinUser, setPinUser] = useState('');
    const [pinLoading, setPinLoading] = useState(false);

    const currentUser = authAPI.getCurrentUser();
    const isSuperAdmin = currentUser?.rol === 'SUPERADMIN';
    const isAdmin = isSuperAdmin || currentUser?.rol === 'DUENO';

    // Count employee accounts (EMPLEADO role) for limit check
    const empleadoCount = usuarios.filter(u => u.rol?.nombre === 'EMPLEADO').length;
    const reachedEmployeeLimit = !isSuperAdmin && empleadoCount >= 2;

    const fetchUsuarios = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get('/usuarios');
            setUsuarios(response.data);
            setError('');
        } catch (err) {
            setError('Error al cargar los usuarios.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchRoles = useCallback(async () => {
        try {
            setLoadingRoles(true);
            const response = await api.get('/roles');
            setRoles(response.data);
        } catch (err) {
            setError('Error al cargar los roles.');
            console.error(err);
        } finally {
            setLoadingRoles(false);
        }
    }, []);

    const fetchComercios = useCallback(async () => {
        if (!isSuperAdmin) return;
        try {
            const response = await api.get('/comercios');
            setComercios(response.data);
        } catch (err) {
            console.error('Error al cargar comercios:', err);
        }
    }, [isSuperAdmin]);

    useEffect(() => {
        if (isAdmin) {
            fetchUsuarios();
            fetchRoles();
            fetchComercios();
        }
    }, [isAdmin, fetchUsuarios, fetchRoles, fetchComercios]);

    const handleCloseModal = () => {
        setShowModal(false);
        setModalData({
            usuario_id: null,
            nombre: '',
            apellido: '',
            user: '',
            pass: '',
            correo: '',
            rol_id: null,
            comercio_id: null
        });
        setIsEditMode(false);
    };

    const handleShowCreateModal = () => {
        setIsEditMode(false);
        setModalData({
            usuario_id: null,
            nombre: '',
            apellido: '',
            user: '',
            pass: '',
            correo: '',
            rol_id: isSuperAdmin
                ? (roles.find(r => r.nombre === 'DUENO')?.rol_id || roles[0]?.rol_id)
                : (roles.find(r => r.nombre === 'EMPLEADO')?.rol_id || null),
            comercio_id: currentUser?.comercio_id || null
        });
        setShowModal(true);
    };

    const handleShowEditModal = (usuario) => {
        setIsEditMode(true);
        setModalData({ 
            ...usuario, 
            pass: '', 
            rol_id: usuario.rol?.rol_id,
            comercio_id: usuario.comercio_id 
        });
        setShowModal(true);
    };
    
    const handleShowConfirmDelete = (usuario) => {
        setUserToDelete(usuario);
        setShowConfirmDelete(true);
    };

    const handleCloseConfirmDelete = () => {
        setShowConfirmDelete(false);
        setUserToDelete(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setModalData(prev => ({
            ...prev,
            [name]: (name === 'rol_id' || name === 'comercio_id') ? (value === "" ? null : parseInt(value, 10)) : value
        }));
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        const userData = { ...modalData };
        if (isEditMode && !userData.pass) delete userData.pass;
        // When DUENO creates employee, backend ignores pass — don't send it
        if (!isEditMode && !isSuperAdmin) delete userData.pass;

        try {
            if (isEditMode) {
                await usersAPI.update(userData.usuario_id, userData);
                fetchUsuarios();
                handleCloseModal();
            } else {
                const response = await usersAPI.create(userData);
                fetchUsuarios();
                handleCloseModal();
                // Show PIN only when DUENO creates an employee (backend returns pin)
                if (response.pin && response.usuario) {
                    setPinValue(response.pin);
                    setPinUser(response.usuario.user || response.usuario.nombre);
                    setShowPinModal(true);
                }
            }
        } catch (err) {
            setError(`Error al guardar: ${err.response?.data?.message || err.message}`);
        }
    };
    
    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        try {
            await usersAPI.delete(userToDelete.usuario_id);
            fetchUsuarios();
            handleCloseConfirmDelete();
        } catch (err) {
            setError(`Error al eliminar: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleGenerarPin = async (usuario) => {
        setPinLoading(true);
        try {
            const response = await usersAPI.generarPin(usuario.usuario_id);
            setPinValue(response.pin);
            setPinUser(usuario.user);
            setShowPinModal(true);
        } catch (err) {
            setError(`Error al generar PIN: ${err.response?.data?.message || err.message}`);
        } finally {
            setPinLoading(false);
        }
    };

    const handleCopiarPin = () => {
        navigator.clipboard.writeText(pinValue).catch(() => {});
    };

    if (!isAdmin) {
        return (
            <div className="container mt-5">
                <Alert variant="danger">Acceso denegado. No tienes permisos para ver esta seccion.</Alert>
            </div>
        );
    }
    
    if (loading) {
        return <div className="text-center mt-5"><Spinner animation="border" variant="info" /></div>;
    }

    return (
        <div className="container-fluid user-management-container animate__animated animate__fadeIn">
            <h1 className="mb-4" style={{ color: 'white', textShadow: '0 0 10px rgba(0, 243, 255, 0.3)' }}>Gestion de Usuarios {isSuperAdmin ? '(Global)' : ''}</h1>
            {error && <Alert variant="danger" onClose={() => setError('')} dismissible className="bg-dark text-danger border-danger">{error}</Alert>}
            
            <div className="d-flex justify-content-end align-items-center mb-4 gap-3">
                {!isSuperAdmin && (
                    <span className="small" style={{ color: 'var(--neon-cyan)', opacity: 0.8 }}>
                        Empleados: {empleadoCount} / 2
                    </span>
                )}
                <Button
                    variant="outline-success"
                    onClick={handleShowCreateModal}
                    className="shadow-glow-green"
                    disabled={reachedEmployeeLimit}
                    title={reachedEmployeeLimit ? 'Limite de 2 empleados alcanzado' : ''}
                >
                    <FaPlus className="me-2" /> {isSuperAdmin ? 'Crear Usuario' : 'Invitar Empleado'}
                </Button>
            </div>

            <div className="table-responsive">
                <Table hover variant="dark" className="border-secondary">
                    <thead>
                        <tr className="border-bottom border-secondary text-white text-uppercase small">
                            <th>Usuario</th>
                            <th>Nombre Completo</th>
                            <th>Email</th>
                            {isSuperAdmin && <th>Comercio</th>}
                            <th>Rol</th>
                            <th>Estado</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((usuario) => (
                            <tr key={usuario.usuario_id} className="align-middle">
                                <td><span className="fw-bold text-white">{usuario.user}</span></td>
                                <td>{`${usuario.nombre} ${usuario.apellido}`}</td>
                                <td>{usuario.correo || '-'}</td>
                                {isSuperAdmin && (
                                    <td>
                                        {usuario.comercio ? (
                                            <span className="text-info">{usuario.comercio.nombre}</span>
                                        ) : (
                                            <span className="text-light opacity-75 italic">Sistema</span>
                                        )}
                                    </td>
                                )}
                                <td>
                                    <span className={`badge border ${usuario.rol?.nombre === 'SUPERADMIN' ? 'border-danger text-danger' : 'border-primary text-primary'}`}>
                                        {usuario.rol?.nombre === 'DUENO' ? 'Dueno / Empresa' : (usuario.rol?.nombre || 'N/A')}
                                    </span>
                                </td>
                                <td>
                                    <span className={`badge ${usuario.estado === 'A' ? 'bg-success' : usuario.estado === 'I' ? 'bg-secondary' : 'bg-danger'}`}>
                                        {usuario.estado === 'A' ? 'Activo' : usuario.estado === 'I' ? 'Inactivo' : 'Eliminado'}
                                    </span>
                                </td>
                                <td className="text-center">
                                    {usuario.rol?.nombre === 'EMPLEADO' && (
                                        <Button
                                            variant="outline-warning"
                                            size="sm"
                                            className="me-2"
                                            title="Generar / Regenerar PIN de activacion"
                                            onClick={() => handleGenerarPin(usuario)}
                                            disabled={pinLoading}
                                        >
                                            <FaKey />
                                        </Button>
                                    )}
                                    <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleShowEditModal(usuario)}>
                                        <FaEdit />
                                    </Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleShowConfirmDelete(usuario)}>
                                        <FaTrash />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Create / Edit Modal */}
            <Modal show={showModal} onHide={handleCloseModal} centered contentClassName="bg-dark border-secondary text-white">
                <Modal.Header closeButton closeVariant="white" className="border-secondary">
                    <Modal.Title className="text-neon-cyan">{isEditMode ? 'Editar Usuario' : isSuperAdmin ? 'Crear Usuario' : 'Invitar Empleado'}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form onSubmit={handleSaveChanges}>
                        <div className="row g-3">
                            <Col md={6}>
                                <Form.Label className="small text-light opacity-75 text-uppercase">Nombre</Form.Label>
                                <Form.Control className="bg-black border-secondary text-white" type="text" name="nombre" value={modalData.nombre} onChange={handleFormChange} required />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small text-light opacity-75 text-uppercase">Apellido</Form.Label>
                                <Form.Control className="bg-black border-secondary text-white" type="text" name="apellido" value={modalData.apellido} onChange={handleFormChange} required />
                            </Col>
                            <Col md={12}>
                                <Form.Label className="small text-light opacity-75 text-uppercase">Nombre de Usuario</Form.Label>
                                <Form.Control className="bg-black border-secondary text-white" type="text" name="user" value={modalData.user} onChange={handleFormChange} required />
                            </Col>
                            <Col md={12}>
                                <Form.Label className="small text-light opacity-75 text-uppercase">Correo Electronico</Form.Label>
                                <Form.Control className="bg-black border-secondary text-white" type="email" name="correo" value={modalData.correo} onChange={handleFormChange} />
                            </Col>
                            {/* Password: only show for superadmin create, or edit (optional) */}
                            {(isSuperAdmin || isEditMode) && (
                                <Col md={12}>
                                    <Form.Label className="small text-light opacity-75 text-uppercase">
                                        Contrasena {isEditMode ? '(Dejar en blanco para no cambiar)' : ''}
                                    </Form.Label>
                                    <Form.Control
                                        className="bg-black border-secondary text-white"
                                        type="password"
                                        name="pass"
                                        value={modalData.pass}
                                        onChange={handleFormChange}
                                        required={!isEditMode && isSuperAdmin}
                                    />
                                </Col>
                            )}
                            {/* Info for DUENO creating employee */}
                            {!isSuperAdmin && !isEditMode && (
                                <Col md={12}>
                                    <div className="small p-2 rounded" style={{ background: 'rgba(0, 243, 255, 0.08)', border: '1px solid rgba(0, 243, 255, 0.2)' }}>
                                        <strong style={{ color: 'var(--neon-cyan)' }}>Flujo de invitacion:</strong>{' '}
                                        <span className="text-light opacity-75">
                                            Se generara un PIN de 6 digitos. Compartilo con el empleado para que active su cuenta y defina su contrasena.
                                        </span>
                                    </div>
                                </Col>
                            )}
                            <Col md={6}>
                                <Form.Label className="small text-light opacity-75 text-uppercase">Rol de Acceso</Form.Label>
                                <Form.Select className="bg-black border-secondary text-white" name="rol_id" value={modalData.rol_id || ''} onChange={handleFormChange} required disabled={!isSuperAdmin}>
                                    <option value="" disabled>Seleccione...</option>
                                    {roles
                                        .filter(rol => isSuperAdmin ? true : rol.nombre === 'EMPLEADO')
                                        .map(rol => (
                                            <option key={rol.rol_id} value={rol.rol_id}>{rol.nombre === 'DUENO' ? 'Dueno / Empresa' : rol.nombre}</option>
                                        ))}
                                </Form.Select>
                            </Col>
                            {isSuperAdmin && (
                                <Col md={6}>
                                    <Form.Label className="small text-light opacity-75 text-uppercase">Asignar Comercio</Form.Label>
                                    <Form.Select className="bg-black border-secondary text-white" name="comercio_id" value={modalData.comercio_id || ''} onChange={handleFormChange}>
                                        <option value="">Ninguno (SuperAdmin)</option>
                                        {comercios.map(c => (
                                            <option key={c.comercio_id} value={c.comercio_id}>{c.nombre}</option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            )}
                        </div>
                        <div className="d-grid mt-4">
                            <Button variant="outline-cyan" type="submit" className="fw-bold py-2">
                                {isEditMode ? 'GUARDAR CAMBIOS' : isSuperAdmin ? 'CREAR USUARIO' : 'INVITAR EMPLEADO'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* PIN Display Modal */}
            <Modal show={showPinModal} onHide={() => setShowPinModal(false)} centered contentClassName="bg-dark border-secondary text-white">
                <Modal.Header closeButton closeVariant="white" className="border-secondary">
                    <Modal.Title className="text-neon-cyan">PIN de Activacion</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4 text-center">
                    <p className="mb-3 text-light">PIN generado para <strong className="text-white">{pinUser}</strong>:</p>
                    <div
                        className="p-3 rounded mb-3"
                        style={{
                            background: 'rgba(0, 243, 255, 0.1)',
                            border: '2px solid var(--neon-cyan)',
                            fontSize: '2rem',
                            letterSpacing: '0.5rem',
                            fontWeight: 'bold',
                            color: 'var(--neon-cyan)',
                            textShadow: '0 0 10px rgba(0, 243, 255, 0.5)',
                            fontFamily: 'monospace'
                        }}
                    >
                        {pinValue}
                    </div>
                    <p className="small text-warning mb-3">
                        Vence en 24 horas. Compartilo con el empleado de forma segura.
                    </p>
                    <p className="small text-light opacity-75 mb-3">
                        Este PIN solo se muestra una vez. Si lo perdes, podes regenerarlo desde la tabla.
                    </p>
                </Modal.Body>
                <Modal.Footer className="border-secondary d-flex justify-content-between">
                    <Button variant="outline-light" onClick={() => setShowPinModal(false)}>Cerrar</Button>
                    <Button variant="outline-success" onClick={handleCopiarPin}>Copiar PIN</Button>
                </Modal.Footer>
            </Modal>

            {/* Confirm Delete Modal */}
            <Modal show={showConfirmDelete} onHide={handleCloseConfirmDelete} centered contentClassName="bg-dark border-danger text-white">
                <Modal.Header closeButton closeVariant="white" className="border-secondary">
                    <Modal.Title className="text-danger">Confirmar Eliminacion</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    Estas seguro de que quieres eliminar al usuario <strong>{userToDelete?.user}</strong>? 
                    <p className="mt-2 text-light opacity-75 small">Esta accion no se puede deshacer.</p>
                </Modal.Body>
                <Modal.Footer className="border-secondary">
                    <Button variant="outline-light" onClick={handleCloseConfirmDelete}>Cancelar</Button>
                    <Button variant="danger" onClick={handleDeleteUser}>ELIMINAR</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Usuarios;
