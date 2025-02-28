// hooks/useItems.js
import { useState, useEffect } from 'react';

const useItems = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await fetch('/items_movimiento'); 
                if (!response.ok) {
                    throw new Error('Error al obtener los ítems');
                }
                const data = await response.json();
                setItems(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    return { items, loading, error };
};

export default useItems;