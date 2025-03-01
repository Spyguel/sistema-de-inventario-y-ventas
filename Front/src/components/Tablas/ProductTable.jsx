import PropTypes from 'prop-types';
import { BuildingStorefrontIcon, XCircleIcon, PencilIcon, CubeIcon } from '@heroicons/react/24/solid';
import Button from '../common/button';
import Tabla from '../common/Tabla';
import { useEffect, useState } from 'react';

const ProductTable = ({ 
  onEdit, 
  onAddComponent, 
  onToggleActive,
  requestSort = () => {} 
}) => {
  const [productos, setProductos] = useState([]);
  const [tipoFiltro, setTipoFiltro] = useState(''); 
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const obtenerItems = async () => {
    setCargando(true);
    setError(null);

    try {
      const tiposUrl = {
        'Materia Prima': 'materia-prima',
        'Producto Terminado': 'producto-terminado',
        'Insumo': 'insumo'
      };

      let url = 'http://localhost:3000/items';
      if (tipoFiltro && tiposUrl[tipoFiltro]) {
        url = `http://localhost:3000/items/tipo/${tiposUrl[tipoFiltro]}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setProductos(data.items || []);

    } catch (error) {
      console.error('Error al obtener ítems:', error);
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerItems();
  }, [tipoFiltro]);

  const headers = [
    { key: 'id_item', label: 'ID' },
    { key: 'unidad_medida', label: 'Unidad' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'tipo_item', label: 'Tipo' },
    { key: 'cantidad_actual', label: 'Cantidad Actual' },
    { key: 'cantidad_minima', label: 'Cantidad Mínima' },
    { key: 'fecha_creacion', label: 'Fecha de Creación' },
    { key: 'activo', label: 'Activo' },
  ];

  const renderActions = (producto) => (
    <div className="flex gap-2">
      <Button 
        onClick={() => onEdit(producto)} 
        variant="primary" 
        size="sm" 
        className={`${!producto.activo ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={!producto.activo}
      >
        <PencilIcon className="h-4 w-4" />
      </Button>

      {producto.tipo_item !== 'Materia Prima' && (
        <Button 
          onClick={() => onAddComponent(producto)} 
          variant="secondary" 
          size="sm"
          className={`${!producto.activo ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!producto.activo}
        >
          <CubeIcon className="h-4 w-4" />
        </Button>
      )}

      <Button 
        onClick={() => onToggleActive(producto.id_item)} 
        variant={producto.activo ? 'danger' : 'success'} 
        size="sm"
      >
        {producto.activo ? <BuildingStorefrontIcon className="h-4 w-4" /> : <XCircleIcon className="h-4 w-4" />}
      </Button>
    </div>
  );

  return (
    <div>
      {/* Selector de filtro actualizado */}
      <div className="mb-4 flex items-center gap-4">
        <label htmlFor="tipoFiltro" className="text-sm font-medium text-gray-700">Filtrar por tipo:</label>
        <select 
          id="tipoFiltro" 
          value={tipoFiltro} 
          onChange={(e) => setTipoFiltro(e.target.value || '')}
          className="p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos</option>
          <option value="Materia Prima">Materia Prima</option>
          <option value="Producto Terminado">Producto Terminado</option>
          <option value="Insumo">Insumo</option> {/* Opción corregida */}
        </select>
      </div>

      {cargando && (
        <div className="flex justify-center items-center p-4">
          <p className="text-gray-600">Cargando ítems...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {!cargando && !error && (
        <Tabla 
          headers={headers}
          data={productos}
          onSort={requestSort}
          renderActions={renderActions}
        />
      )}
    </div>
  );
};

ProductTable.propTypes = {
  onEdit: PropTypes.func.isRequired,
  onAddComponent: PropTypes.func.isRequired,
  onToggleActive: PropTypes.func.isRequired,
  requestSort: PropTypes.func,
};

export default ProductTable;