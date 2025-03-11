import { useState } from 'react';
import PropTypes from 'prop-types';
import FormModal from '../common/common/Forms/FormModal';
import Form from '../common/common/Forms/Form';
import { TextInput, SelectInput, MultiSelectInput } from '../common/common/Forms/Imputs/index';
import Message from '../common/common/Messages/Message';
import { TIPOS_MOVIMIENTO, RAZONES_MOVIMIENTO, TIPOS_DOCUMENTO, TIPOS_CONTACTOS } from '../common/common/ui/const';
import { getFilteredContactsByMovement } from '../../utils/filterContactsByMovement';
import { getFilteredItemData } from '../../utils/filterItems';

const MovimientoForm = ({ isOpen, onClose, onGuardar, items, contactos }) => {
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

  // Filtrar contactos según el tipo de movimiento usando la función externa:
  const contactosFiltrados = formData.tipo_mov
    ? getFilteredContactsByMovement(
        contactos,
        { term: '', filters: {} },
        data => data,
        formData.tipo_mov
      )
    : [];

  // Filtrar ítems usando la función importada.
  // Si se ha seleccionado un contacto, se obtiene el contacto seleccionado y se filtran los ítems.
  const itemsFiltrados = formData.id_contacto
    ? (() => {
        const contactoSeleccionado = contactos.find(
          c => String(c.id_contacto) === String(formData.id_contacto)
        );
        if (contactoSeleccionado) {
          if (contactoSeleccionado.tipo_contacto === TIPOS_CONTACTOS.CLIENTE) {
            // Para cliente: filtrar ítems activos de tipo Producto Terminado
            return getFilteredItemData(items, TIPOS_CONTACTOS.CLIENTE);
          } else if (contactoSeleccionado.tipo_contacto === TIPOS_CONTACTOS.PROVEEDOR) {
            // Para proveedor: filtrar ítems activos de tipo Materia Prima del proveedor seleccionado
            return getFilteredItemData(items, TIPOS_CONTACTOS.PROVEEDOR, contactoSeleccionado.id_contacto);
          }
        }
        return [];
      })()
    : [];

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
    // Al cambiar el tipo de movimiento se reinician razón, contacto, ítems y cantidades
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
      // Al cambiar el contacto se reinician ítems y cantidades
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
              ...Object.values(TIPOS_MOVIMIENTO).map(tipo => ({
                value: tipo,
                label: tipo
              }))
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
              ...contactosFiltrados.map(contacto => ({
                value: String(contacto.id_contacto),
                label: contacto.nombre
              }))
            ]}
            error={errors.id_contacto}
          />

          <MultiSelectInput
            label="Ítems"
            name="id_items"
            value={formData.id_items}
            onChange={(selectedItems) =>
              setFormData(prev => ({ ...prev, id_items: selectedItems }))
            }
            disabled={!formData.id_contacto}
            options={itemsFiltrados.map(item => ({
              value: String(item.id_item),
              label: `${item.nombre} (${item.unidad_medida})`
            }))}
            error={errors.id_items}
          />

          {formData.id_items.map(id_item => (
            <TextInput
              key={id_item}
              label={`Cantidad para ${items.find(item => String(item.id_item) === id_item)?.nombre || ''}`}
              name={`cantidad_${id_item}`}
              type="number"
              value={formData.cantidades[id_item] || ''}
              onChange={(e) => handleCantidadChange(id_item, e.target.value)}
              error={errors[`cantidad_${id_item}`]}
              placeholder="Ingrese la cantidad"
            />
          ))}

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
  items: PropTypes.array.isRequired,
  contactos: PropTypes.array.isRequired
};

export default MovimientoForm;
