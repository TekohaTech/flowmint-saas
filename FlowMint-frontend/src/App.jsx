import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './component/Home';
import Login from './component/Login';
import Registros from './component/Registros';
import Clientes from './component/Clientes';
import Empleados from './component/Empleados';
import Servicios from './component/Servicios';
import Turnos from './component/Turnos';
import Usuarios from './component/Usuarios';
import Ganancias from './component/Ganancias';
import Dashboard from './component/Dashboard';
import Comercios from './component/Comercios';
import ProtectedRoute from './component/ProtectedRoute';
import DashboardHome from './component/DashboardHome'; // Import the new component

function App() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/registros' element={<Registros />} />

                {/* Protected Routes using Dashboard as Layout */}
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
