// UsuariosTable.jsx
import PropTypes from 'prop-types';
import { PencilIcon, UserIcon } from '@heroicons/react/24/solid';
import Button from '../common/button';
import Tabla from '../common/Tabla';

const UsuariosTable = ({ 
  usuarios = [], 
  onEdit,
  onRole,
  onToggleActive,
  requestSort = () => {} 
}) => {
  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'email', label: 'Email' },
    { key: 'rol', label: 'Rol' },
    { key: 'estado', label: 'Estado' }
  ];

  const renderActions = (usuario) => (
    <>
      <Button 
        onClick={() => onEdit(usuario)} 
        variant="primary" 
        size="sm" 
        className={`${usuario.estado !== 'Activo' ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={usuario.estado !== 'Activo'}
      >
        <PencilIcon className="h-4 w-4" />
      </Button>

      <Button
        onClick={() => onRole(usuario)}
        variant="primary"
        size="sm"
        className={`${usuario.estado !== 'Activo' ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={usuario.estado !== 'Activo'}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </Button>

      <Button 
        onClick={() => onToggleActive(usuario.id)} 
        variant={usuario.estado === 'Activo' ? 'danger' : 'success'} 
        size="sm"
      >
        {usuario.estado === 'Activo' ? <UserIcon className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
      </Button>
    </>
  );

  return (
    <Tabla 
      headers={headers}
      data={usuarios}
      onSort={requestSort}
      renderActions={renderActions}
    />
  );
};

UsuariosTable.propTypes = {
  usuarios: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    rol: PropTypes.string.isRequired,
    estado: PropTypes.string.isRequired,
  })).isRequired,
  onEdit: PropTypes.func.isRequired,
  onRole: PropTypes.func.isRequired,
  onToggleActive: PropTypes.func.isRequired,
  requestSort: PropTypes.func,
};

export default UsuariosTable;
