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
import { employeesAPI } from "../services/api";
import { Briefcase, Plus, Edit, Trash2, Search, User } from "lucide-react";

const Empleados = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    puesto: "",
  });

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await employeesAPI.getAll();
      setEmployees(data);
      setError("");
    } catch (err) {
      setError("Error al cargar empleados. Por favor, inténtalo de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowModal = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        nombre: employee.nombre,
        apellido: employee.apellido,
        puesto: employee.puesto || "",
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        nombre: "",
        apellido: "",
        puesto: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
    setFormData({
      nombre: "",
      apellido: "",
      puesto: "",
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
      if (editingEmployee) {
        await employeesAPI.update(editingEmployee.empleado_id, formData);
        setSuccess("¡Empleado actualizado exitosamente!");
      } else {
        await employeesAPI.create(formData);
        setSuccess("¡Empleado creado exitosamente!");
      }
      handleCloseModal();
      loadEmployees();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error al guardar empleado. Por favor, inténtalo de nuevo.",
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este empleado?")) {
      try {
        await employeesAPI.delete(id);
        setSuccess("¡Empleado eliminado exitosamente!");
        loadEmployees();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError("Error al eliminar empleado. Por favor, inténtalo de nuevo.");
      }
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.puesto &&
        employee.puesto.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  return (
    <Container fluid>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center gap-3 mb-3">
            <Briefcase size={36} style={{ color: "var(--neon-purple)" }} />
            <div>
              <h2 className="text-center" style={{ color: 'white', textShadow: '0 0 10px rgba(139, 92, 246, 0.3)', marginBottom: "0" }}>
                EMPLEADOS
              </h2>
              <small style={{ color: "var(--text-muted)" }}>
                Gestiona a tus miembros del equipo
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
              placeholder="Buscar empleados por nombre o posición..."
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
            Agregar Empleado
          </Button>
        </Col>
      </Row>

      {/* Employees Table */}
      <Row>
        <Col>
          <div className="card">
            {loading ? (
              <div className="text-center p-5">
                <div className="spinner mx-auto mb-3"></div>
                <p style={{ color: "var(--text-muted)" }}>
                  Cargando empleados...
                </p>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="text-center p-5">
                <Briefcase
                  size={64}
                  style={{ color: "var(--text-muted)", opacity: 0.3 }}
                  className="mb-3"
                />
                <h4 style={{ color: "var(--text-muted)" }}>
                  No se encontraron empleados
                </h4>
                <p style={{ color: "var(--text-muted)" }}>
                  {searchTerm
                    ? "Intenta ajustar tu búsqueda"
                    : "Comienza agregando tu primer empleado"}
                </p>
                {!searchTerm && (
                  <Button
                    variant="primary"
                    onClick={() => handleShowModal()}
                    className="mt-3"
                  >
                    <Plus size={20} className="me-2" />
                    Agregar Primer Empleado
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
                    <th style={{ color: "var(--neon-cyan)" }}>POSICIÓN</th>
                    <th
                      style={{ color: "var(--neon-cyan)" }}
                      className="text-center"
                    >
                      ACCIONES
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.empleado_id}>
                      <td>
                        <Badge bg="secondary" className="badge-primary">
                          #{employee.empleado_id}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="d-flex align-items-center justify-content-center rounded-circle"
                            style={{
                              width: "36px",
                              height: "36px",
                              background:
                                "linear-gradient(135deg, var(--neon-purple), var(--neon-pink))",
                              border: "2px solid var(--neon-purple)",
                              flexShrink: 0,
                            }}
                          >
                            <User size={18} />
                          </div>
                          <strong style={{ color: "var(--text-primary)" }}>
                            {employee.nombre} {employee.apellido}
                          </strong>
                        </div>
                      </td>
                      <td>
                        {employee.puesto ? (
                          <Badge
                            bg="info"
                            style={{
                              background: "rgba(139, 92, 246, 0.2)",
                              border: "1px solid var(--neon-purple)",
                              color: "var(--neon-purple)",
                              padding: "0.5rem 1rem",
                              fontSize: "0.85rem",
                            }}
                          >
                            {employee.puesto}
                          </Badge>
                        ) : (
                          <small style={{ color: "var(--text-muted)" }}>
                            Sin posición asignada
                          </small>
                        )}
                      </td>
                      <td className="text-center">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleShowModal(employee)}
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
                          onClick={() => handleDelete(employee.empleado_id)}
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
              Mostrando {filteredEmployees.length} de {employees.length} empleados
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
          <Modal.Title style={{ color: "var(--neon-purple)" }}>
            {editingEmployee ? "EDITAR EMPLEADO" : "NUEVO EMPLEADO"}
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

            <Form.Group className="mb-4">
              <Form.Label>
                <Briefcase size={16} className="me-2" />
                Posición / Rol
              </Form.Label>
              <Form.Control
                type="text"
                name="puesto"
                value={formData.puesto}
                onChange={handleChange}
                placeholder="p. ej. Estilista Senior, Barbero, Colorista..."
              />
              <Form.Text style={{ color: "var(--text-muted)" }}>
                Opcional: Especifica el rol o posición del empleado
              </Form.Text>
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
                {editingEmployee ? "Actualizar Empleado" : "Crear Empleado"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Empleados;
