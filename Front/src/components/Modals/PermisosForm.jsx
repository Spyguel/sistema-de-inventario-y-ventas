import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormModal from '../common/common/Forms/FormModal';
import Form from '../common/common/Forms/Form';
import { TextInput, SelectInput } from '../common/common/Forms/Imputs/index';
import Message from '../common/common/Messages/Message';
import {ListButtonsSidebar} from '../common/ListButtonSidebar';

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
    buttonId: '', // ID del botón del sistema
    activo: true
  });

  const [errors, setErrors] = useState({});
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Convertimos los botones del sistema a opciones para el select
  const buttonOptions = ListButtonsSidebar.map(button => ({
    value: button.id,
    label: button.name
  }));

  useEffect(() => {
    if (permisoSeleccionado) {
      setFormData({
        nombre: permisoSeleccionado.Nombre,
        descripcion: permisoSeleccionado.Descripcion,
        buttonId: permisoSeleccionado.ButtonID,
        activo: permisoSeleccionado.Activo
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

    if (!formData.buttonId) {
      newErrors.buttonId = 'Debe seleccionar un componente del sistema';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      buttonId: '',
      activo: true
    });
    setErrors({});
    setMessageModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onGuardar({
        ButtonID: formData.buttonId,
        Nombre: formData.nombre,
        Descripcion: formData.descripcion,
        Activo: formData.activo,
        ID_permiso: permisoSeleccionado?.ID_permiso || Date.now()
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
          submitText={permisoSeleccionado ? 'Actualizar' : 'Crear'}
        >
          <TextInput
            label="Nombre del Permiso"
            name="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            error={errors.nombre}
            placeholder="Ej: Acceso a Gestión de Usuarios"
            autoFocus
          />

          <TextInput
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            error={errors.descripcion}
            placeholder="Describe el propósito del permiso"
          />

          <SelectInput
            label="Componente del Sistema"
            name="buttonId"
            value={formData.buttonId}
            onChange={(e) => setFormData({ ...formData, buttonId: e.target.value })}
            options={buttonOptions}
            error={errors.buttonId}
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