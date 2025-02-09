import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormModal from '../common/common/Forms/FormModal';
import Form from '../common/common/Forms/Form';
import { TextInput } from '../common/common/Forms/Imputs/index';
import Message from '../common/common/Messages/Message';

const RolForm = ({ 
  isOpen, 
  onClose, 
  title, 
  onGuardar, 
  rolSeleccionado 
}) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    estado: 'Activo' // Estado por defecto
  });

  // Estado de errores
  const [errors, setErrors] = useState({});
  const [messageModalOpen, setMessageModalOpen] = useState(false); // Estado para el modal de mensaje
  const [toastMessage, setToastMessage] = useState(''); // Estado para el mensaje del toast
  const [toastType, setToastType] = useState('success'); // Estado para el tipo de mensaje del toast

  // Efecto para cargar datos en edición
  useEffect(() => {
    if (rolSeleccionado) {
      setFormData({
        nombre: rolSeleccionado.nombre,
        descripcion: rolSeleccionado.descripcion,
        estado: rolSeleccionado.estado || 'Activo'
      });
    } else {
      resetForm();
    }
  }, [rolSeleccionado]);

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      estado: 'Activo'
    });
    setErrors({});
    setMessageModalOpen(false); 
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onGuardar({
        ...formData,
        id: rolSeleccionado?.id || Date.now() // Asignar ID si es nuevo
      });
      setMessageModalOpen(true); // Abrir el modal de mensaje
      setToastMessage('Rol guardado correctamente.'); // Mensaje de éxito
      setToastType('success');
      onClose();
      resetForm();
    } else {
      setMessageModalOpen(true); // Abrir el modal de mensaje
      setToastMessage('Error al guardar el rol. Verifique los campos.'); // Mensaje de error
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
          submitText={rolSeleccionado ? 'Actualizar' : 'Crear'}
        >
          <TextInput
            label="Nombre del Rol"
            name="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            error={errors.nombre}
            placeholder="Ej: Administrador"
            autoFocus
          />

          <TextInput
            label="Descripción"
            name="descripcion"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            error={errors.descripcion}
            placeholder="Descripción del rol"
          />

          <div>
            <label className="block text-gray-700 mb-2">Estado</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value=" Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
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

RolForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onGuardar: PropTypes.func.isRequired,
  rolSeleccionado: PropTypes.object
};

export default RolForm;