import React from "react";
import { Nav, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import {
  User,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { Logo } from "./VisualAssets";

function Sidebar({ user, menuItems, onChatToggle, onLogout, onClose }) {
  const navigate = useNavigate();

  return (
    <div className="sidebar h-100 d-flex flex-column">
      <div className="sidebar-logo p-4 border-bottom d-flex flex-column align-items-center">
        <div onClick={() => navigate("/dashboard")} className="sidebar-logo-click">
          <Logo size={60} />
        </div>
        <small className="mt-2 text-muted" style={{ fontSize: "0.75rem" }}>
          v1.0.0
        </small>
      </div>

      {user && (
        <div className="sidebar-user p-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <div className="sidebar-user-avatar d-flex align-items-center justify-content-center rounded-circle">
              <User size={20} />
            </div>
            <div className="flex-grow-1">
              <div className="sidebar-user-name">
                {user.nombre || user.user}
              </div>
              <small className="sidebar-user-username">
                {user.user}
              </small>
            </div>
          </div>
        </div>
      )}

      <Nav className="flex-column flex-grow-1 p-3" style={{ gap: "0.5rem" }}>
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            onClick={onClose}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-3 p-3 rounded sidebar-nav-link ${isActive ? "active" : ""}`
            }
            style={({ isActive }) => ({
              color: isActive ? item.color : "var(--text-secondary)",
              background: isActive ? "var(--bg-hover)" : "transparent",
              border: isActive
                ? `2px solid ${item.color}`
                : "2px solid transparent",
              textDecoration: "none",
              fontWeight: isActive ? "700" : "500",
            })}
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </Nav>

      <div className="p-3 border-top">
        <Button
          variant="outline-primary"
          className="sidebar-chat-btn w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={onChatToggle}
        >
          <MessageSquare size={20} />
          Asistente AI
        </Button>
      </div>

      <div className="p-3 border-top">
        <Button
          variant="outline-danger"
          className="sidebar-logout w-100 d-flex align-items-center justify-content-center gap-2"
          onClick={onLogout}
        >
          <LogOut size={20} />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
