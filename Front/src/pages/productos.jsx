import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    lowStockItems,
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

  useEffect(() => {
    // Solicitar permisos para notificaciones
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  const productosFiltrados = productos.filter(producto => {
    const searchLower = searchTerm.toLowerCase();
    return (
      producto.nombre.toLowerCase().includes(searchLower) ||
      producto.tipo_item.toLowerCase().includes(searchLower) ||
      producto.unidad_medida.toLowerCase().includes(searchLower) ||
      producto.id_item.toString().includes(searchTerm)
    );
  });

  const handleSearch = (term) => setSearchTerm(term);

  const handleEditarProducto = (producto) => {
    setProductoSeleccionado(producto);
    setModalAbierto(true);
  };

  const handleAddComponent = (producto) => {
    setProductForComponent(producto);
    setComponentModalOpen(true);
  };

  const handleGuardar = async (productoData) => {
    try {
      await handleGuardarProducto(productoData);
      setModalAbierto(false);
      setProductoSeleccionado(null);
    } catch (error) {
      toast.error('Error al guardar el producto');
    }
  };

  const handleToggle = async (id) => {
    try {
      await handleToggleActive(id);
      toast.success('Estado del producto actualizado');
    } catch (error) {
      toast.error('Error al cambiar el estado');
    }
  };

  return (
    <div className="h-[100%] ml-10 p-4">
      <ToastContainer 
        position="bottom-right"
        autoClose={5000}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
      
      {loading && <LoadingScreen />}

      <div className="rounded-lg shadow-lg p-6 h-[95%]">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestión de Productos</h2>
        <p className="text-sm text-gray-500 mb-4">
          Administra los productos y materias primas
        </p>

        {lowStockItems.length > 0 && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p className="font-bold">⚠️ Productos con stock bajo:</p>
            <ul className="list-disc pl-5 mt-2">
              {lowStockItems.map(item => (
                <li key={item.id_item}>
                  {item.nombre} - Stock actual: {item.cantidad_actual} (Mínimo: {item.cantidad_minima})
                </li>
              ))}
            </ul>
          </div>
        )}

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