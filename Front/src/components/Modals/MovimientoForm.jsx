import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormModal from '../common/common/Forms/FormModal';
import Form from '../common/common/Forms/Form';
import { TextInput } from '../common/common/Forms/Imputs/index';
import Message from '../common/common/Messages/Message';

function MovimientoForm({ 
    isOpen, 
    onClose, 
    title, 
    movimientoSeleccionado, 
    onGuardar, 
    items = [], 
    contactos = [], 
    tipoActivo 
}) {
    const [formData, setFormData] = useState({
        id_usuario: '',       
        selectedItem: '',     
        cantidad: '',
        tipo_contacto: '',
        contacto: '',
        documento: '',
        fecha: '',        
        tipo_mov: '',
        razon: '',
        detalle: '',
        observaciones: '',
        activo: true
    });

    const [errors, setErrors] = useState({});
    const [messageModalOpen, setMessageModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    useEffect(() => {
        if (movimientoSeleccionado) {
            setFormData(movimientoSeleccionado);
        } else if (tipoActivo) {
            const tipoMap = {
                'entrada': 'ENTRADA',
                'salida': 'SALIDA',
                'ajustes': 'AJUSTE INVENTARIO',
            };
            setFormData(prev => ({
                ...prev,
                tipo_mov: tipoMap[tipoActivo] || ''
            }));
        }
    }, [movimientoSeleccionado, tipoActivo]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.tipo_mov) newErrors.tipo_mov = 'El tipo de movimiento es requerido';
        if (!formData.fecha) newErrors.fecha = 'La fecha es requerida';
        if (!formData.tipo_contacto) newErrors.tipo_contacto = 'El tipo de contacto es requerido';
        if (!formData.contacto) newErrors.contacto = 'El contacto es requerido';
        if (!formData.selectedItem) newErrors.selectedItem = 'Debe seleccionar un item';
        if (!formData.cantidad) newErrors.cantidad = 'La cantidad es requerida';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            id_usuario: '',
            selectedItem: '',
            cantidad: '',
            tipo_contacto: '',
            contacto: '',
            documento: '',
            fecha: '',        
            tipo_mov: '',
            razon: '',
            detalle: '',
            observaciones: '',
            activo: true
        });
        setErrors({});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onGuardar(formData);
            setToastMessage('Movimiento guardado correctamente.');
            setToastType('success');
            onClose();
            resetForm();
        } else {
            setToastMessage('Error al guardar el movimiento. Verifique los campos.');
            setToastType('error');
        }
        setMessageModalOpen(true);
    };

    if (!isOpen) return null;

    return (
        <>
            <FormModal
                isOpen={isOpen}
                onClose={() => { onClose(); resetForm(); }}
                title={title}
                wide={true}  // Si ya has modificado FormModal para aceptar wide, se mantiene
            >
                <Form
                    onSubmit={handleSubmit}
                    onCancel={() => { onClose(); resetForm(); }}
                    cancelText="Cancelar"
                    submitText={movimientoSeleccionado ? 'Actualizar' : 'Crear'}
                    columns={2} // Aquí definimos que el layout es de 2 columnas
                >
                    {/* Campo: Tipo de Movimiento */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Tipo de Movimiento</label>
                        <select 
                            className="w-full px-3 py-2 border rounded-md"
                            value={formData.tipo_mov || ''}
                            onChange={(e) => setFormData({ ...formData, tipo_mov: e.target.value })}
                        >
                            <option value="">Seleccione tipo</option>
                            <option value="INGRESO">Compra</option>
                            <option value="EGRESO">Venta</option>
                            <option value="AJUSTE INVENTARIO">Ajuste Inventario</option>
                            <option value="PRODUCCION">Producción</option>
                            <option value="DEVOLUCION">Devolución</option>
                        </select>
                        {errors.tipo_mov && <p className="text-red-500 text-xs mt-1">{errors.tipo_mov}</p>}
                    </div>

                    {/* Campo: Fecha */}
                    <div>
                        <TextInput
                            label="Fecha"
                            name="fecha"
                            type="date"
                            value={formData.fecha || ''}
                            onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                            error={errors.fecha}
                        />
                    </div>

                    {/* Campo: Tipo de Contacto */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Tipo de Contacto</label>
                        <select
                            className="w-full px-3 py-2 border rounded-md"
                            value={formData.tipo_contacto || ''}
                            onChange={(e) => setFormData({ ...formData, tipo_contacto: e.target.value, contacto: '' })}
                        >
                            <option value="">Seleccione tipo de contacto</option>
                            <option value="Proveedor">Proveedor</option>
                            <option value="Cliente">Cliente</option>
                        </select>
                        {errors.tipo_contacto && <p className="text-red-500 text-xs mt-1">{errors.tipo_contacto}</p>}
                    </div>

                    {/* Campo: Contacto */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Contacto</label>
                        <select
                            className="w-full px-3 py-2 border rounded-md"
                            value={formData.contacto || ''}
                            onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                        >
                            <option value="">Seleccione contacto</option>
                            {contactos
                                .filter(contacto => formData.tipo_contacto ? contacto.tipo === formData.tipo_contacto : true)
                                .map(contacto => (
                                    <option key={contacto.ID_contacto} value={contacto.ID_contacto}>
                                        {contacto.nombre} ({contacto.tipo})
                                    </option>
                                ))}
                        </select>
                        {errors.contacto && <p className="text-red-500 text-xs mt-1">{errors.contacto}</p>}
                    </div>

                    {/* Campo: Documento */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Documento</label>
                        <input 
                            type="file" 
                            className="w-full px-3 py-2 border rounded-md"
                            onChange={(e) => setFormData({ ...formData, documento: e.target.files[0] })}
                        />
                    </div>

                    {/* Campo: Item */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Item</label>
                        <select 
                            className="w-full px-3 py-2 border rounded-md"
                            value={formData.selectedItem || ''}
                            onChange={(e) => setFormData({ ...formData, selectedItem: e.target.value })}
                        >
                            <option value="">Seleccione item</option>
                            {items.map(item => (
                                <option key={item.ID_item} value={item.ID_item}>
                                    {item.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.selectedItem && <p className="text-red-500 text-xs mt-1">{errors.selectedItem}</p>}
                    </div>

                    {/* Campo: Cantidad */}
                    <div>
                        <TextInput
                            label="Cantidad"
                            name="cantidad"
                            type="number"
                            min="1"
                            value={formData.cantidad || ''}
                            onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                            error={errors.cantidad}
                        />
                    </div>

                    {/* Campo: Razón */}
                    <div>
                        <TextInput
                            label="Razón"
                            name="razon"
                            value={formData.razon || ''}
                            onChange={(e) => setFormData({ ...formData, razon: e.target.value })}
                        />
                    </div>

                    {/* Campo: Detalle */}
                    <div>
                        <TextInput
                            label="Detalle"
                            name="detalle"
                            value={formData.detalle || ''}
                            onChange={(e) => setFormData({ ...formData, detalle: e.target.value })}
                        />
                    </div>

                    {/* Campo: Observaciones */}
                    <div>
                        <TextInput
                            label="Observaciones"
                            name="observaciones"
                            value={formData.observaciones || ''}
                            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                            multiline
                        />
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
}

MovimientoForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    movimientoSeleccionado: PropTypes.object,
    onGuardar: PropTypes.func.isRequired,
    items: PropTypes.array,
    contactos: PropTypes.array,
    documentos: PropTypes.array,
    tipoActivo: PropTypes.string
};

export default MovimientoForm;
