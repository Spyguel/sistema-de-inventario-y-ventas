import { useState, useEffect } from 'react';

function useUsuarios() {
    const [usuarios, setUsuarios] = useState([]);
    
    useEffect(() => {
        // Simulación de datos para visualización
        const datosEjemplo = [
            { ID_usuario: 1, nombre: 'Juan Pérez', cargo: 'Administrador', email: 'juan@ejemplo.com' },
            { ID_usuario: 2, nombre: 'María López', cargo: 'Vendedor', email: 'maria@ejemplo.com' },
            { ID_usuario: 3, nombre: 'Carlos Gómez', cargo: 'Almacenista', email: 'carlos@ejemplo.com' },
            { ID_usuario: 4, nombre: 'Ana Martínez', cargo: 'Gerente', email: 'ana@ejemplo.com' }
        ];
        
        setUsuarios(datosEjemplo);
    }, []);
    
    return { usuarios };
}

export default useUsuarios;