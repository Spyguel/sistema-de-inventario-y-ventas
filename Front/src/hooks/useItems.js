// hooks/useItems.js
import { useState, useEffect } from 'react';

const useItems = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Función principal: obtiene los ítems de movimiento
    const fetchItems = async () => {
        try {
            const response = await fetch('http://localhost:3000/items_movimiento');
            if (!response.ok) {
                throw new Error('Error al obtener los ítems de movimiento');
            }
            const data = await response.json();
            setItems(data.items);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener los ítems de proveedor desde la base de datos
    const fetchItemProveedor = async () => {
        try {
            const response = await fetch('http://localhost:3000/items_proveedor');
            if (!response.ok) {
                throw new Error('Error al obtener los ítems de proveedor');
            }
            const data = await response.json();
            setItems(data.items);
            console.log("Ítems de proveedor obtenidos:", data.items);
        } catch (err) {
            setError(err);
            console.error("Error al obtener los ítems de proveedor", err);
        } finally {
            setLoading(false);
        }
    };
    
    

    // Se ejecuta la función principal al montar el hook
    useEffect(() => {
        fetchItems();
    }, []);

    return { items, loading, error, fetchItemProveedor };
};

export default useItems;
