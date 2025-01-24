import { useState, useMemo } from 'react';
import Button from '../components/common/button';
import UsuariosTable from '../components/common/Tablas/UsuariosTable.jsx';
import BarraBusqueda from '../components/common/BarraBusqueda';
import UsuarioForm from '../components/common/Modals/UsuarioForm.jsx'; 
import PropTypes from 'prop-types';

function Usuarios({ permisos: propsPermisos }) {
    const [permisos] = useState(propsPermisos || [
        { id: 1, nombre: 'Permiso 1' },
        { id: 2, nombre: 'Permiso 2' },
    ]);

    const [usuarios, setUsuarios] = useState([
        { 
            id: 1, 
            nombre: 'Juan Pérez', 
            email: 'juan.perez@ejemplo.com',
            rol: 'Administrador',
            estado: 'Activo',
            permisos: [1, 2] // IDs de permisos
        },
        { 
            id: 2, 
            nombre: 'María González', 
            email: 'maria.gonzalez@ejemplo.com',
            rol: 'Empleado',
            estado: 'Activo',
            permisos: [2] // IDs de permisos
        }
    ]);

    const [modalState, setModalState] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('todos');

    // Función de búsqueda y filtrado
    const usuariosFiltrados = useMemo(() => {
        return usuarios.filter(usuario => {
            const coincideBusqueda = 
                usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                usuario.rol.toLowerCase().includes(searchTerm.toLowerCase());

            const coincideEstado = 
                filtroEstado === 'todos' || 
                usuario.estado.toLowerCase() === filtroEstado.toLowerCase() ||
                usuario.rol.toLowerCase() === filtroEstado.toLowerCase();

            return coincideBusqueda && coincideEstado;
        });
    }, [usuarios, searchTerm, filtroEstado]);

    // Manejadores
    const handleSearch = (term, estado) => {
        setSearchTerm(term);
        setFiltroEstado(estado);
    };

    const handleEditarUsuario = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setModoEdicion(true);
        setModalState(true);
    };

    const handleGuardarUsuario = (nuevoUsuario) => {
        if (modoEdicion && usuarioSeleccionado) {
            // Actualizar usuario existente
            setUsuarios(prev => 
                prev.map(u => 
                    u.id === usuarioSeleccionado.id 
                        ? { ...nuevoUsuario, id: u.id } 
                        : u
                )
            );
        } else {
            // Crear nuevo usuario
            const usuarioConId = {
                ...nuevoUsuario,
                id: Date.now(),
                estado: 'Activo'
            };
            setUsuarios(prev => [...prev, usuarioConId]);
        }

        // Resetear estados
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

    // Validacion prop type

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

    return (
        <div className="w-full bg-background p-4 flex flex-col mt-5 rounded-lg shadow-md overflow-hidden border-2">
            <div className="w-full max-h-max flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-text-primary">Gestión de Usuarios</h2>
                <Button 
                    variant="success" 
                    onClick={() => {
                        setModoEdicion(false);
                        setUsuarioSeleccionado(null);
                        setModalState(true);
                    }}
                >                    
                    Agregar Usuario
                </Button>
            </div>
                    
            {/* Barra de búsqueda */}
            <BarraBusqueda 
                onSearch={handleSearch}
                placeholder="Buscar usuarios..."
                options={[
                    { value: 'todos', label: 'Todos' },
                    { value: 'Administrador', label: 'Administradores' },
                    { value: 'Empleado', label: 'Empleados' },
                    { value: 'Activo', label: 'Activos' },
                    { value: 'Inactivo', label: 'Inactivos' }
                ]}
            />
                    
            <UsuariosTable 
                usuarios={usuariosFiltrados}
                onEdit={handleEditarUsuario}
                onDelete={handleEliminarUsuario}
                onToggleActive={handleToggleActive}
                requestSort={(key) => console.log('Ordenar por:', key)} 
            />

            {/* Modal de Usuario */}
            {modalState && (
                <UsuarioForm
                    isOpen={modalState}
                    onClose={() => {
                        setModalState(false);
                        setUsuarioSeleccionado(null);
                    }}
                    title={usuarioSeleccionado ? 'Editar Usuario' : 'Agregar Usuario'}
                    usuarioSeleccionado={usuarioSeleccionado}
                    onGuardar={handleGuardarUsuario}
                    permisos={permisos} // Pasar permisos al formulario
                />
            )}
        </div>
    );
}

export default Usuarios;