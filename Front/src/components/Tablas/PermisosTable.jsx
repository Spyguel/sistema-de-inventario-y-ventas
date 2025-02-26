// PermisosTable.jsx
import PropTypes from 'prop-types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import Button from '../common/button';
import Tabla from '../common/Tabla'; 

const PermisosTable = ({ 
  permisos = [], 
  onEdit,
  onDelete,
  requestSort = () => {} 
}) => {
  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' },
    { key: 'acceso', label: 'Acceso' }
  ];

  const renderActions = (permiso) => (
    <>
      <Button 
        onClick={() => onEdit(permiso)} 
        variant="primary" 
        size="sm"
      >
        <PencilIcon className="h-4 w-4" />
      </Button>

      <Button 
        onClick={() => onDelete(permiso.ID_permiso)} 
        variant="danger" 
        size="sm"
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </>
  );

  return (
    <Tabla 
      headers={headers}
      data={permisos}
      onSort={requestSort}
      renderActions={renderActions}
    />
  );
};

PermisosTable.propTypes = {
  permisos: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string,
  })).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  requestSort: PropTypes.func,
};

export default PermisosTable;
