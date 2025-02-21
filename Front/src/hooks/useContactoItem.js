// useContactoItems.js
import { useState, useEffect } from 'react';

const useContactoItem = () => {
    const [contactoItems, setContactoItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchContactoItems = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/contacto_item');
            if (!response.ok) {
                throw new Error('Error al obtener las asociaciones');
            }
            const data = await response.json();
            setContactoItems(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching contacto items:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContactoItems();
    }, []);

    const handleGuardarContactoItem = async (nuevoContactoItem, contactoItemExistente) => {
        try {
            const url = contactoItemExistente
                ? `http://localhost:3000/contacto_item/${contactoItemExistente.ID_contacto_item}`
                : 'http://localhost:3000/contacto_item';

            const method = contactoItemExistente ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevoContactoItem),
            });

            if (!response.ok) {
                throw new Error('Error al guardar la asociación');
            }

            fetchContactoItems();
            return true;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    };

    const handleEliminarContactoItem = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/contacto_item/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la asociación');
            }

            fetchContactoItems();
            return true;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    };

    return {
        contactoItems,
        loading,
        error,
        fetchContactoItems,
        handleGuardarContactoItem,
        handleEliminarContactoItem
    };
};

export default useContactoItem;