import PropTypes from 'prop-types';
import FormModal from '../common/common/Forms/FormModal';
import Form from '../common/common/Forms/Form';
import { TextInput, SelectInput } from '../common/common/Forms/Imputs/index';
import Message from '../common/common/Messages/Message';
import { useState, useEffect } from 'react';

const UsuarioForm = ({
  isOpen,
  onClose,
  title,
  usuarioSeleccionado = null, // Valor por defecto aquí
  onGuardar,
  roles
}) => {
  // Estados para los inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [roleId, setRoleId] = useState(2); // Valor por defecto para "Empleado"
  const [message, setMessage] = useState({ isOpen: false, text: '', type: '' });
  const [actionType, setActionType] = useState(''); // 'edit' o 'create'

  // Cargar los datos del usuario seleccionado al abrir el modal
  useEffect(() => {
    if (usuarioSeleccionado) {
      setEmail(usuarioSeleccionado.email);
      setRoleId(usuarioSeleccionado.ID_rol);
      setPassword(''); // No cargamos la contraseña por seguridad
      setActionType('edit'); // Establecer el tipo de acción a 'edit'
    } else {
      // Si no hay usuario seleccionado, reiniciamos los campos
      setEmail('');
      setPassword('');
      setRoleId(2);
      setActionType('create'); // Establecer el tipo de acción a 'create'
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
      setMessage({ isOpen: true, text: actionType === 'edit' ? 'Usuario editado con éxito' : 'Usuario creado con éxito', type: 'success' });
  
      // Limpiar el formulario después de un tiempo
      setTimeout(() => {
        setEmail('');
        setPassword('');
        setMessage({ isOpen: false, text: '', type: '' });
        onClose(); // Cerrar el modal
      }, 3000); // Aumentar el tiempo de visualización del mensaje
    } catch (error) {
      setMessage({ isOpen: true, text: error.message, type: 'error' });
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
            options={roles.map((rol) => ({
              value: rol.ID_rol, // Cambia a ID_rol para que sea el valor correcto
              label: rol.nombre,  // Asegúrate de que el label sea el nombre del rol
            }))}
            error=""
          />
        </Form>
      </FormModal>

      {/* Mensaje de éxito o error */}
      <Message 
        isOpen={message .isOpen} 
        onClose={() => setMessage({ ...message, isOpen: false })} 
        message={message.text} 
        type={message.type} 
      />
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
  roles: PropTypes.arrayOf(
    PropTypes.shape({
      ID_rol: PropTypes.number,
      nombre: PropTypes.string,
    })
  ).isRequired,
};

export default UsuarioForm;