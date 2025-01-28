import PropTypes from 'prop-types';
import { BuildingStorefrontIcon, XCircleIcon, PencilIcon, CubeIcon } from '@heroicons/react/24/solid';
import Button from '../button';

const ProductTable = ({ 
  productos = [], 
  onEdit, 
  onAddComponent, 
  onToggleActive,
  requestSort = () => {} 
}) => {
  return (
    <div className="flex-grow overflow-hidden bg-gray-300 rounded-lg shadow-lg p-4">
      <div className="h-full overflow-hidden">
        <div className="overflow-auto max-h-[60vh]">
          <table className="w-full bg-background_2 rounded-lg" aria-label="Product Table">
            <thead className="sticky top-0 z-10">
              <tr className="bg-principal text-white">
                <th className="p-2 cursor-pointer hover:bg-slate-500" onClick={() => requestSort('id')}>ID</th>
                <th className="p-2 cursor-pointer hover:bg-slate-500" onClick={() => requestSort('nombre')}>Nombre</th>
                <th className="p-2 cursor-pointer hover:bg-slate-500" onClick={() => requestSort('unidadMedida')}>Unidad</th>
                <th className="p-2 cursor-pointer hover:bg-slate-500" onClick={() => requestSort('tipoItem')}>Tipo</th>
                <th className="p-2 cursor-pointer hover:bg-slate-500" onClick={() => requestSort('cantidadMinima')}>Cant. Mínima</th>
                <th className="p-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-2 text-center">No hay productos disponibles</td>
                </tr>
              ) : (
                productos.map((producto) => (
                  <tr 
                    key={producto.id} 
                    className={`hover:bg-gray-400 transition-colores text-center ${!producto.activo ? 'bg-gray-400 text-gray-500' : ''}`}
                  >
                    <td className="p-2 text-center">{producto.id}</td>
                    <td className="p-2 text-center">{producto.nombre}</td>
                    <td className="p-2 text-center">{producto.unidadMedida}</td>
                    <td className="p-2 text-center">{producto.tipoItem}</td>
                    <td className="p-2 text-center">{producto.cantidadMinima}</td>
                    <td className="p-2 text-center flex justify-center space-x-2">
                      {/* Botón de Editar Datos */}
                      <Button 
                        onClick={() => onEdit(producto)} 
                        variant="primary" 
                        size="sm" 
                        className={`${!producto.activo ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={!producto.activo}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>

                      {/* Botón de Agregar Componentes (solo para productos terminados) */}
                      {producto.tipoItem !== 'MATERIA_PRIMA' && (
                        <Button 
                          onClick={() => onAddComponent(producto)} 
                          variant="secondary" 
                          size="sm"
                          className={`${!producto.activo ? 'opacity-50 cursor-not-allowed' : ''}`}
                          disabled={!producto.activo}
                        >
                          <CubeIcon className="h-4 w-4" />
                        </Button>
                      )}

                      {/* Botón de Activar/Desactivar */}
                      <Button 
                        onClick={() => onToggleActive(producto.id)} 
                        variant={producto.activo ? 'danger' : 'success'} 
                        size="sm"
                      >
                        {producto.activo ? <BuildingStorefrontIcon className="h-4 w-4" /> : <XCircleIcon className="h-4 w-4" />}
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

ProductTable.propTypes = {
  productos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    unidadMedida: PropTypes.string.isRequired,
    tipoItem: PropTypes.string.isRequired,
    cantidadMinima: PropTypes.number.isRequired,
    activo: PropTypes.bool.isRequired,
  })).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
  onAddComponent: PropTypes.func.isRequired,
  onToggleActive: PropTypes.func.isRequired,
  requestSort: PropTypes.func,
};

export default ProductTable;