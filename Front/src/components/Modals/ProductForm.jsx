import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../common/button';

const TipoItem = {
    MATERIA_PRIMA: 'Materia Prima',
    PRODUCTO_TERMINADO: 'Producto Terminado',
    INSUMO: 'Insumo'
};

const Subcategorias = {
    'Materia Prima': ['Agua', 'Espumante', 'Colorante', 'Sulfato de sodio'],
    'Producto Terminado': ['Suavizante', 'Shampoo', 'Acondicionador'],
    'Insumo': ['Envases', 'Tapas']
};

const ProductForm = ({ 
    isOpen, 
    onClose, 
    productoSeleccionado 
}) => {
    const [fechaActual] = useState(new Date().toISOString().split('T')[0]);
    const [producto, setProducto] = useState({
        tipoItem: '',
        categoria: '',
        nombre: '',
        unidadMedida: '',
        cantidadMinima: 0,
        cantidadActual: 0,
        fechaCreacion: fechaActual,
        activo: true
    });

    const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);

    useEffect(() => {
        if (productoSeleccionado) {
            const fechaExistente = productoSeleccionado.fecha_creacion
                ? new Date(productoSeleccionado.fecha_creacion.split('/').reverse().join('-'))
                : new Date();
            
            setProducto({
                tipoItem: productoSeleccionado.tipo_item || '',
                categoria: productoSeleccionado.nombre || '',
                nombre: productoSeleccionado.nombre || '',
                unidadMedida: productoSeleccionado.unidad_medida || '',
                cantidadMinima: productoSeleccionado.cantidad_minima || 0,
                cantidadActual: productoSeleccionado.cantidad_actual || 0,
                fechaCreacion: fechaExistente.toISOString().split('T')[0],
                activo: productoSeleccionado?.activo ?? true
            });
        } else {
            setProducto({
                tipoItem: '',
                categoria: '',
                nombre: '',
                unidadMedida: '',
                cantidadMinima: 0,
                cantidadActual: 0,
                fechaCreacion: fechaActual,
                activo: true
            });
        }
    }, [productoSeleccionado, fechaActual]);

    useEffect(() => {
        if (producto.tipoItem) {
            setCategoriasDisponibles(Subcategorias[producto.tipoItem] || []);
            setProducto(prev => ({
                ...prev,
                categoria: '',
                nombre: ''
            }));
        }
    }, [producto.tipoItem]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const finalValue = type === 'checkbox' ? checked : value;

        if (name === 'fechaCreacion') {
            const selectedDate = new Date(finalValue);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                alert('No se puede seleccionar una fecha anterior a hoy');
                return;
            }
        }

        setProducto(prev => ({
            ...prev,
            [name]: finalValue,
            ...(name === 'categoria' && { nombre: finalValue })
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const selectedDate = new Date(producto.fechaCreacion);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            alert('La fecha no puede ser anterior al día actual');
            return;
        }

        const [year, month, day] = producto.fechaCreacion.split('-');
        const fechaFormateada = `${day}/${month}/${year}`;

        const bodyData = {
            nombre: producto.nombre,
            tipo_item: producto.tipoItem,
            unidad_medida: producto.unidadMedida,
            cantidad_minima: Number(producto.cantidadMinima),
            cantidad_actual: Number(producto.cantidadActual),
            fecha_creacion: fechaFormateada,
            activo: producto.activo
        };

        try {
            const method = productoSeleccionado ? 'PUT' : 'POST';
            const url = productoSeleccionado 
                ? `http://localhost:3000/items/${productoSeleccionado.id}`
                : 'http://localhost:3000/items';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bodyData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error en la solicitud');
            }

            onClose(true);
            window.location.reload();

        } catch (error) {
            alert(`Error: ${error.message}`);
            console.error('Detalle del error:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 border-b pb-3">
                    <h2 className="text-2xl font-bold text-gray-800">
                        {productoSeleccionado ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Tipo de Producto */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Tipo de Producto
                        </label>
                        <select
                            name="tipoItem"
                            value={producto.tipoItem}
                            onChange={handleChange}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400"
                            required
                        >
                            <option value="">Seleccione un tipo</option>
                            {Object.values(TipoItem).map((tipo) => (
                                <option key={tipo} value={tipo}>{tipo}</option>
                            ))}
                        </select>
                    </div>

                    {/* Categoría/Nombre */}
                    {producto.tipoItem && (
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                {producto.tipoItem === 'Insumo' ? 'Tipo de Insumo' : 'Seleccione el producto'}
                            </label>
                            <select
                                name="categoria"
                                value={producto.categoria}
                                onChange={handleChange}
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400"
                                required
                            >
                                <option value="">Seleccione una opción</option>
                                {categoriasDisponibles.map((item) => (
                                    <option key={item} value={item}>
                                        {item}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Campos numéricos */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Cantidad Mínima
                            </label>
                            <input
                                type="number"
                                name="cantidadMinima"
                                value={producto.cantidadMinima}
                                onChange={handleChange}
                                className="w-full p-2.5 border rounded-lg"
                                min="0"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Cantidad Actual
                            </label>
                            <input
                                type="number"
                                name="cantidadActual"
                                value={producto.cantidadActual}
                                onChange={handleChange}
                                className="w-full p-2.5 border rounded-lg"
                                min="0"
                                required
                            />
                        </div>
                    </div>

                    {/* Unidad de Medida */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Unidad de Medida
                        </label>
                        <select
                            name="unidadMedida"
                            value={producto.unidadMedida}
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

                    {/* Fecha de creación */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Fecha de Creación
                        </label>
                        <input
                            type="date"
                            name="fechaCreacion"
                            value={producto.fechaCreacion}
                            onChange={handleChange}
                            min={fechaActual}
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400"
                            required
                        />
                    </div>

                    {/* Estado Activo */}
                    <div className="flex items-center space-x-2 pt-4">
                        <input
                            type="checkbox"
                            name="activo"
                            id="activo"
                            checked={producto.activo}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="activo" className="text-sm text-gray-700">
                            Activo
                        </label>
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
            </div>
        </div>
    );
};

ProductForm.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    productoSeleccionado: PropTypes.shape({
        id: PropTypes.number,
        nombre: PropTypes.string,
        tipo_item: PropTypes.string,
        unidad_medida: PropTypes.string,
        cantidad_minima: PropTypes.number,
        cantidad_actual: PropTypes.number,
        fecha_creacion: PropTypes.string,
        activo: PropTypes.bool
    })
};

ProductForm.defaultProps = {
    isOpen: false,
    productoSeleccionado: null
};

export default ProductForm;