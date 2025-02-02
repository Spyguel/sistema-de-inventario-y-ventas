// UsuariosTable.jsx
import PropTypes from 'prop-types';
import { PencilIcon, UserIcon } from '@heroicons/react/24/solid';
import Button from '../button';

const UsuariosTable = ({ 
  usuarios = [], 
  onEdit,
  onRole,
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

                      {/* Botón de Rol */}
                      <Button
                      onClick={() => onRole(usuario)}
                      variant='primary'
                      size='sm'
                      className={`${usuario.estado !== 'Activo' ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={usuario.estado !== 'Activo'}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
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
  onRole: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleActive: PropTypes.func.isRequired,
  requestSort: PropTypes.func,
};

export default UsuariosTable;