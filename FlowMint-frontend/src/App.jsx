import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoadingSpinner from './component/LoadingSpinner';
import ProtectedRoute from './component/ProtectedRoute';

// Lazy-loaded page components — each becomes its own chunk
const Landing = React.lazy(() => import('./component/Landing'));
const Login = React.lazy(() => import('./component/Login'));
const Registros = React.lazy(() => import('./component/Registros'));
const CompletarRegistro = React.lazy(() => import('./component/CompletarRegistro'));
const PendienteActivacion = React.lazy(() => import('./component/PendienteActivacion'));
const VerificarEmail = React.lazy(() => import('./component/VerificarEmail'));
const ForgotPassword = React.lazy(() => import('./component/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./component/ResetPassword'));
const Dashboard = React.lazy(() => import('./component/Dashboard'));
const DashboardHome = React.lazy(() => import('./component/DashboardHome'));
const Clientes = React.lazy(() => import('./component/Clientes'));
const Empleados = React.lazy(() => import('./component/Empleados'));
const Servicios = React.lazy(() => import('./component/Servicios'));
const Turnos = React.lazy(() => import('./component/Turnos'));
const Usuarios = React.lazy(() => import('./component/Usuarios'));
const Ganancias = React.lazy(() => import('./component/Ganancias'));
const Comercios = React.lazy(() => import('./component/Comercios'));
const NotFound = React.lazy(() => import('./component/NotFound'));

function App() {
    return (
        <Router>
            <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                    <Route path='/' element={<Landing />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/registro' element={<Registros />} />
                    <Route path='/completar-registro' element={<CompletarRegistro />} />
                    <Route path='/pendiente-activacion' element={<PendienteActivacion />} />
                    <Route path='/verificar-email' element={<VerificarEmail />} />
                    <Route path='/forgot-password' element={<ForgotPassword />} />
                    <Route path='/reset-password' element={<ResetPassword />} />

                    <Route 
                        path='/dashboard' 
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<DashboardHome />} />
                        <Route path='clientes' element={<Clientes />} />
                        <Route path='empleados' element={<Empleados />} />
                        <Route path='servicios' element={<Servicios />} />
                        <Route path='turnos' element={<Turnos />} />
                        <Route path='usuarios' element={<Usuarios />} />
                        <Route path='ganancias' element={<Ganancias />} />
                        <Route path='comercios' element={<Comercios />} />
                    </Route>

                    {/* Catch-all 404 Route */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
