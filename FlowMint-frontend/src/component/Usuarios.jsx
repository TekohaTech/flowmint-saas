import React, { useState, useEffect, useCallback } from 'react';
import { Button, Modal, Table, Form, Alert, Spinner, Col } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { authAPI } from '../services/api';
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

    const currentUser = authAPI.getCurrentUser();
    const isSuperAdmin = currentUser?.rol === 'SUPERADMIN';
    const isAdmin = isSuperAdmin || currentUser?.rol === 'DUEÑO';

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
            rol_id: roles.find(r => r.nombre === 'DUEÑO')?.rol_id || roles[0]?.rol_id,
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

        try {
            if (isEditMode) {
                await api.patch(`/usuarios/${userData.usuario_id}`, userData);
            } else {
                await api.post('/usuarios', userData);
            }
            fetchUsuarios();
            handleCloseModal();
        } catch (err) {
            setError(`Error al guardar: ${err.response?.data?.message || err.message}`);
        }
    };
    
    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        try {
            await api.delete(`/usuarios/${userToDelete.usuario_id}`);
            fetchUsuarios();
            handleCloseConfirmDelete();
        } catch (err) {
            setError(`Error al eliminar: ${err.response?.data?.message || err.message}`);
        }
    };

    if (!isAdmin) {
        return (
            <div className="container mt-5">
                <Alert variant="danger">Acceso denegado. No tienes permisos para ver esta sección.</Alert>
            </div>
        );
    }
    
    if (loading) {
        return <div className="text-center mt-5"><Spinner animation="border" variant="info" /></div>;
    }

    return (
        <div className="container-fluid user-management-container animate__animated animate__fadeIn">
            <h1 className="mb-4" style={{ color: 'white', textShadow: '0 0 10px rgba(0, 243, 255, 0.3)' }}>Gestión de Usuarios {isSuperAdmin ? '(Global)' : ''}</h1>
            {error && <Alert variant="danger" onClose={() => setError('')} dismissible className="bg-dark text-danger border-danger">{error}</Alert>}
            
            <div className="d-flex justify-content-end mb-4">
                <Button variant="outline-success" onClick={handleShowCreateModal} className="shadow-glow-green">
                    <FaPlus className="me-2" /> Crear Usuario
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
                                        {usuario.rol?.nombre || 'N/A'}
                                    </span>
                                </td>
                                <td className="text-center">
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
                    <Modal.Title className="text-neon-cyan">{isEditMode ? 'Editar Usuario' : 'Crear Usuario'}</Modal.Title>
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
                                <Form.Label className="small text-light opacity-75 text-uppercase">Correo Electrónico</Form.Label>
                                <Form.Control className="bg-black border-secondary text-white" type="email" name="correo" value={modalData.correo} onChange={handleFormChange} />
                            </Col>
                            <Col md={12}>
                                <Form.Label className="small text-light opacity-75 text-uppercase">Contraseña {isEditMode && '(Dejar en blanco para no cambiar)'}</Form.Label>
                                <Form.Control className="bg-black border-secondary text-white" type="password" name="pass" value={modalData.pass} onChange={handleFormChange} required={!isEditMode} />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="small text-light opacity-75 text-uppercase">Rol de Acceso</Form.Label>
                                <Form.Select className="bg-black border-secondary text-white" name="rol_id" value={modalData.rol_id || ''} onChange={handleFormChange} required>
                                    <option value="" disabled>Seleccione...</option>
                                    {roles.map(rol => (
                                        <option key={rol.rol_id} value={rol.rol_id}>{rol.nombre}</option>
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
                                {isEditMode ? 'GUARDAR CAMBIOS' : 'CREAR USUARIO'}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Confirm Delete Modal */}
            <Modal show={showConfirmDelete} onHide={handleCloseConfirmDelete} centered contentClassName="bg-dark border-danger text-white">
                <Modal.Header closeButton closeVariant="white" className="border-secondary">
                    <Modal.Title className="text-danger">Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    ¿Estás seguro de que quieres eliminar al usuario <strong>{userToDelete?.user}</strong>? 
                    <p className="mt-2 text-light opacity-75 small">Esta acción no se puede deshacer.</p>
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