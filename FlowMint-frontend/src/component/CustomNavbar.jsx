import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { authAPI } from '../services/api';

const CustomNavbar = () => {
    const [expanded, setExpanded] = useState(false);
    const navbarRef = useRef(null);
    const navigate = useNavigate();

    const handleToggle = () => {
        setExpanded(!expanded);
    };

    const handleClose = () => {
        setExpanded(false);
    };

    const handleClickOutside = (event) => {
        if (navbarRef.current && !navbarRef.current.contains(event.target)) {
            setExpanded(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        setExpanded(false);
        await authAPI.logout();
    };

    return (
        <Navbar
            ref={navbarRef}
            bg="info"
            expand="lg"
            expanded={expanded}
            className="p-0"
            aria-label="Navegación principal"
            style={{ backgroundColor: expanded ? 'rgba(0, 123, 255, 0.5)' : 'info' }}
        >
            <Navbar.Brand as={Link} to="/" className="d-lg-none">
                Juan Toledo Peluquero
            </Navbar.Brand>
            <div className="d-lg-none ml-auto">
                <Navbar.Toggle
                    aria-controls="basic-navbar-nav"
                    aria-expanded={expanded}
                    aria-label="Menú de navegación"
                    onClick={handleToggle}
                    style={{ backgroundColor: 'rgba(0, 123, 255, 0.5)' }}
                />
            </div>
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
                <Nav className="text-center">
                    <Nav.Link as={Link} to="/dashboard" onClick={handleClose}>
                        Panel
                    </Nav.Link>
                </Nav>
                <Nav className="text-center">
                    <Nav.Link as={Link} to="/perfil" onClick={handleClose}>
                        Perfil
                    </Nav.Link>
                    <Button onClick={handleLogout} variant="outline-danger" className="ml-2">
                        Cerrar sesión
                    </Button>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default CustomNavbar;
