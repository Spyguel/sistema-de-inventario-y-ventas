import { useState } from 'react';
//DISEÑO
import Button from '../components/common/button.jsx';
import UsuariosTable from '../components/Tablas/UsuariosTable.jsx';
import RolesTable from '../components/Tablas/RolesTable.jsx';
import PermisosTable from '../components/Tablas/PermisosTable.jsx';
import BarraBusqueda from '../components/common/BarraBusqueda.jsx';
//FORMULARIO
import UsuarioForm from '../components/Modals/UsuarioForm.jsx';
import RolForm from '../components/Modals/RolForm.jsx';
import PermisosForm from '../components/Modals/PermisosForm.jsx';
import PropTypes from 'prop-types';
//HOOKS Y FETCH
import useSearch from '../hooks/useSearch';
import useSearchOptions from '../hooks/useSearchOption.js';

import useFetchUsuarios from '../hooks/useFetchUsuarios';

import useRoles from '../hooks/useRoles';

import usePermisos from '../hooks/usePermisos';

import useModals from '../hooks/useModals';


function Usuarios({ permisos: propsPermisos }) {
    const [activeTab, setActiveTab] = useState('usuarios');
    const { usuarios, handleGuardarUsuario, handleEliminarUsuario } = useFetchUsuarios();
    const { searchConfig, handleSearch, filterData } = useSearch();
    const { roles, handleGuardarRol, handleEliminarRol, handleAddPermiso } = useRoles();
    const { permisos, handleGuardarPermiso, handleEliminarPermiso } = usePermisos();
    const { modals, selectedItems, setSelectedItems, handleOpenModal, handleCloseModal, handleAddButton } = useModals();
    const searchOptions = useSearchOptions(roles);

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

    return (
        <div className="h-[100%] ml-10 p-4">
            <div className="rounded-lg shadow-lg p-6 h-[95%]">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestión de {activeTab}</h2>
                <p className="text-sm text-gray-500 mb-4">
                    {activeTab === 'usuarios' && 'Administra los usuarios y sus roles en el sistema'}
                    {activeTab === 'roles' && 'Gestiona los roles y sus permisos asociados'}
                    {activeTab === 'permisos' && 'Configura los permisos disponibles en el sistema'}
                </p>

                <div className="flex space-x-4 mb-6 justify-end">
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

                <div className="flex justify-end mb-4">
                    <Button
                        onClick={() => handleAddButton(activeTab)}
                        variant="success"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                    >
                        + Agregar {activeTab.slice(0, -1)}
                    </Button>
                </div>

                <BarraBusqueda
                    onSearch={handleSearch}
                    placeholder={`Buscar ${activeTab}...`}
                    options={searchOptions[activeTab] || []}
                    initialFilters={searchConfig.filters}
                />

                <div className="mt-4 border border-gray-200 rounded-lg overflow-hidden">
                    {activeTab === 'usuarios' && (
                        <UsuariosTable
                            usuarios={getFilteredData()}
                            roles={roles}
                            onEdit={(usuario) => {
                                setSelectedItems(prev => ({ ...prev, usuario }));
                                handleOpenModal('usuarios');
                            }}
                            onDelete={handleEliminarUsuario}

                        />
                    )}
                    {activeTab === 'roles' && (
                        <RolesTable
                            roles={getFilteredData()}
                            onEdit={(rol) => {
                                setSelectedItems(prev => ({ ...prev, rol }));
                                handleOpenModal('roles');
                            }}
                            onPermiso={handleAddPermiso}
                            onDelete={handleEliminarRol}
                            permisos={permisos} //Array de permisos
                        />
                    )}
                    {activeTab === 'permisos' && (
                        <PermisosTable
                            permisos={getFilteredData()}
                            onEdit={(permiso) => {
                                setSelectedItems(prev => ({ ...prev, permiso }));
                                handleOpenModal('permisos');
                            }}
                            onDelete={handleEliminarPermiso}
                        />
                    )}
                </div>
            </div>

            {modals.usuarios && (
                <UsuarioForm
                    isOpen={modals.usuarios}
                    onClose={() => handleCloseModal('usuarios')}
                    title={selectedItems.usuario ? 'Editar Usuario' : 'Agregar Usuario'}
                    usuarioSeleccionado={selectedItems.usuario}
                    onGuardar={(usuarioData) => handleGuardarUsuario(usuarioData, selectedItems)}
                    permisos={propsPermisos}
                />
            )}

            {modals.roles && (
                <RolForm
                    isOpen={modals.roles}
                    onClose={() => handleCloseModal('roles')}
                    title={selectedItems.rol ? 'Editar Rol' : 'Agregar Rol'}
                    rolSeleccionado={selectedItems.rol}
                    onGuardar={(nuevoRol) => handleGuardarRol(nuevoRol, selectedItems.rol)}
                />
            )}

            {modals.permisos && (
                <PermisosForm
                    isOpen={modals.permisos}
                    onClose={() => handleCloseModal('permisos')}
                    title={selectedItems.permiso ? 'Editar Permiso' : 'Agregar Permiso'}
                    permisoSeleccionado={selectedItems.permiso}
                    onGuardar={(nuevoPermiso) => handleGuardarPermiso(nuevoPermiso, selectedItems.permiso)}
                />
            )}
        </div>
    );
}

Usuarios.propTypes = {
    permisos: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            nombre: PropTypes.string.isRequired,
        })
    ).isRequired,
};

Usuarios.defaultProps = {
    permisos: [],
};

export default Usuarios;