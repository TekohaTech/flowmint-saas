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
import { employeesAPI } from "../services/api";
import { Briefcase, User, Edit, Trash2 } from "lucide-react";
import useCrud from "./shared/useCrud";
import SearchBar from "./shared/SearchBar";
import CrudModal from "./shared/CrudModal";
import EmptyState from "./shared/EmptyState";

const Empleados = () => {
  const {
    items: employees,
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
    api: employeesAPI,
    entityName: "Empleado",
    fields: [
      { name: "nombre", label: "Nombre", type: "text", required: true },
      { name: "apellido", label: "Apellido", type: "text", required: true },
      { name: "puesto", label: "Puesto", type: "text", required: false },
    ],
    idKey: "empleado_id",
  });

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
              <h2
                className="text-center"
                style={{
                  color: "white",
                  textShadow: "0 0 10px rgba(139, 92, 246, 0.3)",
                  marginBottom: "0",
                }}
              >
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

      {/* Search Bar */}
      <SearchBar
        placeholder="Buscar empleados por nombre o posición..."
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAdd={() => handleShowModal()}
        addLabel="Agregar Empleado"
      />

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
              <EmptyState
                IconComponent={Briefcase}
                entityName="Empleado"
                searchTerm={searchTerm}
                onAdd={() => handleShowModal()}
                addLabel="Agregar Primer Empleado"
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
              Mostrando {filteredEmployees.length} de {employees.length}{" "}
              empleados
            </small>
          </div>
        </Col>
      </Row>

      {/* Add/Edit Modal */}
      <CrudModal
        show={showModal}
        onHide={handleCloseModal}
        entityName="EMPLEADO"
        editingItem={editingItem}
        onSubmit={handleSubmit}
        accentColor="var(--neon-purple)"
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
      </CrudModal>
    </Container>
  );
};

export default Empleados;
