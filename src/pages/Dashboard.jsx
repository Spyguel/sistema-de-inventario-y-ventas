import { CubeIcon, ChartBarIcon, ServerIcon, UserIcon, CogIcon } from '@heroicons/react/24/solid';

function Dashboard() {
  const estadisticas = [
    { titulo: "Inventario total", valor: "123,456", cambio: "+12.5%", positivo: true },
    { titulo: "Productos Bajos", valor: "23", cambio: "-5%", positivo: false },
    { titulo: "Movimientos Hoy", valor: "89", cambio: "+8%", positivo: true }
  ];

  const acciones = [
    { titulo: "Nuevo Producto", descripcion: "Añadir item al inventario", icono: <CubeIcon className="w-6 h-6 text-blue-500" /> },
    { titulo: "Registrar Entrada", descripcion: "Entrada de mercancía", icono: <ChartBarIcon className="w-6 h-6 text-green-500" /> },
    { titulo: "Registrar Salida", descripcion: "Salida de mercancía", icono: <ServerIcon className="w-6 h-6 text-red-500" /> }
  ];

  const modulos = [
    { titulo: "Gestión de Inventario", descripcion: "Control preciso de stock, entradas y salidas de productos.", icono: <CubeIcon className="w-10 h-10 text-gray-600" /> },
    { titulo: "Reportes y Análisis", descripcion: "Informes detallados de consumo, existencias y tendencias.", icono: <ChartBarIcon className="w-10 h-10 text-gray-600" /> },
    { titulo: "Registro de Movimientos", descripcion: "Seguimiento completo de todas las operaciones de almacén.", icono: <ServerIcon className="w-10 h-10 text-gray-600" /> },
    { titulo: "Gestión de Usuarios", descripcion: "Control de acceso y permisos para cada usuario.", icono: <UserIcon className="w-10 h-10 text-gray-600" /> },
    { titulo: "Configuración", descripcion: "Ajustes del sistema y personalización.", icono: <CogIcon className="w-10 h-10 text-gray-600" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">Panel de Inicio</h1>
        <p className="text-sm text-gray-500">28/1/2025, 17:16:52</p>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          {estadisticas.map((item, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-md">
              <h2 className="text-lg font-medium">{item.titulo}</h2>
              <p className="text-2xl font-bold">{item.valor}</p>
              <span className={`text-sm ${item.positivo ? 'text-green-600' : 'text-red-600'}`}>{item.cambio}</span>
            </div>
          ))}
        </div>

        {/* Acciones Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          {acciones.map((accion, index) => (
            <button key={index} className="p-4 bg-white rounded-lg shadow hover:shadow-md flex flex-col items-center">
              {accion.icono}
              <h3 className="text-md font-medium mt-2">{accion.titulo}</h3>
              <p className="text-xs text-gray-500">{accion.descripcion}</p>
            </button>
          ))}
        </div>

        {/* Módulos */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {modulos.map((modulo, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg shadow-md flex flex-col items-center text-center">
              {modulo.icono}
              <h3 className="text-md font-medium mt-2">{modulo.titulo}</h3>
              <p className="text-xs text-gray-500">{modulo.descripcion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
