import { useState } from 'react';
import PropTypes from 'prop-types';
import Button from "../button";

const UserModal = ({ 
  modalState, 
  setModalState, 
  handleGuardarUsuario, 
  usuarioSeleccionado = null 
}) => {
  const [modoEdicion] = useState(!!usuarioSeleccionado);

  return (
    <>
      {modalState && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-2xl font-bold mb-4">
              {modoEdicion ? 'Editar' : 'Agregar'} Usuario
            </h2>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const nuevoUsuario = {
                  nombre: formData.get('nombre'),
                  email: formData.get('email'),
                  rol: formData.get('rol'),
                  estado: formData.get('estado') || 'Activo'
                };
                handleGuardarUsuario(nuevoUsuario);
              }} 
              className="space-y-4"
            >
              <div>
                <label className="block text-gray-700 mb-2">Nombre Completo</label>
                <input 
                  type="text"
                  name="nombre"
                  defaultValue={usuarioSeleccionado?.nombre || ''}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Correo Electrónico</label>
                <input 
                  type="email"
                  name="email"
                  defaultValue={usuarioSeleccionado?.email || ''}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Rol</label>
                <select
                  name="rol"
                  defaultValue={usuarioSeleccionado?.rol || ''}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Seleccionar Rol</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Empleado">Empleado</option>
                  <option value="Supervisor">Supervisor</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Estado</label>
                <select
                  name="estado"
                  defaultValue={usuarioSeleccionado?.estado || 'Activo'}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  type="submit" 
                  variant="success"
                >
                  {modoEdicion ? 'Actualizar' : 'Crear'} Usuario
                </Button>
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => {
                    setModalState(false);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

UserModal.propTypes = {
  modalState: PropTypes.bool.isRequired,
  setModalState: PropTypes.func.isRequired,
  handleGuardarUsuario: PropTypes.func.isRequired,
  usuarioSeleccionado: PropTypes.object
};

export default UserModal;