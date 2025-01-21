// Productos.jsx
import { useState } from 'react';
import Button from '../components/common/button';
import ProductTable from '../components/common/ProductTable'; 
import ProductForm from '../components/common/modal';

// Datos pre-cargados de productos
const productosIniciales = [
    {
        id: 1,
        nombre: 'Pastel de Chocolate',
        unidadMedida: 'Unidad',
        tipoItem: 'PRODUCTO_TERMINADO',
        cantidadMinima: 10,
        activo: true
    },
    // ... otros productos iniciales
];

function Productos() {
    const [productos, setProductos] = useState(productosIniciales);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);

    const handleEditarProducto = (producto) => {
        setProductoSeleccionado(producto);
        setModalAbierto(true);
    };

    const handleGuardarProducto = (nuevoProducto) => {
        if (productoSeleccionado) {
            // Actualizar producto existente
            setProductos(prevProductos => 
                prevProductos.map(p => 
                    p.id === productoSeleccionado.id 
                        ? {...nuevoProducto, id: p.id, activo: p.activo} 
                        : p
                )
            );
        } else {
            // Crear nuevo producto
            const productoConId = {
                ...nuevoProducto,
                id: Date.now(), // Genera un ID temporal
                activo: true
            };
            setProductos(prevProductos => [...prevProductos, productoConId]);
        }

        setModalAbierto(false);
        setProductoSeleccionado(null);
    };

    const handleEliminarProducto = (id) => {
        const productosActualizados = productos.filter(p => p.id !== id);
        setProductos(productosActualizados);
    };

    const handleAgregarComponente = (producto) => {
        console.log('Agregar componente a:', producto.nombre);
    };

    const handleToggleActive = (id) => {
        setProductos(prevProductos => 
            prevProductos.map(producto => 
                producto.id === id 
                    ? { ...producto, activo: !producto.activo } 
                    : producto
            )
        );
    };

    return (
        <div className="w-full bg-background p-4 flex flex-col mt-5 rounded-lg shadow-md overflow-hidden border-2">
            <div className="w-full max-h-max flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-text-primary">Gestión de Productos</h2>
                <Button 
                    onClick={() => { setProductoSeleccionado(null); setModalAbierto(true); }} 
                    variant="success"
                >
                    Agregar Producto
                </Button>
            </div>

            <ProductTable 
                productos={productos} 
                onEdit={handleEditarProducto}
                onDelete={handleEliminarProducto}
                onAddComponent={handleAgregarComponente}
                onToggleActive={handleToggleActive}
            />

            <ProductForm 
                isOpen={modalAbierto} 
                onClose={() => { setModalAbierto(false);
                    setProductoSeleccionado(null);
                }}
                title={productoSeleccionado ? "Editar Producto" : "Agregar Nuevo Producto"}
                productoSeleccionado={productoSeleccionado}
                onGuardar={handleGuardarProducto}
            >
                <ProductForm 
                    productoSeleccionado={productoSeleccionado} 
                    onGuardar={handleGuardarProducto} 
                    onCancelar={() => {
                        setModalAbierto(false);
                        setProductoSeleccionado(null);
                    }} 
                />
            </ProductForm>
        </div>
    );
}

export default Productos;