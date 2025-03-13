import { useState } from 'react';
import Button from '../components/common/button.jsx';
import ProductTable from '../components/Tablas/ProductTable';
import ProductForm from '../components/Modals/ProductForm';
import ProductComponentForm from '../components/Modals/ProductComponentForm.jsx';
import BarraBusqueda from '../components/common/BarraBusqueda';
import useFetchProductos from '../hooks/useFetchItems.js';
import LoadingScreen from '../components/LoadingScreen.jsx';

function Productos() {
  const { 
    productos, 
    loading, 
    error, 
    handleGuardarProducto, 
    handleToggleActive,
    handleConfirmAddComponent 
  } = useFetchProductos();

  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [componentModalOpen, setComponentModalOpen] = useState(false);
  const [productForComponent, setProductForComponent] = useState(null);

  const productosFiltrados = productos.filter(producto => {
    return (
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.tipo_item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.unidad_medida.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.id_item.toString().includes(searchTerm)
    );
  });

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleEditarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  const handleAddComponent = (producto) => {
    setProductForComponent(producto);
    setComponentModalOpen(true);
  };

  const handleGuardar = async (productoData) => {
    await handleGuardarProducto(productoData);
    setModalAbierto(false);
    setProductoSeleccionado(null);
  };

  const handleToggle = (id) => {
    handleToggleActive(id);
  };

  return (
    <div className="h-[100%] ml-10 p-4">
      {/* Pantalla de carga */}
      {loading && <LoadingScreen />}

      <div className="rounded-lg shadow-lg p-6 h-[95%]">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestión de Productos</h2>
        <p className="text-sm text-gray-500 mb-4">
          Administra los productos y materias primas
        </p>
        
        <div className="flex justify-end mb-4">
          <Button 
            onClick={() => { setProductoSeleccionado(null); setModalAbierto(true); }} 
            variant="success"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
          >
            + Agregar Producto
          </Button>
        </div>
        
        <BarraBusqueda onSearch={handleSearch} placeholder="Buscar productos..." />
        
        <div className="mt-4 flex-1 overflow-auto">
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ProductTable 
              productos={productosFiltrados} 
              onEdit={handleEditarProducto}
              onAddComponent={handleAddComponent} 
              onToggleActive={handleToggle}
            />
          )}
        </div>
      </div>

      {/* Modales */}
      <ProductForm 
        isOpen={modalAbierto} 
        onClose={() => { setModalAbierto(false); setProductoSeleccionado(null); }}
        title={productoSeleccionado ? "Editar Producto" : "Agregar Nuevo Producto"}
        productoSeleccionado={productoSeleccionado}
        onGuardar={handleGuardar}
      />

      {componentModalOpen && productForComponent && (
        <ProductComponentForm 
          isOpen={componentModalOpen}
          onClose={() => { setComponentModalOpen(false); setProductForComponent(null); }}
          product={productForComponent}
          onAddComponent={handleConfirmAddComponent}
        />
      )}
    </div>
  );
}

export default Productos;