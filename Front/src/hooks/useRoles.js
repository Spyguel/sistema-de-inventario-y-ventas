import { useState } from 'react';

const useRoles = () => {
    const [roles, setRoles] = useState([
        { id: 1, nombre: 'Administrador', descripcion: 'Rol con todos los permisos' },
        { id: 2, nombre: 'productor', descripcion: 'Rol con permisos de productor' },
        { id: 3, nombre: 'controlador', descripcion: 'Rol con permisos de controlador' },
    ]);

    const handleGuardarRol = (nuevoRol, selectedRol) => {
        if (selectedRol) {
            setRoles(roles.map(rol => (rol.id === selectedRol.id ? nuevoRol : rol)));
        } else {
            setRoles([...roles, { ...nuevoRol, id: roles.length + 1 }]);
        }
    };

    const handleEliminarRol = (id) => {
        setRoles(roles.filter(rol => rol.id !== id));
    };

    return {
        roles,
        handleGuardarRol,
        handleEliminarRol,
    };
};

export default useRoles;