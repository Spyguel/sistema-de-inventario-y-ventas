import PropTypes from 'prop-types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import Button from './button';

const ProductTable = ({ productos, onEdit, onDelete, onAddComponent }) => {
  return (
    <div className="overflow-auto max-h-[60vh]">
      <table className="w-full bg-background_2 rounded-lg">
        <thead className="sticky top-0 z-10">
          <tr className="bg-principal text-white">
            <th className="p-2">ID</th>
            <th className="p-2">Nombre</th>
            <th className="p-2">Unidad</th>
            <th className="p-2">Tipo</th>
            <th className="p-2">Cant. Mínima</th>
            <th className="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id} className={`hover:bg-gray-400 transition-colores text-center ${!producto.activo ? 'bg-gray-200' : ''}`}>
              <td className="p-2 text-center">{producto.id}</td>
              <td className="p-2 text-center">{producto.nombre}</td>
              <td className="p-2 text-center">{producto.unidadMedida}</td>
              <td className="p-2 text-center">{producto.tipoItem}</td>
              <td className="p-2 text-center">{producto.cantidadMinima}</td>
              <td className="p-2 text-center space-x-2">
                {!producto.activo && <span className="text-red-500">(Inactivo)</span>}
                <Button onClick={() => onEdit(producto)} variant="primary" size="sm" className={` ${!producto.activo ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!producto.activo}>
                  <PencilIcon className="h-5 w-5" />
                </Button>
                <Button onClick={() => onDelete(producto.id)} variant="danger" size="sm">
                  <TrashIcon className="h-5 w-5" />
                </Button>
                <Button onClick={() => onAddComponent(producto)} variant="secondary" size="sm" className={`${producto.tipoItem === "MATERIA_PRIMA" ? 'invisible' : ''}`} disabled={producto.tipoItem === "MATERIA_PRIMA"}>
                  <PencilIcon className="h-5 w-5" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

ProductTable.propTypes = {
  productos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      unidadMedida: PropTypes.string.isRequired,
      tipoItem: PropTypes.string.isRequired,
      cantidadMinima: PropTypes.number.isRequired,
      activo: PropTypes.bool.isRequired,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onAddComponent: PropTypes.func.isRequired,
};

export default ProductTable;