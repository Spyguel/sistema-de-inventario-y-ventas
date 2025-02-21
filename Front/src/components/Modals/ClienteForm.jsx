import PropTypes from 'prop-types';
import FormModal from '../common/common/Forms/FormModal';
import Form from '../common/common/Forms/Form';
import { TextInput} from '../common/common/Forms/Imputs/index';
import Message from '../common/common/Messages/Message';
import { useState, useEffect } from 'react';

const ClienteForm = ({ isOpen, onClose, title, clienteSeleccionado, onGuardar }) => {

  const [cliente, setCliente] = useState({
    nombre: '',
    tipo_contacto: 'Cliente', // por defecto devuelve siempre cliente
    direccion: '',
    telefono: '',
    mail: '',
    activo: true
  });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (clienteSeleccionado) {
      setCliente(clienteSeleccionado);
    } else {
      setCliente({
        nombre: '',
        tipo_contacto: 'Cliente',
        direccion: '',
        telefono: '',
        mail: '',
        activo: true
      });
    }
  }, [clienteSeleccionado]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCliente({
      ...cliente,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onGuardar(cliente);
      setMessage({ text: 'Cliente guardado con éxito', type: 'success' });
      setCliente({
        nombre: '',
        tipo_contacto: 'Cliente',
        direccion: '',
        telefono: '',
        mail: '',
        activo: true
      });
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  const validarEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <>
      <FormModal isOpen={isOpen} onClose={onClose} title={title}>
        <Form onSubmit={handleSubmit} onCancel={onClose} cancelText="Cancelar" submitText="Guardar">
          <TextInput
            label="Nombre"
            name="nombre"
            type="text"
            value={cliente.nombre}
            onChange={handleChange}
            error=""
            placeholder="Nombre del cliente"
            autoFocus
          />

          <TextInput
            label="Dirección"
            name="direccion"
            type="text"
            value={cliente.direccion}
            onChange={handleChange}
            error=""
            placeholder="Dirección del cliente"
          />

          <TextInput
            label="Teléfono"
            name="telefono"
            type="tel"
            value={cliente.telefono}
            onChange={handleChange}
            error=""
            placeholder="Teléfono del cliente"
          />

          <TextInput
            label="Email"
            name="mail"
            type="email"
            value={cliente.mail}
            onChange={handleChange}
            error=""
            placeholder="Email del cliente"
          />
          {cliente.mail && !validarEmail(cliente.mail) && (
            <p className="mt-1 text-sm text-red-600">Por favor, ingrese un email válido</p>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="activo"
              name="activo"
              checked={cliente.activo}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="activo" className="ml-2 block text-sm font-medium text-gray-700">
              Cliente activo
            </label>
          </div>
        </Form>
      </FormModal>

      {/* Mensaje de éxito o error */}
      <Message isOpen={!!message.text} onClose={() => setMessage({ text: '', type: '' })} message={message.text} type={message.type} />
    </>
  );
};

ClienteForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  clienteSeleccionado: PropTypes.shape({
    id_contacto: PropTypes.number,
    nombre: PropTypes.string,
    tipo_contacto: PropTypes.string,
    direccion: PropTypes.string,
    telefono: PropTypes.string,
    mail: PropTypes.string,
    activo: PropTypes.bool
  }),
  onGuardar: PropTypes.func.isRequired
};

export default ClienteForm;
