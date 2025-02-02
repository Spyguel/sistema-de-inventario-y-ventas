// RolesTable.jsx
import PropTypes from 'prop-types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import Button from '../button';

const RolesTable = ({ 
  roles = [], 
  onEdit,
  onDelete,
  onPermiso,
  requestSort = () => {} 
}) => {
  return (
    <div className="flex-grow overflow-hidden bg-accent-subtle-lavender rounded-lg shadow-lg p-4">
      <div className="h-full overflow-hidden">
        <div className="overflow-auto max-h-[60vh]">
          <table className="w-full bg-background_2 rounded-lg" aria-label="Roles Table">
            <thead className="sticky top-0 z-10">
              <tr className="bg-principal text-white">
                <th className="p-2 cursor-pointer hover:bg-slate-500" onClick={() => requestSort('id')}>ID</th>
                <th className="p-2 cursor-pointer hover:bg-slate-500" onClick={() => requestSort('nombre')}>nombre</th>
                <th className="p-2 cursor-pointer hover:bg-slate-500" onClick={() => requestSort('descripcion')}>descripcion</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-2 text-center">No hay roles disponibles</td>
                </tr>
              ) : (
                roles.map((rol) => (
                  <tr 
                    key={rol.id} 
                    className="hover:bg-gray-400 transition-colores text-center"
                  >
                    <td className="p-2 text-center">{rol.id}</td>
                    <td className="p-2 text-center">{rol.nombre}</td>
                    <td className="p-2 text-center">{rol.descripcion}</td>
                    <td className="p-2 text-center flex justify-center space-x-2">
                      {/* Botón de Editar Rol Y Agregar Permisos */}
                      <Button 
                        onClick={() => onEdit(rol)} 
                        variant="primary" 
                        size="sm" 
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>

                      <Button
                        onClick={() => onPermiso(rol)}
                        variant='primary'
                        size='sm'
                        >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </Button>

                      {/* Botón de Eliminar Rol */}
                      <Button 
                        onClick={() => onDelete(rol.id)} 
                        variant="danger" 
                        size="sm"
                      >
                        <TrashIcon className="h-4 w-4" />
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

RolesTable.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string,
  })).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPermiso: PropTypes.func.isRequired,
  requestSort: PropTypes.func,
};

export default RolesTable;