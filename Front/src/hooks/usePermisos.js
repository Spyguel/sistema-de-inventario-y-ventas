import { useState, useEffect } from 'react';

const usePermisos = () => {
    const [permisos, setPermisos] = useState([]);

    // Obtener los permisos desde la API
    const fetchPermisos = async () => {
        try {
            const response = await fetch('http://localhost:3000/permisos');
            if (!response.ok) {
                throw new Error('Error al obtener los permisos');
            }
            const data = await response.json();
            setPermisos(data.permisos);
            console.log(data.permisos);
        } catch (error) {
            console.error('Error al obtener permisos:', error);
        }
    };

    // useEffect para cargar los permisos al montar el componente
    useEffect(() => {
        fetchPermisos();
    }, []);

    // Guardar o actualizar un permiso
    const handleGuardarPermiso = async (nuevoPermiso, selectedPermiso) => {
        try {
            console.log(nuevoPermiso);
            let response;
            if (selectedPermiso) {
                // Si se está editando, usar PUT
                response = await fetch(`http://localhost:3000/permisos/${selectedPermiso.ID_permiso}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nuevoPermiso),
                });
            } else {
                // Si es nuevo, usar POST
                response = await fetch('http://localhost:3000/permisos', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(nuevoPermiso),
                });
            }

            if (!response.ok) {
                throw new Error('Error al guardar el permiso');
            }

            const data = await response.json();
            if (data) {
                fetchPermisos(); // Recargar la lista después de guardar
            }
        } catch (error) {
            console.error('Error al guardar el permiso:', error);
        }
    };

    const handleEliminarPermiso = async (id) => {
        console.log("ID que se intenta eliminar:", id);
        try {
            const response = await fetch(`http://localhost:3000/permisos/${id}`, {
                method: 'DELETE',
            });
    
            console.log("Estado de la respuesta:", response.status); // Ver el código de estado HTTP
            
            const data = await response.json();
            console.log("Respuesta del servidor:", data); // Ver la respuesta JSON
    
            if (!response.ok) {
                throw new Error(`Error al eliminar el permiso: ${data.error || 'Desconocido'}`);
            }
    
            fetchPermisos(); // Recargar la lista después de eliminar
        } catch (error) {
            console.error("Error al eliminar el permiso:", error);
        }
    };
    

    return {
        permisos,
        fetchPermisos,
        handleGuardarPermiso,
        handleEliminarPermiso,
    };
};

export default usePermisos;
