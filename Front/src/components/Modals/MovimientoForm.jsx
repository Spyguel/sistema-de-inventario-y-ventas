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
  
    // Validación de Tipo de Movimiento
    if (!formData.tipo_mov || formData.tipo_mov.trim() === '') {
      newErrors.tipo_mov = 'Seleccione un tipo de movimiento';
    }
    
    // Validación de Razón
    if (!formData.razon || formData.razon.trim() === '') {
      newErrors.razon = 'Seleccione una razón';
    }
    
    // Validación de Contacto
    if (!formData.id_contacto || formData.id_contacto.trim() === '') {
      newErrors.id_contacto = 'Seleccione un contacto';
    }
    
    // Validación de Ítems y Cantidades
    if (!formData.id_items || formData.id_items.length === 0) {
      newErrors.id_items = 'Seleccione al menos un ítem';
    } else {
      formData.id_items.forEach(id_item => {
        const cantidad = formData.cantidades[id_item];
        if (!cantidad || Number(cantidad) <= 0) {
          newErrors[`cantidad_${id_item}`] = 'La cantidad debe ser mayor a 0';
        }
      });
    }
    
    // Validación de Datos del Documento
    if (!formData.documento.tipo_documento || formData.documento.tipo_documento.trim() === '') {
      newErrors['documento.tipo_documento'] = 'Seleccione un tipo de documento';
    }
    if (!formData.documento.fecha || formData.documento.fecha.trim() === '') {
      newErrors['documento.fecha'] = 'Ingrese la fecha del documento';
    }
    if (!formData.documento.total || Number(formData.documento.total) <= 0) {
      newErrors['documento.total'] = 'El total debe ser mayor a 0';
    }
    // Si deseas que el archivo PDF sea obligatorio, descomenta lo siguiente:
     if (!formData.documento.pdf) {
       newErrors['documento.pdf'] = 'Adjunte el archivo PDF';
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

  const logFormData = (formData) => {
    console.groupCollapsed('[MovimientoForm] Datos del formulario enviados');
    console.log('Tipo Movimiento:', formData.tipo_mov);
    console.log('Razón:', formData.razon);
    console.log('ID Contacto:', formData.id_contacto);
    console.log('Detalle:', formData.detalle);
    
    console.log('Items y Cantidades:');
    formData.id_items.forEach(id_item => {
      console.log(
        `- Item ID: ${id_item},`,
        `Cantidad: ${formData.cantidades[id_item]}`
      );
    });
  
    console.log('Documento:');
    console.log('-- Tipo:', formData.documento.tipo_documento);
    console.log('-- Fecha:', formData.documento.fecha);
    console.log('-- Total:', formData.documento.total);
    console.log('-- PDF:', formData.documento.pdf ? formData.documento.pdf.name : 'Ningún archivo seleccionado');
    
    console.groupEnd();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    logFormData(formData);
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
          className="overflow-y-auto"
      >
        <Form
  onSubmit={handleSubmit}
  onCancel={() => {
    onClose();
    resetForm();
  }}
  cancelText="Cancelar"
  submitText="Guardar"
  // Usamos la prop gridTemplate para definir una grid de 3 columnas con gap
  gridTemplate="grid grid-cols-3 gap-4"
>
  {/* Fila 1 */}
  <div className="col-span-1">
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
  </div>
  <div className="col-span-1">
    <SelectInput
      label="Razón"
      name="razon"
      value={formData.razon}
      onChange={handleChange}
      disabled={!formData.tipo_mov}
      options={Object.values(RAZONES_MOVIMIENTO)
        .filter(razon => {
          if (formData.tipo_mov === TIPOS_MOVIMIENTO.ENTRADA) {
            return razon.toLowerCase() !== 'egreso';
          }
          if (formData.tipo_mov === TIPOS_MOVIMIENTO.SALIDA) {
            return razon.toLowerCase() !== 'ingreso';
          }
          return true;
        })
        .map(razon => ({
          value: razon,
          label: razon
        }))}
      error={errors.razon}
    />
  </div>
  <div className="col-span-1">
    {/* Celda vacía para completar la fila 1 */}
  </div>

  {/* Fila 2 */}
  <div className="col-span-1">
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
  </div>
  <div className="col-span-1">
    {/* Ítems y Cantidades */}
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-2">
        Ítems y Cantidades
      </label>
      {filteredItems.length === 0 && (
        <p className="text-gray-500 text-sm">Seleccione un contacto para ver ítems</p>
      )}
      {filteredItems.map(item => {
        const isSelected = formData.id_items.includes(String(item.id_item));
        return (
          <div key={item.id_item} className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`item_${item.id_item}`}
                checked={isSelected}
                onChange={(e) => {
                  if (e.target.checked) {
                    setFormData(prev => ({
                      ...prev,
                      id_items: [...prev.id_items, String(item.id_item)]
                    }));
                  } else {
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
              <label htmlFor={`item_${item.id_item}`} className="text-sm">
                {item.nombre} ({item.unidad_medida})
              </label>
            </div>
            <input
              type="number"
              placeholder="Cantidad"
              value={formData.cantidades[String(item.id_item)] || ''}
              onChange={(e) => handleCantidadChange(String(item.id_item), e.target.value)}
              disabled={!isSelected}
              className={`w-24 px-2 py-1 border ${
                isSelected ? 'border-gray-300' : 'border-gray-200 bg-gray-100'
              } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 text-right`}
            />
            {errors[`cantidad_${item.id_item}`] && (
              <p className="text-red-500 text-xs ml-2">{errors[`cantidad_${item.id_item}`]}</p>
            )}
          </div>
        );
      })}
      {errors.id_items && <p className="text-red-500 text-xs mt-1">{errors.id_items}</p>}
    </div>
  </div>
  <div className="col-span-1">
    <TextInput
      label="Detalle"
      name="detalle"
      value={formData.detalle}
      onChange={handleChange}
      error={errors.detalle}
      placeholder="Ingrese detalles adicionales (opcional)"
      multiline
    />
  </div>

  {/* Fila 3 */}
  <div className="col-span-1">
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
  </div>
  <div className="col-span-1">
    <TextInput
      label="Total del Documento"
      name="total"
      type="number"
      value={formData.documento.total}
      onChange={handleDocumentoChange}
      error={errors['documento.total']}
      placeholder="Ingrese el total"
    />
  </div>
  <div className="col-span-1">
    <TextInput
      label="Fecha del Documento"
      name="fecha"
      type="date"
      value={formData.documento.fecha}
      onChange={handleDocumentoChange}
      max={new Date().toISOString().split('T')[0]}
      error={errors['documento.fecha']}
    />
  </div>

  {/* Fila 4: PDF en la segunda columna */}
  <div className="col-span-1"></div>
  <div className="col-span-1">
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
  </div>
  <div className="col-span-1"></div>
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
