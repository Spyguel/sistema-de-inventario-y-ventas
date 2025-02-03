import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import BarraLateral from './components/layaut/sidebar.jsx'; 

// Importaciones de páginas
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Productos from './pages/productos.jsx';
import Proveedores from './pages/proveedores.jsx';
import Clientes from './pages/Clientes.jsx';
import Usuarios from './pages/Usuarios.jsx';
import Configuracion from './pages/Configuracion.jsx';

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas accesibles sin autenticación */}
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
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<Productos />} />
        <Route path="proveedores" element={<Proveedores />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="configuracion" element={<Configuracion />} />
      </Route>

      {/* Ruta de redirección por defecto */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
