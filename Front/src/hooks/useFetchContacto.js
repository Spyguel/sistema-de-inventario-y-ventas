// hooks/useFetchContacto.js
import { useState, useEffect } from 'react';

const useFetchContacto = () => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchClientes = async () => {
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
            console.error('Error fetching clientes:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleGuardarContacto = async (nuevoProveedor, selectedItems, handleCloseModal, fetchProveedores) => {
        try {
            const isEditing = !!selectedItems.proveedor;
            const contactoId = isEditing ? selectedItems.proveedor.id_contacto : null;
            const url = isEditing ? `http://localhost:3000/contacto/${contactoId}` : 'http://localhost:3000/contacto';
            const method = isEditing ? 'PUT' : 'POST';

            const proveedorData = { ...nuevoProveedor, tipo_contacto: 'Proveedor' };

            console.log('Enviando solicitud:', { url, method, body: proveedorData, contactoId });

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
        } catch (error) {
            console.error('Error completo:', error);
            alert(`Error al guardar el proveedor: ${error.message}`);
        }
    };

    const handleEliminarProveedor = async (id, fetchProveedores) => {
        try {
            const response = await fetch(`http://localhost:3000/contacto/${id}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok) {
                if (data.tieneMovimientos) {
                    // En lugar de mostrar un mensaje de error, desactiva el proveedor
                    await handleToggleEstado(id, clientes, fetchProveedores);
                    alert('El proveedor no se puede eliminar porque tiene movimientos asociados. Se ha desactivado.');
                } else {
                    throw new Error(data.error || 'Error al eliminar el proveedor');
                }
                return;
            }
            fetchProveedores();
        } catch (error) {
            console.error('Error:', error);
            alert(`Error al eliminar el proveedor: ${error.message}`);
        }
    };

    const handleEliminarCliente = async (id, fetchClientes) => {
        try {
            const response = await fetch(`http://localhost:3000/contacto/${id}`, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok) {
                if (data.tieneMovimientos) {
                    alert('No se puede eliminar el cliente porque tiene movimientos asociados.');
                } else {
                    throw new Error(data.error || 'Error al eliminar el cliente');
                }
                return;
            }
            fetchClientes();
        } catch (error) {
            console.error('Error:', error);
            alert(`Error al eliminar el cliente: ${error.message}`);
        }
    }

    const handleToggleEstado = async (id, proveedores, fetchProveedores) => {
        const proveedor = proveedores.find(c => c.id_contacto === id);
        if (!proveedor || proveedor.activo === undefined) {
            console.error('El proveedor no tiene un estado válido');
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
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    return { clientes, loading, error, fetchClientes, handleGuardarContacto, handleEliminarProveedor, handleEliminarCliente, handleToggleEstado };
};

export default useFetchContacto;
