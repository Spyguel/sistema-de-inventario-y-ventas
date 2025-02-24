import PropTypes from 'prop-types';
import FormModal from '../common/common/Forms/FormModal';
import Form from '../common/common/Forms/Form';
import { TextInput, SelectInput } from '../common/common/Forms/Imputs/index';
import Message from '../common/common/Messages/Message';
import { useState, useEffect } from 'react';

const UsuarioForm = ({ isOpen, onClose, title, usuarioSeleccionado, onGuardar }) => {
  // Estados para los inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(2); // Valor por defecto para "Empleado"
  const [message, setMessage] = useState({ text: '', type: '' });

  // Cargar los datos del usuario seleccionado al abrir el modal
  useEffect(() => {
    if (usuarioSeleccionado) {
      setEmail(usuarioSeleccionado.email);
      setRoleId(usuarioSeleccionado.ID_rol);
      setPassword(''); // No cargamos la contraseña por seguridad
    } else {
      // Si no hay usuario seleccionado, reiniciamos los campos
      setEmail('');
      setPassword('');
      setRoleId(2);
    }
  }, [usuarioSeleccionado]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Crear el objeto con los datos del usuario
      const usuarioData = {};
  
      // Solo incluir el email si ha cambiado
      if (email !== usuarioSeleccionado?.email) {
        usuarioData.email = email;
      }
  
      // Solo incluir la contraseña si se ha proporcionado
      if (password) {
        usuarioData.password = password;
      }
  
      // Solo incluir el rol si ha cambiado
      if (roleId !== usuarioSeleccionado?.ID_rol) {
        usuarioData.roleId = roleId;
      }
  
      // Llamar a la función onGuardar pasada como prop
      await onGuardar(usuarioData);
  
      // Mostrar mensaje de éxito
      setMessage({ text: 'Usuario actualizado con éxito', type: 'success' });
  
      // Limpiar el formulario después de un tiempo
      setTimeout(() => {
        setEmail('');
        setPassword('');
        setMessage({ text: '', type: '' });
        onClose(); // Cerrar el modal
      }, 2000);
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  return (
    <>
      <FormModal isOpen={isOpen} onClose={onClose} title={title}>
        <Form onSubmit={handleFormSubmit} onCancel={onClose} cancelText="Cancelar" submitText={usuarioSeleccionado ? 'Guardar cambios' : 'Crear'}>
          <TextInput
            label="Correo electrónico"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error=""
            placeholder="Ej: juan@empresa.com"
            autoFocus
          />

          <TextInput
            label="Contraseña"
            name="contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error=""
            placeholder={usuarioSeleccionado ? 'Dejar en blanco para no cambiar' : 'Ingrese su contraseña'}
          />

          <SelectInput
            label="Rol"
            name="rol"
            value={roleId}
            onChange={(e) => setRoleId(Number(e.target.value))}
            options={[
              { value: 1, label: 'Administrador' },
              { value: 2, label: 'Empleado' },
            ]}
            error=""
          />
        </Form>
      </FormModal>

      {/* Mensaje de éxito o error */}
      <Message isOpen={!!message.text} onClose={() => setMessage({ text: '', type: '' })} message={message.text} type={message.type} />
    </>
  );
};

UsuarioForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  usuarioSeleccionado: PropTypes.shape({
    ID_usuario: PropTypes.number,
    email: PropTypes.string,
    ID_rol: PropTypes.number,
  }),
  onGuardar: PropTypes.func.isRequired,
};

UsuarioForm.defaultProps = {
  usuarioSeleccionado: null,
};

export default UsuarioForm;