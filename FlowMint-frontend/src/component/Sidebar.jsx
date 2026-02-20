import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { Person, People, Calendar, Gear, FileEarmark } from 'react-bootstrap-icons';
import { Store, Crown } from 'lucide-react';
import { authAPI } from '../services/api';

const Sidebar = () => {
    const location = useLocation();
    const user = authAPI.getCurrentUser();
    const isSuperAdmin = user?.rol === 'SUPERADMIN';

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <style>
                {`
                    .sidebar-nav {
                        background: #0d1117;
                        border-right: 1px solid #21262d;
                    }
                    .nav-link {
                        color: #8b949e !important;
                        padding: 12px 16px;
                        border-radius: 8px;
                        margin: 4px 8px;
                        transition: all 0.2s ease;
                    }
                    .nav-link:hover {
                        background: #161b22 !important;
                        color: #58a6ff !important;
                    }
                    .nav-link.active {
                        background: #161b22 !important;
                        color: #58a6ff !important;
                    }
                    .nav-link.active::before {
                        content: '';
                        position: absolute;
                        left: 0;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 3px;
                        height: 24px;
                        background: #58a6ff;
                        border-radius: 0 4px 4px 0;
                    }
                    .sidebar-section {
                        padding: 8px 16px;
                        font-size: 11px;
                        text-transform: uppercase;
                        color: #484f58;
                        letter-spacing: 0.5px;
                    }
                `}
            </style>
            <div 
                className="sidebar-nav d-none d-md-flex flex-column position-fixed"
                style={{ 
                    width: '220px', 
                    height: 'calc(100vh - 60px)', 
                    top: '60px',
                    overflowY: 'auto'
                }}
            >
                {isSuperAdmin ? (
                    <>
                        <div className="sidebar-section mt-2">Administración SaaS</div>
                        <Nav className="flex-column">
                            <Nav.Link
                                as={Link}
                                to="/dashboard/comercios"
                                className={`position-relative ${isActive('/dashboard/comercios') ? 'active' : ''}`}
                            >
                                <Store size={18} className="me-2" />
                                Comercios
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/dashboard/usuarios"
                                className={`position-relative ${isActive('/dashboard/usuarios') ? 'active' : ''}`}
                            >
                                <Person className="me-2" />
                                Usuarios Globales
                            </Nav.Link>
                        </Nav>
                    </>
                ) : (
                    <>
                        <div className="sidebar-section mt-2">Mi Negocio</div>
                        <Nav className="flex-column">
                            <Nav.Link
                                as={Link}
                                to="/dashboard/clientes"
                                className={`position-relative ${isActive('/dashboard/clientes') ? 'active' : ''}`}
                            >
                                <Person className="me-2" />
                                Clientes
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/dashboard/turnos"
                                className={`position-relative ${isActive('/dashboard/turnos') ? 'active' : ''}`}
                            >
                                <Calendar className="me-2" />
                                Turnos
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/dashboard/empleados"
                                className={`position-relative ${isActive('/dashboard/empleados') ? 'active' : ''}`}
                            >
                                <People className="me-2" />
                                Empleados
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/dashboard/servicios"
                                className={`position-relative ${isActive('/dashboard/servicios') ? 'active' : ''}`}
                            >
                                <Gear className="me-2" />
                                Servicios
                            </Nav.Link>
                        </Nav>
                        
                        <div className="sidebar-section mt-3">Administración</div>
                        <Nav className="flex-column">
                            <Nav.Link
                                as={Link}
                                to="/dashboard/usuarios"
                                className={`position-relative ${isActive('/dashboard/usuarios') ? 'active' : ''}`}
                            >
                                <Person className="me-2" />
                                Usuarios
                            </Nav.Link>
                            <Nav.Link
                                as={Link}
                                to="/dashboard/ganancias"
                                className={`position-relative ${isActive('/dashboard/ganancias') ? 'active' : ''}`}
                            >
                                <FileEarmark className="me-2" />
                                Ganancias
                            </Nav.Link>
                        </Nav>
                    </>
                )}
            </div>
        </>
    );
};

export default Sidebar;
