import { useState, useEffect, useCallback } from 'react';

function useFetchMovimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMovimientos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/movimientos');
      if (!response.ok) throw new Error('Error al obtener los movimientos');
      const data = await response.json();
      setMovimientos(data.movimientos);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMovimientos();
  }, [fetchMovimientos]);

  const handleGuardarMovimiento = async (movimientoData) => {
    console.log('Datos recibidos en movimientoData:', movimientoData);
    setLoading(true);
    try {
      const url = movimientoData.ID_movimiento
        ? `http://localhost:3000/movimientos/${movimientoData.ID_movimiento}`
        : 'http://localhost:3000/movimientos';
      
      const method = movimientoData.ID_movimiento ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movimientoData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar el movimiento');
      }
      await fetchMovimientos();
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/movimientos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cambiar el estado del movimiento');
      }
      await fetchMovimientos();
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    movimientos,
    loading,
    error,
    handleGuardarMovimiento,
    handleToggleActive,
  };
}

export default useFetchMovimientos;
