import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, ArrowLeft } from 'lucide-react';
import { Logo } from './VisualAssets';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div 
            className="min-vh-100 d-flex align-items-center justify-content-center" 
            style={{ 
                background: 'var(--bg-primary)',
                fontFamily: '"Courier New", Courier, monospace'
            }}
        >
            <div className="position-absolute w-100 h-100 overflow-hidden" style={{ pointerEvents: 'none', zIndex: 0 }}>
                {/* Ambient Glows */}
                <div 
                    className="position-absolute" 
                    style={{ 
                        top: '20%', left: '20%', width: '300px', height: '300px', 
                        background: 'radial-gradient(circle, rgba(0, 243, 255, 0.1) 0%, transparent 70%)',
                        filter: 'blur(50px)'
                    }} 
                />
                <div 
                    className="position-absolute" 
                    style={{ 
                        bottom: '20%', right: '20%', width: '300px', height: '300px', 
                        background: 'radial-gradient(circle, rgba(255, 0, 110, 0.1) 0%, transparent 70%)',
                        filter: 'blur(50px)'
                    }} 
                />
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center p-5 rounded-4 shadow-lg border-2 border-info position-relative"
                style={{ 
                    background: 'rgba(30, 30, 62, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '2px solid var(--neon-cyan)',
                    boxShadow: '0 0 30px rgba(0, 243, 255, 0.2)',
                    maxWidth: '500px',
                    zIndex: 1
                }}
            >
                <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="mb-4 d-inline-block"
                >
                    <Logo size={80} showText={false} />
                </motion.div>

                <h1 className="display-1 fw-bold mb-2" style={{ color: 'var(--neon-pink)', textShadow: '0 0 20px var(--neon-pink)' }}>
                    404
                </h1>
                
                <h2 className="h3 text-white mb-4 text-uppercase tracking-wider">
                    Página No Encontrada
                </h2>

                <p className="text-light opacity-75 mb-5">
                    Parece que te has perdido en el flujo. La página que buscas no existe o ha sido movida.
                </p>

                <div className="d-flex flex-column gap-3">
                    <button 
                        className="btn btn-outline-info w-100 py-3"
                        onClick={() => navigate(-1)}
                        style={{ border: '2px solid var(--neon-cyan)', color: 'var(--neon-cyan)' }}
                    >
                        <ArrowLeft size={18} className="me-2" /> Volver Atrás
                    </button>
                    
                    <button 
                        className="btn w-100 py-3"
                        onClick={() => navigate('/')}
                        style={{ background: 'var(--neon-cyan)', color: 'black', fontWeight: 'bold' }}
                    >
                        <Home size={18} className="me-2" /> Ir al Inicio
                    </button>
                </div>

                {/* Decorative Elements */}
                <div className="mt-5 pt-3 opacity-25">
                    <div className="d-flex justify-content-center gap-2">
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--neon-cyan)' }} />
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
