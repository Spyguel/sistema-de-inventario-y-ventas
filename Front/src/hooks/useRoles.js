import { useState, useEffect } from 'react';

const useRoles = () => {
    // Estado para almacenar los roles obtenidos desde la base de datos
    const [roles, setRoles] = useState([]);

    // Función para obtener los roles desde la API
    const fetchRoles = async () => {
        try {
            const response = await fetch('http://localhost:3000/roles');
            if (!response.ok) {
                throw new Error('Error al obtener los roles');
            }
            const data = await response.json();
            // Se asume que la respuesta tiene la forma { roles: [...] }
            setRoles(data.roles);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // useEffect para cargar los roles al montar el componente
    useEffect(() => {
        fetchRoles();
    }, []);

    // Función para guardar o actualizar un rol en la base de datos
    const handleGuardarRol = async (nuevoRol, selectedRol) => {
        try {
            let response;
            if (selectedRol) {
                // Si se está editando un rol, se actualiza con método PUT
                response = await fetch(`http://localhost:3000/roles/${selectedRol.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nuevoRol),
                });
            } else {
                // Si es un nuevo rol, se crea con método POST
                response = await fetch('http://localhost:3000/roles', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nuevoRol),
                });
            }
            if (!response.ok) {
                throw new Error('Error al guardar el rol');
            }
            // Después de guardar, se recargan los roles desde la base de datos
            fetchRoles();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Función para agregar un permiso a un rol
    // Se asume que el endpoint espera el id del rol y el permiso a agregar
    const handleAddPermiso = async (idRol, permiso) => {
        try {
            const response = await fetch(`http://localhost:3000/roles/${idRol}/permisos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ permiso }),
            });
            if (!response.ok) {
                throw new Error('Error al agregar el permiso');
            }
            // Se recargan los roles para reflejar el permiso agregado
            fetchRoles();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Función para eliminar un rol de la base de datos
    const handleEliminarRol = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/roles/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Error al eliminar el rol');
            }
            // Se recargan los roles después de eliminar uno
            fetchRoles();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return {
        roles,
        fetchRoles,
        handleGuardarRol,
        handleAddPermiso,
        handleEliminarRol,
    };
};

export default useRoles;
