import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormModal from '../common/common/Forms/FormModal';
import Form from '../common/common/Forms/Form';
import { TextInput, SelectInput } from '../common/common/Forms/Imputs/index';
import Message from '../common/common/Messages/Message';

const UsuarioForm = ({ 
  isOpen, 
  onClose, 
  title, 
  onGuardar, 
  usuarioSeleccionado,
  rolesDisponibles 
}) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    email: '',
    rol: '',
    contraseña: '',
    activo: true
  });

  // Estado de errores
  const [errors, setErrors] = useState({});
  const [messageModalOpen, setMessageModalOpen] = useState(false); // Estado para el modal de mensaje
  const [toastMessage, setToastMessage] = useState(''); // Estado para el mensaje del toast
  const [toastType, setToastType] = useState('success'); // Estado para el tipo de mensaje del toast

  // Efecto para cargar datos en edición
  useEffect(() => {
    if (usuarioSeleccionado) {
      setFormData({
        email: usuarioSeleccionado.Email,
        rol: usuarioSeleccionado.ID_rol,
        contraseña: '',
        activo: usuarioSeleccionado.Activo
      });
    } else {
      resetForm();
    }
  }, [usuarioSeleccionado]);

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (!formData .rol) {
      newErrors.rol = 'Debe seleccionar un rol';
    }

    if (!formData.contraseña.trim()) {
      newErrors.contraseña = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      email: '',
      rol: '',
      contraseña: '',
      activo: true
    });
    setErrors({});
    setMessageModalOpen(false); // Cerrar el modal de mensaje
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onGuardar({
        ID_rol: formData.rol,
        Email: formData.email,
        Contraseña: formData.contraseña,
        Activo: formData.activo,
        ID_usuario: usuarioSeleccionado?.ID_usuario || Date.now()
      });
      setMessageModalOpen(true); // Abrir el modal de mensaje
      setToastMessage('Usuario guardado correctamente.'); // Mensaje de éxito
      setToastType('success');
      onClose();
      resetForm();
    } else {
      setMessageModalOpen(true); // Abrir el modal de mensaje
      setToastMessage('Error al guardar el usuario. Verifique los campos.'); // Mensaje de error
      setToastType('error');
    }
  };

  // Opciones para selects
  const estadoOptions = [
    { value: true, label: 'Activo' },
    { value: false, label: 'Inactivo' }
  ];

  return (
    <>
      <FormModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          resetForm();
        }}
        title={title}
      >
        <Form
          onSubmit={handleSubmit}
          onCancel={() => {
            onClose();
            resetForm();
          }}
          cancelText="Cancelar"
          submitText={usuarioSeleccionado ? 'Actualizar' : 'Crear'}
        >
          <TextInput
            label="Correo electrónico"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            error={errors.email}
            placeholder="Ej: juan@empresa.com"
            autoFocus
          />

          <TextInput
            label="Contraseña"
            name="contraseña"
            type="password"
            value={formData.contraseña}
            onChange={(e) => setFormData({ ...formData, contraseña: e.target.value })}
            error={errors.contraseña}
            placeholder="Ingrese su contraseña"
          />

          <SelectInput
            label="Rol"
            name="rol"
            value={formData.rol}
            onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
            options={rolesDisponibles}
            error={errors.rol}
          />

          <SelectInput
            label="Estado"
            name="activo"
            value={formData.activo}
            onChange={(e) => setFormData({ ...formData, activo: e.target.value === 'true' })}
            options={estadoOptions}
          />
        </Form>
      </FormModal>
      <Message 
        isOpen={messageModalOpen} 
        onClose={() => setMessageModalOpen(false)} 
        message={toastMessage} 
        type={toastType} 
      /> {/* Mostrar el modal de mensaje */}
    </>
  );
};

UsuarioForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onGuardar: PropTypes.func.isRequired,
  usuarioSeleccionado: PropTypes.object,
  rolesDisponibles: PropTypes.array.isRequired
};

export default UsuarioForm;