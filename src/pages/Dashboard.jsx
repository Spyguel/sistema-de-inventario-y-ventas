import  { useState, useEffect } from 'react';
import { 
  BeakerIcon, 
  ChartBarIcon, 
  ServerIcon, 
  UserIcon, 
  CogIcon,
  ArrowUpIcon, // Para ArrowTrendingUpIcon
  ArrowDownIcon, // Para ArrowTrendingDownIcon
  ClockIcon 
} from '@heroicons/react/24/solid';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "./components/ui/card";

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  const metricas = [
    {
      titulo: "Inventario total",
      valor: "123,456",
      incremento: "+12.5%",
      positivo: true,
      icono: <ArrowUpIcon className="w-4 h-4" />
    },
    {
      titulo: "Productos Bajos",
      valor: "23",
      incremento: "-5%",
      positivo: false,
      icono: <ArrowDownIcon className="w-4 h-4" />
    },
    {
      titulo: "Movimientos Hoy",
      valor: "89",
      incremento: "+8%",
      positivo: true,
      icono: <ArrowUpIcon className="w-4 h-4" />
    }
  ];

  const caracteristicas = [
    {
      icono: <BeakerIcon className="w-8 h-8" />,
      titulo: "Gestión de Inventario",
      descripcion: "Control preciso de stock, entradas y salidas de productos."
    },
    {
      icono: <ChartBarIcon className="w-8 h-8" />,
      titulo: "Reportes y Análisis",
      descripcion: "Informes detallados de consumo, existencias y tendencias."
    },
    {
      icono: <ServerIcon className="w-8 h-8" />,
      titulo: "Registro de Movimientos",
      descripcion: "Seguimiento completo de todas las operaciones de almacén."
    },
    {
      icono: <UserIcon className="w-8 h-8" />,
      titulo: "Gestión de Usuarios",
      descripcion: "Control de acceso y permisos para cada usuario."
    },
    {
      icono: <CogIcon className="w-8 h-8" />,
      titulo: "Configuración",
      descripcion: "Ajustes del sistema y personalización."
    }
  ];

  const accionesRapidas = [
    {
      titulo: "Nuevo Producto",
      descripcion: "Añadir item al inventario",
      icono: <BeakerIcon className="w-6 h-6" />,
      color: "bg-blue-500"
    },
    {
      titulo: "Registrar Entrada",
      descripcion: "Entrada de mercancía",
      icono: <ArrowUpIcon className="w-6 h-6" />,
      color: "bg-green-500"
    },
    {
      titulo: "Registrar Salida",
      descripcion: "Salida de mercancía",
      icono: <ArrowDownIcon className="w-6 h-6" />,
      color: "bg-orange-500"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Panel de Inicio
            </h1>
            <div className="flex items-center text-gray-500 mt-1">
              <ClockIcon className="w-4 h-4 mr-2" />
              {currentTime.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metricas.map((metrica, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {metrica.titulo}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">{metrica.valor}</span>
                  <div className={`flex items-center ${metrica.positivo ? 'text-green-500' : 'text-red-500'}`}>
                    {metrica.icono}
                    <span className="ml-1 text-sm">{metrica.incremento}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Acciones Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {accionesRapidas.map((accion, index) => (
            <button
              key={index}
              className="flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200"
            >
              <div className={`${accion.color} p-3 rounded-lg text-white mr-4`}>
                {accion.icono}
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">{accion.titulo}</h3>
                <p className="text-sm text-gray-500">{accion.descripcion}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Características */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {caracteristicas.map((caracteristica, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-2 bg-blue-50 rounded-lg text-blue-600">
                    {caracteristica.icono}
                  </div>
                  <h3 className="font-semibold mb-2">{caracteristica.titulo}</h3>
                  <p className="text-sm text-gray-500">{caracteristica.descripcion}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;