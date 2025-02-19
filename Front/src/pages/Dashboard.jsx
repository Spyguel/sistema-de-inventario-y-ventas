import { CubeIcon, ChartBarIcon, ServerIcon, UserIcon, CogIcon } from '@heroicons/react/24/solid';

function Dashboard() {
  const estadisticas = [
    { titulo: "Inventario", valor: "123,456", cambio: "+12.5%", positivo: true },
    { titulo: "P. Bajos", valor: "23", cambio: "-5%", positivo: false },
    { titulo: "Movimientos", valor: "89", cambio: "+8%", positivo: true }
  ];

  const acciones = [
    { titulo: "Nuevo Producto", descripcion: "Añadir item", icono: CubeIcon, color: "text-blue-500" },
    { titulo: "Entrada", descripcion: "Ingreso", icono: ChartBarIcon, color: "text-green-500" },
    { titulo: "Salida", descripcion: "Egreso", icono: ServerIcon, color: "text-red-500" }
  ];

  const modulos = [
    { titulo: "Inventario", descripcion: "Control de stock", icono: CubeIcon },
    { titulo: "Reportes", descripcion: "Análisis y estadísticas", icono: ChartBarIcon },
    { titulo: "Movimientos", descripcion: "Registro de operaciones", icono: ServerIcon },
    { titulo: "Usuarios", descripcion: "Control de acceso", icono: UserIcon },
    { titulo: "Config", descripcion: "Ajustes", icono: CogIcon }
  ];

  return (
    <div className="h-screen ml-10 p-4">
      <div className="rounded-lg shadow-lg p-6 h-[90%] min-h-[80%]">
        <h1 className="text-2xl font-semibold">Panel de Inicio</h1>
        <p className="text-sm text-gray-500 mb-4">28/1/2025</p>

        <div className="grid gap-6 h-[calc(100%-5rem)]">
          {/* Estadísticas */}
          <div>
            <div className="grid grid-cols-3 gap-4">
              {estadisticas.map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg text-center shadow">
                  <h2 className="text-md font-medium">{item.titulo}</h2>
                  <p className="text-xl font-bold mt-1">{item.valor}</p>
                  <span className={`text-sm ${item.positivo ? 'text-green-600' : 'text-red-600'}`}>
                    {item.cambio}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Acciones */}
          <div>
            <div className="grid grid-cols-3 gap-4">
              {acciones.map((accion, index) => (
                <button key={index} 
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-lg shadow hover:shadow-md"
                  >
                  <accion.icono className={`w-8 h-8 ${accion.color}`} />
                  <h3 className="text-md mt-2 font-medium">{accion.titulo}</h3>
                  <p className="text-sm text-gray-500">{accion.descripcion}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Módulos */}
          <div>
            <div className="grid grid-cols-5 gap-4">
              {modulos.map((modulo, index) => (
                <button key={index} 
                  className="flex flex-col items-center p-4 bg-gray-50 rounded-lg shadow-md hover:bg-gray-100"
                  >
                  <modulo.icono className="w-10 h-10 text-gray-600" />
                  <h3 className="text-md mt-2 font-medium">{modulo.titulo}</h3>
                  <p className="text-sm text-gray-500">{modulo.descripcion}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;