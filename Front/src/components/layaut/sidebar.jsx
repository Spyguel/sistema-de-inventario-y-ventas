// BarraLateral.js
import { useState } from 'react';
import { ButtonSidebar} from './ButtonSidebar';
import { ListButtonsSidebar} from '../common/ListButtonSidebar';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

function BarraLateral() {
  const [open, setOpen] = useState(false);
  const rol = localStorage.getItem('rol');

  return (
    <div className={`${open ? 'w-72' : 'w-20'} h-screen p-4 pt-9 bg-principal relative transition-all duration-300`}>
      {/* Botón de toggle */}
      <div
        className="absolute cursor-pointer rounded-full -right-4 top-9 w-8 h-8 flex items-center justify-center bg-accent-soft-blue border-2 border-principal transition-colors duration-300 hover:bg-detalles"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <ChevronLeftIcon className="w-5 h-5 text-white" />
        ) : (
          <ChevronRightIcon className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Logo y título */}
      <div className="flex gap-x-4 items-center">
        <div className="w-10 h-10 bg-white rounded-full"></div>
        <h1 className={`text-white origin-left font-medium text-xl duration-300 ${!open && 'scale-0'}`}>
          ALRIC
        </h1>
      </div>

      {/* Mostrar el nombre del rol del usuario */}
      {open && (
        <div className="mt-2 text-white text-sm">
          Usuario: {rol}
        </div>
      )}

      {/* Menú de navegación */}
      <ul className='pt-6'>
        {ButtonSidebar.map((menu, index) => (
          <ListButtonsSidebar key={index} item={menu} open={open} />
        ))}
      </ul>
    </div>
  );
}

export default BarraLateral;