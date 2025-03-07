import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../common/button.jsx';
import Tabla from '../common/Tabla.jsx';
import { PencilIcon, ListBulletIcon } from '@heroicons/react/24/solid';
import ProveedorItemForm from '../Modals/ProveedorItemForm.jsx';

const ProveedoresTable = ({ 
    proveedores = [], 
    items = [],
    fetchItemProveedor, 
    onEdit,  
    onDelete,
    requestSort = () => {},
    onGuardarItems,  // Prop para asignar ítems
    onObtenerItemsProveedor // Nueva prop para obtener ítems asociados
}) => {
    const [selectedProveedorItem, setSelectedProveedorItem] = useState(null);
    const [showProveedorItemModal, setShowProveedorItemModal] = useState(false);
    const [itemsAsociados, setItemsAsociados] = useState([]); // Estado para almacenar los ítems asociados

    // Al hacer clic, refrescamos los ítems desde la base de datos y abrimos el modal
    const handleProveedorItem = async (proveedor) => {
        console.log('Proveedor seleccionado:', proveedor); // Verificar el proveedor seleccionado

        if (fetchItemProveedor) {
          console.log('Refrescando ítems desde la base de datos...'); // Verificar si se llama a fetchItemProveedor
          fetchItemProveedor();
        }

        // Obtener los ítems asociados al proveedor seleccionado
        if (onObtenerItemsProveedor) {
            console.log('Obteniendo ítems asociados para el proveedor:', proveedor.id_contacto); // Verificar el ID del proveedor
            const itemsAsociados = await onObtenerItemsProveedor(proveedor.id_contacto);
            console.log('Ítems asociados obtenidos:', itemsAsociados); // Verificar los ítems asociados
            setItemsAsociados(itemsAsociados); // Guardar los ítems asociados en el estado
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
                <ListBulletIcon className="h-4 w-4" />
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
                      console.log('Guardando nuevos ítems:', nuevoItem); // Verificar los ítems que se están guardando
                      onGuardarItems(selectedProveedorItem.id_contacto, nuevoItem);
                      setShowProveedorItemModal(false);
                    }}
                    proveedorSeleccionado={selectedProveedorItem}
                    items={items}
                    itemsAsociados={itemsAsociados} // Pasar los ítems asociados al formulario
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
    onObtenerItemsProveedor: PropTypes.func.isRequired, // Nueva prop
};

export default ProveedoresTable;