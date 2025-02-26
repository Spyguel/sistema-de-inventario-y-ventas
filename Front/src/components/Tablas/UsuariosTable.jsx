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
    { key: 'ID_usuario', label: 'ID' },
    { key: 'email', label: 'Email' },
    { key: 'rol', label: 'Rol' },
    { key: 'estado', label: 'Estado' }
  ];

  const usuariosTransformados = usuarios.map(usuario => ({
    ...usuario,
    estado: usuario.estado ? 'Activo' : 'Inactivo'
  }));

  const renderActions = (usuario) => (
    <>
      <Button 
        onClick={() => onEdit(usuario)} 
        variant="primary" 
        size="sm"
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
        onClick={() => onToggleActive(usuario.ID_usuario)} 
        variant={usuario.estado === 'Activo' ? 'danger' : 'success'} 
        size="sm"
      >
        <UserIcon className="h-4 w-4" />
      </Button>
    </>
  );

  return (
    <Tabla 
      headers={headers}
      data={usuariosTransformados}
      onSort={requestSort}
      renderActions={renderActions}
    />
  );
};

UsuariosTable.propTypes = {
  usuarios: PropTypes.arrayOf(PropTypes.shape({
    ID_usuario: PropTypes.number.isRequired,
    email: PropTypes.string.isRequired,
    rol: PropTypes.string.isRequired,
    estado: PropTypes.bool.isRequired, // Ahora reflejamos que viene como booleano
  })).isRequired,
  onEdit: PropTypes.func.isRequired,
  onRole: PropTypes.func.isRequired,
  onToggleActive: PropTypes.func.isRequired,
  requestSort: PropTypes.func,
};

export default UsuariosTable;
