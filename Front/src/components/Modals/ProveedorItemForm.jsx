import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FormModal from '../common/common/Forms/FormModal';
import Message from '../common/common/Messages/Message';
import Button from '../common/button';

const ProveedorItemForm = ({ 
  isOpen, 
  onClose, 
  proveedorSeleccionado, 
  items = [], 
  itemsAsociados = [], // Ítems ya asociados al proveedor
  onGuardar 
}) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // Mensaje de depuración para verificar los datos recibidos
  useEffect(() => {
    console.log('Ítems recibidos en ProveedorItemForm:', items);
    console.log('Ítems asociados recibidos en ProveedorItemForm:', itemsAsociados);
  }, [items, itemsAsociados]);

  // Inicializar los ítems seleccionados con los ítems ya asociados
  useEffect(() => {
    if (itemsAsociados.length > 0) {
      setSelectedItems(itemsAsociados);
    }
  }, [itemsAsociados]);

  const handleToggleItem = (id_item) => {
    setSelectedItems((prev) => {
      const newSelectedItems = prev.includes(id_item)
        ? prev.filter((item) => item !== id_item) // Deseleccionar
        : [...prev, id_item]; // Seleccionar
      
      console.log('Ítems seleccionados:', newSelectedItems);
      return newSelectedItems;
    });
  };

  const handleGuardarSubmit = async (e) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      setMessageModalOpen(true);
      setToastMessage('Debe seleccionar al menos un ítem.');
      setToastType('error');
      return;
    }
    console.log('Ítems seleccionados para guardar:', selectedItems);

    try {
      await onGuardar(selectedItems);
      onClose();
    } catch (error) {
      setMessageModalOpen(true);
      setToastMessage('Error al guardar los ítems.');
      setToastType('error');
      console.error(error);
    }
  };

  // Filtrar ítems disponibles y seleccionados
  const itemsDisponibles = items.filter((item) => !selectedItems.includes(item.id_item));
  const itemsSeleccionados = items.filter((item) => selectedItems.includes(item.id_item));

  return (
    <>
      <FormModal 
        isOpen={isOpen} 
        onClose={onClose} 
        title={`Asignar Ítems a ${proveedorSeleccionado?.nombre || ''}`}
      >
        <form onSubmit={handleGuardarSubmit}>
          <div className="flex space-x-4">
            {/* Lista de ítems disponibles */}
            <div className="w-1/2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ítems disponibles:</h3>
              <div className="max-h-60 overflow-y-auto pr-2 rounded-md border border-gray-200">
                {itemsDisponibles.length > 0 ? (
                  itemsDisponibles.map((item) => (
                    <label 
                      key={item.id_item} 
                      className="flex items-center space-x-3 p-2 hover:bg-gray-100 transition border-b last:border-b-0 border-gray-200"
                    >
                      <input
                        type="checkbox"
                        name="item"
                        value={item.id_item}
                        checked={selectedItems.includes(item.id_item)}
                        onChange={() => handleToggleItem(item.id_item)}
                        className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{item.nombre}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-gray-500 p-2">No hay ítems disponibles</p>
                )}
              </div>
            </div>

            {/* Lista de ítems seleccionados */}
            <div className="w-1/2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Ítems seleccionados:</h3>
              <div className="max-h-60 overflow-y-auto pr-2 rounded-md border border-gray-200">
                {itemsSeleccionados.length > 0 ? (
                  itemsSeleccionados.map((item) => (
                    <label 
                      key={item.id_item} 
                      className="flex items-center space-x-3 p-2 hover:bg-gray-100 transition border-b last:border-b-0 border-gray-200"
                    >
                      <input
                        type="checkbox"
                        name="item"
                        value={item.id_item}
                        checked={selectedItems.includes(item.id_item)}
                        onChange={() => handleToggleItem(item.id_item)}
                        className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{item.nombre}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-gray-500 p-2">No hay ítems seleccionados</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button 
              type="button" 
              onClick={onClose} 
              variant="secondary" 
              className="mr-2"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="primary"
            >
              Guardar
            </Button>
          </div>
        </form>
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

ProveedorItemForm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  proveedorSeleccionado: PropTypes.shape({
    id_contacto: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nombre: PropTypes.string.isRequired,
  }).isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id_item: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      nombre: PropTypes.string.isRequired,
    })
  ).isRequired,
  itemsAsociados: PropTypes.arrayOf(PropTypes.number), // Ítems ya asociados
  onGuardar: PropTypes.func.isRequired,
};

export default ProveedorItemForm;