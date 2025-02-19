import { useState, useEffect } from 'react';

const useFetchUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);

    const fetchUsuarios = async () => {
        try {
            const response = await fetch('http://localhost:3000/usuarios');
            if (!response.ok) {
                throw new Error('Error al obtener los usuarios');
            }
            const data = await response.json();
            setUsuarios(data.usuarios);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    return {
        usuarios,
        fetchUsuarios,
    };
};

export default useFetchUsuarios;