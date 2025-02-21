// Componente ClientesTable.jsx
import PropTypes from 'prop-types';
import Button from '../common/button.jsx';
import Tabla from '../common/Tabla.jsx';
import { PencilIcon, UserIcon } from '@heroicons/react/24/solid';

const ClientesTable = ({ 
    clientes = [], 
    onEdit, 
    onToggleEstado, 
    onDelete,
    requestSort = () => {}
}) => {
    const headers = [
        { key: 'id_contacto', label: 'ID' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'tipo_contacto', label: 'Tipo' },
        { key: 'direccion', label: 'Dirección' },
        { key: 'telefono', label: 'Teléfono' },
        { key: 'mail', label: 'Email' },
        { key: 'activo', label: 'Estado' }
    ];

    const renderActions = (cliente) => (
        <div className="flex justify-center space-x-2">
            <Button 
                onClick={() => onEdit(cliente)} 
                variant="primary" 
                size="sm" 
                className={`${cliente.activo ? '' : 'opacity-50 cursor-not-allowed'}`}
                disabled={!cliente.activo}
            >
                <PencilIcon className="h-4 w-4" />
            </Button>

            <Button
                onClick={() => onToggleEstado(cliente.id_contacto, cliente.activo)}
                variant={cliente.activo ? 'warning' : 'success'}
                size="sm"
                className={`${cliente.activo ? 'bg-yellow-500' : 'bg-green-500'} text-white rounded hover:${cliente.activo ? 'bg-yellow-600' : 'bg-green-600'}`}
            >
                <UserIcon className="h-4 w-4" />
            </Button>

            <Button 
                onClick={() => onDelete(cliente.id_contacto)} 
                variant="danger" 
                size="sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </Button>
        </div>
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

ClientesTable.propTypes = {
    clientes: PropTypes.arrayOf(PropTypes.shape({
        id_contacto: PropTypes.number.isRequired,
        nombre: PropTypes.string.isRequired,
        tipo_contacto: PropTypes.string.isRequired,
        direccion: PropTypes.string.isRequired,
        telefono: PropTypes.string.isRequired,
        mail: PropTypes.string.isRequired,
        activo: PropTypes.bool.isRequired,
    })).isRequired,
    onEdit: PropTypes.func.isRequired,
    onToggleEstado: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    requestSort: PropTypes.func,
};

export default ClientesTable;
