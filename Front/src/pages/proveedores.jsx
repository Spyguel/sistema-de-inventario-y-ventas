import Button from '../components/common/button.jsx';
import ProveedoresTable from '../components/Tablas/ProveedoresTable.jsx';
import BarraBusqueda from '../components/common/BarraBusqueda.jsx';
import ProveedorForm from '../components/Modals/ProveedorForm.jsx';
import useSearch from '../hooks/useSearch';
import useFetchContacto from '../hooks/useFetchContacto.js';
import useModals from '../hooks/useModals';
import useItems from '../hooks/useItems'; 
import useContactoItem from '../hooks/useContactoItem';
import { getFilteredProveedoresData } from '../utils/filterProveedores';
import Message from '../components/common/common/Messages/Message.jsx';
import LoadingScreen from '../components/LoadingScreen.jsx'; // Importar componente de carga

function Proveedores() {
  const { 
    clientes: proveedores, 
    fetchClientes: fetchProveedores, 
    handleGuardarContacto, 
    handleEliminarProveedor, 
    handleToggleEstado,
    message,
    closeMessage,
    loading  // Asegúrate de que tu hook devuelva este estado
  } = useFetchContacto();

  const { searchConfig, handleSearch, filterData } = useSearch();
  const { modals, selectedItems, setSelectedItems, handleOpenModal, handleCloseModal, handleAddButton } = useModals();
  const { items, fetchItemProveedor } = useItems(); 
  const { handleGuardarContactoItem, getContactoItemsByContacto } = useContactoItem();

  const filteredProveedores = getFilteredProveedoresData(proveedores, searchConfig, filterData);

  const handleAsignarItems = async (id_proveedor, selectedItemsArr) => {
    try {
      const promises = selectedItemsArr.map(async (id_item) => {
        const response = await handleGuardarContactoItem({ id_contacto: id_proveedor, id_item });
        if (!response) {
          throw new Error(`Error al asignar ítem con ID ${id_item} al proveedor con ID ${id_proveedor}`);
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.error(error);
    }
  };

  const handleObtenerItemsProveedor = async (id_proveedor) => {
    try {
      const itemsAsociados = await getContactoItemsByContacto(id_proveedor);
      return itemsAsociados;
    } catch (error) {
      console.error('Error al obtener ítems asociados:', error);
      return [];
    }
  };

  return (
    <div className="h-[100%] ml-10 p-4">
      {/* Pantalla de carga */}
      {loading && <LoadingScreen />}

      <div className="rounded-lg shadow-lg p-6 h-[95%]">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestión de Proveedores</h2>
        <p className="text-sm text-gray-500 mb-4">Administra los proveedores en el sistema</p>

        <div className="flex justify-end mb-4">
          <Button
            onClick={() => handleAddButton('proveedor')}
            variant="success"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
          >
            + Agregar Proveedor
          </Button>
        </div>

        <BarraBusqueda
          onSearch={handleSearch}
          placeholder="Buscar proveedores..."
          initialFilters={searchConfig.filters}
        />

        <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
          {!loading && (  // Ocultar tabla mientras carga
            <ProveedoresTable
              proveedores={filteredProveedores}
              items={items}
              fetchItemProveedor={fetchItemProveedor}
              onGuardarItems={handleAsignarItems}
              onEdit={(proveedor) => {
                setSelectedItems(prev => ({ ...prev, proveedor }));
                handleOpenModal('proveedor');
              }}
              onDelete={(id) => handleEliminarProveedor(id, fetchProveedores)}
              onToggleEstado={(id) => handleToggleEstado(id, proveedores, fetchProveedores)}
              onObtenerItemsProveedor={handleObtenerItemsProveedor}
            />
          )}
        </div>
      </div>

      {modals.proveedor && (
        <ProveedorForm
          isOpen={modals.proveedor}
          onClose={() => handleCloseModal('proveedor')}
          title={selectedItems.proveedor ? 'Editar Proveedor' : 'Agregar Proveedor'}
          proveedorSeleccionado={selectedItems.proveedor}
          onGuardar={(nuevoProveedor) => handleGuardarContacto(nuevoProveedor, selectedItems, handleCloseModal, fetchProveedores)}
        />
      )}

      <Message
        isOpen={message.isOpen}
        onClose={closeMessage}
        message={message.text}
        type={message.type}
      />
    </div>
  );
}

export default Proveedores;