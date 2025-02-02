import  { useState, useMemo } from 'react';
import Button from '../components/common/button';
import ProductTable from '../components/Tablas/ProductTable'; 
import ProductForm from '../components/Modals/ProductForm';
import BarraBusqueda from '../components/common/BarraBusqueda';

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
];

function Productos() {
    const [productos, setProductos] = useState(productosIniciales);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('todos');

    // Función de búsqueda y filtrado
    const productosFiltrados = useMemo(() => {
        return productos.filter(producto => {
            const coincideBusqueda = 
                producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                producto.tipoItem.toLowerCase().includes(searchTerm.toLowerCase()) ||
                producto.unidadMedida.toLowerCase().includes(searchTerm.toLowerCase()) ||
                producto.id.toString().includes(searchTerm);

            const coincideEstado = 
                filtroEstado === 'todos' || 
                filtroEstado === 'activos' && producto.activo ||
                filtroEstado === 'inactivos' && !producto.activo ||
                producto.tipoItem === filtroEstado;

            return coincideBusqueda && coincideEstado;
        });
    }, [productos, searchTerm, filtroEstado]);

    // Manejador de búsqueda
    const handleSearch = (term, estado) => {
        setSearchTerm(term);
        setFiltroEstado(estado);
    };

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
            <BarraBusqueda
                onSearch={handleSearch}
                placeholder="Buscar productos por nombre..."
                options={[
                    { value: 'todos', label: 'Todos' },
                    { value: 'activos', label: 'Activos' },
                    { value: 'inactivos', label: 'Inactivos' },
                    { value: 'PRODUCTO_TERMINADO', label: 'Producto final' },
                    { value: 'MATERIA_PRIMA', label: 'Materia prima' },
                ]}
            />
            <ProductTable 
                productos={productosFiltrados} 
                onEdit={handleEditarProducto}
                onDelete={handleEliminarProducto}
                onAddComponent={handleAgregarComponente}
                onToggleActive={handleToggleActive}
            />

            <ProductForm 
                isOpen={modalAbierto} 
                onClose={() => { 
                    setModalAbierto(false);
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