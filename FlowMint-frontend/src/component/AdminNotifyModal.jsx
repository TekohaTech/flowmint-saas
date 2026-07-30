import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { Send } from 'lucide-react';
import { notificationsAPI, usersAPI } from '../services/api';

const AdminNotifyModal = ({ show, onHide }) => {
  const [titulo, setTitulo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipo, setTipo] = useState('info');
  const [targetAll, setTargetAll] = useState(true);
  const [targetUserId, setTargetUserId] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (show) {
      // Reset form when modal opens
      setTitulo('');
      setMensaje('');
      setTipo('info');
      setTargetAll(true);
      setTargetUserId('');
      setError('');
      setSuccess('');
      setLoading(false);
      fetchUsers();
    }
  }, [show]);

  const fetchUsers = async () => {
    try {
      const data = await usersAPI.getAll();
      // Handle both array and paginated responses
      const userList = Array.isArray(data) ? data : (data?.data || data?.usuarios || []);
      setUsers(userList);
    } catch (err) {
      console.error('Error fetching users:', err);
      // Don't block the modal — grupal mode still works without users list
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!titulo.trim() || !mensaje.trim()) {
      setError('El título y el mensaje son obligatorios');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        titulo: titulo.trim(),
        mensaje: mensaje.trim(),
        tipo,
      };

      if (targetAll) {
        payload.target_all = true;
      } else {
        if (!targetUserId) {
          setError('Seleccioná un usuario destinatario');
          setLoading(false);
          return;
        }
        payload.target_user_id = parseInt(targetUserId, 10);
      }

      const data = await notificationsAPI.create(payload);
      setSuccess(`Notificación enviada a ${data.count} usuario(s)`);

      // Reset form but keep modal open briefly to show success
      setTitulo('');
      setMensaje('');
      setTipo('info');
      setTargetAll(true);
      setTargetUserId('');

      setTimeout(() => {
        setSuccess('');
        onHide();
      }, 1500);
    } catch (err) {
      console.error('[AdminNotify] Error:', err);
      const msg = err.response?.data?.message;
      setError(Array.isArray(msg) ? msg.join(', ') : (msg || 'Error al enviar notificación'));
    } finally {
      setLoading(false);
    }
  };

  const getTipoColor = (t) => {
    switch (t) {
      case 'warning': return '#ffd60a';
      case 'alert': return '#ff006e';
      default: return '#00f3ff';
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      keyboard={true}
      dialogClassName="modal-dialog-centered"
      contentClassName="notify-modal-content"
    >
      <Modal.Header
        closeButton
        style={{
          background: 'var(--bg-card, #1a1a3e)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <Modal.Title style={{ color: 'var(--text-primary)' }}>
          <Send size={18} className="me-2" style={{ color: '#00f3ff' }} />
          Enviar Notificación
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ background: 'var(--bg-card, #1a1a3e)' }}>
        {error && (
          <Alert variant="danger" style={{ background: 'rgba(255,0,110,0.1)', border: '1px solid #ff006e', color: '#ff006e' }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="success" style={{ background: 'rgba(22,242,179,0.1)', border: '1px solid #16f2b3', color: '#16f2b3' }}>
            {success}
          </Alert>
        )}

        <Form onSubmit={handleSubmit} noValidate>
          <Form.Group className="mb-3">
            <Form.Label style={{ color: 'var(--text-primary)' }}>Tipo</Form.Label>
            <div className="d-flex gap-3">
              {['info', 'warning', 'alert'].map((t) => (
                <Form.Check
                  key={t}
                  type="radio"
                  id={`tipo-${t}`}
                  label={
                    <span style={{ color: getTipoColor(t), textTransform: 'capitalize' }}>
                      {t}
                    </span>
                  }
                  checked={tipo === t}
                  onChange={() => setTipo(t)}
                />
              ))}
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: 'var(--text-primary)' }}>Título</Form.Label>
            <Form.Control
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título de la notificación"
              required
              maxLength={200}
              style={{
                background: 'var(--bg-tertiary, #2a1a4e)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: 'var(--text-primary)' }}>Mensaje</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="Detalle del mensaje..."
              required
              maxLength={500}
              style={{
                background: 'var(--bg-tertiary, #2a1a4e)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
              }}
            />
            <small style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
              {mensaje.length}/500
            </small>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label style={{ color: 'var(--text-primary)' }}>Destinatario</Form.Label>
            <Form.Check
              type="checkbox"
              id="target-all"
              label={<span style={{ color: 'var(--text-primary)' }}>Todos los usuarios activos</span>}
              checked={targetAll}
              onChange={(e) => setTargetAll(e.target.checked)}
              className="mb-2"
            />
            {!targetAll && (
              <Form.Select
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                required
                style={{
                  background: 'var(--bg-tertiary, #2a1a4e)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)',
                }}
              >
                <option value="">Seleccionar usuario...</option>
                {users.map((u) => (
                  <option key={u.usuario_id} value={u.usuario_id}>
                    {u.nombre} {u.apellido} ({u.user})
                  </option>
                ))}
              </Form.Select>
            )}
          </Form.Group>

          <div className="d-flex gap-2 justify-content-end">
            <Button
              variant="secondary"
              onClick={onHide}
              style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !titulo.trim() || !mensaje.trim()}
              style={{
                background: '#00f3ff',
                border: 'none',
                color: 'black',
                fontWeight: 'bold',
              }}
            >
              {loading ? 'Enviando...' : 'Enviar Notificación'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AdminNotifyModal;
