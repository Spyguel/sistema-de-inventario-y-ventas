import { useState } from 'react';
import Button from '../components/common/button.jsx';
import MovimientosTable from '../components/Tablas/MovimientosTable.jsx';
import BarraBusqueda from '../components/common/BarraBusqueda.jsx';
import MovimientoForm from '../components/Modals/MovimientoForm.jsx';
import useFetchMovimientos from '../hooks/useFetchMovimientos.js';
import useContactos from '../hooks/useContactos.js';
import useItems from '../hooks/useItems.js';
import useUsuario from '../hooks/useUsuarios.js';
import { getFilteredMovimientosData } from '../utils/filterMovimientos';

function Movimientos() {
  const { usuario, loading: usuarioLoading, error: usuarioError } = useUsuario();
  const { items } = useItems();
  const { contactos } = useContactos();
  const { movimientos, handleGuardarMovimiento, handleToggleActive } = useFetchMovimientos();

  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Función genérica de filtrado para movimientos
  const filterData = (data, term) => {
    return data.filter(movimiento => 
      movimiento.id_movimiento.toString().includes(term) ||
      movimiento.tipo_mov.toLowerCase().includes(term.toLowerCase()) ||
      movimiento.razon.toLowerCase().includes(term.toLowerCase()) ||
      movimiento.detalle.toLowerCase().includes(term.toLowerCase())
    );
  };

  const searchConfig = { term: searchTerm };

  // Se aplican los filtros del utils para movimientos
  const movimientosFiltrados = getFilteredMovimientosData(movimientos, searchConfig, filterData);

  const handleSearch = (term) => setSearchTerm(term);
  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  const handleGuardar = async (movimientoData) => {
    await handleGuardarMovimiento({
      ...movimientoData,
      id_usuario: usuario.id
    });
    closeForm();
  };

  if (usuarioLoading) return <div>Cargando usuario...</div>;
  if (usuarioError) return <div>Error: {usuarioError}</div>;

  return (
    <div className="h-full ml-10 p-4">
      <div className="rounded-lg shadow-lg p-4 h-[95%]">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestión de Movimientos</h2>
        <p className="text-sm text-gray-500 mb-4">Administra los movimientos de inventario</p>
        
        <div className="flex justify-end mb-4">
          <Button
            variant="success"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
            onClick={openForm}
          >
            + Nuevo movimiento
          </Button>
        </div>

        <BarraBusqueda
          onSearch={handleSearch}
          placeholder="Buscar movimientos..."
        />

        <div className="mt-4 border border-gray-200 rounded-lg h-[60%]">
          <MovimientosTable
            movimientos={movimientosFiltrados}
            onToggleActive={handleToggleActive}
          />
        </div>
      </div>

      <MovimientoForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onGuardar={handleGuardar}
        items={items}
        contactos={contactos}
      />
    </div>
  );
}

export default Movimientos;
