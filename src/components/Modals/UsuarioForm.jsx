import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormModal  from '../common/common/Forms/FormModal';
import Form  from '../common/common/Forms/Form';
import { TextInput, SelectInput } from '../common/common/Forms/Imputs/index';

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
    nombre: '',
    email: '',
    rol: '',
    estado: 'Activo'
  });

  // Estado de errores
  const [errors, setErrors] = useState({});

  // Efecto para cargar datos en edición
  useEffect(() => {
    if (usuarioSeleccionado) {
      setFormData({
        nombre: usuarioSeleccionado.nombre,
        email: usuarioSeleccionado.email,
        rol: usuarioSeleccionado.rol,
        estado: usuarioSeleccionado.estado
      });
    } else {
      resetForm();
    }
  }, [usuarioSeleccionado]);

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    if (!formData.rol) {
      newErrors.rol = 'Debe seleccionar un rol';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      email: '',
      rol: '',
      estado: 'Activo'
    });
    setErrors({});
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onGuardar({
        ...formData,
        id: usuarioSeleccionado?.id || Date.now()
      });
      onClose();
      resetForm();
    }
  };

  // Opciones para selects
  const estadoOptions = [
    { value: 'Activo', label: 'Activo' },
    { value: 'Inactivo', label: 'Inactivo' }
  ];

  return (
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
          label="Nombre completo"
          name="nombre"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          error={errors.nombre}
          placeholder="Ej: Juan Pérez"
          autoFocus
        />

        <TextInput
          label="Correo electrónico"
          name="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          error={errors.email}
          placeholder="Ej: juan@empresa.com"
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
          name="estado"
          value={formData.estado}
          onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
          options={estadoOptions}
        />
      </Form>
    </FormModal>
  );
};

UsuarioForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onGuardar: PropTypes.func.isRequired,
  usuarioSeleccionado: PropTypes.shape({
    id: PropTypes.number,
    nombre: PropTypes.string,
    email: PropTypes.string,
    rol: PropTypes.string,
    estado: PropTypes.string
  }),
  rolesDisponibles: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired
};

UsuarioForm.defaultProps = {
  usuarioSeleccionado: null
};

export default UsuarioForm;