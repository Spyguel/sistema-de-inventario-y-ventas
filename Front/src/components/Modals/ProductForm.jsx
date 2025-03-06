import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../common/button';
import FormModal from '../common/common/Forms/FormModal';

const ProductForm = ({ 
  isOpen, 
  onClose, 
  productoSeleccionado, 
  title, 
  onGuardar 
}) => {
  const [fechaActual] = useState(new Date().toISOString().split('T')[0]);
  const [producto, setProducto] = useState({
    tipo_item: '',
    nombre: '',
    unidad_medida: '',
    cantidad_minima: 0,
    fecha_creacion: fechaActual
  });

  useEffect(() => {
    if (productoSeleccionado) {
      // Si se edita, se formatea la fecha para que sea "yyyy-mm-dd"
      const fechaExistente = productoSeleccionado.fecha_creacion
        ? new Date(productoSeleccionado.fecha_creacion.split('/').reverse().join('-'))
        : new Date();
      setProducto({
        id_item: productoSeleccionado.id_item,
        tipo_item: productoSeleccionado.tipo_item || '',
        nombre: productoSeleccionado.nombre || '',
        unidad_medida: productoSeleccionado.unidad_medida || '',
        cantidad_minima: productoSeleccionado.cantidad_minima || 0,
        fecha_creacion: fechaExistente.toISOString().split('T')[0]
      });
    } else {
      setProducto({
        id_item: null,
        tipo_item: '',
        nombre: '',
        unidad_medida: '',
        cantidad_minima: 0,
        fecha_creacion: fechaActual
      });
    }
  }, [productoSeleccionado, fechaActual]);

  useEffect(() => {
    if (!isOpen) {
      setProducto({
        id_item: null,
        tipo_item: '',
        nombre: '',
        unidad_medida: '',
        cantidad_minima: 0,
        fecha_creacion: fechaActual
      });
    }
  }, [isOpen, fechaActual])

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? e.target.checked : value;
  
    if (name === 'fecha_creacion' && finalValue < fechaActual) {
      alert('No se puede seleccionar una fecha anterior a hoy');
      return;
    }
  
    setProducto(prev => ({
      ...prev,
      [name === 'nombre_producto' ? 'nombre' : name]: finalValue 
    }));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Comparamos directamente las cadenas de fecha
    if (producto.fecha_creacion < fechaActual) {
      alert('La fecha no puede ser anterior al día actual');
      return;
    }

    // Formateo de fecha a dd/mm/yyyy
    const [year, month, day] = producto.fecha_creacion.split('-');
    const fechaFormateada = `${day}/${month}/${year}`;

    const bodyData = {
      ...producto,
      fecha_creacion: fechaFormateada
    };

    try {
      await onGuardar(bodyData);
    } catch (error) {
      alert(`Error: ${error.message}`);
      console.error('Detalle del error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <FormModal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo de Producto */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Producto
          </label>
          <select
            name="tipo_item"
            value={producto.tipo_item}
            onChange={handleChange}
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">Seleccione un tipo</option>
            <option value="Materia Prima">Materia Prima</option>
            <option value="Producto Terminado">Producto Terminado</option>
          </select>
        </div>

        {/* Nombre del Producto */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Nombre del Producto
          </label>
          <input
            type="text"
            name="nombre_producto"
            value={producto.nombre}
            onChange={handleChange}
            className="w-full p-2.5 border rounded-lg"
            placeholder="Ingrese el nombre"
            required
          />
        </div>

        {/* Cantidad Mínima */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Cantidad Mínima
          </label>
          <input
            type="number"
            name="cantidad_minima"
            value={producto.cantidad_minima}
            onChange={handleChange}
            className="w-full p-2.5 border rounded-lg"
            min="0"
            required
          />
        </div>

        {/* Unidad de Medida */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Unidad de Medida
          </label>
          <select
            name="unidad_medida"
            value={producto.unidad_medida}
            onChange={handleChange}
            className="w-full p-2.5 border rounded-lg"
            required
          >
            <option value="">Seleccione unidad</option>
            {['unidades', 'litros', 'kilogramos'].map((unidad) => (
              <option key={unidad} value={unidad}>{unidad}</option>
            ))}
          </select>
        </div>

        {/* Fecha de Creación */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Fecha de Creación
          </label>
          <input
            type="date"
            name="fecha_creacion"
            value={producto.fecha_creacion}
            onChange={handleChange}
            min={fechaActual}
            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Botones */}
        <div className="flex gap-4 mt-6">
          <Button 
            type="submit" 
            variant="success" 
            className="flex-1 py-2.5"
          >
            {productoSeleccionado ? 'Actualizar' : 'Crear'}
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            className="flex-1 py-2.5"
            onClick={onClose}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </FormModal>
  );
};

ProductForm.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  productoSeleccionado: PropTypes.shape({
    id_item: PropTypes.number,
    nombre: PropTypes.string,
    tipo_item: PropTypes.string,
    unidad_medida: PropTypes.string,
    cantidad_minima: PropTypes.number,
    fecha_creacion: PropTypes.string
  }),
  onGuardar: PropTypes.func.isRequired,
};

ProductForm.defaultProps = {
  isOpen: false,
  productoSeleccionado: null
};

export default ProductForm;
