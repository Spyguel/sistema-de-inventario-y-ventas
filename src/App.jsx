import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BarraLateral from './pages/sidebar';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas sin barra lateral */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Rutas con barra lateral */}
        <Route 
          path="/*" 
          element={
            <div className="flex">
              <BarraLateral />
              <div className="flex-1">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  {/* Agrega más rutas aquí */}
                </Routes>
              </div>
            </div>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
