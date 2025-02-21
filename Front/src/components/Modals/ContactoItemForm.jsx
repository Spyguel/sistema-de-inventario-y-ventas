import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal from '../common/common/Forms/FormModal.jsx';
import Button from '../common/button.jsx';

function ContactoItemForm({ isOpen, onClose, title, contactoItemSeleccionado, onGuardar, clientes, items }) {
    const [contactoItem, setContactoItem] = useState({
        ID_contacto: '',
        ID_item: ''
    });

    useEffect(() => {
        if (contactoItemSeleccionado) {
            setContactoItem(contactoItemSeleccionado);
        } else {
            setContactoItem({
                ID_contacto: '',
                ID_item: ''
            });
        }
    }, [contactoItemSeleccionado]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setContactoItem({
            ...contactoItem,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onGuardar({
            ...contactoItem,
            ID_contacto: parseInt(contactoItem.ID_contacto),
            ID_item: parseInt(contactoItem.ID_item)
        });
    };

    const validarForm = () => {
        return contactoItem.ID_contacto && contactoItem.ID_item;
    };

    // Filtrar clientes activos
    const clientesActivos = clientes.filter(cliente => cliente.Activo);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="ID_contacto" className="block text-sm font-medium text-gray-700">
                        Cliente
                    </label>
                    <select
                        id="ID_contacto"
                        name="ID_contacto"
                        value={contactoItem.ID_contacto}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">Seleccionar cliente</option>
                        {clientesActivos.map((cliente) => (
                            <option key={cliente.ID_contacto} value={cliente.ID_contacto}>
                                {cliente.Nombre} - {cliente.tipo_contacto}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="ID_item" className="block text-sm font-medium text-gray-700">
                        Item
                    </label>
                    <select
                        id="ID_item"
                        name="ID_item"
                        value={contactoItem.ID_item}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        <option value="">Seleccionar item</option>
                        {items.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                    <Button
                        type="button"
                        onClick={onClose}
                        variant="default"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={!validarForm()}
                        className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            validarForm()
                                ? 'bg-blue-500 text-white hover:bg-blue-600'
                                : 'bg-blue-300 text-white cursor-not-allowed'
                        }`}
                    >
                        Guardar
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

ContactoItemForm.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    contactoItemSeleccionado: PropTypes.shape({
        ID_contacto_item: PropTypes.number,
        ID_contacto: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        ID_item: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    }),
    onGuardar: PropTypes.func.isRequired,
    clientes: PropTypes.arrayOf(
        PropTypes.shape({
            ID_contacto: PropTypes.number.isRequired,
            Nombre: PropTypes.string.isRequired,
            tipo_contacto: PropTypes.string.isRequired,
            Activo: PropTypes.bool.isRequired
        })
    ).isRequired,
    items: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            nombre: PropTypes.string.isRequired
        })
    ).isRequired
};

export default ContactoItemForm;