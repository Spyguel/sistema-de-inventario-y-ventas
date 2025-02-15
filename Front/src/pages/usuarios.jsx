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
    const [usuarios, setUsuarios] = useState([]); // Lista de usuarios vacía
    const [roles, setRoles] = useState([
        { id: 1, nombre: 'Administrador', descripcion: 'Rol con todos los permisos' },
        { id: 2, nombre: 'productor', descripcion: 'Rol con permisos de productor' },
        { id: 3, nombre: 'controlador,', descripcion: 'Rol con permisos de controlador' },
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

    const [searchTerm, setSearchTerm] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('todos');

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
        <div className="w-full p-4 flex flex-col mt-5 rounded-lg shadow-md overflow-hidden border-2 bg-white min-h-[92vh]">
            <div className="sticky top-0 z-50 bg-white">
                <div className="w-full flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-principal mb-2 flex items-center gap-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            ADMINISTRADOR DE USUARIOS
                        </h2>
                    </div>
                    <div className="flex space-x-4 justify-between items-center translate-y-1">
                        <Button
                            variant={activeTab === 'usuarios' ? 'active' : 'default'}
                            onClick={() => setActiveTab('usuarios')}
                            className={`rounded-t-lg transition-all duration-300 ease-in-out flex items-center gap-2 px-6 py-3 ${
                                activeTab === 'usuarios'
                                    ? 'bg-accent-soft-blue  text-white rounded-b-none transform -translate-y-1'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300 hover:-translate-y-1'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Usuarios
                        </Button>
                        <Button
                            variant={activeTab === 'roles' ? 'active' : 'default'}
                            onClick={() => setActiveTab('roles')}
                            className={`rounded-t-lg transition-all duration-300 ease-in-out flex items-center gap-2 px-6 py-3 ${
                                activeTab === 'roles'
                                    ? 'bg-accent-muted-green text-white rounded-b-none border-b-0 shadow-lg transform -translate-y-1'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300 hover:-translate-y-1'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            Roles
                        </Button>
                        <Button
                            variant={activeTab === 'permisos' ? 'active' : 'default'}
                            onClick={() => setActiveTab('permisos')}
                            className={`rounded-t-lg transition-all duration-300 ease-in-out flex items-center gap-2 px-6 py-3 ${
                                activeTab === 'permisos'
                                    ? 'bg-background_3 text-white rounded-b-none border-b-0 shadow-lg transform -translate-y-1'
                                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300 hover:-translate-y-1'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                            Permisos
                        </Button>
                    </div>                
                </div>
            </div>

            <div className={`rounded-b-lg rounded-tl-lg p-4 transition-all duration-300 z-50 min-h-[83vh] ${
                activeTab === 'usuarios' 
                    ? 'bg-gradient-to-br from-accent-soft-blue to-accent-soft-blue/80' 
                    : activeTab === 'roles' 
                    ? 'bg-gradient-to-br from-accent-muted-green to-accent-muted-green/80' 
                    : 'bg-gradient-to-br from-background_3 to-background_3/80'
            }`}>
                <div className="bg-white rounded-lg p-4 shadow-lg backdrop-blur-sm">
                    <div className="mb-6">
                        <BarraBusqueda
                            onSearch={(term, estado) => {
                                setSearchTerm(term);
                                setFiltroEstado(estado);
                            }}
                            placeholder={`Buscar ${activeTab}...`}
                            options={[
                                { value: 'todos', label: 'Todos' },
                                { value: 'Activo', label: 'Activos' },
                                { value: 'Inactivo', label: 'Inactivos' }
                            ]}
                        />
                    </div>

                    <div className="flex justify-end mb-4">
                        <Button 
                            className="transform transition-transform duration-200 hover:scale-105 flex items-center gap-2"
                            variant="success" 
                            onClick={handleAddButton}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            {`Agregar ${activeTab.slice(0, -1)}`}
                        </Button>
                    </div>

                    <div className="overflow-auto max-h-[calc(100vh-300px)] rounded-lg border border-gray-200">
                        {activeTab === 'usuarios' && (
                            <UsuariosTable
                                usuarios={usuarios}
                                onEdit={(usuario) => {
                                    setSelectedItems(prev => ({ ...prev, usuario }));
                                    handleOpenModal('usuarios');
                                }}
                                onDelete={handleEliminarUsuario}
                            />
                        )}
                        {activeTab === 'roles' && (
                            <RolesTable 
                                roles={roles}
                                onEdit={(rol) => {
                                    setSelectedItems(prev => ({ ...prev, rol }));
                                    handleOpenModal('roles');
                                }}
                                onDelete={(id) => setRoles(prev => prev.filter(r => r.id !== id))}
                            />
                        )}
                        {activeTab === 'permisos' && (
                            <PermisosTable 
                                permisos={permisos}
                                onEdit={(permiso) => {
                                    setSelectedItems(prev => ({ ...prev, permiso }));
                                    handleOpenModal('permisos');
                                }}
                                onDelete={(id) => setPermisos(prev => prev.filter(p => p.id !== id))}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Modal rendering based on specific states */}
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