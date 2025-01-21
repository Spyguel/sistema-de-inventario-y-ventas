import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from './button';

// Enum para tipos de producto
const TipoItem = {
    PRODUCTO_TERMINADO: 'PRODUCTO_TERMINADO',
    MATERIA_PRIMA: 'MATERIA_PRIMA',
};

const ProductForm = ({ 
    isOpen, 
    onClose, 
    productoSeleccionado, 
    onGuardar 
}) => {
    const [producto, setProducto] = useState({
        nombre: '',
        tipoItem: '',
        unidadMedida: '',
        cantidadMinima: 0
    });

    // Efecto para cargar datos del producto seleccionado
    useEffect(() => {
        if (productoSeleccionado) {
            setProducto({
                nombre: productoSeleccionado.nombre || '',
                tipoItem: productoSeleccionado.tipoItem || '',
                unidadMedida: productoSeleccionado.unidadMedida || '',
                cantidadMinima: productoSeleccionado.cantidadMinima || 0
            });
        } else {
            // Resetear formulario si no hay producto seleccionado
            setProducto({
                nombre: '',
                tipoItem: '',
                unidadMedida: '',
                cantidadMinima: 0
            });
        }
    }, [productoSeleccionado]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducto(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onGuardar(producto);
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center 
            bg-black bg-opacity-50 backdrop-blur-sm"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999
            }}
        >
            <div 
                className="relative w-full max-w-xl max-h-[90vh] bg-white rounded-xl shadow-2xl 
                transform transition-all duration-300 ease-in-out 
                scale-100 opacity-100 p-6 overflow-y-auto"
                style={{
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    animation: 'fadeIn 0.3s ease-out',
                    maxHeight: '90vh'
                }}
            >
                {/* Encabezado del Modal */}
                <div className="flex justify-between items-center mb-6 border-b pb-3">
                    <h2 className="text-2xl font-bold text-text-primary">
                        {productoSeleccionado ? 'Editar Producto' : 'Agregar Nuevo Producto'}
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-6 w-6" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M6 18L18 6M6 6l12 12" 
                            />
                        </svg>
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label 
                            htmlFor="nombre" 
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Nombre del Producto
                        </label>
                        <input
                            id="nombre"
                            type="text"
                            name="nombre"
                            placeholder="Ej: Pastel de Chocolate"
                            value={producto.nombre}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md text-text-primary focus:ring-2 focus:ring-blue-500 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label 
                            htmlFor="tipoItem" 
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Tipo de Producto
                        </label>
                        <select
                            id="tipoItem"
                            name="tipoItem"
                            value={producto.tipoItem}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md text-text-primary focus:ring-2 focus:ring-blue-500 transition-all"
                            required
                        >
                            <option value="">Seleccionar Tipo de Producto</option>
                            {Object.values(TipoItem).map((tipo) => (
                                <option key={tipo} value={tipo}>
                                    {tipo}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label 
                            htmlFor="unidadMedida" 
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Unidad de Medida
                        </label>
                        <select
                            id="unidadMedida"
                            name="unidadMedida"
                            value={producto.unidadMedida}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md text-text-primary focus:ring-2 focus:ring-blue-500 transition-all"
                            required
                        >
                            <option value="">Seleccionar Unidad de Medida</option>
                            {['Unidad', 'Kg', 'Litro', 'Caja', 'Paquete'].map((unidad) => (
                                <option key={unidad} value={unidad}>
                                    {unidad}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label 
                            htmlFor="cantidadMinima" 
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Cantidad Mínima
                        </label>
                        <input
                            id="cantidadMinima"
                            type="number"
                            name="cantidadMinima"
                            placeholder="Cantidad Mínima"
                            value={producto.cantidadMinima}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md text-text-primary focus:ring-2 focus:ring-blue-500 transition-all"
                            required
                            min="0"
                        />
                    </div>

                    <div className="flex justify-between mt-6 space-x-4">
                        <Button 
                            type="submit" 
                            variant="success" 
                            className="w-full"
                        >
                            {productoSeleccionado ? 'Actualizar' : 'Agregar'}
                        </Button>
                        <Button 
                            type="button" 
                            variant="secondary" 
                            className="w-full"
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

// Validación de PropTypes
ProductForm.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func.isRequired,
    productoSeleccionado: PropTypes.shape({
        id: PropTypes.number,
        nombre: PropTypes.string,
        tipoItem: PropTypes.string,
        unidadMedida: PropTypes.string,
        cantidadMinima: PropTypes.number,
        activo: PropTypes.bool
    }),
    onGuardar: PropTypes.func.isRequired
};

ProductForm.defaultProps = {
    isOpen: false,
    productoSeleccionado: null
};

export default ProductForm;