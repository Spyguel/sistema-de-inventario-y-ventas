import PropTypes from 'prop-types';
import { BuildingStorefrontIcon, XCircleIcon, PencilIcon, CubeIcon } from '@heroicons/react/24/solid';
import Button from '../common/button';
import Tabla from '../common/Tabla';

const ProductTable = ({ 
  productos, 
  onEdit, 
  onAddComponent, 
  onToggleActive,
  requestSort = () => {} 
}) => {
  // Mapea los productos para adecuarlos al formato de la tabla
  const mappedProductos = productos.map(producto => ({
    id_item: producto.id_item,
    unidad_medida: producto.unidad_medida,
    nombre: producto.nombre,
    tipo_item: producto.tipo_item,
    cantidad_actual: producto.cantidad_actual,
    cantidad_minima: producto.cantidad_minima,
    fecha_creacion: producto.fecha_creacion,
    activo: producto.activo,
  }));

  const renderActions = (producto) => (
    <div className="flex gap-2">
      <Button 
        onClick={() => onEdit(producto)} 
        variant="primary" 
        size="sm"
        className={`${!producto.activo ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!producto.activo}
      >
        <PencilIcon className="h-4 w-4" />
      </Button>
      {producto.tipo_item !== 'Materia Prima' && (
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
      <Button 
        onClick={() => onToggleActive(producto.id_item)} 
        variant={producto.activo ? 'danger' : 'success'} 
        size="sm"
      >
        {producto.activo 
          ? <BuildingStorefrontIcon className="h-4 w-4" />
          : <XCircleIcon className="h-4 w-4" />
        }
      </Button>
    </div>
  );

  const headers = [
    { key: 'id_item', label: 'ID' },
    { key: 'unidad_medida', label: 'Unidad' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'tipo_item', label: 'Tipo' },
    { key: 'cantidad_actual', label: 'Cantidad Actual' },
    { key: 'cantidad_minima', label: 'Cantidad Mínima' },
    { key: 'fecha_creacion', label: 'Fecha de Creación' },
    { key: 'activo', label: 'Activo' },
  ];

  return (
    <Tabla 
      headers={headers}
      data={mappedProductos}
      onSort={requestSort}
      renderActions={renderActions}
    />
  );
};

ProductTable.propTypes = {
  productos: PropTypes.arrayOf(PropTypes.shape({
    id_item: PropTypes.number.isRequired,
    unidad_medida: PropTypes.string,
    nombre: PropTypes.string.isRequired,
    tipo_item: PropTypes.string.isRequired,
    cantidad_actual: PropTypes.number,
    cantidad_minima: PropTypes.number,
    fecha_creacion: PropTypes.string,
    activo: PropTypes.bool.isRequired,
  })).isRequired,
  onEdit: PropTypes.func.isRequired,
  onAddComponent: PropTypes.func.isRequired,
  onToggleActive: PropTypes.func.isRequired,
  requestSort: PropTypes.func,
};

export default ProductTable;
