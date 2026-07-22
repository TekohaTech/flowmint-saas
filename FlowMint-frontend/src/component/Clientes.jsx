import React from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Form,
  Alert,
  Badge,
} from "react-bootstrap";
import { clientsAPI } from "../services/api";
import { Users, Mail, Phone, Edit, Trash2 } from "lucide-react";
import useCrud from "./shared/useCrud";
import SearchBar from "./shared/SearchBar";
import CrudModal from "./shared/CrudModal";
import EmptyState from "./shared/EmptyState";

const Clientes = () => {
  const {
    items: clients,
    loading,
    error,
    setError,
    success,
    setSuccess,
    showModal,
    editingItem,
    searchTerm,
    setSearchTerm,
    formData,
    handleChange,
    handleShowModal,
    handleSubmit,
    handleDelete,
  } = useCrud({
    api: clientsAPI,
    entityName: "Cliente",
    fields: [
      { name: "nombre", label: "Nombre", type: "text", required: true },
      { name: "apellido", label: "Apellido", type: "text", required: true },
      { name: "telefono", label: "Teléfono", type: "tel", required: false },
      { name: "email", label: "Email", type: "email", required: false },
    ],
    idKey: "cliente_id",
  });

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
              <h2
                className="text-center"
                style={{
                  color: "white",
                  textShadow: "0 0 10px rgba(22, 242, 179, 0.3)",
                  marginBottom: "0",
                }}
              >
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

      {/* Search Bar */}
      <SearchBar
        placeholder="Buscar clientes por nombre, email o teléfono..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAdd={() => handleShowModal()}
        addLabel="Agregar Cliente"
      />

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
              <EmptyState
                IconComponent={Users}
                entityName="Cliente"
                searchTerm={searchTerm}
                onAdd={() => handleShowModal()}
                addLabel="Agregar Primer Cliente"
              />
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
      <CrudModal
        show={showModal}
        onHide={handleCloseModal}
        entityName="CLIENTE"
        editingItem={editingItem}
        onSubmit={handleSubmit}
        accentColor="var(--neon-green)"
      >
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
      </CrudModal>
    </Container>
  );
};

export default Clientes;
