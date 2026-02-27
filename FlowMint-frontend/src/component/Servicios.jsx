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
import { servicesAPI } from "../services/api";
import {
  Scissors,
  Plus,
  Edit,
  Trash2,
  Search,
  DollarSign,
  Clock,
} from "lucide-react";

const Servicios = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    duracion: "",
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await servicesAPI.getAll();
      setServices(data);
      setError("");
    } catch (err) {
      setError("Error al cargar servicios. Por favor, inténtalo de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        nombre: service.nombre,
        descripcion: service.descripcion || "",
        precio: service.precio.toString(),
        duracion: service.duracion.toString(),
      });
    } else {
      setEditingService(null);
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        duracion: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      duracion: "",
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

    // Validation
    if (parseFloat(formData.precio) <= 0) {
      setError("El precio debe ser mayor a 0");
      return;
    }

    if (parseInt(formData.duracion) <= 0) {
      setError("La duración debe ser mayor a 0");
      return;
    }

    try {
      const serviceData = {
        ...formData,
        precio: parseFloat(formData.precio),
        duracion: parseInt(formData.duracion),
      };

      if (editingService) {
        await servicesAPI.update(editingService.servicio_id, serviceData);
        setSuccess("¡Servicio actualizado exitosamente!");
      } else {
        await servicesAPI.create(serviceData);
        setSuccess("¡Servicio creado exitosamente!");
      }
      handleCloseModal();
      loadServices();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error al guardar servicio. Por favor, inténtalo de nuevo.",
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
      try {
        await servicesAPI.delete(id);
        setSuccess("¡Servicio eliminado exitosamente!");
        loadServices();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError("Error al eliminar servicio. Por favor, inténtalo de nuevo.");
      }
    }
  };

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
              <h2 className="text-center" style={{ color: 'white', textShadow: '0 0 10px rgba(255, 0, 110, 0.3)', marginBottom: "0" }}>
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
              placeholder="Buscar servicios por nombre o descripción..."
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
            Agregar Servicio
          </Button>
        </Col>
      </Row>

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
              <div className="text-center p-5">
                <Scissors
                  size={64}
                  style={{ color: "var(--text-muted)", opacity: 0.3 }}
                  className="mb-3"
                />
                <h4 style={{ color: "var(--text-muted)" }}>
                  No se encontraron servicios
                </h4>
                <p style={{ color: "var(--text-muted)" }}>
                  {searchTerm
                    ? "Intenta ajustar tu búsqueda"
                    : "Comienza agregando tu primer servicio"}
                </p>
                {!searchTerm && (
                  <Button
                    variant="primary"
                    onClick={() => handleShowModal()}
                    className="mt-3"
                  >
                    <Plus size={20} className="me-2" />
                    Agregar Primer Servicio
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
          <Modal.Title style={{ color: "var(--neon-pink)" }}>
            {editingService ? "EDITAR SERVICIO" : "NUEVO SERVICIO"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: "var(--bg-card)" }}>
          <Form onSubmit={handleSubmit}>
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
                {editingService ? "Actualizar Servicio" : "Crear Servicio"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Servicios;
