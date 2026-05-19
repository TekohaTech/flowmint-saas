import React, { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import "../index.css";
import { Logo } from "./VisualAssets";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [pass, setPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Enlace de recuperación inválido o expirado.");
      return;
    }

    if (pass !== confirmPass) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (pass.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    if (!/[A-Z]/.test(pass) || !/\d/.test(pass)) {
      setError("La contraseña debe tener al menos una mayúscula y un número.");
      return;
    }

    setLoading(true);

    try {
      const result = await authAPI.resetPassword(token, pass);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Error al restablecer la contraseña");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center p-3" style={{ background: "var(--bg-dark)" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4 shadow-lg border-0 text-center"
          style={{ width: "100%", maxWidth: "420px", background: "var(--bg-card)", borderRadius: "12px" }}
        >
          <AlertCircle size={48} className="text-danger mb-3" />
          <h5 className="text-light fw-bold">Enlace inválido</h5>
          <p className="text-light opacity-75 small mb-4">
            El enlace de recuperación es inválido o ya expiró. Solicitá uno nuevo.
          </p>
          <Link to="/forgot-password" className="btn btn-primary w-100 py-2 fw-bold shadow-glow" style={{ borderRadius: "8px" }}>
            Solicitar nuevo enlace
          </Link>
        </motion.div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center p-3" style={{ background: "var(--bg-dark)" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4 shadow-lg border-0 text-center"
          style={{ width: "100%", maxWidth: "420px", background: "var(--bg-card)", borderRadius: "12px" }}
        >
          <CheckCircle size={48} className="text-success mb-3" />
          <h5 className="text-light fw-bold">Contraseña actualizada</h5>
          <p className="text-light opacity-75 small mb-4">
            Tu contraseña se actualizó correctamente. Redirigiendo al inicio de sesión...
          </p>
          <Link to="/login" className="btn btn-primary w-100 py-2 fw-bold shadow-glow" style={{ borderRadius: "8px" }}>
            Ir al inicio de sesión
          </Link>
        </motion.div>
      </div>
    );
  }

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
            Nueva contraseña
          </h4>
          <p className="text-light opacity-75 small">
            Ingresá tu nueva contraseña.
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

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="text-light small mb-1">Nueva contraseña</label>
            <div className="position-relative">
              <span className="position-absolute start-0 top-50 translate-middle-y ps-3 text-light opacity-75">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="••••••••"
                required
                className="form-control bg-dark text-white border-secondary ps-5 pe-5 py-2"
                style={{ borderRadius: "8px" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="position-absolute end-0 top-50 translate-middle-y bg-transparent border-0 text-neon-cyan pe-3"
                style={{ zIndex: 10, cursor: "pointer" }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-light small mb-1">Confirmar contraseña</label>
            <div className="position-relative">
              <span className="position-absolute start-0 top-50 translate-middle-y ps-3 text-light opacity-75">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="••••••••"
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
                Guardando...
              </span>
            ) : (
              "Restablecer contraseña"
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

export default ResetPassword;
