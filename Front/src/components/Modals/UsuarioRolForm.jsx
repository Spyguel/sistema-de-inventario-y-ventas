import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormModal from '../common/common/Forms/FormModal';
import Message from '../common/common/Messages/Message';
import Button from '../common/button';
import useFetchUsuarioRol from '../../hooks/useFetchUsuariosRol.js';


const UsuarioRolForm = ({ isOpen, onClose, usuarioSeleccionado, roles = [] }) => {
  const [selectedRol, setSelectedRol] = useState(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const { handleGuardarUsuarioRol } = useFetchUsuarioRol();

  useEffect(() => {
    if (!isOpen) {
      setSelectedRol(null);
    }
  }, [isOpen]);

  const handleGuardarRol = async (e) => {
    e.preventDefault();
    if (!selectedRol) {
      setMessageModalOpen(true);
      setToastMessage('Debe seleccionar un rol.'); 
      setToastType('error');
      return;
    }

    try {
      await handleGuardarUsuarioRol(usuarioSeleccionado.ID_usuario, selectedRol);
      onClose();
    } catch (error) {
      setMessageModalOpen(true);
      setToastMessage('Error al asignar el rol.');
      setToastType('error');
      console.error(error);
    }
  };

  return (
    <>
      <FormModal isOpen={isOpen} onClose={onClose} title={`Asignar Rol a ${usuarioSeleccionado?.email || ''}`}>
      <form onSubmit={handleGuardarRol}>
  <div className="space-y-4">
    <h3 className="text-lg font-semibold text-gray-800">Seleccione un rol:</h3>
    <div className="max-h-60 overflow-y-auto pr-2 rounded-md border border-gray-200">
      {roles.length > 0 ? (
        roles.map((rol) => (
          <label 
            key={rol.ID_rol} 
            className="flex items-center space-x-3 p-2 hover:bg-gray-100 transition border-b last:border-b-0 border-gray-200"
          >
            <input
              type="radio"
              name="rol"
              value={rol.ID_rol}
              checked={selectedRol === rol.ID_rol}
              onChange={() => setSelectedRol(rol.ID_rol)}
              className="form-radio h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700">{rol.nombre}</span>
          </label>
        ))
      ) : (
        <p className="text-gray-500 p-2">No hay roles disponibles</p>
      )}
    </div>
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
      <Message isOpen={messageModalOpen} onClose={() => setMessageModalOpen(false)} message={toastMessage} type={toastType} />
    </>
  );
};

UsuarioRolForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  usuarioSeleccionado: PropTypes.shape({
    ID_usuario: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      ID_rol: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default UsuarioRolForm;
