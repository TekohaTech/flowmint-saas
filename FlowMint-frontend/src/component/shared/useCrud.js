import { useState, useEffect } from "react";

const useCrud = ({ api, entityName, fields, idKey, onBeforeSubmit, transformSubmit }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState(() =>
    fields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {}),
  );

  const emptyFormData = fields.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {});

  const loadItems = async () => {
    try {
      setLoading(true);
      const data = await api.getAll();
      setItems(data);
      setError("");
    } catch (err) {
      setError(
        `Error al cargar ${entityName.toLowerCase()}s. Por favor, inténtalo de nuevo.`,
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleShowModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData(
        fields.reduce((acc, f) => ({
          ...acc,
          [f.name]: item[f.name] != null ? String(item[f.name]) : "",
        }), {}),
      );
    } else {
      setEditingItem(null);
      setFormData(emptyFormData);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData(emptyFormData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Auto-filter numeric fields: only allow digits
    const field = fields.find((f) => f.name === name);
    const isNumeric = field && (field.type === "number" || field.numeric);
    const cleaned = isNumeric ? value.replace(/[^0-9]/g, "") : value;
    setFormData((prev) => ({ ...prev, [name]: cleaned }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (onBeforeSubmit) {
      const valid = onBeforeSubmit(formData, setError);
      if (!valid) return;
    }

    try {
      const submitData = transformSubmit ? transformSubmit(formData) : formData;
      if (editingItem) {
        await api.update(editingItem[idKey], submitData);
        setSuccess(`¡${entityName} actualizado exitosamente!`);
      } else {
        await api.create(submitData);
        setSuccess(`¡${entityName} creado exitosamente!`);
      }
      handleCloseModal();
      loadItems();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Error al guardar ${entityName.toLowerCase()}. Por favor, inténtalo de nuevo.`,
      );
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        `¿Estás seguro de que deseas eliminar este ${entityName.toLowerCase()}?`,
      )
    ) {
      try {
        await api.delete(id);
        setSuccess(`¡${entityName} eliminado exitosamente!`);
        loadItems();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(
          `Error al eliminar ${entityName.toLowerCase()}. Por favor, inténtalo de nuevo.`,
        );
      }
    }
  };

  return {
    items,
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
    setFormData,
    loadItems,
    handleShowModal,
    handleCloseModal,
    handleChange,
    handleSubmit,
    handleDelete,
  };
};

export default useCrud;
