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

    const handleGuardarUsuario = async (usuarioData, selectedItems) => {
        try {
            const url = selectedItems.usuario
                ? `http://localhost:3000/usuarios/${selectedItems.usuario.ID_usuario}`
                : 'http://localhost:3000/register';

            const method = selectedItems.usuario ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuarioData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al guardar el usuario');
            }

            fetchUsuarios();
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    };

    const handleEliminarUsuario = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/usuarios/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el usuario');
            }

            fetchUsuarios();
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
        handleGuardarUsuario,
        handleEliminarUsuario,
    };
};

export default useFetchUsuarios;
