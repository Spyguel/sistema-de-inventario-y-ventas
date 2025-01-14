import React from 'react';
import { 
  CubeIcon, 
  ChartBarIcon, 
  ServerIcon 
} from '@heroicons/react/24/solid';

function Dashboard() {
  // Array de características para empleados de almacén
  const caracteristicas = [
    {
      icono: <CubeIcon className="w-10 h-10 text-principal" />,
      titulo: "Gestión de Inventario",
      descripcion: "Control preciso de stock, entradas y salidas de productos."
    },
    {
      icono: <ChartBarIcon className="w-10 h-10 text-principal" />,
      titulo: "Reportes y Análisis",
      descripcion: "Informes detallados de consumo, existencias y tendencias."
    },
    {
      icono: <ServerIcon className="w-10 h-10 text-principal" />,
      titulo: "Registro de Movimientos",
      descripcion: "Seguimiento completo de todas las operaciones de almacén."
    }
  ];

  return (
    <div className="min-h-90 max-w-50 bg-background_2 p-4 flex flex-col items-center justify-center relative">
      {/* Contenedor para el efecto de borde */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      w-[100%] h-[70%] 
                      border-2 bg-accent-subtle-lavender  shadow-lg
                      rounded-lg border-principal
                      ">
      </div>

      {/* Cuerpo Principal */}
      <div className="mt-5 flex-grow flex items-center justify-center rounded-lg bg-accent-subtle-lavender w-100 h-100 relative z-1 border-2 border-principal ">
        <div className="relative bg-white rounded-lg shadow-lg p-6 h-100 w-100 " 
             style={{ 
               backdropFilter: 'blur(10px)', 
               maxWidth: '90%', 
               maxHeight: '95%', 
               margin: 'auto 0' 
             }}>
          <h2 className="text-2xl font-semibold text-text-primary mb-4">Panel de Control de Almacén</h2>
          <p className="text-text-secondary mb-4">
            Sistema integral para la gestión eficiente de inventario y recursos.
          </p>
          
          {/* Sección de Accesos Rápidos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-100 rounded-lg p-4 text-center hover:bg-gray-200 transition">
              <h3 className="font-semibold mb-2">Inventario</h3>
              <p className="text-sm text-gray-600">Consulta y actualiza existencias</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 text-center hover:bg-gray-200 transition">
              <h3 className="font-semibold mb-2">Proveedores</h3>
              <p className="text-sm text-gray-600">Gestión de contactos</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 text-center hover:bg-gray-200 transition">
              <h3 className="font-semibold mb-2">Movimientos</h3>
              <p className="text-sm text-gray-600">Registro de entradas y salidas</p>
            </div>
          </div>

          {/* Sección de Características */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {caracteristicas.map((caracteristica, index) => (
              <div 
                key={index} 
                className="bg-white 
                           rounded-lg 
                           p-4 
                           flex 
                           flex-col 
                           items-center 
                           text-center 
                           shadow-md 
                           border 
                           border-principal/20
                           hover:shadow-lg 
                           transition-all 
                           duration-300 
                           ease-in-out
                           cursor-pointer hover:bg-success"
                           
              >
                <div className="mb-3">
                  {caracteristica.icono}
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {caracteristica.titulo}
                </h3>
                <p className="text-text-secondary text-sm">
                  {caracteristica.descripcion}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;