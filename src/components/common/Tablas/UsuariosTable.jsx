// UsuariosTable.jsx
import PropTypes from 'prop-types';
import { PencilIcon, TrashIcon, UserIcon } from '@heroicons/react/24/solid';
import Button from '../button';

const UsuariosTable = ({ 
  usuarios = [], 
  onEdit, 
  onDelete,
  onToggleActive,
  requestSort = () => {} 
}) => {
  return (
    <div className="flex-grow overflow-hidden bg-accent-subtle-lavender rounded-lg shadow-lg p-4">
      <div className="h-full overflow-hidden">
        <div className="overflow-auto max-h-[60vh]">
          <table className="w-full bg-background_2 rounded-lg" aria-label="Usuarios Table">
            <thead className="sticky top-0 z-10">
              <tr className="bg-principal text-white">
                <th className="p-2 cursor-pointer hover:bg-slate-500" onClick={() => requestSort('id')}>ID</th>
                <th className="p-2 cursor-pointer hover:bg-slate-500" onClick={() => requestSort('nombre')}>Nombre</th>
                <th className="p-2 cursor-pointer hover:bg-slate-500" onClick={() => requestSort('email')}>Email</th>
                <th className="p-2 cursor-pointer hover:bg-slate-500" onClick={() => requestSort('rol')}>Rol</th>
                <th className="p-2 cursor-pointer hover:bg-slate-500" onClick={() => requestSort('estado')}>Estado</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-2 text-center">No hay usuarios disponibles</td>
                </tr>
              ) : (
                usuarios.map((usuario) => (
                  <tr 
                    key={usuario.id} 
                    className={`hover:bg-gray-400 transition-colores text-center ${usuario.estado !== 'Activo' ? 'bg-gray-200 text-gray-500' : ''}`}
                  >
                    <td className="p-2 text-center">{usuario.id}</td>
                    <td className="p-2 text-center">{usuario.nombre}</td>
                    <td className="p-2 text-center">{usuario.email}</td>
                    <td className="p-2 text-center">{usuario.rol}</td>
                    <td className="p-2 text-center">
                      <span className={`
                        px-3 py-1 rounded-full text-xs 
                        ${usuario.estado === 'Activo' 
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-red-200 text-red-800'
                        }
                      `}>
                        {usuario.estado}
                      </span>
                    </td>
                    <td className="p-2 text-center flex justify-center space-x-2">
                      {/* Botón de Editar Datos */}
                      <Button 
                        onClick={() => onEdit(usuario)} 
                        variant="primary" 
                        size="sm" 
                        className={`${usuario.estado !== 'Activo' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={usuario.estado !== 'Activo'}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>

                      {/* Botón de Eliminar */}
                      <Button 
                        onClick={() => onDelete(usuario.id)} 
                        variant="danger" 
                        size="sm"
                        className={`${usuario.estado !== 'Activo' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={usuario.estado !== 'Activo'}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>

                      {/* Botón de Activar/Desactivar */}
                      <Button 
                        onClick={() => onToggleActive(usuario.id)} 
                        variant={usuario.estado === 'Activo' ? 'danger' : 'success'} 
                        size="sm"
                      >
                        {usuario.estado === 'Activo' ? <UserIcon className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

UsuariosTable.propTypes = {
  usuarios: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    rol: PropTypes.string.isRequired,
    estado: PropTypes.string.isRequired,
  })).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleActive: PropTypes.func.isRequired,
  requestSort: PropTypes.func,
};

export default UsuariosTable;