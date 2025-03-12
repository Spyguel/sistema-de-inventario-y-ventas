import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormModal from '../common/common/Forms/FormModal';
import Form from '../common/common/Forms/Form';
import { TextInput, SelectInput } from '../common/common/Forms/Imputs/index';
import Message from '../common/common/Messages/Message';
import { TIPOS_MOVIMIENTO, RAZONES_MOVIMIENTO, TIPOS_DOCUMENTO } from '../common/common/ui/const';

const MovimientoForm = ({
  isOpen,
  onClose,
  onGuardar,
  data 
}) => {
  const [formData, setFormData] = useState({
    tipo_mov: '',     
    razon: '',
    id_contacto: '',
    id_items: [],
    cantidades: {},
    detalle: '',
    documento: {
      tipo_documento: '',
      fecha: '',
      total: '',
      pdf: null
    }
  });

  const [errors, setErrors] = useState({});
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Estados locales para almacenar contactos e ítems según la selección
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    console.log('Datos recibidos en MovimientoForm:', data);
    alert('Datos recibidos: ' + JSON.stringify(data));
  }, [data]);
  
  
  useEffect(() => {
    if (formData.tipo_mov === TIPOS_MOVIMIENTO.ENTRADA) {
      setFilteredContacts(data.proveedores || []);
    } else if (formData.tipo_mov === TIPOS_MOVIMIENTO.SALIDA) {
      setFilteredContacts(data.clientes || []);
    } else {
      setFilteredContacts([]);
    }
    // Resetea contacto e ítems cuando cambia el movimiento
    setFormData(prev => ({
      ...prev,
      id_contacto: '',
      id_items: [],
      cantidades: {}
    }));
    setFilteredItems([]);
  }, [formData.tipo_mov, data]);

  // Al seleccionar un contacto se actualiza la lista de ítems
  useEffect(() => {
    if (formData.id_contacto) {
      const selectedGroup = filteredContacts.find(
        group => String(group.contacto.id_contacto) === formData.id_contacto
      );
      if (selectedGroup) {
        setFilteredItems(selectedGroup.items || []);
      } else {
        setFilteredItems([]);
      }
      // Resetea ítems seleccionados y cantidades
      setFormData(prev => ({
        ...prev,
        id_items: [],
        cantidades: {}
      }));
    } else {
      setFilteredItems([]);
    }
  }, [formData.id_contacto, filteredContacts]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.tipo_mov) {
      newErrors.tipo_mov = 'Seleccione un tipo de movimiento';
    }
    if (!formData.razon) {
      newErrors.razon = 'Seleccione una razón';
    }
    if (!formData.id_contacto) {
      newErrors.id_contacto = 'Seleccione un contacto';
    }
    if (formData.id_items.length === 0) {
      newErrors.id_items = 'Seleccione al menos un ítem';
    }
    formData.id_items.forEach(id_item => {
      if (!formData.cantidades[id_item] || Number(formData.cantidades[id_item]) <= 0) {
        newErrors[`cantidad_${id_item}`] = 'La cantidad debe ser mayor a 0';
      }
    });
    if (!formData.documento.tipo_documento) {
      newErrors['documento.tipo_documento'] = 'Seleccione un tipo de documento';
    }
    if (!formData.documento.fecha) {
      newErrors['documento.fecha'] = 'Ingrese la fecha del documento';
    }
    if (!formData.documento.total || Number(formData.documento.total) <= 0) {
      newErrors['documento.total'] = 'El total debe ser mayor a 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'tipo_mov') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        razon: '',
        id_contacto: '',
        id_items: [],
        cantidades: {}
      }));
    } else if (name === 'id_contacto') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        id_items: [],
        cantidades: {}
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDocumentoChange = (e) => {
    const { name, value, type, files } = e.target;
    const newValue = type === 'file' ? files[0] : value;
    setFormData(prev => ({
      ...prev,
      documento: { ...prev.documento, [name]: newValue }
    }));
  };

  const handleCantidadChange = (id_item, value) => {
    setFormData(prev => ({
      ...prev,
      cantidades: { ...prev.cantidades, [id_item]: value }
    }));
  };

  const resetForm = () => {
    setFormData({
      tipo_mov: '',
      razon: '',
      id_contacto: '',
      id_items: [],
      cantidades: {},
      detalle: '',
      documento: {
        tipo_documento: '',
        fecha: '',
        total: '',
        pdf: null
      }
    });
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onGuardar(formData);
      setToastMessage('Movimiento y documento guardados correctamente.');
      setToastType('success');
      onClose();
      resetForm();
    } else {
      setToastMessage('Error al guardar. Verifique los campos.');
      setToastType('error');
    }
    setMessageModalOpen(true);
  };

  if (!isOpen) return null;

  return (
    <>
      <FormModal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          resetForm();
        }}
        title="Nuevo Movimiento y Documento"
        wide={true}
      >
        <Form
          onSubmit={handleSubmit}
          onCancel={() => {
            onClose();
            resetForm();
          }}
          cancelText="Cancelar"
          submitText="Guardar"
          columns={2}
        >
          {/* Sección Movimiento */}
          <SelectInput
            label="Tipo de Movimiento"
            name="tipo_mov"
            value={formData.tipo_mov}
            onChange={handleChange}
            options={[
              { value: '', label: 'Seleccione tipo movimiento' },
              { value: TIPOS_MOVIMIENTO.ENTRADA, label: TIPOS_MOVIMIENTO.ENTRADA },
              { value: TIPOS_MOVIMIENTO.SALIDA, label: TIPOS_MOVIMIENTO.SALIDA }
            ]}
            error={errors.tipo_mov}
          />

          <SelectInput
            label="Razón"
            name="razon"
            value={formData.razon}
            onChange={handleChange}
            disabled={!formData.tipo_mov}
            options={Object.values(RAZONES_MOVIMIENTO).map(razon => ({
              value: razon,
              label: razon
            }))}
            error={errors.razon}
          />

          <SelectInput
            label="Contacto"
            name="id_contacto"
            value={formData.id_contacto}
            onChange={handleChange}
            disabled={!formData.tipo_mov}
            options={[
              { value: '', label: 'Seleccione contacto' },
              ...filteredContacts.map(group => ({
                value: String(group.contacto.id_contacto),
                label: group.contacto.nombre
              }))
            ]}
            error={errors.id_contacto}
          />

          {/* Sección Ítems y Cantidades */}
<div className="mb-4">
  <label className="block text-gray-700 text-sm font-medium mb-2">
    Ítems y Cantidades
  </label>
  {filteredItems.length === 0 && (
    <p className="text-gray-500 text-sm">Seleccione un contacto para ver ítems</p>
  )}
  {filteredItems.map(item => {
    // Determina si el ítem está seleccionado
    const isSelected = formData.id_items.includes(String(item.id_item));
    return (
      <div key={item.id_item} className="flex items-center mb-2">
        <input
          type="checkbox"
          id={`item_${item.id_item}`}
          checked={isSelected}
          onChange={(e) => {
            if (e.target.checked) {
              // Agrega el ítem a la lista de seleccionados
              setFormData(prev => ({
                ...prev,
                id_items: [...prev.id_items, String(item.id_item)]
              }));
            } else {
              // Quita el ítem y borra su cantidad
              setFormData(prev => {
                const updatedItems = prev.id_items.filter(id => id !== String(item.id_item));
                const updatedCantidades = { ...prev.cantidades };
                delete updatedCantidades[String(item.id_item)];
                return {
                  ...prev,
                  id_items: updatedItems,
                  cantidades: updatedCantidades
                };
              });
            }
          }}
          className="mr-2"
        />
        <label htmlFor={`item_${item.id_item}`} className="mr-4">
          {item.nombre} ({item.unidad_medida})
        </label>
        <input
          type="number"
          placeholder="Cantidad"
          value={formData.cantidades[String(item.id_item)] || ''}
          onChange={(e) => handleCantidadChange(String(item.id_item), e.target.value)}
          disabled={!isSelected}
          className={`w-24 px-2 py-1 border ${
            isSelected ? 'border-gray-300' : 'border-gray-200 bg-gray-100'
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200`}
        />
        {errors[`cantidad_${item.id_item}`] && (
          <p className="text-red-500 text-xs ml-2">{errors[`cantidad_${item.id_item}`]}</p>
        )}
      </div>
    );
  })}
  {errors.id_items && <p className="text-red-500 text-xs mt-1">{errors.id_items}</p>}
</div>


          <TextInput
            label="Detalle"
            name="detalle"
            value={formData.detalle}
            onChange={handleChange}
            error={errors.detalle}
            placeholder="Ingrese detalles adicionales (opcional)"
            multiline
          />

          <hr className="my-4" />

          {/* Sección Documento */}
          <SelectInput
            label="Tipo de Documento"
            name="tipo_documento"
            value={formData.documento.tipo_documento}
            onChange={handleDocumentoChange}
            options={[
              { value: '', label: 'Seleccione tipo de documento' },
              ...Object.values(TIPOS_DOCUMENTO).map(tipo => ({
                value: tipo,
                label: tipo
              }))
            ]}
            error={errors['documento.tipo_documento']}
          />

          <TextInput
            label="Fecha del Documento"
            name="fecha"
            type="date"
            value={formData.documento.fecha}
            onChange={handleDocumentoChange}
            error={errors['documento.fecha']}
          />

          <TextInput
            label="Total del Documento"
            name="total"
            type="number"
            value={formData.documento.total}
            onChange={handleDocumentoChange}
            error={errors['documento.total']}
            placeholder="Ingrese el total"
          />

          <div className="mb-4">
            <label htmlFor="pdf" className="block text-gray-700 text-sm font-medium mb-2">
              Archivo PDF
            </label>
            <input
              id="pdf"
              type="file"
              name="pdf"
              accept="application/pdf"
              onChange={handleDocumentoChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            {errors['documento.pdf'] && (
              <p className="text-red-500 text-xs mt-1">{errors['documento.pdf']}</p>
            )}
          </div>
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

MovimientoForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onGuardar: PropTypes.func.isRequired,
  data: PropTypes.shape({
    proveedores: PropTypes.array.isRequired,
    clientes: PropTypes.array.isRequired
  }).isRequired
};

export default MovimientoForm;
