import Button from '../components/common/button.jsx';
import ClientesTable from '../components/Tablas/ClientesTable.jsx';
import BarraBusqueda from '../components/common/BarraBusqueda.jsx';
import ClienteForm from '../components/Modals/ClienteForm.jsx';
import useSearch from '../hooks/useSearch';
import useFetchContacto from '../hooks/useFetchContacto.js';
import useModals from '../hooks/useModals';
import { getFilteredClientesData } from '../utils/filterClientes';
import LoadingScreen from '../components/LoadingScreen.jsx'; // Importar componente de carga

function Clientes() {
    const { 
        clientes, 
        fetchClientes, 
        handleGuardarContacto, 
        handleEliminarCliente, 
        handleToggleEstado,
        loading // Asegúrate de que tu hook devuelva este estado
    } = useFetchContacto();
    
    const { searchConfig, handleSearch, filterData } = useSearch();
    const { modals, selectedItems, setSelectedItems, handleOpenModal, handleCloseModal, handleAddButton } = useModals();

    const filteredClientes = getFilteredClientesData(clientes, searchConfig, filterData);

    const handleEliminarClienteCallback = async (id) => {
        await handleEliminarCliente(id, fetchClientes);
    };

    const handleToggleEstadoCallback = async (id) => {
        await handleToggleEstado(id, clientes, fetchClientes);
    };

    return (
        <div className="h-[100%] ml-10 p-4">
            {/* Pantalla de carga */}
            {loading && <LoadingScreen />}

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
                    {!loading && ( // Ocultar tabla mientras carga
                        <ClientesTable
                            clientes={filteredClientes}
                            onEdit={(cliente) => {
                                setSelectedItems(prev => ({ ...prev, cliente }));
                                handleOpenModal('cliente');
                            }}
                            onDelete={handleEliminarClienteCallback}
                            onToggleEstado={handleToggleEstadoCallback}
                        />
                    )}
                </div>
            </div>

            {modals.cliente && (
                <ClienteForm
                    isOpen={modals.cliente}
                    onClose={() => handleCloseModal('cliente')}
                    title={selectedItems.cliente ? 'Editar Cliente' : 'Agregar Cliente'}
                    clienteSeleccionado={selectedItems.cliente}
                    onGuardar={(nuevoCliente) => handleGuardarContacto(nuevoCliente, selectedItems, handleCloseModal, fetchClientes)}
                />
            )}
        </div>
    );
}

export default Clientes;