import { useState } from 'react';
import Button from '../components/common/button.jsx';
import ProductTable from '../components/Tablas/ProductTable';
import ProductForm from '../components/Modals/ProductForm';
import BarraBusqueda from '../components/common/BarraBusqueda';
import useFetchProductos from '../hooks/useFetchItems.js';

function Productos() {
  // Obtiene productos desde la base de datos mediante el hook
  const { 
    productos, 
    loading, 
    error, 
    handleGuardarProducto, 
    handleEliminarProducto, 
    handleToggleActive 
  } = useFetchProductos();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrado de productos basado en el término de búsqueda
  const productosFiltrados = productos.filter(producto => {
    return (
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.tipoItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.unidadMedida.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.id.toString().includes(searchTerm)
    );
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleEditarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  const handleGuardar = (producto) => {
    handleGuardarProducto(producto);
    setModalAbierto(false);
    setProductoSeleccionado(null);
  };

  const handleDelete = (id) => {
    handleEliminarProducto(id);
  };

  const handleToggle = (id) => {
    handleToggleActive(id);
  };

  return (
    <div className="h-[100%] ml-10 p-4">
      <div className="rounded-lg shadow-lg p-6 h-[95%]">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestión de Productos</h2>
        <p className="text-sm text-gray-500 mb-4">Administra los productos y materias primas</p>

        {/* Botón Agregar */}
        <div className="flex justify-end mb-4">
          <Button 
            onClick={() => { setProductoSeleccionado(null); setModalAbierto(true); }} 
            variant="success"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
          >
            + Agregar Producto
          </Button>
        </div>

        {/* Barra de Búsqueda */}
        <BarraBusqueda
          onSearch={handleSearch}
          placeholder="Buscar productos..."
        />

        {/* Tabla de Productos */}
        <div className="mt-4 flex-1 overflow-auto">
          {loading ? (
            <p>Cargando productos...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ProductTable 
              productos={productosFiltrados} 
              onEdit={handleEditarProducto}
              onDelete={handleDelete}
              onToggleActive={handleToggle}
            />
          )}
        </div>
      </div>

      {/* Modal para Agregar/Editar Productos */}
      <ProductForm 
        isOpen={modalAbierto} 
        onClose={() => { 
          setModalAbierto(false);
          setProductoSeleccionado(null);
        }}
        title={productoSeleccionado ? "Editar Producto" : "Agregar Nuevo Producto"}
        productoSeleccionado={productoSeleccionado}
        onGuardar={handleGuardar}
      />
    </div>
  );
}

export default Productos;
