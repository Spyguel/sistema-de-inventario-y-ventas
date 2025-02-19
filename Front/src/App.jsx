import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Informes from './pages/Informes.jsx';
import Productos from './pages/productos.jsx';
import Proveedores from './pages/proveedores.jsx';
import Clientes from './pages/Clientes.jsx';
import Usuarios from './pages/Usuarios.jsx';
import Configuracion from './pages/Configuracion.jsx';
import Movimientos from './pages/Movimientos.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import BarraLateral from './components/layaut/sidebar.jsx';

function App() {
    return (
        <div className="relative min-h-screen ">
            {/* Fondo con blur que ocupa toda la pantalla */}
            <div className="absolute inset-0 bg-fondo-1 bg-cover bg-center blur-sm z-[-1]"></div>

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
                            <div className="flex h-screen z-10">
                                <BarraLateral />
                                <main className="flex-1 overflow-y-auto p-4">
                                    <Outlet />
                                </main>
                            </div>
                        }
                    >
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="informes" element={<Informes />} />
                        <Route path="productos" element={<Productos />} />
                        <Route path="proveedores" element={<Proveedores />} />
                        <Route path="clientes" element={<Clientes />} />
                        <Route path="usuarios" element={<Usuarios />} />
                        <Route path="configuracion" element={<Configuracion />} />
                        <Route path="movimientos" element={<Movimientos />} />
                    </Route>
                </Route>

                {/* Ruta de redirección por defecto */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </div>
    );
}

export default App;
