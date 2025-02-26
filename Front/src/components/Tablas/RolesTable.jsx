// RolesTable.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import Button from '../common/button';
import Tabla from '../common/Tabla';
import RolPermisoForm from '../Modals/RolPermisoForm';

const RolesTable = ({
  roles = [],
  onEdit,
  onDelete,
  onPermiso,
  requestSort = () => {},
  permisos
  
}) => {
  const [selectedRol, setSelectedRol] = useState(null);
  const [showPermisoModal, setShowPermisoModal] = useState(false);

  // Función para abrir el modal antes de llamar a onPermiso
  const handleAddPermisoARol = (rol) => {
    alert("Hasta aqui llego")
    setSelectedRol(rol);
    alert("Hasra aqui tambien")
    setShowPermisoModal(true);
  };

  // Confirmar selección de permisos y llamar a onPermiso
  const handleConfirmPermisos = (rol, permisosSeleccionados) => {
    onPermiso(rol, permisosSeleccionados);
    setShowPermisoModal(false);
  };

  // Encabezados de la tabla sin incluir datos no deseados
  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcion', label: 'Descripción' }
  ];

  // Función para renderizar los botones de acción
  const renderActions = (rol) => (
    <>
      <Button
        onClick={() => onEdit(rol)}
        variant="primary"
        size="sm"
      >
        <PencilIcon className="h-4 w-4" />
      </Button>
      
      <Button
        onClick={() => handleAddPermisoARol(rol)}
        variant="primary"
        size="sm"
        title="Asignar permisos"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      </Button>
      
      <Button
        onClick={() => onDelete(rol.id)}
        variant="danger"
        size="sm"
      >
        <TrashIcon className="h-4 w-4" />
      </Button>
    </>
  );

  // Mapeo de los roles
  const mappedRoles = roles.map(rol => ({
    id: rol.ID_rol,
    nombre: rol.nombre,
    descripcion: rol.descripcion,
  }));

  return (
    <>
      <Tabla
        headers={headers}
        data={mappedRoles}
        onSort={requestSort}
        renderActions={renderActions}
      />
      
      {showPermisoModal && selectedRol && (
        <RolPermisoForm
          isOpen={showPermisoModal}
          onClose={() => setShowPermisoModal(false)}
          onPermiso={(permisosSeleccionados) => handleConfirmPermisos(selectedRol, permisosSeleccionados)}
          permisos={permisos}
          rolSeleccionado={selectedRol}
        />
      )}
    </>
  );
};

RolesTable.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.shape({
    ID_rol: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    nombre: PropTypes.string.isRequired,
    descripcion: PropTypes.string,
  })).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onPermiso: PropTypes.func.isRequired,
  requestSort: PropTypes.func,
  permisos: PropTypes.array
};

export default RolesTable;