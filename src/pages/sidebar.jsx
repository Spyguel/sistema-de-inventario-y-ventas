import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeIcon, 
  DocumentChartBarIcon, 
  CubeIcon, 
  TruckIcon, 
  UserGroupIcon, 
  ArrowsRightLeftIcon, 
  UsersIcon, 
  CogIcon, 
  ArrowLeftOnRectangleIcon,
  ChevronRightIcon, 
  ChevronLeftIcon 
} from '@heroicons/react/24/solid';

function BarraLateral() {
  const [open, setOpen] = useState(false);
  const iconMap = {
    'home': HomeIcon,
    'inf': DocumentChartBarIcon,
    'product': CubeIcon,
    'prov': TruckIcon,
    'report': UserGroupIcon,
    'product': ArrowsRightLeftIcon,
    'contact': UsersIcon,
    'setting': CogIcon,
    'logout': ArrowLeftOnRectangleIcon
  };
  const Menus = [
    { title: 'Inicio', src: 'home', path: '/', gap: true },
    { title: 'Informes', src: 'inf', path: '/informes' },
    { title: 'Productos', src: 'product', path: '/productos' },
    { title: 'Proveedores', src: 'prov', path: '/proveedores' },
    { title: 'Clientes', src: 'report', path: '/clientes' },
    { title: 'Movimientos', src: 'product', path: '/movimientos' },
    { title: 'Usuarios', src: 'contact', path: '/usuarios', gap: true },
    { title: 'Configuración', src: 'setting', path: '/configuracion' },
    { title: 'Cerrar Sesión', src: 'logout', path: '/logout' },
  ];

  const toggleBarraLateral = () => {
    setOpen(!open);
  };

  return (
    <div className={`${open ? 'w-72' : 'w-20'} h-screen p-4 pt-9 bg-pastel-blue relative transition-all duration-300`}>
      <div 
        className="absolute cursor-pointer rounded-full -right-4 top-9 w-8 h-8 flex items-center justify-center bg-pastel-pink border-2 border-pastel-blue transition-colors duration-300 hover:bg-pastel-yellow"
        onClick={toggleBarraLateral}
      >
        {open ? (
          <ChevronLeftIcon className="w-5 h-5 text-pastel-blue" />
        ) : (
          <ChevronRightIcon className="w-5 h-5 text-pastel-blue" />
        )}
      </div>
      <div className="flex gap-x-4 items-center">
        <img alt="Alric Logo" className="w-10 h-10" />
        <h1 className={`text-pastel-white origin-left font-medium text-xl duration-300 ${!open && 'scale-0'}`}>
          ALRIC
        </h1>
      </div>
      <ul className='pt-6'>
        {Menus.map((menu, index) => {
          const Icon = iconMap[menu.src];
          return (
            <li 
              key={index} 
              className={`flex rounded-md p-2 cursor-pointer hover:bg-pastel-pink text-pastel-white text-sm items-center gap-x-4 ${menu.gap ? 'mt-9' : 'mt-2'}`}
            >
              <Link to={menu.path} className="flex items-center gap-x-4 w-full">
                <Icon className="w-6 h-6" />
                <span className={`${!open && 'hidden'} origin-left duration-200`}>{menu.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default BarraLateral;
