import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { authAPI } from "../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, User, AlertCircle, Eye, EyeOff, Key } from "lucide-react";
import { Logo } from "./VisualAssets";

const Login = () => {
  const [mode, setMode] = useState("login"); // "login" | "activar"
  const [credentials, setCredentials] = useState({ user: "", pass: "" });
  const [pinForm, setPinForm] = useState({ user: "", pin: "", pass: "", passConfirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showPinPassword, setShowPinPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 1. Manejar Datos de Google si vienen en la URL
    const params = new URLSearchParams(location.search);
    const userData = params.get('user');

    if (userData) {
      // El token ahora viaja en una cookie HttpOnly seteada por el backend
      localStorage.setItem('user', decodeURIComponent(userData));
      window.location.href = "/dashboard";
      return;
    }

    // 2. Check if already logged in
    if (authAPI.isAuthenticated()) {
      navigate("/dashboard");
    }
  }, [navigate, location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    setError("");
  };

  const handlePinChange = (e) => {
    const { name, value } = e.target;
    // For PIN field, only allow digits and max 6 chars
    if (name === "pin") {
      const digits = value.replace(/\D/g, "").slice(0, 6);
      setPinForm({ ...pinForm, [name]: digits });
    } else {
      setPinForm({ ...pinForm, [name]: value });
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authAPI.login(credentials);
      window.location.href = "/dashboard";
    } catch (err) {
      console.error('[Login] Error:', err);
      setError(
        err.response?.data?.message || "Credenciales invalidas. Por favor, intentalo de nuevo.",
      );
      setCredentials({ ...credentials, pass: "" });
    } finally {
      setLoading(false);
    }
  };

  const handleActivarPin = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords match
    if (pinForm.pass !== pinForm.passConfirm) {
      setError("Las contrasenas no coinciden.");
      return;
    }

    // Validate password strength: min 8, uppercase, number
    if (pinForm.pass.length < 8) {
      setError("La contrasena debe tener al menos 8 caracteres.");
      return;
    }
    if (!/[A-Z]/.test(pinForm.pass)) {
      setError("La contrasena debe incluir al menos una mayuscula.");
      return;
    }
    if (!/[0-9]/.test(pinForm.pass)) {
      setError("La contrasena debe incluir al menos un numero.");
      return;
    }

    setLoading(true);

    try {
      await authAPI.activarPin({
        user: pinForm.user,
        pin: pinForm.pin,
        pass: pinForm.pass,
      });
      window.location.href = "/dashboard";
    } catch (err) {
      console.error('[Activar PIN] Error:', err);
      setError(
        err.response?.data?.message || "Error al activar la cuenta. Verifica tus datos e intentalo de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  const switchToActivar = () => {
    setMode("activar");
    setError("");
  };

  const switchToLogin = () => {
    setMode("login");
    setError("");
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-3">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card shadow-lg"
        style={{ maxWidth: "450px", width: "100%", background: 'rgba(26, 26, 62, 0.95)', border: '1px solid var(--border-color)', borderRadius: '16px' }}
      >
        <div className="text-center mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="d-flex justify-content-center"
          >
            <Logo size={80} showText={false} />
          </motion.div>
          <h1 className="mt-3 mb-1 text-white">FlowMint</h1>
          <p style={{ color: "var(--text-secondary)" }}>Plataforma SaaS de Gestion de Negocios</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            id="login-error"
            role="alert"
            className="alert alert-danger mb-3 py-2 small d-flex align-items-center"
          >
            <AlertCircle size={16} className="me-2" />
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {mode === "login" ? (
            <motion.div
              key="login-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="d-flex align-items-center mb-4 text-light opacity-75">
                <hr className="flex-grow-1" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                <span className="px-3 small">O con usuario</span>
                <hr className="flex-grow-1" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="text-light small mb-1">Usuario</label>
                  <div className="position-relative">
                    <span className="position-absolute start-0 top-50 translate-middle-y ps-3 text-light opacity-75">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      name="user"
                      value={credentials.user}
                      onChange={handleChange}
                      placeholder="admin"
                      aria-label="Usuario"
                      aria-describedby={error ? "login-error" : undefined}
                      className="form-control bg-dark text-white border-secondary ps-5 py-2"
                      style={{ borderRadius: '8px' }}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-light small mb-1">Contrasena</label>
                  <div className="position-relative">
                    <span className="position-absolute start-0 top-50 translate-middle-y ps-3 text-light opacity-75">
                      <Lock size={18} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="pass"
                      value={credentials.pass}
                      onChange={handleChange}
                      placeholder="••••••••"
                      aria-label="Contrasena"
                      aria-describedby={error ? "login-error" : undefined}
                      className="form-control bg-dark text-white border-secondary ps-5 pe-5 py-2"
                      style={{ borderRadius: '8px' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                      className="position-absolute end-0 top-50 translate-middle-y bg-transparent border-0 text-neon-cyan pe-3"
                      style={{ zIndex: 10, cursor: 'pointer' }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-glow" disabled={loading} style={{ borderRadius: '8px' }}>
                  {loading ? (
                    <span className="d-flex align-items-center justify-content-center gap-2">
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Cargando...
                    </span>
                  ) : "Entrar al Sistema"}
                </button>

                <div className="text-center mt-3">
                  <Link to="/forgot-password" className="text-decoration-none small" style={{ color: "var(--neon-cyan)" }}>
                    Olvidaste tu contrasena?
                  </Link>
                </div>
              </form>

              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={switchToActivar}
                  className="btn btn-link text-decoration-none small p-0"
                  style={{ color: "var(--neon-cyan)" }}
                >
                  <Key size={14} className="me-1" />
                  Tenes un PIN de activacion?
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="activar-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="text-center mb-3">
                <span className="badge bg-info text-dark px-3 py-2">
                  <Key size={14} className="me-1" />
                  Activar cuenta con PIN
                </span>
              </div>

              <form onSubmit={handleActivarPin}>
                <div className="mb-3">
                  <label className="text-light small mb-1">Usuario</label>
                  <div className="position-relative">
                    <span className="position-absolute start-0 top-50 translate-middle-y ps-3 text-light opacity-75">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      name="user"
                      value={pinForm.user}
                      onChange={handlePinChange}
                      placeholder="Tu nombre de usuario"
                      aria-label="Usuario"
                      aria-describedby={error ? "login-error" : undefined}
                      className="form-control bg-dark text-white border-secondary ps-5 py-2"
                      style={{ borderRadius: '8px' }}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="text-light small mb-1">PIN de activacion</label>
                  <div className="position-relative">
                    <span className="position-absolute start-0 top-50 translate-middle-y ps-3 text-light opacity-75">
                      <Key size={18} />
                    </span>
                    <input
                      type="text"
                      name="pin"
                      value={pinForm.pin}
                      onChange={handlePinChange}
                      placeholder="123456"
                      maxLength={6}
                      inputMode="numeric"
                      aria-label="PIN de activacion"
                      aria-describedby={error ? "login-error" : undefined}
                      className="form-control bg-dark text-white border-secondary ps-5 py-2"
                      style={{ borderRadius: '8px', letterSpacing: '0.3rem', fontSize: '1.1rem' }}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="text-light small mb-1">Nueva contrasena</label>
                  <div className="position-relative">
                    <span className="position-absolute start-0 top-50 translate-middle-y ps-3 text-light opacity-75">
                      <Lock size={18} />
                    </span>
                    <input
                      type={showPinPassword ? "text" : "password"}
                      name="pass"
                      value={pinForm.pass}
                      onChange={handlePinChange}
                      placeholder="Minimo 8 caracteres, 1 mayuscula, 1 numero"
                      aria-label="Nueva contrasena"
                      className="form-control bg-dark text-white border-secondary ps-5 pe-5 py-2"
                      style={{ borderRadius: '8px' }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPinPassword(!showPinPassword)}
                      aria-label={showPinPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                      className="position-absolute end-0 top-50 translate-middle-y bg-transparent border-0 text-neon-cyan pe-3"
                      style={{ zIndex: 10, cursor: 'pointer' }}
                    >
                      {showPinPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-light small mb-1">Confirmar contrasena</label>
                  <div className="position-relative">
                    <span className="position-absolute start-0 top-50 translate-middle-y ps-3 text-light opacity-75">
                      <Lock size={18} />
                    </span>
                    <input
                      type={showPinPassword ? "text" : "password"}
                      name="passConfirm"
                      value={pinForm.passConfirm}
                      onChange={handlePinChange}
                      placeholder="Repeti tu contrasena"
                      aria-label="Confirmar contrasena"
                      className="form-control bg-dark text-white border-secondary ps-5 py-2"
                      style={{ borderRadius: '8px' }}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 py-2 fw-bold shadow-glow" disabled={loading} style={{ borderRadius: '8px' }}>
                  {loading ? (
                    <span className="d-flex align-items-center justify-content-center gap-2">
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Activando...
                    </span>
                  ) : "Activar Cuenta"}
                </button>
              </form>

              <div className="text-center mt-3">
                <button
                  type="button"
                  onClick={switchToLogin}
                  className="btn btn-link text-decoration-none small p-0"
                  style={{ color: "var(--neon-cyan)" }}
                >
                  Volver al login
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center mt-4 pt-3 border-top border-secondary">
          <Link to="/registro" className="text-decoration-none" style={{ color: "var(--neon-cyan)" }}>
            No tienes cuenta? <strong>Registrate aqui</strong>
          </Link>
        </div>

        <div className="text-center mt-4 pt-3 border-top border-secondary">
          <p className="small text-light opacity-75 mb-0">
            Al continuar, aceptas que FlowMint cree un espacio de trabajo para tu negocio.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
