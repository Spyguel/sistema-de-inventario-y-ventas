import PropTypes from 'prop-types';
import { PencilIcon, XCircleIcon, BuildingStorefrontIcon } from '@heroicons/react/24/solid';
import Button from '../common/button';
import Tabla from '../common/Tabla'; 

const ClienteTable = ({ 
  clientes = [], 
  onEdit, 
  onToggleActive,
  requestSort = () => {} 
}) => {
  const headers = [
    { key: 'ID_contacto', label: 'ID' },
    { key: 'Nombre', label: 'Nombre' },
    { key: 'tipo_contacto', label: 'Tipo' },
    { key: 'Dirección', label: 'Dirección' },
    { key: 'Teléfono', label: 'Teléfono' },
    { key: 'Mail', label: 'Correo Electrónico' },
  ];

  const renderActions = (cliente) => (
    <>
      <Button 
        onClick={() => onEdit(cliente)} 
        variant="primary" 
        size="sm"
        className={`${!cliente.Activo ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!cliente.Activo}
      >
        <PencilIcon className="h-4 w-4" />
      </Button>

      <Button 
        onClick={() => onToggleActive(cliente.ID_contacto)} 
        variant={cliente.Activo ? 'danger' : 'success'} 
        size="sm"
      >
        {cliente.Activo ? <BuildingStorefrontIcon className="h-4 w-4" /> : <XCircleIcon className="h-4 w-4" />}
      </Button>
    </>
  );

  return (
    <Tabla 
      headers={headers}
      data={clientes}
      onSort={requestSort}
      renderActions={renderActions}
    />
  );
};

ClienteTable.propTypes = {
  clientes: PropTypes.arrayOf(PropTypes.shape({
    ID_contacto: PropTypes.number.isRequired,
    Nombre: PropTypes.string.isRequired,
    tipo_contacto: PropTypes.string.isRequired,
    Dirección: PropTypes.string.isRequired,
    Teléfono: PropTypes.string.isRequired,
    Mail: PropTypes.string.isRequired,
    Activo: PropTypes.bool.isRequired,
  })).isRequired,
  onEdit: PropTypes.func.isRequired,
  onToggleActive: PropTypes.func.isRequired,
  requestSort: PropTypes.func,
};

export default ClienteTable;
