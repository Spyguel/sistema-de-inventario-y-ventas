import { useState } from 'react';

const usePermisos = () => {
    const [permisos, setPermisos] = useState([
        { id: 1, nombre: 'Crear Usuarios', descripcion: 'Permite crear nuevos usuarios' },
        { id: 2, nombre: 'Editar Usuarios', descripcion: 'Permite editar usuarios existentes' },
        { id: 3, nombre: 'Eliminar Usuarios', descripcion: 'Permite eliminar usuarios existentes' },
        { id: 4, nombre: 'Crear Roles', descripcion: 'Permite crear nuevos roles' },
    ]);

    const handleGuardarPermiso = (nuevoPermiso, selectedPermiso) => {
        if (selectedPermiso) {
            setPermisos(permisos.map(permiso =>
                permiso.id === selectedPermiso.id ? nuevoPermiso : permiso
            ));
        } else {
            setPermisos([...permisos, { ...nuevoPermiso, id: permisos.length + 1 }]);
        }
    };

    const handleEliminarPermiso = (id) => {
        setPermisos(permisos.filter(permiso => permiso.id !== id));
    };

    return {
        permisos,
        handleGuardarPermiso,
        handleEliminarPermiso,
    };
};

export default usePermisos;