import { useState, useMemo } from 'react';
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
    const [usuarios, setUsuarios] = useState([
        { 
            id: 1, 
            nombre: 'Juan Pérez', 
            email: 'juan.perez@ejemplo.com',
            rol: 'Administrador',
            estado: 'Activo',
            permisos: [1, 2]
        },
        { 
            id: 2, 
            nombre: 'María González', 
            email: 'maria.gonzalez@ejemplo.com',
            rol: 'Empleado',
            estado: 'Activo',
            permisos: [2]
        }
    ]);
    const [roles, setRoles] = useState([
        { id: 1, nombre: 'Administrador', descripcion: 'Rol con todos los permisos' },
        { id: 2, nombre: 'productor', descripcion: 'Rol con permisos de productor' },
        { id: 3, nombre: 'controlador,', descripcion: 'Rol con permisos de controlador' },
    ]);

    const [permisos, setPermisos] = useState([
        { id: 1, nombre: 'Crear Usuarios' },
        { id: 2, nombre: 'Editar Usuarios' },
        { id: 3, nombre: 'Eliminar Usuarios' },
        { id: 4, nombre: 'Crear Roles' },
        { id: 5, nombre: 'Editar Roles' },
        { id: 6, nombre: 'Eliminar Roles' },
        { id: 7, nombre: 'Crear Permisos' },
        { id: 8, nombre: 'Editar Permisos' },
        { id: 9, nombre: 'Eliminar Permisos' },
        { id: 10, nombre: 'Crear Productos' },
        { id: 11, nombre: 'Editar Productos' },
        { id: 12, nombre: 'Eliminar Productos' },
        { id: 13, nombre: 'ver estadistica'},
        { id: 14, nombre: 'ver reportes' },
        { id: 15, nombre: 'ver proveedores' },
        { id: 16, nombre: 'ver clientes' },
        { id: 17, nombre: 'ver pedidos' }
    ]);

    const [modalState, setModalState] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [rolSeleccionado, setRolSeleccionado] = useState(null);
    const [permisoSeleccionado, setPermisoSeleccionado] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('todos');

    const usuariosFiltrados = useMemo(() => {
        return usuarios.filter(usuario => {
            const coincideBusqueda = 
                usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                usuario.rol.toLowerCase().includes(searchTerm.toLowerCase());

            const coincideEstado = 
                filtroEstado === 'todos' || 
                usuario.estado.toLowerCase() === filtroEstado.toLowerCase();

            return coincideBusqueda && coincideEstado;
        });
    }, [usuarios, searchTerm, filtroEstado]);

    const handleSearch = (term, estado) => {
        setSearchTerm(term);
        setFiltroEstado(estado);
    };

    const handleGuardarUsuario = (nuevoUsuario) => {
        if (modoEdicion && usuarioSeleccionado) {
            setUsuarios(prev => 
                prev.map(u => 
                    u.id === usuarioSeleccionado.id 
                        ? { ...nuevoUsuario, id: u.id } 
                        : u
                )
            );
        } else {
            const usuarioConId = {
                ...nuevoUsuario,
                id: Date.now(),
                estado: 'Activo'
            };
            setUsuarios(prev => [...prev, usuarioConId]);
        }
        setModalState(false);
        setModoEdicion(false);
        setUsuarioSeleccionado(null);
    };

    const handleEliminarUsuario = (id) => {
        setUsuarios(prev => prev.filter(u => u.id !== id));
    };

    const handleToggleActive = (id) => {
        setUsuarios(prev => 
            prev.map(usuario => 
                usuario.id === id 
                    ? { 
                        ...usuario, 
                        estado: usuario.estado === 'Activo' ? 'Inactivo' : 'Activo' 
                    } 
                    : usuario
            )
        );
    };

    return (
        <div className="w-full p-4 flex flex-col mt-5 rounded-lg shadow-md overflow-hidden border-2 bg-white max-h-screen">
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

            <div className={`rounded-b-lg p-4 transition-all duration-300 z-50 ${
                activeTab === 'usuarios' 
                    ? 'bg-gradient-to-br from-accent-soft-blue to-accent-soft-blue/80' 
                    : activeTab === 'roles' 
                    ? 'bg-gradient-to-br from-accent-muted-green to-accent-muted-green/80' 
                    : 'bg-gradient-to-br from-background_3 to-background_3/80'
            }`}>
                <div className="bg-white rounded-lg p-4 shadow-lg backdrop-blur-sm">
                    <div className="mb-6">
                        <BarraBusqueda
                            onSearch={handleSearch}
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
                            onClick={() => {
                                setModoEdicion(false);
                                setUsuarioSeleccionado(null);
                                setModalState(true);
                            }}
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
                                usuarios={usuariosFiltrados}
                                onEdit={setUsuarioSeleccionado}
                                onDelete={handleEliminarUsuario}
                                onToggleActive={handleToggleActive}
                            />
                        )}
                        {activeTab === 'roles' && (
                            <RolesTable 
                                roles={roles}
                                onEdit={setRolSeleccionado}
                                onDelete={(id) => setRoles(prev => prev.filter(r => r.id !== id))}
                            />
                        )}
                        {activeTab === 'permisos' && (
                            <PermisosTable 
                                permisos={permisos}
                                onEdit={setPermisoSeleccionado}
                                onDelete={(id) => setPermisos(prev => prev.filter(p => p.id !== id))}
                            />
                        )}
                    </div>
                </div>
            </div>

            {modalState && activeTab === 'usuarios' && (
                <UsuarioForm
                    isOpen={modalState}
                    onClose={() => setModalState(false)}
                    title={usuarioSeleccionado ? 'Editar Usuario' : 'Agregar Usuario'}
                    usuarioSeleccionado={usuarioSeleccionado}
                    onGuardar={handleGuardarUsuario}
                    permisos={propsPermisos}
                />
            )}

            {modalState && activeTab === 'roles' && (
                <RolForm
                    isOpen={modalState}
                    onClose={() => setModalState(false)}
                    title={rolSeleccionado ? 'Editar Rol' : 'Agregar Rol'}
                    rolSeleccionado={rolSeleccionado}
                    onGuardar={(nuevoRol) => {
                        if (rolSeleccionado) {
                                setRoles(prev => prev.map(r => r.id === rolSeleccionado.id ? nuevoRol : r));
                            } else {
                                setRoles(prev => [...prev, { ...nuevoRol, id: Date.now() }]);
                            }
                            setModalState(false);
                            setRolSeleccionado(null);
                        }}
                    />
                )}
    
                {modalState && activeTab === 'permisos' && (
                    <PermisosForm
                        isOpen={modalState}
                        onClose={() => setModalState(false)}
                        title={permisoSeleccionado ? 'Editar Permiso' : 'Agregar Permiso'}
                        permisoSeleccionado={permisoSeleccionado}
                        onGuardar={(nuevoPermiso) => {
                            if (permisoSeleccionado) {
                                setPermisos(prev => prev.map(p => p.id === permisoSeleccionado.id ? nuevoPermiso : p));
                            } else {
                                setPermisos(prev => [...prev, { ...nuevoPermiso, id: Date.now() }]);
                            }
                            setModalState(false);
                            setPermisoSeleccionado(null);
                        }}
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