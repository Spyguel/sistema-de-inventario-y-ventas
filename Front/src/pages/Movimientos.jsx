import { useState } from 'react';
import PropTypes from 'prop-types';

import Button from '../components/common/button.jsx';
import MovimientosTable from '../components/Tablas/MovimientosTable.jsx';
import BarraBusqueda from '../components/common/BarraBusqueda.jsx';
import MovimientoForm from '../components/Modals/MovimientoForm.jsx';

import useSearch from '../hooks/useSearch';
import useSearchOptions from '../hooks/useSearchOption.js';
import useFetchMovimientos from '../hooks/useFetchMovimientos.js';
import useContactos from '../hooks/useContactos.js';
import useItems from '../hooks/useItems.js'

function Movimientos({ usuarios, documentos }) {
  const { movimientos, handleGuardarMovimiento, handleToggleActive } = useFetchMovimientos();
  const { contactos: contactosData } = useContactos(); 
  const { items: itemsData } = useItems(); 
  const { searchConfig, handleSearch, filterData } = useSearch();
  const searchOptions = useSearchOptions(movimientos);
  
  const [isFormOpen, setIsFormOpen] = useState(false);

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  const getFilteredData = () => {
    const { term, filters } = searchConfig;
    return filterData(movimientos, term, filters);
  };

  const getFechaHoraActual = () => {
    const ahora = new Date();
    return ahora.toLocaleDateString('es-ES') + ', ' + ahora.toLocaleTimeString('es-ES');
  };

  return (
    <div className="h-full ml-10 p-4">
      <div className="rounded-lg shadow-lg p-4 h-[95%]">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestión de Movimientos</h2>
        <p className="text-sm text-gray-500 mb-4">{getFechaHoraActual()}</p>
        
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
          options={searchOptions.movimientos || []}
          initialFilters={searchConfig.filters}
        />

        <div className="mt-4 border border-gray-200 rounded-lg h-[60%]">
          <MovimientosTable
            movimientos={getFilteredData()}
            onToggleActive={handleToggleActive}
          />
        </div>
      </div>

      <MovimientoForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onGuardar={handleGuardarMovimiento}
        items={itemsData}
        usuarios={usuarios}
        contactos={contactosData}  
        documentos={documentos}
      />
    </div>
  );
}

Movimientos.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      ID_item: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired,
      stock: PropTypes.number
    })
  ).isRequired,
  usuarios: PropTypes.arrayOf(
    PropTypes.shape({
      ID_usuario: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired
    })
  ).isRequired,
  documentos: PropTypes.arrayOf(
    PropTypes.shape({
      ID_documento: PropTypes.number.isRequired,
      nombre: PropTypes.string.isRequired
    })
  ).isRequired
};

Movimientos.defaultProps = {
  items: [],
  usuarios: [],
  documentos: []
};

export default Movimientos;
