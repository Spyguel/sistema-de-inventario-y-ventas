import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Productos from './pages/productos.jsx';
import Proveedores from './pages/proveedores.jsx';
import Clientes from './pages/Clientes.jsx';
import Usuarios from './pages/Usuarios.jsx';
import Configuracion from './pages/Configuracion.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import BarraLateral from './components/layaut/sidebar.jsx';

function App() {
    return (
        <Routes>
            {/* Redirigir la ruta raíz ("/") al login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rutas protegidas */}
            <Route element={<ProtectedRoute />}>
                <Route
                    element={
                        <div className="flex h-screen">
                            <BarraLateral />
                            <main className="flex-1 overflow-y-auto p-4 bg-gray-100">
                                <Outlet />
                            </main>
                        </div>
                    }
                >
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="productos" element={<Productos />} />
                    <Route path="proveedores" element={<Proveedores />} />
                    <Route path="clientes" element={<Clientes />} />
                    <Route path="usuarios" element={<Usuarios />} />
                    <Route path="configuracion" element={<Configuracion />} />
                </Route>
            </Route>

            {/* Ruta de redirección por defecto */}
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
}

export default App;