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
        clientes: [
            { value: 'Nombre', label: 'Nombre' },
            { value: 'tipo_contacto', label: 'Tipo' },
            { value: 'Mail', label: 'Email' },
            { value: 'Teléfono', label: 'Teléfono' },
            { value: 'Activo', label: 'Estado' },
        ],
        contactoitems: [
            { value: 'ID_contacto', label: 'ID Cliente' },
            { value: 'ID_item', label: 'ID Item' },
        ],
        informes: {
            Inicio: [
                { key: 'tipo_mov', label: 'Tipo Movimiento', options: ['todos', 'COMPRA', 'VENTA', 'AJUSTE INVENTARIO', 'PRODUCCION', 'CONSUMO INTERNO'] },
                { key: 'tipo_item', label: 'Tipo de Item', options: ['todos', 'PRODUCTO', 'MATERIA_PRIMA'] },
                { key: 'estado_pago', label: 'Estado de Pago', options: ['todos', 'PENDIENTE', 'PAGADO', 'PARCIAL'] },
            ],
            Egresos: [
                { key: 'tipo_egreso', label: 'Tipo de Egreso', options: ['todos', 'MATERIA_PRIMA', 'PRODUCTO', 'OPERATIVO', 'SERVICIO'] },
                { key: 'proveedor', label: 'Proveedor', options: ['todos'] },
            ],
            Ranking: [
                { key: 'criterio', label: 'Criterio', options: ['VENTAS', 'COMPRAS', 'ROTACION', 'FRECUENCIA'] },
                { key: 'periodo', label: 'Período', options: ['MES', 'TRIMESTRE', 'AÑO'] },
            ],
        },
    };

    return searchOptions;
};

export default useSearchOptions;