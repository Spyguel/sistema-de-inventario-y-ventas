import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormModal from '../common/common/Forms/FormModal';
import Message from '../common/common/Messages/Message';
import Button from '../common/button';
import useFetchRolPermiso from '../../hooks/useFetchRolPermiso';

const RolPermisoForm = ({ isOpen, onClose, permisos = [], rolSeleccionado }) => {
  const [selectedPermisos, setSelectedPermisos] = useState([]);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Extraemos la función que guarda en la base de datos desde el hook.
  const { guardarRolPermiso } = useFetchRolPermiso();

  useEffect(() => {
    if (!isOpen) {
      setSelectedPermisos([]);
    }
  }, [isOpen]);

  const handleCheckboxChange = (id) => {
    setSelectedPermisos((prev) =>
      prev.includes(id)
        ? prev.filter((permiso) => permiso !== id)
        : [...prev, id]
    );
  };

  const handleGuardarRolPermiso = async (e) => {
    e.preventDefault();
    if (selectedPermisos.length === 0) {
      setMessageModalOpen(true);
      setToastMessage('Debe seleccionar al menos un permiso.');
      setToastType('error');
      return;
    } else {
      try {
        await guardarRolPermiso(rolSeleccionado, selectedPermisos);
        onClose();
      } catch (error) {
        setMessageModalOpen(true);
        setToastMessage('Error al guardar los permisos.');
        setToastType('error');
        console.log(error)
      }
    }
  };

  return (
    <>
      <FormModal
        isOpen={isOpen}
        onClose={onClose}
        title={`Asignar Permisos a ${rolSeleccionado?.nombre || ''}`}
      >
        {/* Opcionalmente se puede envolver en un formulario */}
        <form onSubmit={handleGuardarRolPermiso}>
          <div className="h-72 space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Seleccione los permisos que desea asignar:
            </h3>
            {permisos && permisos.length > 0 ? (
              permisos.map((permiso) => (
                <label
                  key={permiso.ID_permiso}
                  className="flex items-center space-x-3 p-2 border rounded-md hover:bg-gray-100 transition overflow-x-hidden"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermisos.includes(permiso.ID_permiso)}
                    onChange={() => handleCheckboxChange(permiso.ID_permiso)}
                    className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-gray-700">
                    {permiso.Nombre} -{' '}
                    <span className="text-sm text-gray-500">
                      {permiso.descripcion}
                    </span>
                  </span>
                </label>
              ))
            ) : (
              <p className="text-gray-500">No hay permisos disponibles</p>
            )}
          </div>
          <div className="flex justify-end mt-4">
            <Button type="button" onClick={onClose} variant="secondary" className="mr-2">
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Guardar
            </Button>
          </div>
        </form>
      </FormModal>
      <Message
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        message={toastMessage}
        type={toastType}
      />
    </>
  );
};

RolPermisoForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  permisos: PropTypes.arrayOf(
    PropTypes.shape({
      ID_permiso: PropTypes.number.isRequired,
      Nombre: PropTypes.string.isRequired,
      descripcion: PropTypes.string.isRequired,
    })
  ).isRequired,
  rolSeleccionado: PropTypes.object,
};

export default RolPermisoForm;
