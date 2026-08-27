import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Navbar,
  Button,
  Offcanvas,
} from "react-bootstrap";
import { Outlet, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import {
  Calendar,
  Users,
  Briefcase,
  Scissors,
  DollarSign,
  User,
  Menu,
  Zap,
  Store,
  Send,
} from "lucide-react";
import AIChat from "./AIChat";
import Sidebar from "./Sidebar";
import NotificationsDropdown from "./NotificationsDropdown";
import AdminNotifyModal from "./AdminNotifyModal";
import { Logo } from "./VisualAssets";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);

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

  let menuItems;
  if (user?.rol === 'SUPERADMIN') {
    menuItems = [
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
    ];
  } else if (user?.rol === 'DUENO') {
    menuItems = [
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
  } else {
    // EMPLEADO — operate the business without structural privileges
    menuItems = [
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
        path: "/dashboard/servicios",
        icon: Scissors,
        label: "Servicios",
        color: "var(--neon-pink)",
      },
      {
        path: "/dashboard/ganancias",
        icon: DollarSign,
        label: "Ganancias",
        color: "var(--neon-orange)",
      },
    ];
  }

  const sidebarProps = {
    user,
    menuItems,
    onChatToggle: toggleChat,
    onLogout: handleLogout,
  };

  return (
    <Container fluid className="p-0 min-vh-100">
      <Row className="g-0 min-vh-100">
        <Col
          md={3}
          lg={2}
          className="d-none d-md-block sidebar-bg"
        >
          <Sidebar {...sidebarProps} onClose={() => {}} />
        </Col>

        <Offcanvas
          show={showSidebar}
          onHide={toggleSidebar}
          placement="start"
          className="sidebar-bg"
          style={{ width: "280px" }}
        >
          <Offcanvas.Body className="p-0">
            <Sidebar {...sidebarProps} onClose={toggleSidebar} />
          </Offcanvas.Body>
        </Offcanvas>

        <Col
          md={9}
          lg={10}
          className="main-content-bg"
        >
          <Navbar
            className="border-bottom px-2 px-sm-3 py-2"
            style={{
              background: "linear-gradient(180deg, #1a1a3e 0%, #2a1a4e 100%)",
              borderColor: "var(--border-color)",
            }}
          >
            <Button
              variant="outline"
              className="navbar-hamburger me-2"
              onClick={toggleSidebar}
            >
              <Menu size={20} />
            </Button>

            <Navbar.Brand
              className="d-flex align-items-center gap-2 mb-0"
              onClick={() => navigate("/dashboard")}
              style={{ cursor: "pointer" }}
            >
              <Logo size={28} showText={false} />
              <h3
                className="mb-0 navbar-brand-text"
                style={{
                  color: "var(--neon-cyan)",
                  fontSize: "1.1rem",
                  textTransform: "uppercase",
                  letterSpacing: "2px",
                }}
              >
                Dashboard
              </h3>
            </Navbar.Brand>

            <div className="ms-auto d-flex align-items-center navbar-actions">
              {user?.rol === "SUPERADMIN" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="navbar-action-btn"
                  onClick={() => setShowNotifyModal(true)}
                  title="Enviar notificación"
                >
                  <Send size={14} />
                  <span className="navbar-action-label">Notificar</span>
                </Button>
              )}

              <NotificationsDropdown />

              <Button
                variant="outline-success"
                size="sm"
                className="navbar-action-btn"
                onClick={toggleChat}
                title="Chat AI"
              >
                <Zap size={14} />
                <span className="navbar-action-label">Chat AI</span>
              </Button>

              {user && (
                <div className="d-flex align-items-center gap-2 navbar-user">
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
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.7rem",
                      }}
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

              {/* Mobile compact user avatar */}
              {user && (
                <div
                  className="navbar-user-mobile d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "32px",
                    height: "32px",
                    background:
                      "linear-gradient(135deg, var(--neon-cyan), var(--neon-pink))",
                    border: "2px solid var(--neon-cyan)",
                  }}
                >
                  <User size={16} />
                </div>
              )}
            </div>
          </Navbar>

          <div className="p-3 p-md-4">
            <Outlet context={{ showChat, setShowChat }} />
          </div>
        </Col>
      </Row>

      <AIChat show={showChat} onHide={() => setShowChat(false)} />
      <AdminNotifyModal show={showNotifyModal} onHide={() => setShowNotifyModal(false)} />
    </Container>
  );
};

export default Dashboard;
