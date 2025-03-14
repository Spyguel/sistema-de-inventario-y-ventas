import { useState, useEffect } from 'react';

function useFetchMovimientos() {
  const [movimientos, setMovimientos] = useState([]);

  const fetchMovimientos = async () => {
    try {
      const response = await fetch('http://localhost:3000/movimientos');
      if (!response.ok) {
        throw new Error('Error al obtener los movimientos');
      }
      const data = await response.json();
      // Se espera que el backend devuelva { movimientos: [...] }
      setMovimientos(data.movimientos);
      console.log('Movimientos:', data.movimientos);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Cargar los movimientos al montar el componente
  useEffect(() => {
    fetchMovimientos();
  }, []);

  const handleGuardarMovimiento = async (movimientoData) => {
    console.log("Los datos que llegan hasta movimientoData", movimientoData);
  
    try {
      const url = movimientoData.ID_movimiento
        ? `http://localhost:3000/movimientos/${movimientoData.ID_movimiento}` // Actualizar movimiento (si aplica)
        : 'http://localhost:3000/movimientos'; // Crear nuevo movimiento
  
      const method = movimientoData.ID_movimiento ? 'PUT' : 'POST';
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(movimientoData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al guardar el movimiento');
      }
  
      // Recargar la lista de movimientos tras guardar
      fetchMovimientos();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };
  

  const handleToggleActive = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/movimientos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cambiar el estado del movimiento');
      }
      // Recargar la lista tras cambiar el estado
      fetchMovimientos();
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  return {
    movimientos,
    handleGuardarMovimiento,
    handleToggleActive,
  };
}

export default useFetchMovimientos;
