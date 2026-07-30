import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bell, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { notificationsAPI } from '../services/api';

const MAX_MESSAGE_LINES = 2;

const NotificationsDropdown = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0 });
  const [expandedIds, setExpandedIds] = useState(new Set());
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current && !containerRef.current.contains(e.target) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setDropdownPos({ top: rect.bottom + 4 });
  }, []);

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition, true);
      return () => {
        window.removeEventListener('resize', updatePosition);
        window.removeEventListener('scroll', updatePosition, true);
      };
    }
  }, [isOpen, updatePosition]);

  const fetchUnreadCount = async () => {
    try {
      const data = await notificationsAPI.getUnreadCount();
      setUnreadCount(data.count);
    } catch (err) {
      console.error('Error fetching unread count:', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const data = await notificationsAPI.getMine();
      setNotifications(data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const handleToggle = () => {
    if (!isOpen) fetchNotifications();
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsAPI.markRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.notificacion_id === id ? { ...n, leido: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const getIcon = (tipo) => {
    switch (tipo) {
      case 'warning':
        return <AlertTriangle size={18} style={{ color: '#ffd60a', flexShrink: 0 }} />;
      case 'alert':
        return <AlertCircle size={18} style={{ color: '#ff006e', flexShrink: 0 }} />;
      default:
        return <Info size={18} style={{ color: '#00f3ff', flexShrink: 0 }} />;
    }
  };

  const truncate = (text, max) =>
    text.length > max ? text.substring(0, max) + '...' : text;

  const toggleExpand = (id, e) => {
    e.stopPropagation();
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="position-relative" ref={containerRef}>
      <button
        className="btn position-relative"
        onClick={handleToggle}
        style={{ border: 'none', color: 'var(--text-secondary)', background: 'transparent', minWidth: '40px', minHeight: '40px' }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            className="position-absolute rounded-pill d-flex align-items-center justify-content-center"
            style={{
              top: '2px',
              right: '2px',
              minWidth: '18px',
              height: '18px',
              fontSize: '0.6rem',
              fontWeight: 'bold',
              background: '#ff006e',
              color: 'white',
              lineHeight: 1,
              padding: '0 4px',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="dropdown-menu show"
          style={{
            position: 'fixed',
            top: dropdownPos.top,
            left: '8px',
            right: '8px',
            width: 'auto',
            maxHeight: 'min(400px, calc(100vh - 80px))',
            overflowY: 'auto',
            background: 'var(--bg-card, #1a1a3e)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            zIndex: 1060,
          }}
        >
          <div
            className="d-flex justify-content-between align-items-center px-3 py-2"
            style={{ borderBottom: '1px solid var(--border-color)' }}
          >
            <span className="fw-bold" style={{ color: 'var(--text-primary)' }}>
              Notificaciones
            </span>
            {unreadCount > 0 && (
              <small style={{ color: 'var(--text-muted)' }}>
                {unreadCount} sin leer
              </small>
            )}
          </div>

          {notifications.length === 0 ? (
            <div
              className="text-center py-4"
              style={{ color: 'var(--text-muted)' }}
            >
              No hay notificaciones
            </div>
          ) : (
            <div style={{ maxHeight: 'min(290px, calc(100vh - 160px))', overflowY: 'auto' }}>
              {notifications.slice(0, 20).map((notif) => (
              <div
                key={notif.notificacion_id}
                className="d-flex gap-2 px-3 py-2"
                onClick={() => !notif.leido && handleMarkAsRead(notif.notificacion_id)}
                style={{
                  cursor: 'pointer',
                  background: !notif.leido ? 'rgba(0,243,255,0.05)' : 'transparent',
                  borderBottom: '1px solid var(--border-color)',
                  minHeight: '48px',
                }}
              >
                {getIcon(notif.tipo)}
                <div className="flex-grow-1" style={{ minWidth: 0 }}>
                  <div className="d-flex justify-content-between align-items-start">
                    <span
                      className="fw-bold"
                      style={{
                        fontSize: '0.85rem',
                        color: !notif.leido ? 'var(--text-primary)' : 'var(--text-muted)',
                      }}
                    >
                      {notif.titulo}
                    </span>
                    {!notif.leido && (
                      <span
                        className="badge"
                        style={{ fontSize: '0.6rem', background: '#00f3ff', color: 'black' }}
                      >
                        Nuevo
                      </span>
                    )}
                  </div>
                  <small style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    {notif.mensaje.length > 80 && !expandedIds.has(notif.notificacion_id) ? (
                      <>
                        <span style={{ display: '-webkit-box', WebkitLineClamp: MAX_MESSAGE_LINES, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {notif.mensaje}
                        </span>
                        <span
                          onClick={(e) => toggleExpand(notif.notificacion_id, e)}
                          style={{ color: 'var(--neon-cyan)', cursor: 'pointer', fontWeight: 500 }}
                        >
                          Ver más
                        </span>
                      </>
                    ) : (
                      <>
                        {notif.mensaje}
                        {notif.mensaje.length > 80 && (
                          <span
                            onClick={(e) => toggleExpand(notif.notificacion_id, e)}
                            style={{ color: 'var(--neon-cyan)', cursor: 'pointer', fontWeight: 500, marginLeft: '4px' }}
                          >
                            Ver menos
                          </span>
                        )}
                      </>
                    )}
                  </small>
                </div>
              </div>
            ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
