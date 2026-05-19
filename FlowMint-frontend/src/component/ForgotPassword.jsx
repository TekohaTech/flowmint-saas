import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authAPI } from "../services/api";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import "../index.css";
import { Logo } from "./VisualAssets";

const ForgotPassword = () => {
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await authAPI.forgotPassword(correo);
      setSuccess(result.message);
      setCorreo("");
    } catch (err) {
      setError(err.response?.data?.message || "Error al procesar la solicitud");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3" style={{ background: "var(--bg-dark)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card p-4 shadow-lg border-0"
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "var(--bg-card)",
          borderRadius: "12px",
        }}
      >
        <div className="text-center mb-4">
          <Logo />
          <h4 className="text-light fw-bold mt-3" style={{ color: "var(--neon-cyan)" }}>
            Recuperar contraseña
          </h4>
          <p className="text-light opacity-75 small">
            Ingresá tu correo y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="alert alert-danger mb-3 py-2 small d-flex align-items-center"
          >
            <AlertCircle size={16} className="me-2" />
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="alert alert-success mb-3 py-2 small d-flex align-items-center"
          >
            <CheckCircle size={16} className="me-2" />
            {success}
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-light small mb-1">Correo electrónico</label>
            <div className="position-relative">
              <span className="position-absolute start-0 top-50 translate-middle-y ps-3 text-light opacity-75">
                <Mail size={18} />
              </span>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="tu@email.com"
                required
                className="form-control bg-dark text-white border-secondary ps-5 py-2"
                style={{ borderRadius: "8px" }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 py-2 fw-bold shadow-glow"
            disabled={loading}
            style={{ borderRadius: "8px" }}
          >
            {loading ? (
              <span className="d-flex align-items-center justify-content-center gap-2">
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Enviando...
              </span>
            ) : (
              "Enviar enlace de recuperación"
            )}
          </button>
        </form>

        <div className="text-center mt-4 pt-3 border-top border-secondary">
          <Link to="/login" className="text-decoration-none d-flex align-items-center justify-content-center gap-1" style={{ color: "var(--neon-cyan)" }}>
            <ArrowLeft size={16} />
            Volver al inicio de sesión
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
