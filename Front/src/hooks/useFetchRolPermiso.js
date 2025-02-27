import { useState } from 'react';

const useFetchRolPermiso = () => {
    const [rolPermiso, setRolPermiso] = useState([]);

    const handleGuardarRolPermiso = async (idRol, permisos) => {
        try {
            // Extraer los IDs de permisos antes de enviarlos
            const permisosIds = permisos.map(p => p.ID_permiso);

            console.log('📤 Enviando datos:', { idRol, permisos: permisosIds });

            const response = await fetch('http://localhost:3000/RolPer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idRol: String(idRol), permisos: permisosIds }), // Ahora permisos es solo un array de números
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al guardar el rol-permiso');
            }

            const data = await response.json();
            setRolPermiso(data); // Actualiza el estado con los nuevos permisos
        } catch (error) {
            console.error('❌ Error en handleGuardarRolPermiso:', error);
            throw error;
        }
    };

    return { rolPermiso, handleGuardarRolPermiso };
};

export default useFetchRolPermiso;
