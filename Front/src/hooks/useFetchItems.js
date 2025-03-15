import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';

function useFetchProductos() {
  const [productos, setProductos] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]); // Estado añadido
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/items');
      if (!response.ok) throw new Error('Error al obtener productos');
      const data = await response.json();
      setProductos(data.items);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching productos:', err);
    } finally {
      setLoading(false);
    }
  };


  const fetchBajoStock = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/items/bajo-stock');
      if (!response.ok) throw new Error('Error al obtener stock bajo');
      const data = await response.json();
      setLowStockItems(data.items);
      
      // Mostrar notificación solo si hay nuevos items con stock bajo
      if (data.items.length > 0) {
        data.items.forEach(item => {
          toast.warning(`Stock bajo: ${item.nombre} (${item.cantidad_actual}/${item.cantidad_minima})`, {
            autoClose: false,
            closeOnClick: false,
            toastId: item.id_item // ID único para evitar duplicados
          });
        });
      }
    } catch (error) {
      console.error('Error fetching low stock items:', error);
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchProductos();
      await fetchBajoStock();
    };
    fetchInitialData();

    const interval = setInterval(fetchBajoStock, 300000); // Chequear cada 5 minutos
    return () => clearInterval(interval);
  }, [fetchBajoStock]);


  const handleGuardarProducto = async (productoData) => {
    try {
      const url = productoData.id_item 
        ? `http://localhost:3000/items/${productoData.id_item}`
        : 'http://localhost:3000/items';
        
      const method = productoData.id_item ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productoData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar producto');
      }

      await fetchProductos();
      await fetchBajoStock(); // Actualizar lista de stock bajo
      
      toast.success(`Producto ${method === 'POST' ? 'creado' : 'actualizado'} correctamente`);
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/items/${id}/toggle`, {
        method: 'PUT'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cambiar el estado del producto');
      }
      fetchProductos();
    } catch (error) {
      console.error('Error al cambiar el estado del producto:', error);
      throw error;
    }
  };

  const fetchMateriaPrima = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/items/materia-prima-activos');
      if (!response.ok) {
        throw new Error('Error al obtener materia prima activa');
      }
      const data = await response.json();
      return data.items;
    } catch (err) {
      console.error('Error fetching materia prima:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAddComponent = async (producto, compositionArray) => {
    console.log('Guardando composición:', compositionArray, 'para producto:', producto);
    try {
      const response = await fetch('http://localhost:3000/composicion_item', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_item: producto.id_item, composicion: compositionArray })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar composición');
      }
  
      const result = await response.json();
      console.log('Composición guardada correctamente y asignada al producto:', result);
      fetchProductos(); // Asegúrate de que esta función esté definida para refrescar la lista de productos
    } catch (error) {
      console.error('Error al guardar composición:', error);
      alert('Error al guardar la composición: ' + error.message);
    }
  };

  // En tu hook useFetchProductos.js

  const fetchComposicionPorIdItemFinal = useCallback(async (id_item_final) => {
    console.log("Buscando composición para id_item_final:", id_item_final);
    try {
      const response = await fetch(`http://localhost:3000/item_composicion/${id_item_final}`);
      if (!response.ok) throw new Error('No se encontró la composición');
      
      const data = await response.json();
      console.log("Datos de composición recibidos:", data);
  
      // Acceder a data.compositores (no a data directamente)
      const compositores = data.compositores || []; // Si es null, usa array vacío
  
      if (!Array.isArray(compositores)) return []; // Validar que sea un array
      
      return compositores.map(comp => ({
        id_item: comp.id_item,
        cantidad_usada: comp.cantidad_usada,
      }));
    } catch (err) {
      console.error("Error al obtener composición:", err);
      return [];
    }
  }, []);
  


  return { 
    productos, 
    lowStockItems,
    loading, 
    error, 
    handleGuardarProducto, 
    handleToggleActive,
    fetchMateriaPrima,
    handleConfirmAddComponent,
    fetchComposicionPorIdItemFinal
  };
}

export default useFetchProductos;
