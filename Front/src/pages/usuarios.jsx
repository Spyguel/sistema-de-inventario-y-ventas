import { useState, useEffect } from 'react';
import Button from '../components/common/button.jsx';
import UsuariosTable from '../components/Tablas/UsuariosTable.jsx';
import RolesTable from '../components/Tablas/RolesTable.jsx';
import PermisosTable from '../components/Tablas/PermisosTable.jsx';
import BarraBusqueda from '../components/common/BarraBusqueda.jsx';
import UsuarioForm from '../components/Modals/UsuarioForm.jsx';
import RolForm from '../components/Modals/RolForm.jsx';
import PermisosForm from '../components/Modals/PermisosForm.jsx';
import PropTypes from 'prop-types';

function Usuarios({ permisos: propsPermisos }) {
    const [activeTab, setActiveTab] = useState('usuarios');
    const [usuarios, setUsuarios] = useState([]); 
    const [roles, setRoles] = useState([
        { id: 1, nombre: 'Administrador', descripcion: 'Rol con todos los permisos' },
        { id: 2, nombre: 'productor', descripcion: 'Rol con permisos de productor' },
        { id: 3, nombre: 'controlador', descripcion: 'Rol con permisos de controlador' },
    ]);

    const [permisos, setPermisos] = useState([
        { id: 1, nombre: 'Crear Usuarios', descripcion: 'Permite crear nuevos usuarios' },
        { id: 2, nombre: 'Editar Usuarios', descripcion: 'Permite editar usuarios existentes' },
        { id: 3, nombre: 'Eliminar Usuarios', descripcion: 'Permite eliminar usuarios existentes' },
        { id: 4, nombre: 'Crear Roles', descripcion: 'Permite crear nuevos roles' },
    ]);

    // Separate modal states for each form type
    const [modals, setModals] = useState({
        usuarios: false,
        roles: false,
        permisos: false
    });

    const [selectedItems, setSelectedItems] = useState({
        usuario: null,
        rol: null,
        permiso: null
    });

    const [searchConfig, setSearchConfig] = useState({
        term: '',
        filters: {}
    });

    const searchOptions = {
        usuarios: [{
            key: 'estado',
            label: 'Estado',
            options: [
                {value: 'todos', label: 'Todos'},
                {value: 'activo', label: 'Activo'},
                {value: 'inactivo', label: 'Inactivo'}
            ]
        },
        {
            Key: 'rol',
            label: 'Rol',
            options: roles.map(r => ({ value: r.nombre, label: r.nombre }))
        }
    ],
    roles: [
        {
            key: 'tipoRol',
            label: 'Tipo de Rol',
            options: [
                { value: 'todos', label: 'Todos' },
                { value: 'Administrador', label: 'Administrador' },
                { value: 'productor', label: 'Productor' },
                { value: 'controlador', label: 'Controlador' }//Deberiamos obtenerlo de rol
            ]
        }
    ],
    permisos: [ //revisar
        {
            key: 'categoria',
            label: 'Categoría',
            options: [
                { value: 'todos', label: 'Todos' },
                { value: 'usuarios', label: 'Usuarios' },
                { value: 'roles', label: 'Roles' },
                { value: 'permisos', label: 'Permisos' }
            ]
        }
    ]
};
    //Filter data based on search term and filters
    const filterData = (data, searchTerm, filters) => {
        return data.filter(item => {
            // Search term filtering
            const searchMatch = Object.values(item).some(value =>
                value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );

            // Filters matching
            const filterMatch = Object.entries(filters).every(([key, value]) => {
                if (!value || value === 'todos') return true;
                return item[key]?.toString() === value;
            });

            return searchMatch && filterMatch;
        });
    };
    const getFilteredData = () => {
        const { term, filters } = searchConfig;
        switch (activeTab) {
            case 'usuarios':
                return filterData(usuarios, term, filters);
            case 'roles':
                return filterData(roles, term, filters);
            case 'permisos':
                return filterData(permisos, term, filters);
            default:
                return [];
        }
    };

    const handleSearch = (term, filters) => {
        setSearchConfig({ term, filters });
    };

        // Función para obtener usuarios desde el backend
    const fetchUsuarios = async () => {
        try {
            const response = await fetch('http://localhost:3000/usuarios'); // Ajusta la URL según tu backend
            if (!response.ok) {
                throw new Error('Error al obtener los usuarios');
            }
            const data = await response.json();
            setUsuarios(data.usuarios); // Usar los datos directamente
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Cargar usuarios al montar el componente
    useEffect(() => {
        fetchUsuarios();
    }, []);

    // Handle opening specific modal
    const handleOpenModal = (type) => {
        setModals({
            usuarios: false,
            roles: false,
            permisos: false,
            [type]: true
        });
    };

    // Handle closing specific modal
    const handleCloseModal = (type) => {
        setModals(prev => ({
            ...prev,
            [type]: false
        }));
        setSelectedItems(prev => ({
            ...prev,
            [type.slice(0, -1)]: null
        }));
    };

    const handleAddButton = () => {
        setSelectedItems({
            usuario: null,
            rol: null,
            permiso: null
        });
        handleOpenModal(activeTab);
    };

    const handleGuardarUsuario = async (nuevoUsuario) => {
        try {
            const url = selectedItems.usuario
                ? `http://localhost:3000/usuarios/${selectedItems.usuario.id}` // Usar "id" en lugar de "ID_usuario"
                : 'http://localhost:3000/usuarios';

            const method = selectedItems.usuario ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevoUsuario),
            });

            if (!response.ok) {
                throw new Error('Error al guardar el usuario');
            }

            // Recargar la lista de usuarios después de guardar
            fetchUsuarios();
            handleCloseModal('usuarios');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleGuardarRol = async (nuevoRol) => {
        try {
            // Update roles state with the new role
            if (selectedItems.rol) {
                setRoles(roles.map(rol => rol.id === selectedItems.rol.id ? nuevoRol : rol));
            } else {
                setRoles([...roles, { ...nuevoRol, id: roles.length + 1 }]);
            }
            handleCloseModal('roles');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleGuardarPermiso = async (nuevoPermiso) => {
        try {
            if (selectedItems.permiso) {
                setPermisos(permisos.map(permiso => 
                    permiso.id === selectedItems.permiso.id ? nuevoPermiso : permiso
                ));
            } else {
                setPermisos([...permisos, { ...nuevoPermiso, id: permisos.length + 1 }]);
            }
            handleCloseModal('permisos');
        } catch (error) {
            console.error('Error:', error);
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

            // Recargar la lista de usuarios después de eliminar
            fetchUsuarios();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="h-screen ml-10 p-4">
            <div className="rounded-lg shadow-lg p-6 h-[90%] min-h-[80%]">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestión de {activeTab}</h2>
                <p className="text-sm text-gray-500 mb-4">
                    {activeTab === 'usuarios' && 'Administra los usuarios y sus roles en el sistema'}
                    {activeTab === 'roles' && 'Gestiona los roles y sus permisos asociados'}
                    {activeTab === 'permisos' && 'Configura los permisos disponibles en el sistema'}
                </p>
    
                <div className="flex space-x-4 mb-6 justify-end ">
                    <Button
                        onClick={() => setActiveTab('usuarios')}
                        variant={activeTab === 'usuarios' ? 'primary' : 'default'}
                        className={`px-4 py-2 rounded-lg transition ${
                            activeTab === 'usuarios' 
                                ? 'bg-blue-500 text-white shadow hover:bg-blue-600' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Usuarios
                    </Button>
                    <Button
                        onClick={() => setActiveTab('roles')}
                        variant={activeTab === 'roles' ? 'primary' : 'default'}
                        className={`px-4 py-2 rounded-lg transition ${
                            activeTab === 'roles' 
                                ? 'bg-blue-500 text-white shadow hover:bg-blue-600' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Roles
                    </Button>
                    <Button
                        onClick={() => setActiveTab('permisos')}
                        variant={activeTab === 'permisos' ? 'primary' : 'default'}
                        className={`px-4 py-2 rounded-lg transition ${
                            activeTab === 'permisos' 
                                ? 'bg-blue-500 text-white shadow hover:bg-blue-600' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        Permisos
                    </Button>
                </div>
    
                {/* Botón Agregar */}
                <div className="flex justify-end mb-4">
                    <Button 
                        onClick={handleAddButton}
                        variant="success"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                    >
                        + Agregar {activeTab.slice(0, -1)}
                    </Button>
                </div>
    
                {/* Barra de Búsqueda */}
                <BarraBusqueda
                    onSearch={handleSearch}
                    placeholder={`Buscar ${activeTab}...`}
                    options={searchOptions[activeTab] || []}
                    initialFilters={searchConfig.filters}
                />
    
                {/* Tablas */}
                <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                    {activeTab === 'usuarios' && (
                        <UsuariosTable
                            usuarios={getFilteredData}
                            onEdit={(usuario) => {
                                setSelectedItems(prev => ({ ...prev, usuario }));
                                handleOpenModal('usuarios');
                            }}
                            onDelete={handleEliminarUsuario}
                        />
                    )}
                    {activeTab === 'roles' && (
                        <RolesTable 
                            roles={getFilteredData}
                            onEdit={(rol) => {
                                setSelectedItems(prev => ({ ...prev, rol }));
                                handleOpenModal('roles');
                            }}
                            onDelete={(id) => setRoles(prev => prev.filter(r => r.id !== id))}
                        />
                    )}
                    {activeTab === 'permisos' && (
                        <PermisosTable 
                            permisos={getFilteredData}
                            onEdit={(permiso) => {
                                setSelectedItems(prev => ({ ...prev, permiso }));
                                handleOpenModal('permisos');
                            }}
                            onDelete={(id) => setPermisos(prev => prev.filter(p => p.id !== id))}
                        />
                    )}
                </div>
            </div>
    
            {/* Modals */}
            {modals.usuarios && (
                <UsuarioForm
                    isOpen={modals.usuarios}
                    onClose={() => handleCloseModal('usuarios')}
                    title={selectedItems.usuario ? 'Editar Usuario' : 'Agregar Usuario'}
                    usuarioSeleccionado={selectedItems.usuario}
                    onGuardar={handleGuardarUsuario}
                    permisos={propsPermisos}
                />
            )}
    
            {modals.roles && (
                <RolForm
                    isOpen={modals.roles}
                    onClose={() => handleCloseModal('roles')}
                    title={selectedItems.rol ? 'Editar Rol' : 'Agregar Rol'}
                    rolSeleccionado={selectedItems.rol}
                    onGuardar={handleGuardarRol}
                />
            )}
    
            {modals.permisos && (
                <PermisosForm
                    isOpen={modals.permisos}
                    onClose={() => handleCloseModal('permisos')}
                    title={selectedItems.permiso ? 'Editar Permiso' : 'Agregar Permiso'}
                    permisoSeleccionado={selectedItems.permiso}
                    onGuardar={handleGuardarPermiso}
                />
            )}
        </div>
    );
}

Usuarios.propTypes = {
    permisos: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            nombre: PropTypes.string.isRequired
        })
    ).isRequired
};

Usuarios.defaultProps = {
    permisos: []
};

export default Usuarios;