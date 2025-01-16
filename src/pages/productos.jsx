import { useState, useEffect } from 'react';
import { ComposicionProducto } from '../../Backend/modelos/ComposicionProducto.js';
import { TipoItem, Unidades_Medida } from '../modelos/TIPOS'; 
import { FuncionesUtiles } from '../Utils/GeneralUtils';
import Button from './Button';
import Modal from './Modal';
import ProductTable from './ProductTable'; // Importa el nuevo componente

function Productos() {
    const [productos, setProductos] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const initialProductoState = {
        nombre: '',
        unidadMedida: '',
        tipoItem: '',
        cantidadMinima: 0,
        activo: true,
    };
 const [nuevoProducto, setNuevoProducto] = useState(initialProductoState);

    useEffect(() => {
        const storedProducts = FuncionesUtiles.obtenerElementos('productos');
        const productosActivos = storedProducts.map(producto => ({
            ...producto,
            activo: producto.activo !== undefined ? producto.activo : true 
        }));
        setProductos(productosActivos);
    }, []);

    useEffect(() => {
        if (productos.length > 0) {
            localStorage.setItem('productos', JSON.stringify(productos));
        }
    }, [productos]);

    const handleCloseModal = () => {
        setShowModal(false);
        setModoEdicion(false);
        setNuevoProducto(initialProductoState);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevoProducto(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSaveProduct = (e) => {
        const resultado = FuncionesUtiles.handleGuardarElemento(e, nuevoProducto, {
            tipoElemento: 'producto',
            modoEdicion,
            elementoSeleccionado: productoSeleccionado,
            elementos: productos,
            setElementos: setProductos,
            initialElementoState: initialProductoState,
            setNuevoElemento: setNuevoProducto,
            setShowModal,
            setModoEdicion,
            validaciones: [
                (producto) => {
                    if (!producto.nombre) return "El nombre es obligatorio.";
                    if (producto.cantidadMinima < 0) return "La cantidad mínima no puede ser negativa.";
                    return true;
                }
            ],
        });

        if (!resultado) {
            console.error("No se pudo guardar el producto.");
        } else {
            console.log("Producto guardado exitosamente:", resultado);
        }
    };

    const handleEliminarProducto = (id) => {
        FuncionesUtiles.handleEliminarElemento(id, 'producto', setProductos);
    };

    const handleEditarProducto = (producto) => {
        setModoEdicion(true);
        setNuevoProducto(producto);
        setProductoSeleccionado(producto);
        setShowModal(true);
    };

    return (
        <div className="w-full bg-background p-4 flex flex-col mt-5 rounded-lg shadow-md overflow-hidden border-2">
            <div className="w-full max-h-max flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-text-primary">Gestión de Productos</h2>
                <Button onClick={() => setShowModal(true)} variant="success">
                    Agregar Producto
                </Button>
            </div>

            <ProductTable 
                productos={productos} 
                onEdit={handleEditarProducto} 
                onDelete={handleEliminarProducto} 
                onAddComponent={() => { /* lógica para agregar componente */ }} 
            />

            <Modal isOpen={showModal} onClose={handleCloseModal} title={modoEdicion ? 'Editar Producto' : 'Agregar Nuevo Producto'}>
                <form onSubmit={handleSaveProduct} className="space-y-5">
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre del Producto"
                        value={nuevoProducto.nombre}
                        onChange={handleInputChange} 
                        className="w-full p-3 border rounded-md text-text-primary"
                        required
                    />
                    <select
                        name="tipoItem"
                        value={nuevoProducto.tipoItem}
                        onChange={handleInputChange} 
                        className="w-full p-3 border rounded-md text-text-primary"
                        required
                    >
                        <option value="">Seleccionar Tipo de Producto</option>
                        {Object.values(TipoItem).map((tipo) => (
                            <option key={tipo} value={tipo}>
                                {tipo}
                            </option>
                        ))}
                    </select>
                    <select
                        name="unidadMedida"
                        value={nuevoProducto.unidadMedida}
                        onChange={handleInputChange} 
                        className="w-full p-3 border rounded-md text-text-primary"
                        required
                    >
                        <option value="">Seleccionar Unidad de Medida</option>
                        {Unidades_Medida.map((unidad) => (
                            <option key={unidad.simbolo} value={unidad.simbolo}>
                                {unidad.nombre} ({unidad.simbolo})
                            </option>
                        ))}
                    </select>
                    <label className='text-black w-full'>
                        Cantidad Minima
                        <input
                            type="number"
                            name="cantidadMinima"
                            placeholder="Cantidad Mínima"
                            value={nuevoProducto.cantidadMinima}
                            onChange={handleInputChange} 
                            className="w-full p-3 border rounded-md text-text-primary"
                            required
 min="0"
                        />
                    </label>

                    <div className="flex justify-between mt-6">
                        <Button type="submit" variant="success" className="w-full mr-4">
                            {modoEdicion ? 'Actualizar' : 'Agregar'}
                        </Button>
                        <Button type="button" onClick={handleCloseModal} variant="secondary" className="w-full">
                            Cancelar
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default Productos;