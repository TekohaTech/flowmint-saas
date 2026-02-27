import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './component/Landing';
import Login from './component/Login';
import CompletarRegistro from './component/CompletarRegistro';
import PendienteActivacion from './component/PendienteActivacion';
import Clientes from './component/Clientes';
import Empleados from './component/Empleados';
import Servicios from './component/Servicios';
import Turnos from './component/Turnos';
import Usuarios from './component/Usuarios';
import Ganancias from './component/Ganancias';
import Dashboard from './component/Dashboard';
import Comercios from './component/Comercios';
import ProtectedRoute from './component/ProtectedRoute';
import DashboardHome from './component/DashboardHome';

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Landing />} />
                <Route path='/login' element={<Login />} />
                <Route path='/completar-registro' element={<CompletarRegistro />} />
                <Route path='/pendiente-activacion' element={<PendienteActivacion />} />

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
            </Routes>
        </Router>
    );
}

export default App;
