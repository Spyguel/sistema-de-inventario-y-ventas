import PropTypes from 'prop-types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import Button from '../button';

const PermisosTable = ({ 
  permisos = [], 
  onEdit,
  onDelete,
  requestSort = () => {} 
}) => {
  return (
    <div className="flex-grow overflow-hidden bg-accent-subtle-lavender rounded-lg shadow-lg p-4">
      <div className="h-full overflow-hidden">
        <div className="overflow-auto max-h-[60vh]">
          <table className="w-full bg-background_2 rounded-lg" aria-label="Permisos Table">
            <thead className="sticky top-0 z-10">
              <tr className="bg-principal text-white">
                <th className="p-2 cursor-pointer hover:bg-slate-500" onClick={() => requestSort('id')}>ID</th>
                <th className="p-2 cursor-pointer hover:bg-slate-500" onClick={() => requestSort('nombre')}>nombre</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {permisos.length === 0 ? (
                <tr>
                  <td colSpan="3" className="p-2 text-center">No hay permisos disponibles</td>
                </tr>
              ) : (
                permisos.map((permiso) => (
                  <tr 
                    key={permiso.id} 
                    className="hover:bg-gray-400 transition-colores text-center"
                  >
                    <td className="p-2 text-center">{permiso.id}</td>
                    <td className="p-2 text-center">{permiso.nombre}</td>
                    <td className="p-2 text-center flex justify-center space-x-2">
                      {/* Botón de Editar Permiso */}
                      <Button 
                        onClick={() => onEdit(permiso)} 
                        variant="primary" 
                        size="sm" 
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>

                      {/* Botón de Eliminar Permiso */}
                      <Button 
                        onClick={() => onDelete(permiso.id)} 
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

PermisosTable.propTypes = {
  permisos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
  })).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  requestSort: PropTypes.func,
};

export default PermisosTable;