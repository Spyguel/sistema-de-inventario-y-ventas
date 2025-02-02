import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import BarraLateral from './components/layaut/sidebar'; 
import ProtectedRoute from './routes/ProtectedRoute';

// Importaciones de páginas
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Productos from './pages/productos';
import Proveedores from './pages/proveedores';
import Clientes from './pages/Clientes';
import Usuarios from './pages/Usuarios';
import Configuracion from './pages/Configuracion.jsx';

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Configuracion />} />
      <Route path="/register" element={<Register />} />

      {/* Rutas protegidas con layout */}
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
        <Route 
          index 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="productos" 
          element={
            <ProtectedRoute>
              <Productos />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="proveedores" 
          element={
            <ProtectedRoute>
              <Proveedores />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="clientes" 
          element={
            <ProtectedRoute>
              <Clientes />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="usuarios" 
          element={
            <ProtectedRoute>
              <Usuarios />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="configuracion" 
          element={
            <ProtectedRoute>
              <Configuracion />
            </ProtectedRoute>
          } 
        />
      </Route>

      {/* Ruta de redirección por defecto */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;