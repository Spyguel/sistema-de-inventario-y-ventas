import Button from '../components/common/button.jsx';
import ClientesTable from '../components/Tablas/ClientesTable.jsx';
import BarraBusqueda from '../components/common/BarraBusqueda.jsx';
import ClienteForm from '../components/Modals/ClienteForm.jsx';
import useSearch from '../hooks/useSearch';
import useFetchClientes from '../hooks/useFetchContacto.js';
import useModals from '../hooks/useModals';

function Clientes() {
    const { clientes, fetchClientes } = useFetchClientes();
    const { searchConfig, handleSearch, filterData } = useSearch();
    const { modals, selectedItems, setSelectedItems, handleOpenModal, handleCloseModal, handleAddButton } = useModals();

    const getFilteredData = () => {
        const { term, filters } = searchConfig;
        const filteredData = filterData(clientes, term, filters);
        
        // Modificar el campo 'activo' a 'Activo' o 'Inactivo'
        return filteredData.map(cliente => ({
            ...cliente,
            activo: cliente.activo ? 'Activo' : 'Inactivo'
        }));
    };
    

    const handleGuardarContacto = async (nuevoCliente) => {
        try {
            // Verificar si estamos editando un cliente existente
            const isEditing = !!selectedItems.cliente;
            
            // Si estamos editando, usar id_contacto en lugar de id
            const contactoId = isEditing ? selectedItems.cliente.id_contacto : null;
            
            const url = isEditing
                ? `http://localhost:3000/contacto/${contactoId}`
                : 'http://localhost:3000/contacto';
            
            const method = isEditing ? 'PUT' : 'POST';
            
            console.log('Enviando solicitud:', {
                url,
                method,
                body: nuevoCliente,
                contactoId
            });
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevoCliente),
            });
            
            // Obtener la respuesta como JSON para mejor manejo de errores
            const responseData = await response.json();
            
            if (!response.ok) {
                throw new Error(responseData.error || 'Error desconocido al guardar el cliente');
            }
            
            alert('Cliente guardado correctamente');
            fetchClientes();
            handleCloseModal('cliente');
        } catch (error) {
            console.error('Error completo:', error);
            alert(`Error al guardar el cliente: ${error.message}`);
        }
    };
    

    const handleEliminarCliente = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/contacto/${id}`, {
                method: 'DELETE',
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                if (data.tieneMovimientos) {
                    alert('No se puede eliminar el contacto porque tiene movimientos asociados.');
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
    };
    const handleToggleEstado = async (id) => {
        const cliente = clientes.find(c => c.id === id);

        if (!cliente || cliente.activo === undefined) {
            console.error("El cliente no tiene un estado válido");
            return;
        }

        const nuevoEstado = !cliente.activo;

        try {
            const response = await fetch(`http://localhost:3000/contacto/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...cliente, activo: nuevoEstado }),
            });

            if (!response.ok) {
                throw new Error('Error al cambiar el estado del cliente');
            }

            fetchClientes();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="h-[100%] ml-10 p-4">
            <div className="rounded-lg shadow-lg p-6 h-[95%]">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestión de Clientes</h2>
                <p className="text-sm text-gray-500 mb-4">Administra los clientes en el sistema</p>

                <div className="flex justify-end mb-4">
                    <Button
                        onClick={() => handleAddButton('cliente')}
                        variant="success"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                    >
                        + Agregar Cliente
                    </Button>
                </div>

                <BarraBusqueda
                    onSearch={handleSearch}
                    placeholder="Buscar clientes..."
                    initialFilters={searchConfig.filters}
                />

                <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                    <ClientesTable
                        clientes={getFilteredData()}
                        onEdit={(cliente) => {
                            setSelectedItems(prev => ({ ...prev, cliente }));
                            handleOpenModal('cliente');
                        }}
                        onDelete={handleEliminarCliente}
                        onToggleEstado={handleToggleEstado}
                    />
                </div>
            </div>

            {modals.cliente && (
                <ClienteForm
                    isOpen={modals.cliente}
                    onClose={() => handleCloseModal('cliente')}
                    title={selectedItems.cliente ? 'Editar Cliente' : 'Agregar Cliente'}
                    clienteSeleccionado={selectedItems.cliente}
                    onGuardar={handleGuardarContacto}
                />
            )}
        </div>
    );
}

export default Clientes;
