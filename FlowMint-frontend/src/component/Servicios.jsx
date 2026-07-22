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
  InputGroup,
} from "react-bootstrap";
import { servicesAPI } from "../services/api";
import { Scissors, DollarSign, Clock, Edit, Trash2 } from "lucide-react";
import useCrud from "./shared/useCrud";
import SearchBar from "./shared/SearchBar";
import CrudModal from "./shared/CrudModal";
import EmptyState from "./shared/EmptyState";

const Servicios = () => {
  const {
    items: services,
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
    handleCloseModal,
    handleSubmit,
    handleDelete,
  } = useCrud({
    api: servicesAPI,
    entityName: "Servicio",
    fields: [
      { name: "nombre", label: "Nombre del Servicio", type: "text", required: true },
      { name: "descripcion", label: "Descripción", type: "textarea", required: false },
      { name: "precio", label: "Precio", type: "number", required: true },
      { name: "duracion", label: "Duración", type: "number", required: true },
    ],
    idKey: "servicio_id",
    onBeforeSubmit: (data, setError) => {
      if (parseFloat(data.precio) <= 0) {
        setError("El precio debe ser mayor a 0");
        return false;
      }
      if (parseInt(data.duracion) <= 0) {
        setError("La duración debe ser mayor a 0");
        return false;
      }
      return true;
    },
    transformSubmit: (data) => ({
      ...data,
      precio: parseFloat(data.precio),
      duracion: parseInt(data.duracion),
    }),
  });

  const filteredServices = services.filter(
    (service) =>
      service.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (service.descripcion &&
        service.descripcion.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <Container fluid>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center gap-3 mb-3">
            <Scissors size={36} style={{ color: "var(--neon-pink)" }} />
            <div>
              <h2
                className="text-center"
                style={{
                  color: "white",
                  textShadow: "0 0 10px rgba(255, 0, 110, 0.3)",
                  marginBottom: "0",
                }}
              >
                SERVICIOS
              </h2>
              <small style={{ color: "var(--text-muted)" }}>
                Gestiona tu catálogo de servicios
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
        placeholder="Buscar servicios por nombre o descripción..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAdd={() => handleShowModal()}
        addLabel="Agregar Servicio"
      />

      {/* Services Table */}
      <Row>
        <Col>
          <div className="card">
            {loading ? (
              <div className="text-center p-5">
                <div className="spinner mx-auto mb-3"></div>
                <p style={{ color: "var(--text-muted)" }}>
                  Cargando servicios...
                </p>
              </div>
            ) : filteredServices.length === 0 ? (
              <EmptyState
                IconComponent={Scissors}
                entityName="Servicio"
                searchTerm={searchTerm}
                onAdd={() => handleShowModal()}
                addLabel="Agregar Primer Servicio"
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
                    <th style={{ color: "var(--neon-cyan)" }}>SERVICIO</th>
                    <th style={{ color: "var(--neon-cyan)" }}>PRECIO</th>
                    <th style={{ color: "var(--neon-cyan)" }}>DURACIÓN</th>
                    <th
                      style={{ color: "var(--neon-cyan)" }}
                      className="text-center"
                    >
                      ACCIONES
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service) => (
                    <tr key={service.servicio_id}>
                      <td>
                        <Badge bg="secondary" className="badge-primary">
                          #{service.servicio_id}
                        </Badge>
                      </td>
                      <td>
                        <div>
                          <strong style={{ color: "var(--text-primary)" }}>
                            {service.nombre}
                          </strong>
                          {service.descripcion && (
                            <div>
                              <small
                                style={{
                                  color: "var(--text-muted)",
                                  fontSize: "0.85rem",
                                }}
                              >
                                {service.descripcion}
                              </small>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <DollarSign
                            size={16}
                            style={{ color: "var(--neon-green)" }}
                          />
                          <span
                            style={{
                              color: "var(--neon-green)",
                              fontWeight: "bold",
                              fontSize: "1.1rem",
                            }}
                          >
                            ${service.precio.toFixed(2)}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Clock
                            size={16}
                            style={{ color: "var(--neon-cyan)" }}
                          />
                          <span style={{ color: "var(--text-secondary)" }}>
                            {service.duracion} min
                          </span>
                        </div>
                      </td>
                      <td className="text-center">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleShowModal(service)}
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
                          onClick={() => handleDelete(service.servicio_id)}
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
              Mostrando {filteredServices.length} de {services.length} servicios
            </small>
          </div>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <CrudModal
        show={showModal}
        onHide={handleCloseModal}
        entityName="SERVICIO"
        editingItem={editingItem}
        onSubmit={handleSubmit}
        accentColor="var(--neon-pink)"
      >
        <Form.Group className="mb-3">
          <Form.Label>Nombre del Servicio *</Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder="p. ej. Corte de pelo, Masaje, Consulta..."
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            placeholder="Describe el servicio (opcional)"
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Label>
                <DollarSign size={16} className="me-2" />
                Precio *
              </Form.Label>
              <InputGroup>
                <InputGroup.Text
                  style={{
                    background: "var(--bg-card)",
                    borderColor: "var(--border-color)",
                    color: "var(--neon-green)",
                  }}
                >
                  $
                </InputGroup.Text>
                <Form.Control
                  type="number"
                  step="0.01"
                  min="0.01"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                />
              </InputGroup>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-4">
              <Form.Label>
                <Clock size={16} className="me-2" />
                Duración *
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  min="1"
                  name="duracion"
                  value={formData.duracion}
                  onChange={handleChange}
                  required
                  placeholder="30"
                />
                <InputGroup.Text
                  style={{
                    background: "var(--bg-card)",
                    borderColor: "var(--border-color)",
                    color: "var(--text-secondary)",
                  }}
                >
                  min
                </InputGroup.Text>
              </InputGroup>
              <Form.Text style={{ color: "var(--text-muted)" }}>
                Duración del servicio en minutos
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
      </CrudModal>
    </Container>
  );
};

export default Servicios;
