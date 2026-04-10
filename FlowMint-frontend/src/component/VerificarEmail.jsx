import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './Usuarios.css'; // Reusing styles

const VerificarEmail = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [status, setStatus] = useState('verificando');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const verificar = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Token de verificación no encontrado.');
                return;
            }

            try {
                const response = await api.get(`/auth/verificar-email?token=${token}`);
                setStatus('success');
                setMessage(response.data.message || 'Email verificado con éxito.');
                
                // Redirigir al login después de 3 segundos
                setTimeout(() => {
                    navigate('/login');
                }, 3000);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Error al verificar el email. El enlace puede haber expirado.');
            }
        };

        verificar();
    }, [token, navigate]);

    return (
        <div className="container mt-5 text-center">
            <div className="card p-5" style={{ backgroundColor: '#1a1a2e', color: 'white', borderRadius: '15px', border: '1px solid #16f2b3' }}>
                {status === 'verificando' && (
                    <>
                        <h2 className="mb-4">Verificando tu correo...</h2>
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <h2 className="text-success mb-4">¡Verificación Exitosa!</h2>
                        <p>{message}</p>
                        <p className="text-muted">Redirigiendo al login...</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <h2 className="text-danger mb-4">Error de Verificación</h2>
                        <p>{message}</p>
                        <button className="btn btn-primary mt-3" onClick={() => navigate('/login')}>Ir al Login</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerificarEmail;
