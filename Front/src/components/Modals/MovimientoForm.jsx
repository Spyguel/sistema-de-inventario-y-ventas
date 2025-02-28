import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormModal from '../common/common/Forms/FormModal';
import Form from '../common/common/Forms/Form';
import { TextInput } from '../common/common/Forms/Imputs/index';
import Message from '../common/common/Messages/Message';

function MovimientoForm({ 
    isOpen, 
    onClose, 
    onGuardar, 
    items = [], 
    contactos = [], 
    tipoActivo,
    // Función que se invoca cuando se necesita obtener los ítems de un proveedor.
    // Esta función debe retornar (o actualizar en el padre) la lista de ítems según el proveedor y el tipo de ítem.
    fetchProviderItems 
}) {
    const [formData, setFormData] = useState({
        id_usuario: '',       
        tipo_item: '',        // Nuevo campo: "Materia Prima" o "Producto Terminado"
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
    
    // Estado para guardar los ítems filtrados según la selección de tipo_item
    const [filteredItems, setFilteredItems] = useState([]);
    const [errors, setErrors] = useState({});
    const [messageModalOpen, setMessageModalOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    // Define el tipo de movimiento según la pestaña activa
    useEffect(() => {
        if (tipoActivo) {
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
    }, [tipoActivo]);

    // Cada vez que cambie el tipo de ítem o el contacto, actualizamos la lista de ítems a mostrar.
    useEffect(() => {
        // Si se seleccionó un tipo de ítem
        if (formData.tipo_item) {
            // Si el contacto seleccionado es de tipo "Proveedor", se consulta al backend.
            const contactoSeleccionado = contactos.find(c => c.ID_contacto === formData.contacto);
            if (contactoSeleccionado && contactoSeleccionado.tipo === 'Proveedor') {
                // Llamamos a la función que nos trae los ítems que ese proveedor provee para el tipo indicado.
                // Se espera que fetchProviderItems sea asíncrona.
                (async () => {
                    try {
                        const provItems = await fetchProviderItems(contactoSeleccionado.ID_contacto, formData.tipo_item);
                        setFilteredItems(provItems);
                    } catch (error) {
                        console.error('Error al obtener ítems del proveedor:', error);
                        setFilteredItems([]);
                    }
                })();
            } else {
                // Si no es proveedor, filtramos los items recibidos desde el padre
                const filt = items.filter(item => item.tipo_item === formData.tipo_item);
                setFilteredItems(filt);
            }
            // Limpia el ítem seleccionado si se cambia el filtro
            setFormData(prev => ({ ...prev, selectedItem: '' }));
        } else {
            setFilteredItems([]);
        }
    }, [formData.tipo_item, formData.contacto, items, contactos, fetchProviderItems]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.tipo_mov) newErrors.tipo_mov = 'El tipo de movimiento es requerido';
        if (!formData.fecha) newErrors.fecha = 'La fecha es requerida';
        if (!formData.tipo_contacto) newErrors.tipo_contacto = 'El tipo de contacto es requerido';
        if (!formData.contacto) newErrors.contacto = 'El contacto es requerido';
        if (!formData.tipo_item) newErrors.tipo_item = 'El tipo de item es requerido';
        if (!formData.selectedItem) newErrors.selectedItem = 'Debe seleccionar un item';
        if (!formData.cantidad) newErrors.cantidad = 'La cantidad es requerida';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            id_usuario: '',
            tipo_item: '',
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
        setFilteredItems([]);
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

    // Título fijo para el modal
    const modalTitle = "Nuevo Movimiento";

    return (
        <>
            <FormModal
                isOpen={isOpen}
                onClose={() => { onClose(); resetForm(); }}
                title={modalTitle}
                wide={true}
            >
                <Form
                    onSubmit={handleSubmit}
                    onCancel={() => { onClose(); resetForm(); }}
                    cancelText="Cancelar"
                    submitText="Crear"
                    columns={2}
                >
                    {/* Tipo de Movimiento */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Tipo de Movimiento</label>
                        <select 
                            className="w-full px-3 py-2 border rounded-md"
                            value={formData.tipo_mov || ''}
                            onChange={(e) => setFormData({ ...formData, tipo_mov: e.target.value })}
                        >
                            <option value="">Seleccione tipo</option>
                            <option value="COMPRA">Compra</option>
                            <option value="VENTA">Venta</option>
                            <option value="AJUSTE INVENTARIO">Ajuste Inventario</option>
                            <option value="PRODUCCION">Producción</option>
                            <option value="TRASFERENCIA">Transferencia</option>
                            <option value="DEVOLUCION">Devolución</option>
                        </select>
                        {errors.tipo_mov && <p className="text-red-500 text-xs mt-1">{errors.tipo_mov}</p>}
                    </div>

                    {/* Fecha */}
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

                    {/* Tipo de Contacto */}
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

                    {/* Contacto */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Contacto</label>
                        <select
                            className="w-full px-3 py-2 border rounded-md"
                            value={formData.contacto || ''}
                            onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                            disabled={!formData.tipo_contacto}
                        >
                            <option value="">Seleccione contacto</option>
                            {contactos
                                .filter(contacto => formData.tipo_contacto ? contacto.tipo_contacto === formData.tipo_contacto : true)
                                .map(contacto => (
                                    <option key={contacto.ID_contacto} value={contacto.ID_contacto}>
                                        {contacto.nombre} ({contacto.tipo_contacto})
                                    </option>
                                ))}
                        </select>
                        {errors.contacto && <p className="text-red-500 text-xs mt-1">{errors.contacto}</p>}
                    </div>

                    {/* Documento */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Documento</label>
                        <input 
                            type="file" 
                            className="w-full px-3 py-2 border rounded-md"
                            onChange={(e) => setFormData({ ...formData, documento: e.target.files[0] })}
                        />
                    </div>

                    {/* Tipo de Item */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Tipo de Item</label>
                        <select 
                            className="w-full px-3 py-2 border rounded-md"
                            value={formData.tipo_item || ''}
                            onChange={(e) => setFormData({ ...formData, tipo_item: e.target.value })}
                            required
                        >
                            <option value="">Seleccione tipo de item</option>
                            <option value="Materia Prima">Materia Prima</option>
                            <option value="Producto Terminado">Producto Terminado</option>
                        </select>
                        {errors.tipo_item && <p className="text-red-500 text-xs mt-1">{errors.tipo_item}</p>}
                    </div>

                    {/* Item (filtrado según tipo de item y, en caso de proveedor, consultado en backend) */}
                    <div>
                        <label className="block text-sm font-medium mb-1">Item</label>
                        <select 
                            className="w-full px-3 py-2 border rounded-md"
                            value={formData.selectedItem || ''}
                            onChange={(e) => setFormData({ ...formData, selectedItem: e.target.value })}
                            disabled={!formData.tipo_item} 
                            required
                        >
                            <option value="">Seleccione item</option>
                            {filteredItems.map(item => (
                                <option key={item.ID_item} value={item.ID_item}>
                                    {item.nombre}
                                </option>
                            ))}
                        </select>
                        {errors.selectedItem && <p className="text-red-500 text-xs mt-1">{errors.selectedItem}</p>}
                    </div>

                    {/* Cantidad */}
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

                    {/* Razón */}
                    <div>
                        <TextInput
                            label="Razón"
                            name="razon"
                            value={formData.razon || ''}
                            onChange={(e) => setFormData({ ...formData, razon: e.target.value })}
                        />
                    </div>

                    {/* Detalle */}
                    <div>
                        <TextInput
                            label="Detalle"
                            name="detalle"
                            value={formData.detalle || ''}
                            onChange={(e) => setFormData({ ...formData, detalle: e.target.value })}
                        />
                    </div>

                    {/* Observaciones */}
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
    onGuardar: PropTypes.func.isRequired,
    items: PropTypes.array,
    contactos: PropTypes.array,
    tipoActivo: PropTypes.string,
    fetchProviderItems: PropTypes.func.isRequired  // Función para obtener ítems por proveedor y tipo de item
};

export default MovimientoForm;
