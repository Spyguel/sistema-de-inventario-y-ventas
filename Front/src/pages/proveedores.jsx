import Button from '../components/common/button.jsx';
import ProveedoresTable from '../components/Tablas/ProveedoresTable.jsx';
import BarraBusqueda from '../components/common/BarraBusqueda.jsx';
import ProveedorForm from '../components/Modals/ProveedorForm.jsx';
import useSearch from '../hooks/useSearch';
import useFetchProveedores from '../hooks/useFetchContacto.js';
import useModals from '../hooks/useModals';
import useItems from '../hooks/useItems'; 
import useContactoItem from '../hooks/useContactoItem';
import { getFilteredProveedoresData } from '../utils/filterProveedores';

function Proveedores() {
  const { clientes: proveedores, fetchClientes: fetchProveedores, handleGuardarContacto, handleEliminarProveedor, handleToggleEstado } = useFetchProveedores();
  const { searchConfig, handleSearch, filterData } = useSearch();
  const { modals, selectedItems, setSelectedItems, handleOpenModal, handleCloseModal, handleAddButton } = useModals();
  const { items, fetchItemProveedor } = useItems(); 
  const { handleGuardarContactoItem } = useContactoItem();

  // Filtrado de proveedores mediante helper
  const filteredProveedores = getFilteredProveedoresData(proveedores, searchConfig, filterData);

  // Función que se invoca cuando el formulario de ítems envía datos
  const handleAsignarItems = async (id_proveedor, selectedItemsArr) => {
    console.log('Ítems recibidos en handleAsignarItems:', selectedItemsArr); 
    
    try {
      const promises = selectedItemsArr.map(async (id_item) => {
        // Verificar si la relación ya existe
        const response = await handleGuardarContactoItem({ id_contacto: id_proveedor, id_item });

        if (!response) {
          throw new Error(`Error al asignar ítem con ID ${id_item} al proveedor con ID ${id_proveedor}`);
        }
      });

      await Promise.all(promises);

      // Aquí puedes actualizar el estado o mostrar un mensaje de éxito
      console.log('Ítems asignados correctamente al proveedor', id_proveedor);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-[100%] ml-10 p-4">
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
          <ProveedoresTable
            proveedores={filteredProveedores}
            items={items}
            fetchItemProveedor={fetchItemProveedor}  // Función para refrescar los ítems de proveedor
            onGuardarItems={handleAsignarItems}       // Función que se encargará de asignar los ítems (usa useContactoItem)
            onEdit={(proveedor) => {
              setSelectedItems(prev => ({ ...prev, proveedor }));
              handleOpenModal('proveedor');
            }}
            onDelete={(id) => handleEliminarProveedor(id, fetchProveedores)}
            onToggleEstado={(id) => handleToggleEstado(id, proveedores, fetchProveedores)}
          />
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
    </div>
  );
}

export default Proveedores;
