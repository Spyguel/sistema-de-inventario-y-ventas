import { useState }  from 'react';

const useFetchUsuariosRol = () => {
    const [usuariosRol, setUsuariosRol] = useState([]);

    const handleGuardarUsuarioRol = async (idUsuario, idRol) => {
        try {
            console.log('📤 Enviando datos:', { idUsuario, idRol });

            const response = await fetch('http://localhost:3000/UsuarioRol', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idUsuario: String(idUsuario), idRol: String(idRol) }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al guardar el usuario-rol');
            }

            const data = await response.json();
            setUsuariosRol(data); // Actualiza el estado con los nuevos roles
        } catch (error) {
            console.error('❌ Error en handleGuardarUsuarioRol:', error);
            throw error;
        }
    };

    return { usuariosRol, handleGuardarUsuarioRol };
}

export default useFetchUsuariosRol;