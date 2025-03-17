import { useState } from 'react';
import ButtonSidebar from './ButtonSidebar'; 
import { ListButtonsSidebar } from '../common/ListButtonSidebar';
import useUsuario from '../../hooks/useUsuarios'; // Importar el hook

function BarraLateral() {
  const [visible, setVisible] = useState(false);
  const { usuario, tienePermiso, esAdministrador } = useUsuario(); // Usar el hook

  const verificarAcceso = (item) => {
    // Si tiene rol requerido
    if (item.rolRequerido && !esAdministrador()) return false;
    
    // Si no requiere permiso
    if (!item.permiso) return true;
    
    // Verificar permiso
    return tienePermiso(item.permiso);
  };

  return (
    <>
      <div 
        className="fixed top-0 left-0 h-screen w-20 z-50"
        onMouseEnter={() => setVisible(true)}
      ></div>

      <div 
        className={`fixed top-0 left-0 h-screen w-60 p-4 pt-9 bg-principal bg-opacity-30 backdrop-blur-md transition-all duration-300 z-40
                    ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onMouseLeave={() => setVisible(false)}
      >
        <div className="flex gap-x-4 items-center">
          <div className="bg-white rounded-full w-10 h-10"></div>
          <h1 className="text-text-primary font-medium text-xl">ALRIC</h1>
        </div>
        
        <div className="mt-2 text-text-primary text-sm">
          Usuario: {usuario.rol} {/* Usar dato del hook */}
        </div>

        <ul className='pt-6'>
          {ListButtonsSidebar.map((menu, index) => (
            verificarAcceso(menu) && ( // Renderizar solo si tiene acceso
              <ButtonSidebar 
                key={index} 
                item={menu} 
                open={true}
                disabled={!verificarAcceso(menu)} 
              />
            )
          ))}
        </ul>
      </div>
    </>
  );
}

export default BarraLateral;