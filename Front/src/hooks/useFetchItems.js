import { useState, useEffect } from 'react';

function useFetchProductos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/productos'); 
      if (!response.ok) {
        throw new Error('Error al obtener productos');
      }
      const data = await response.json();
      // Se espera que la API devuelva { productos: [...] }
      setProductos(data.productos);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching productos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleGuardarProducto = async (productoData) => {
    try {
      const url = productoData.id 
        ? `http://localhost:3000/productos/${productoData.id}`
        : 'http://localhost:3000/productos'; 
      const method = productoData.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productoData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar producto');
      }
      // Recargar la lista de productos tras guardar
      fetchProductos();
    } catch (error) {
      console.error('Error al guardar producto:', error);
      throw error;
    }
  };

  const handleEliminarProducto = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/productos/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar producto');
      }
      // Recargar la lista tras eliminar
      fetchProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/productos/${id}/toggle`, {
        method: 'PUT'
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cambiar el estado del producto');
      }
      // Recargar la lista tras cambiar el estado
      fetchProductos();
    } catch (error) {
      console.error('Error al cambiar el estado del producto:', error);
      throw error;
    }
  };

  return { productos, loading, error, handleGuardarProducto, handleEliminarProducto, handleToggleActive };
}

export default useFetchProductos;
