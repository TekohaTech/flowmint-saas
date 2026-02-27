import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Modal,
  Form,
  Alert,
  Badge,
  InputGroup,
} from "react-bootstrap";
import { clientsAPI } from "../services/api";
import { Users, Plus, Edit, Trash2, Search, Mail, Phone } from "lucide-react";

const Clientes = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientsAPI.getAll();
      setClients(data);
      setError("");
    } catch (err) {
      setError("Error al cargar clientes. Por favor, inténtalo de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (client = null) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        nombre: client.nombre,
        apellido: client.apellido,
        telefono: client.telefono || "",
        email: client.email || "",
      });
    } else {
      setEditingClient(null);
      setFormData({
        nombre: "",
        apellido: "",
        telefono: "",
        email: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingClient(null);
    setFormData({
      nombre: "",
      apellido: "",
      telefono: "",
      email: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingClient) {
        await clientsAPI.update(editingClient.cliente_id, formData);
        setSuccess("¡Cliente actualizado exitosamente!");
      } else {
        await clientsAPI.create(formData);
        setSuccess("¡Cliente creado exitosamente!");
      }
      handleCloseModal();
      loadClients();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error al guardar cliente. Por favor, inténtalo de nuevo.",
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
      try {
        await clientsAPI.delete(id);
        setSuccess("¡Cliente eliminado exitosamente!");
        loadClients();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError("Error al eliminar cliente. Por favor, inténtalo de nuevo.");
      }
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.email &&
        client.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (client.telefono && client.telefono.includes(searchTerm)),
  );

  return (
    <Container fluid>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center gap-3 mb-3">
            <Users size={36} style={{ color: "var(--neon-green)" }} />
            <div>
              <h2 className="text-center" style={{ color: 'white', textShadow: '0 0 10px rgba(22, 242, 179, 0.3)', marginBottom: "0" }}>
                CLIENTES
              </h2>
              <small style={{ color: "var(--text-muted)" }}>
                Gestiona tu base de datos de clientes
              </small>
            </div>
          </div>
        </Col>
      </Row>

      {/* Alerts */}
      {error && (
        <Alert
          variant="danger"
          dismissible
          onClose={() => setError("")}
          className="alert-error"
        >
          {error}
        </Alert>
      )}
      {success && (
        <Alert
          variant="success"
          dismissible
          onClose={() => setSuccess("")}
          className="alert-success"
        >
          {success}
        </Alert>
      )}

      {/* Actions Bar */}
      <Row className="mb-4">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border-color)",
                color: "var(--neon-cyan)",
              }}
            >
              <Search size={20} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar clientes por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: "var(--bg-card)",
                borderColor: "var(--border-color)",
                color: "var(--text-primary)",
              }}
            />
          </InputGroup>
        </Col>
        <Col md={4} className="text-end">
          <Button
            variant="success"
            onClick={() => handleShowModal()}
            className="btn-success"
            style={{ textTransform: "uppercase", fontWeight: "bold" }}
          >
            <Plus size={20} className="me-2" />
            Agregar Cliente
          </Button>
        </Col>
      </Row>

      {/* Clients Table */}
      <Row>
        <Col>
          <div className="card">
            {loading ? (
              <div className="text-center p-5">
                <div className="spinner mx-auto mb-3"></div>
                <p style={{ color: "var(--text-muted)" }}>Cargando clientes...</p>
              </div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center p-5">
                <Users
                  size={64}
                  style={{ color: "var(--text-muted)", opacity: 0.3 }}
                  className="mb-3"
                />
                <h4 style={{ color: "var(--text-muted)" }}>No se encontraron clientes</h4>
                <p style={{ color: "var(--text-muted)" }}>
                  {searchTerm
                    ? "Intenta ajustar tu búsqueda"
                    : "Comienza agregando tu primer cliente"}
                </p>
                {!searchTerm && (
                  <Button
                    variant="primary"
                    onClick={() => handleShowModal()}
                    className="mt-3"
                  >
                    <Plus size={20} className="me-2" />
                    Agregar Primer Cliente
                  </Button>
                )}
              </div>
            ) : (
              <Table
                responsive
                hover
                style={{ marginBottom: 0 }}
                className="table-dark"
              >
                <thead>
                  <tr>
                    <th style={{ color: "var(--neon-cyan)" }}>ID</th>
                    <th style={{ color: "var(--neon-cyan)" }}>NOMBRE</th>
                    <th style={{ color: "var(--neon-cyan)" }}>CONTACTO</th>
                    <th
                      style={{ color: "var(--neon-cyan)" }}
                      className="text-center"
                    >
                      ACCIONES
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client) => (
                    <tr key={client.cliente_id}>
                      <td>
                        <Badge bg="secondary" className="badge-primary">
                          #{client.cliente_id}
                        </Badge>
                      </td>
                      <td>
                        <div>
                          <strong style={{ color: "var(--text-primary)" }}>
                            {client.nombre} {client.apellido}
                          </strong>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-1">
                          {client.email && (
                            <small
                              className="d-flex align-items-center gap-2"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              <Mail
                                size={14}
                                style={{ color: "var(--neon-cyan)" }}
                              />
                              {client.email}
                            </small>
                          )}
                          {client.telefono && (
                            <small
                              className="d-flex align-items-center gap-2"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              <Phone
                                size={14}
                                style={{ color: "var(--neon-green)" }}
                              />
                              {client.telefono}
                            </small>
                          )}
                        </div>
                      </td>
                      <td className="text-center">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleShowModal(client)}
                          className="me-2"
                          style={{
                            borderColor: "var(--neon-yellow)",
                            color: "var(--neon-yellow)",
                          }}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(client.cliente_id)}
                          style={{
                            borderColor: "var(--neon-pink)",
                            color: "var(--neon-pink)",
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>

          {/* Stats */}
          <div className="mt-3 text-center">
            <small style={{ color: "var(--text-muted)" }}>
              Mostrando {filteredClients.length} de {clients.length} clientes
            </small>
          </div>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <Modal
        show={showModal}
        onHide={handleCloseModal}
        centered
        contentClassName="modal-content"
      >
        <Modal.Header
          closeButton
          style={{
            background: "var(--bg-card)",
            borderBottom: "2px solid var(--border-color)",
          }}
        >
          <Modal.Title style={{ color: "var(--neon-green)" }}>
            {editingClient ? "EDITAR CLIENTE" : "NUEVO CLIENTE"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: "var(--bg-card)" }}>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Ingresa tu nombre"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Apellido *</Form.Label>
                  <Form.Control
                    type="text"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleChange}
                    required
                    placeholder="Ingresa tu apellido"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>
                <Mail size={16} className="me-2" />
                Email
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="client@example.com"
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>
                <Phone size={16} className="me-2" />
                Phone
              </Form.Label>
              <Form.Control
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
              />
            </Form.Group>

            <div className="d-flex gap-2 justify-content-end">
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                style={{
                  borderColor: "var(--text-muted)",
                  color: "var(--text-muted)",
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" variant="success" className="btn-success">
                {editingClient ? "Actualizar Cliente" : "Crear Cliente"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Clientes;
