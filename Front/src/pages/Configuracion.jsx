import  { useState } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import Button from '../components/common/button'; 

function Configuracion() {
    // Estados principales
    const [productos, setProductos] = useState([
        { 
            id: 1, 
            nombre: 'Producto 1', 
            tipoItem: 'Materia Prima',
            unidadMedida: 'Kg',
            cantidadMinima: 10
        },
        { 
            id: 2, 
            nombre: 'Producto 2', 
            tipoItem: 'Producto Terminado',
            unidadMedida: 'Unidad',
            cantidadMinima: 5
        }
    ]);
    const [modalState, setModalState] = useState({
        producto: false,
    });

    // Estado de edición
    const [modoEdicion, setModoEdicion] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    // Estado inicial de nuevo producto
    const initialProductoState = {
        nombre: '',
        unidadMedida: '',
        tipoItem: '',
        cantidadMinima: 0,
    };
    const [nuevoProducto, setNuevoProducto] = useState(initialProductoState);

    // Manejadores de modal
    const toggleModal = (modalName, state = true) => {
        setModalState(prev => ({
            ...Object.fromEntries(
                Object.keys(prev).map(key => [key, false])
            ),
            [modalName]: state
        }));
    };

    // Manejadores de producto
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevoProducto(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProduct = (e) => {
        e.preventDefault();
        
        if (modoEdicion) {
            // Lógica de edición
            setProductos(prev => 
                prev.map(p => 
                    p.id === productoSeleccionado.id 
                        ? { ...nuevoProducto, id: p.id } 
                        : p
                )
            );
        } else {
            // Lógica de agregar
            setProductos(prev => [
                ...prev, 
                { ...nuevoProducto, id: prev.length + 1 }
            ]);
        }

        // Resetear estados
        setNuevoProducto(initialProductoState);
        toggleModal('producto', false);
        setModoEdicion(false);
    };

    const handleEditarProducto = (producto) => {
        setModoEdicion(true);
        setNuevoProducto(producto);
        setProductoSeleccionado(producto);
        toggleModal('producto');
    };

    const handleEliminarProducto = (id) => {
        setProductos(prev => prev.filter(p => p.id !== id));
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Gestión de Productos</h2>
                <Button 
                    variant="success" 
                    onClick={() => toggleModal('producto')}
                >
                    Agregar Producto
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-4 text-left">ID</th>
                            <th className="py-3 px-4 text-left">Nombre</th>
                            <th className="py-3 px-4 text-left">Tipo</th>
                            <th className="py-3 px-4 text-left">Unidad</th>
                            <th className="py-3 px-4 text-left">Cant. Mínima</th>
                            <th className="py-3 px-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {productos.map((producto) => (
                            <tr 
                                key={producto.id} 
                                className="border-b border-gray-200 hover:bg-gray-100"
                            >
                                <td className="py-3 px-4">{producto.id}</td>
                                <td className="py-3 px-4">{producto.nombre}</td>
                                <td className="py-3 px-4">{producto.tipoItem}</td>
                                <td className="py-3 px-4">{producto.unidadMedida}</td>
                                <td className="py-3 px-4">{producto.cantidadMinima}</td>
                                <td className="py-3 px-4">
                                    <div className="flex justify-center space-x-2">
                                        <button 
                                            onClick={() => handleEditarProducto(producto)}
                                            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors"
                                        >
                                            <PencilIcon className="h-5 w-5" />
                                        </button>
                                        <button 
                                            onClick={() => handleEliminarProducto(producto.id)}
                                            className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors"
                                        >
                                            <TrashIcon className="h-5 w-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal de Producto */}
            {modalState.producto && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <h2 className="text-2xl font-bold mb-4">
                            {modoEdicion ? 'Editar' : 'Agregar'} Producto
                        </h2>
                        <form onSubmit={handleSaveProduct} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Nombre</label>
                                <input 
                                    type="text"
                                    name="nombre"
                                    value={nuevoProducto.nombre}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Tipo de Producto</label>
                                <select
                                    name="tipoItem"
                                    value={nuevoProducto.tipoItem}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                >
                                    <option value="">Seleccionar Tipo</option>
                                    <option value="Materia Prima">Materia Prima</option>
                                    <option value="Producto Terminado">Producto Terminado</option>
                                </select>
                            </div>
                            <div>
                                <label className ="block text-gray-700 mb-2">Unidad de Medida</label>
                                <input 
                                    type="text"
                                    name="unidadMedida"
                                    value={nuevoProducto.unidadMedida}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Cantidad Mínima</label>
                                <input 
                                    type="number"
                                    name="cantidadMinima"
                                    value={nuevoProducto.cantidadMinima}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <Button type="submit" variant="success">
                                    Guardar
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="secondary"
                                    onClick={() => toggleModal('producto', false)}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Configuracion;