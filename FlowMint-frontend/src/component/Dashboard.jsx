import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Nav,
  Navbar,
  Button,
  Offcanvas,
} from "react-bootstrap";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { authAPI } from "../services/api";
import {
  Calendar,
  Users,
  Briefcase,
  Scissors,
  DollarSign,
  User,
  LogOut,
  Menu,
  Zap,
  MessageSquare,
  Store,
} from "lucide-react";
import AIChat from "./AIChat";
import { Logo } from "./VisualAssets";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    navigate("/login");
  };

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const toggleChat = () => setShowChat(!showChat);

  const menuItems = user?.rol === 'SUPERADMIN' 
    ? [
        {
          path: "/dashboard",
          icon: Zap,
          label: "Panel",
          color: "var(--neon-cyan)",
        },
        {
          path: "/dashboard/comercios",
          icon: Store,
          label: "Comercios",
          color: "var(--neon-green)",
        },
        {
          path: "/dashboard/usuarios",
          icon: User,
          label: "Usuarios",
          color: "var(--neon-purple)",
        },
      ]
    : [
        {
          path: "/dashboard",
          icon: Zap,
          label: "Panel",
          color: "var(--neon-cyan)",
        },
        {
          path: "/dashboard/turnos",
          icon: Calendar,
          label: "Turnos",
          color: "var(--neon-cyan)",
        },
        {
          path: "/dashboard/clientes",
          icon: Users,
          label: "Clientes",
          color: "var(--neon-green)",
        },
        {
          path: "/dashboard/empleados",
          icon: Briefcase,
          label: "Empleados",
          color: "var(--neon-purple)",
        },
        {
          path: "/dashboard/servicios",
          icon: Scissors,
          label: "Servicios",
          color: "var(--neon-pink)",
        },
        {
          path: "/dashboard/usuarios",
          icon: User,
          label: "Usuarios",
          color: "var(--neon-yellow)",
        },
        {
          path: "/dashboard/ganancias",
          icon: DollarSign,
          label: "Ganancias",
          color: "var(--neon-orange)",
        },
      ];

  const SidebarContent = ({ onClose }) => (
    <div
      className="h-100 d-flex flex-column"
      style={{
        background: "linear-gradient(180deg, #1a1a3e 0%, #2a1a4e 100%)",
      }}
    >
      {/* Logo */}
      <div
        className="p-4 border-bottom d-flex flex-column align-items-center"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          <Logo size={60} />
        </div>
        <small className="mt-2" style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>
          v1.0.0
        </small>
      </div>

      {/* User Info */}
      {user && (
        <div
          className="p-3 border-bottom"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div className="d-flex align-items-center gap-2">
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: "40px",
                height: "40px",
                background:
                  "linear-gradient(135deg, var(--neon-cyan), var(--neon-pink))",
                border: "2px solid var(--neon-cyan)",
                boxShadow: "var(--shadow-glow)",
              }}
            >
              <User size={20} />
            </div>
            <div className="flex-grow-1">
              <div
                style={{
                  color: "var(--text-primary)",
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                }}
              >
                {user.nombre || user.user}
              </div>
              <small
                style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}
              >
                {user.user}
              </small>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Nav className="flex-column flex-grow-1 p-3" style={{ gap: "0.5rem" }}>
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            onClick={onClose}
            end={item.path === "/dashboard"}  // Solo para el panel, usar coincidencia exacta
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-3 p-3 rounded ${isActive ? "active" : ""}`
            }
            style={({ isActive }) => ({
              color: isActive ? item.color : "var(--text-secondary)",
              background: isActive ? "var(--bg-hover)" : "transparent",
              border: isActive
                ? `2px solid ${item.color}`
                : "2px solid transparent",
              transition: "all 0.3s ease",
              textDecoration: "none",
              fontWeight: isActive ? "700" : "500",
              textTransform: "uppercase",
              fontSize: "0.85rem",
              letterSpacing: "1px",
            })}
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </Nav>

      {/* Chat Button */}
      <div
        className="p-3 border-top"
        style={{ borderColor: "var(--border-color)" }}
      >
        <Button
          variant="outline-primary"
          className="w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={toggleChat}
          style={{
            borderColor: "var(--neon-green)",
            color: "var(--neon-green)",
            fontWeight: "bold",
            textTransform: "uppercase",
            fontSize: "0.85rem",
            padding: "0.75rem",
          }}
        >
          <MessageSquare size={20} />
          Asistente AI
        </Button>
      </div>

      {/* Logout */}
      <div
        className="p-3 border-top"
        style={{ borderColor: "var(--border-color)" }}
      >
        <Button
          variant="outline-danger"
          className="w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={handleLogout}
          style={{
            borderColor: "var(--neon-pink)",
            color: "var(--neon-pink)",
            fontWeight: "bold",
            textTransform: "uppercase",
            fontSize: "0.85rem",
          }}
        >
          <LogOut size={20} />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );

  return (
    <Container fluid className="p-0 min-vh-100">
      <Row className="g-0 min-vh-100">
        {/* Desktop Sidebar */}
        <Col
          md={3}
          lg={2}
          className="d-none d-md-block"
          style={{
            background: "linear-gradient(180deg, #1a1a3e 0%, #2a1a4e 100%)",
          }}
        >
          <SidebarContent onClose={() => {}} />
        </Col>

        {/* Mobile Sidebar */}
        <Offcanvas
          show={showSidebar}
          onHide={toggleSidebar}
          placement="start"
          style={{
            background: "linear-gradient(180deg, #1a1a3e 0%, #2a1a4e 100%)",
            width: "280px",
          }}
        >
          <Offcanvas.Body className="p-0">
            <SidebarContent onClose={toggleSidebar} />
          </Offcanvas.Body>
        </Offcanvas>

        {/* Main Content */}
        <Col
          md={9}
          lg={10}
          style={{
            background:
              "linear-gradient(135deg, #0a0a1f 0%, #1a0a2e 25%, #2a1050 50%, #1a0a2e 75%, #0f0a1a 100%)",
          }}
        >
          {/* Top Navbar */}
          <Navbar
            className="border-bottom px-3 py-2"
            style={{
              background: "linear-gradient(180deg, #1a1a3e 0%, #2a1a4e 100%)",
              borderColor: "var(--border-color)",
            }}
          >
            <Button
              variant="outline"
              className="d-md-none me-2"
              onClick={toggleSidebar}
              style={{
                border: "2px solid var(--neon-cyan)",
                color: "var(--neon-cyan)",
              }}
            >
              <Menu size={24} />
            </Button>

            <Navbar.Brand className="d-flex align-items-center gap-2 mb-0" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
              <div className="d-md-none">
                <Logo size={32} showText={false} />
              </div>
              <h3
                className="mb-0"
                style={{
                  color: "var(--neon-cyan)",
                  fontSize: "1.2rem",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Dashboard
              </h3>
            </Navbar.Brand>

            <div className="ms-auto d-flex align-items-center gap-2">
              <Button
                variant="outline-success"
                size="sm"
                className="d-none d-md-inline-flex align-items-center gap-2"
                onClick={toggleChat}
                style={{
                  borderColor: "var(--neon-green)",
                  color: "var(--neon-green)",
                  textTransform: "uppercase",
                  fontSize: "0.75rem",
                  padding: "0.5rem 1rem",
                }}
              >
                <MessageSquare size={16} />
                Chat AI
              </Button>

              {user && (
                <div className="d-none d-md-flex align-items-center gap-2 px-3">
                  <div className="text-end">
                    <div
                      style={{
                        color: "var(--text-primary)",
                        fontSize: "0.85rem",
                        fontWeight: "bold",
                      }}
                    >
                      {user.nombre || user.user}
                    </div>
                    <small
                      style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}
                    >
                      Online
                    </small>
                  </div>
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle"
                    style={{
                      width: "36px",
                      height: "36px",
                      background:
                        "linear-gradient(135deg, var(--neon-cyan), var(--neon-pink))",
                      border: "2px solid var(--neon-cyan)",
                    }}
                  >
                    <User size={18} />
                  </div>
                </div>
              )}
            </div>
          </Navbar>

          {/* Content Area */}
          <div className="p-3 p-md-4">
            <Outlet context={{ showChat, setShowChat }} />
          </div>
        </Col>
      </Row>

      {/* AI Chat Modal */}
      <AIChat show={showChat} onHide={() => setShowChat(false)} />
    </Container>
  );
};

export default Dashboard;
