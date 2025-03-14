import { useState } from 'react';
import Button from '../components/common/button.jsx';
import MovimientosTable from '../components/Tablas/MovimientosTable.jsx';
import BarraBusqueda from '../components/common/BarraBusqueda.jsx';
import MovimientoForm from '../components/Modals/MovimientoForm.jsx';
import useFetchMovimientos from '../hooks/useFetchMovimientos.js';
import useContactoItem from '../hooks/useContactoItem.js';
import useUsuario from '../hooks/useUsuarios.js';
import { getFilteredMovimientosData } from '../utils/filterMovimientos';

function Movimientos() {
  const { usuario } = useUsuario();
  const { loading: loadingCI, error: errorCI, handleObtenerItemsYContactosListos } = useContactoItem();
  const { movimientos, handleGuardarMovimiento, handleToggleActive } = useFetchMovimientos();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [datosListos, setDatosListos] = useState({ proveedores: [], clientes: [] });

  // Función de filtrado corregida
  const filterData = (data, term) => {
    return data.filter(movimiento => {
      const searchText = term.toLowerCase();
      return (
        movimiento.ID?.toString().includes(searchText) ||
        (movimiento.Tipo?.toLowerCase() || '').includes(searchText) ||
        (movimiento.Razón?.toLowerCase() || '').includes(searchText) ||
        (movimiento.Detalle?.toLowerCase() || '').includes(searchText)
      );
    });
  };

  const searchConfig = { term: searchTerm };
  const movimientosFiltrados = getFilteredMovimientosData(movimientos, searchConfig, filterData);

  const handleSearch = (term) => setSearchTerm(term);
  
  const openForm = async () => {
    setIsFormOpen(true);
    try {
      const data = await handleObtenerItemsYContactosListos();
      setDatosListos(data);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };

  const closeForm = () => setIsFormOpen(false);

  const handleGuardar = async (movimientoData) => {
    try {
      await handleGuardarMovimiento({
        ...movimientoData,
        id_usuario: usuario.userId
      });
      closeForm();
    } catch (error) {
      console.error('Error al guardar movimiento:', error);
    }
  };

  if (loadingCI) return <div>Cargando datos...</div>;
  if (errorCI) return <div>Error: {errorCI}</div>;

  return (
    <div className="h-screen ml-10 p-4">
      <div className="rounded-lg shadow-lg p-4 h-[95%]">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestión de Movimientos</h2>
        
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
          placeholder="Buscar por ID, tipo o razón..."
        />

        <div className="mt-4 border border-gray-200 rounded-lg h-[60%] overflow-auto">
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
        data={datosListos}
      />
    </div>
  );
}

export default Movimientos;