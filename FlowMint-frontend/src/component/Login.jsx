import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { authAPI } from "../services/api";
import { motion } from "framer-motion";
import { Zap, Lock, User, AlertCircle, Eye, EyeOff } from "lucide-react";
import "../index.css";

const Login = () => {
  const [credentials, setCredentials] = useState({ user: "", pass: "" });
  const [showPassword, setShowPassword] = useState(false);
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
      localStorage.setItem('isLoggedIn', 'true');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.login(credentials);
      console.log('[Login] Response:', response);
      console.log('[Login] Token guardado:', localStorage.getItem('token'));
      console.log('[Login] User guardado:', localStorage.getItem('user'));
      window.location.href = "/dashboard";
    } catch (err) {
      console.error('[Login] Error:', err);
      setError(
        err.response?.data?.message || "Credenciales inválidas. Por favor, inténtalo de nuevo.",
      );
      setCredentials({ ...credentials, pass: "" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirigir al endpoint de Google en el Backend
    const backendUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';
    window.location.href = `${backendUrl}/api/auth/google`;
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
          >
            <Zap size={64} className="neon-pulse" style={{ color: "var(--neon-cyan)" }} />
          </motion.div>
          <h1 className="mt-3 mb-1 text-white">FlowMint</h1>
          <p style={{ color: "var(--text-secondary)" }}>Plataforma SaaS de Gestión de Negocios</p>
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

        {/* GOOGLE LOGIN BUTTON (PRIMARY) */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="btn btn-light w-100 mb-4 d-flex align-items-center justify-content-center gap-2 py-2 fw-bold"
          style={{ border: '1px solid #ddd', borderRadius: '8px', background: 'white', color: '#333' }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="18" />
          Continuar con Google
        </button>

        <div className="d-flex align-items-center mb-4 text-muted">
          <hr className="flex-grow-1" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <span className="px-3 small">O con usuario</span>
          <hr className="flex-grow-1" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="text-light small mb-1">Usuario</label>
            <div className="position-relative">
              <span className="position-absolute start-0 top-50 translate-middle-y ps-3 text-muted">
                <User size={18} />
              </span>
              <input
                type="text"
                name="user"
                value={credentials.user}
                onChange={handleChange}
                placeholder="admin"
                className="form-control bg-dark text-white border-secondary ps-5 py-2"
                style={{ borderRadius: '8px' }}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-light small mb-1">Contraseña</label>
            <div className="position-relative">
              <span className="position-absolute start-0 top-50 translate-middle-y ps-3 text-muted">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="pass"
                value={credentials.pass}
                onChange={handleChange}
                placeholder="••••••••"
                className="form-control bg-dark text-white border-secondary ps-5 pe-5 py-2"
                style={{ borderRadius: '8px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
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
        </form>

        <div className="text-center mt-4 pt-3 border-top border-secondary">
          <p className="small text-muted mb-0">
            Al continuar, aceptas que FlowMint cree un espacio de trabajo para tu negocio.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
