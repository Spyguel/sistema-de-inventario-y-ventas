import { 
  CubeIcon, 
  ChartBarIcon, 
  ServerIcon 
} from '@heroicons/react/24/solid';

function Dashboard() {
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

  const AccesoRapido = [
    {
      titulo: "Inventario",
      descripcion: "Consulta y actualiza existencias",
      icono: <CubeIcon className="w-6 h-6 text-principal mx-auto mb-2" />
    },
    {
      titulo: "Proveedores",
      descripcion: "Gestión de contactos",
      icono: <ChartBarIcon className="w-6 h-6 text-principal mx-auto mb-2" />
    },
    {
      titulo: "Movimientos",
      descripcion: "Registro de entradas y salidas",
      icono: <ServerIcon className="w-6 h-6 text-principal mx-auto mb-2" />
    }
  ];

  return (
    <div className="min-h-screen bg-background_2 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Contenedor Principal con Diseño Responsive */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Encabezado Adaptativo */}
          <div className="bg-principal text-white p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                  Panel de Control de Almacén
                </h2>
                <p className="text-sm sm:text-base text-white/80">
                  Sistema integral para la gestión eficiente de inventario y recursos
                </p>
              </div>
            </div>
          </div>

          {/* Sección de Accesos Rápidos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 sm:p-6 bg-background">
            {AccesoRapido.map((acceso, index) => (
              <div 
                key={index} 
                className="bg-white 
                           rounded-xl 
                           p-4 
                           text-center 
                           shadow-md 
                           border 
                           border-gray-100 
                           hover:shadow-xl 
                           hover:border-principal/20 
                           transition-all 
                           duration-300 
                           cursor-pointer"
              >
                {acceso.icono}
                <h3 className="font-semibold text-text-primary mb-2">{acceso.titulo}</h3>
                <p className="text-text-secondary text-sm">{acceso.descripcion}</p>
              </div>
            ))}
          </div>

          {/* Sección de Características */}
          <div className="p-4 sm:p-6 bg-background_2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {caracteristicas.map((caracteristica, index) => (
                <div 
                  key={index} 
                  className="bg-white 
                             rounded-xl 
                             p-4 sm:p-6 
                             flex 
                             flex-col 
                             items-center 
                             text-center 
                             shadow-md 
                             border 
                             border-gray-100
                             hover:shadow-xl 
                             hover:border-principal/20
                             transition-all 
                             duration-300 
                             ease-in-out
                             cursor-pointer"
                >
                  <div className="mb-3 sm:mb-4">
                    {caracteristica.icono}
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-text-primary mb-2">
                    {caracteristica.titulo}
                  </h3>
                  <p className="text-text-secondary text-xs sm:text-sm">
                    {caracteristica.descripcion}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;