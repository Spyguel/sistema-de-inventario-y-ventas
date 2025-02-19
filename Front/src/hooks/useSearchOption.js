const useSearchOptions = (roles) => {
    const searchOptions = {
        usuarios: [
            {
                key: 'estado',
                label: 'Estado',
                options: [
                    { value: 'todos', label: 'Todos' },
                    { value: 'activo', label: 'Activo' },
                    { value: 'inactivo', label: 'Inactivo' },
                ],
            },
            {
                key: 'rol',
                label: 'Rol',
                options: roles.map(r => ({ value: r.nombre, label: r.nombre })),
            },
        ],
        roles: [
            {
                key: 'tipoRol',
                label: 'Tipo de Rol',
                options: [
                    { value: 'todos', label: 'Todos' },
                    { value: 'Administrador', label: 'Administrador' },
                    { value: 'productor', label: 'Productor' },
                    { value: 'controlador', label: 'Controlador' },
                ],
            },
        ],
        permisos: [
            {
                key: 'categoria',
                label: 'Categoría',
                options: [
                    { value: 'todos', label: 'Todos' },
                    { value: 'usuarios', label: 'Usuarios' },
                    { value: 'roles', label: 'Roles' },
                    { value: 'permisos', label: 'Permisos' },
                ],
            },
        ],
    };

    return searchOptions;
};

export default useSearchOptions;