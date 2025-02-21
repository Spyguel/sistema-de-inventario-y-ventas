// useFetchContacto.js
import { useState, useEffect } from 'react';

const useFetchContacto = () => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchClientes = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/contacto');
            if (!response.ok) {
                throw new Error('Error al obtener los clientes');
            }
            const data = await response.json();
            setClientes(data);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching clientes:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClientes();
    }, []);

    return { clientes, loading, error, fetchClientes };
};

export default useFetchContacto;
