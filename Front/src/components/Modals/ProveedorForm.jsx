import PropTypes from 'prop-types';
import FormModal from '../common/common/Forms/FormModal';
import Form from '../common/common/Forms/Form';
import { TextInput } from '../common/common/Forms/Imputs/index';
import Message from '../common/common/Messages/Message';
import { useState, useEffect } from 'react';

const initialProveedorState = {
  nombre_contacto: '',
  tipo_contacto: 'Proveedor',
  direccion_contacto: '',
  telefono_contacto: '',
  mail_contacto: '',
  activo: true
};

const ProveedorForm = ({ isOpen, onClose, title, proveedorSeleccionado, onGuardar }) => {
  const [proveedor, setProveedor] = useState(initialProveedorState);
  const [message, setMessage] = useState({ text: '', type: '', isOpen: false });

  useEffect(() => {
    if (proveedorSeleccionado) {
      const activoBoolean =
        typeof proveedorSeleccionado.activo === 'string'
          ? proveedorSeleccionado.activo === 'Activo'
          : proveedorSeleccionado.activo;
      
      setProveedor({
        nombre_contacto: proveedorSeleccionado.nombre || '',
        tipo_contacto: proveedorSeleccionado.tipo_contacto || 'Proveedor',
        direccion_contacto: proveedorSeleccionado.direccion || '',
        telefono_contacto: proveedorSeleccionado.telefono || '',
        mail_contacto: proveedorSeleccionado.mail || '',
        activo: activoBoolean,
        id_contacto: proveedorSeleccionado.id_contacto
      });
    } else {
      setProveedor(initialProveedorState);
    }
  }, [proveedorSeleccionado]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProveedor({
      ...proveedor,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!proveedor.nombre_contacto.trim()) {
        setMessage({ text: 'El nombre es obligatorio', type: 'error', isOpen: true });
        return;
      }
  
      const datosParaGuardar = {
        nombre: proveedor.nombre_contacto,
        direccion: proveedor.direccion_contacto,
        telefono: proveedor.telefono_contacto,
        mail: proveedor.mail_contacto,
        tipo_contacto: proveedor.tipo_contacto,
        activo: proveedor.activo
      };
  
      if (proveedorSeleccionado?.id_contacto) {
        datosParaGuardar.id_contacto = proveedorSeleccionado.id_contacto;
      }
  
      await onGuardar(datosParaGuardar);
      setMessage({ text: 'Proveedor guardado con éxito', type: 'success', isOpen: true });
      setProveedor(initialProveedorState);
    } catch (error) {
      setMessage({ text: error.message, type: 'error', isOpen: true });
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
            name="nombre_contacto"
            type="text"
            value={proveedor.nombre_contacto}
            onChange={handleChange}
            error=""
            placeholder="Nombre del proveedor"
            autoFocus
          />

          <TextInput
            label="Dirección"
            name="direccion_contacto"
            type="text"
            value={proveedor.direccion_contacto}
            onChange={handleChange}
            error=""
            placeholder="Dirección del proveedor"
          />

          <TextInput
            label="Teléfono"
            name="telefono_contacto"
            type="tel"
            value={proveedor.telefono_contacto}
            onChange={handleChange}
            error=""
            placeholder="Teléfono del proveedor"
          />

          <TextInput
            label="Email"
            name="mail_contacto"
            type="email"
            value={proveedor.mail_contacto}
            onChange={handleChange}
            error=""
            placeholder="Email del proveedor"
          />
          {proveedor.mail_contacto && !validarEmail(proveedor.mail_contacto) && (
            <p className="mt-1 text-sm text-red-600">Por favor, ingrese un email válido</p>
          )}
        </Form>
      </FormModal>

      <Message
        isOpen={message.isOpen}
        onClose={() => setMessage({ text: '', type: '', isOpen: false })}
        message={message.text}
        type={message.type}
      />
    </>
  );
};

ProveedorForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  proveedorSeleccionado: PropTypes.shape({
    id_contacto: PropTypes.number,
    nombre: PropTypes.string,
    tipo_contacto: PropTypes.string,
    direccion: PropTypes.string,
    telefono: PropTypes.string,
    mail: PropTypes.string,
    activo: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
  }),
  onGuardar: PropTypes.func.isRequired
};

export default ProveedorForm;
