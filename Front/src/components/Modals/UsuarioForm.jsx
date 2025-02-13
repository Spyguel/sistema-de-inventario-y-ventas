import PropTypes from 'prop-types';
import FormModal from '../common/common/Forms/FormModal';
import Form from '../common/common/Forms/Form';
import { TextInput, SelectInput } from '../common/common/Forms/Imputs/index';
import Message from '../common/common/Messages/Message';
import { useState } from 'react';

const UsuarioForm = ({ isOpen, onClose, title }) => {
  const rolEmpleado = 2; // Valor fijo para "Empleado"

  // Estados para los inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  // Función para enviar los datos al backend
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          roleId: rolEmpleado, // Siempre "Empleado"
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar usuario');
      }

      setMessage({ text: 'Usuario registrado con éxito', type: 'success' });

      // Limpiar el formulario
      setEmail('');
      setPassword('');
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  return (
    <>
      <FormModal isOpen={isOpen} onClose={onClose} title={title}>
        <Form onSubmit={handleFormSubmit} onCancel={onClose} cancelText="Cancelar" submitText="Crear">
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
            placeholder="Ingrese su contraseña"
          />

          <SelectInput
            label="Rol"
            name="rol"
            value={rolEmpleado}
            onChange={() => {}}
            options={[{ value: 2, label: 'Empleado' }]}
            error=""
            disabled
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
};

export default UsuarioForm;
