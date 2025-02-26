import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormModal from '../common/common/Forms/FormModal';
import Form from '../common/common/Forms/Form';
import { TextInput, SelectInput } from '../common/common/Forms/Imputs/index';
import Message from '../common/common/Messages/Message';
import { ListButtonsSidebar } from '../common/ListButtonSidebar';

const PermisoForm = ({
  isOpen,
  onClose,
  title,
  onGuardar,
  permisoSeleccionado
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    acceso: '', 
  });

  const [errors, setErrors] = useState({});
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Convertimos los botones del sistema a opciones para el select
  const buttonOptions = ListButtonsSidebar.map(button => ({
    value: button.id,
    label: button.title 
  }));

  useEffect(() => {
    if (permisoSeleccionado) {
      setFormData({
        nombre: permisoSeleccionado.Nombre,
        descripcion: permisoSeleccionado.Descripcion,
        acceso: permisoSeleccionado.acceso, 
      });
    } else {
      resetForm();
    }
  }, [permisoSeleccionado]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del permiso es requerido';
    }

    if (!formData.acceso) { // Cambié 'id' por 'acceso'
      newErrors.acceso = 'Debe seleccionar un componente del sistema';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      acceso: '', // Cambié 'id' por 'acceso'
    });
    setErrors({});
    setMessageModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onGuardar({
        ID_permiso: permisoSeleccionado?.ID_permiso || Date.now(),
        Nombre: formData.nombre,
        acceso: formData.acceso,
        descripcion: formData.descripcion
        
      });
      setMessageModalOpen(true);
      setToastMessage('Permiso guardado correctamente.');
      setToastType('success');
      onClose();
      resetForm();
    } else {
      setMessageModalOpen(true);
      setToastMessage('Error al guardar el permiso. Verifique los campos.');
      setToastType('error');
    }
  };

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
          submitText={permisoSeleccionado ? 'Actualizar' : 'Crear'}
        >
          <TextInput
            label="Nombre del Permiso"
            title="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            error={errors.nombre}
            placeholder="Ej: Acceso a Gestión de Usuarios"
            autoFocus
          />

          <TextInput
            label="Descripción"
            title="descripcion"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            error={errors.descripcion}
            placeholder="Describe el propósito del permiso"
          />

          <SelectInput
            label="Componente del Sistema"
            title="acceso" 
            value={formData.acceso} 
            onChange={(e) => setFormData({ ...formData, acceso: e.target.value })} 
            options={buttonOptions}
            error={errors.acceso} 
          />
        </Form>
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

PermisoForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onGuardar: PropTypes.func.isRequired,
  permisoSeleccionado: PropTypes.object
};

export default PermisoForm;
