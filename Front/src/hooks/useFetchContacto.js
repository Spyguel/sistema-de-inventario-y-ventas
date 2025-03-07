import { useState, useEffect, useCallback } from 'react';

const useFetchContacto = () => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState({ isOpen: false, text: '', type: 'info' });

    const showMessage = (text, type = 'info') => {
        setMessage({ isOpen: true, text, type });
    };

    const closeMessage = () => {
        setMessage({ isOpen: false, text: '', type: 'info' });
    };

    const fetchClientes = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/contacto');
            if (!response.ok) {
                throw new Error('Error al obtener los clientes');
            }
            const data = await response.json();
            setClientes(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            showMessage('Error fetching clientes: ' + err.message, 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleGuardarContacto = async (nuevoProveedor, selectedItems, handleCloseModal, fetchProveedores) => {
        try {
            const isEditing = !!selectedItems.proveedor;
            const contactoId = isEditing ? selectedItems.proveedor.id_contacto : null;
            const url = isEditing ? `http://localhost:3000/contacto/${contactoId}` : 'http://localhost:3000/contacto';
            const method = isEditing ? 'PUT' : 'POST';

            const proveedorData = { ...nuevoProveedor, tipo_contacto: 'Proveedor' };

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(proveedorData),
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.error || 'Error desconocido al guardar el proveedor');
            }

            fetchProveedores();
            handleCloseModal('proveedor');
            showMessage('Los proveedores se actualizaron correctamente', 'success');
        } catch (error) {
            showMessage('Error al guardar el proveedor: ' + error.message, 'error');
        }
    };

    const handleEliminarProveedor = async (id, fetchProveedores) => {
        try {
            const response = await fetch(`http://localhost:3000/contacto/${id}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok) {
                if (data.tieneMovimientos || data.tieneItemsAsociados) {
                    showMessage('El proveedor tiene movimientos o ítems asociados. Se ha desactivado.', 'warning');
                } else {
                    throw new Error(data.error || 'Error al eliminar el proveedor');
                }
                return;
            }
            fetchProveedores();
            showMessage('Proveedor inabilitado con exito.', 'success');
        } catch (error) {
            showMessage('Error al eliminar el proveedor: ' + error.message, 'error');
        }
    };

    const handleEliminarCliente = async (id, fetchClientes) => {
        try {
            const response = await fetch(`http://localhost:3000/contacto/${id}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok) {
                if (data.tieneMovimientos) {
                    showMessage('No se puede eliminar el cliente porque tiene movimientos asociados.', 'warning');
                } else {
                    throw new Error(data.error || 'Error al eliminar el cliente');
                }
                return;
            }
            fetchClientes();
            showMessage('El estado del cliente cambio exitosamente.', 'success');
        } catch (error) {
            showMessage('Error al eliminar el cliente: ' + error.message, 'error');
        }
    }

    const handleToggleEstado = async (id, proveedores, fetchProveedores) => {
        const proveedor = proveedores.find(c => c.id_contacto === id);
        if (!proveedor || proveedor.activo === undefined) {
            showMessage('El proveedor no tiene un estado válido', 'error');
            return;
        }

        const nuevoEstado = !proveedor.activo;

        try {
            const response = await fetch(`http://localhost:3000/contacto/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...proveedor, activo: nuevoEstado }),
            });

            if (!response.ok) {
                throw new Error('Error al cambiar el estado del proveedor');
            }

            fetchProveedores();
            showMessage('Estado del proveedor cambiado correctamente.', 'success');
        } catch (error) {
            showMessage('Error al cambiar el estado del proveedor: ' + error.message, 'error');
        }
    };

    useEffect(() => {
        fetchClientes();
    }, [fetchClientes]);

    return { 
        clientes, 
        loading, 
        error, 
        fetchClientes, 
        handleGuardarContacto, 
        handleEliminarProveedor, 
        handleEliminarCliente, 
        handleToggleEstado,
        message,
        closeMessage
    };
};

export default useFetchContacto;