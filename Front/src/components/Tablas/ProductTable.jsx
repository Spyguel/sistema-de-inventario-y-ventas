// ProductTable.jsx
import PropTypes from 'prop-types';
import { BuildingStorefrontIcon, XCircleIcon, PencilIcon, CubeIcon } from '@heroicons/react/24/solid';
import Button from '../common/button';
import Tabla from '../common/Tabla';

const ProductTable = ({ 
  productos = [], 
  onEdit, 
  onAddComponent, 
  onToggleActive,
  requestSort = () => {} 
}) => {
  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'unidadMedida', label: 'Unidad' },
    { key: 'tipoItem', label: 'Tipo' },
    { key: 'cantidadMinima', label: 'Cant. Mínima' },
    { key: 'activo', label: 'Estado' }
  ];

  const renderActions = (producto) => (
    <>
      <Button 
        onClick={() => onEdit(producto)} 
        variant="primary" 
        size="sm" 
        className={`${!producto.activo ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!producto.activo}
      >
        <PencilIcon className="h-4 w-4" />
      </Button>

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

      <Button 
        onClick={() => onToggleActive(producto.id)} 
        variant={producto.activo ? 'danger' : 'success'} 
        size="sm"
      >
        {producto.activo ? <BuildingStorefrontIcon className="h-4 w-4" /> : <XCircleIcon className="h-4 w-4" />}
      </Button>
    </>
  );

  return (
    <Tabla 
      headers={headers}
      data={productos}
      onSort={requestSort}
      renderActions={renderActions}
    />
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
