// components/Tablas/ProveedoresTable.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../common/button.jsx';
import Tabla from '../common/Tabla.jsx';
import { PencilIcon } from '@heroicons/react/24/solid';
import ProveedorItemForm from '../Modals/ProveedorItemForm.jsx';

const ProveedoresTable = ({ 
    proveedores = [], 
    items = [],
    fetchItemProveedor, 
    onEdit,  
    onDelete,
    requestSort = () => {},
    onGuardarItems  // Nueva prop para asignar ítems
}) => {
    const [selectedProveedorItem, setSelectedProveedorItem] = useState(null);
    const [showProveedorItemModal, setShowProveedorItemModal] = useState(false);

    // Al hacer clic, refrescamos los ítems desde la base de datos y abrimos el modal
    const handleProveedorItem = (proveedor) => {
        if (fetchItemProveedor) {
          fetchItemProveedor();
        }
        setSelectedProveedorItem(proveedor);
        setShowProveedorItemModal(true);
    };

    const headers = [
        { key: 'id_contacto', label: 'ID' },
        { key: 'nombre', label: 'Nombre' },
        { key: 'tipo_contacto', label: 'Tipo' },
        { key: 'direccion', label: 'Dirección' },
        { key: 'telefono', label: 'Teléfono' },
        { key: 'mail', label: 'Email' },
        { key: 'activo', label: 'Estado' }
    ];

    const renderActions = (proveedor) => (
        <div className="flex justify-center space-x-2">
            <Button 
                onClick={() => onEdit(proveedor)} 
                variant="primary" 
                size="sm" 
                className={`${proveedor.activo ? '' : 'opacity-50 cursor-not-allowed'}`}
                disabled={!proveedor.activo}
            >
                <PencilIcon className="h-4 w-4" />
            </Button>

            <Button
                onClick={() => handleProveedorItem(proveedor)}
                variant="primary"
                size="sm"
                className={`${proveedor.activo ? 'bg-yellow-500' : 'bg-green-500'} text-white rounded hover:${proveedor.activo ? 'bg-yellow-600' : 'bg-green-600'}`}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            </Button>

            <Button 
                onClick={() => onDelete(proveedor.id_contacto)} 
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
        <>
            <Tabla 
                headers={headers}
                data={proveedores}
                onSort={requestSort}
                renderActions={renderActions}
            />
            
            {showProveedorItemModal && selectedProveedorItem && (
                <ProveedorItemForm
                    isOpen={showProveedorItemModal}
                    onClose={() => setShowProveedorItemModal(false)}
                    // Aquí se delega la asignación de ítems al callback recibido
                    onGuardar={(nuevoItem) => {
                      onGuardarItems(selectedProveedorItem.id_contacto, nuevoItem);
                      setShowProveedorItemModal(false);
                    }}
                    proveedorSeleccionado={selectedProveedorItem}
                    items={items}
                />
            )}
        </>
    );
};

ProveedoresTable.propTypes = {
    proveedores: PropTypes.arrayOf(PropTypes.shape({
        id_contacto: PropTypes.number.isRequired,
        nombre: PropTypes.string.isRequired,
        tipo_contacto: PropTypes.string.isRequired,
        direccion: PropTypes.string.isRequired,
        telefono: PropTypes.string.isRequired,
        mail: PropTypes.string.isRequired,
        activo: PropTypes.bool.isRequired,
    })).isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
        id_item: PropTypes.number.isRequired,
        nombre: PropTypes.string.isRequired,
    })),
    fetchItemProveedor: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    requestSort: PropTypes.func,
    onGuardarItems: PropTypes.func.isRequired,
};

export default ProveedoresTable;
