// RolesTable.jsx
import PropTypes from 'prop-types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import Button from '../common/button';
import Tabla from '../common/Tabla';

const RolesTable = ({ 
  roles = [], 
  onEdit,
  onDelete,
  onPermiso,
  requestSort = () => {} 
}) => {
  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' }
  ];

  const renderActions = (rol) => (
    <>
      <Button 
        onClick={() => onEdit(rol)} 
        variant="primary" 
        size="sm"
      >
        <PencilIcon className="h-4 w-4" />
      </Button>

      <Button
        onClick={() => onPermiso(rol)}
        variant="primary"
        size="sm"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      </Button>

      <Button 
        onClick={() => onDelete(rol.id)} 
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
      data={roles}
      onSort={requestSort}
      renderActions={renderActions}
    />
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
