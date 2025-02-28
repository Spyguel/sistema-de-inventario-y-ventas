import { useState, useEffect } from 'react';

const useItems = () => {
    const [items, setItems] = useState([]);

    const fetchItems = async () => {
        try {
            const response = await fetch('http://localhost:3000/items');
            if (!response.ok) {
                throw new Error('Error al obtener los items');
            }
            const data = await response.json();
            setItems(data.items);
            console.log(data.items);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

        return {
            items
    };
}

export default useItems;