import { useState } from 'react';
import ButtonSidebar from './ButtonSidebar'; 
import { ListButtonsSidebar } from '../common/ListButtonSidebar'; 

function BarraLateral() {
  const [visible, setVisible] = useState(false);
  const rol = localStorage.getItem('rol') || 'Invitado'; // Por defecto

  return (
    <>
      {/* Área invisible para detectar el hover cerca del borde izquierdo */}
      <div 
        className="fixed top-0 left-0 h-screen w-20 z-50"
        onMouseEnter={() => setVisible(true)}
      ></div>

      {/* Barra lateral */}
      <div 
        className={`fixed top-0 left-0 h-screen w-60 p-4 pt-9 bg-principal bg-opacity-30 backdrop-blur-md transition-all duration-300 z-40
                    ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onMouseLeave={() => setVisible(false)}
      >
        {/* Logo y título */}
        <div className="flex gap-x-4 items-center">
          <div className="bg-white rounded-full w-10 h-10"></div>
          <h1 className="text-text-primary font-medium text-xl">ALRIC</h1>
        </div>
        
        {/* Mostrar el nombre del rol del usuario */}
        <div className="mt-2 text-text-primary text-sm">
          Usuario: {rol}
        </div>

        {/* Menú de navegación */}
        <ul className='pt-6'>
          {ListButtonsSidebar.map((menu, index) => (
            <ButtonSidebar key={index} item={menu} open={true} />
          ))}
        </ul>
      </div>
    </>
  );
}

export default BarraLateral;
