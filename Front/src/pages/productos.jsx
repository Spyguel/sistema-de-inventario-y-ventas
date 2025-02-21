import { useState, useMemo } from 'react';
import Button from '../components/common/button';
import ProductTable from '../components/Tablas/ProductTable'; 
import ProductForm from '../components/Modals/ProductForm';
import BarraBusqueda from '../components/common/BarraBusqueda';

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
            setProductos(prevProductos => 
                prevProductos.map(p => 
                    p.id === productoSeleccionado.id 
                        ? {...nuevoProducto, id: p.id, activo: p.activo} 
                        : p
                )
            );
        } else {
            const productoConId = {
                ...nuevoProducto,
                id: Date.now(), 
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
        <div className="h-[100%] ml-10 p-4">
            <div className="rounded-lg shadow-lg p-6 h-[95%]">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Gestión de Productos</h2>
                <p className="text-sm text-gray-500 mb-4">Administra los productos y materias primas</p>

                {/* Botón Agregar */}
                <div className="flex justify-end mb-4">
                    <Button 
                        onClick={() => { setProductoSeleccionado(null); setModalAbierto(true); }} 
                        variant="success"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
                    >
                        + Agregar Producto
                    </Button>
                </div>

                {/* Barra de Búsqueda */}
                <BarraBusqueda
                    onSearch={handleSearch}
                    placeholder="Buscar productos..."
                    options={[
                        { value: 'activos', label: 'Todos' },
                        { value: 'PRODUCTO_TERMINADO', label: 'Producto final' },
                        { value: 'MATERIA_PRIMA', label: 'Materia prima' },
                    ]}
                />

                {/* Tabla de Productos */}
                <div className="mt-4">
                    <ProductTable 
                        productos={productosFiltrados} 
                        onEdit={handleEditarProducto}
                        onDelete={handleEliminarProducto}
                        onToggleActive={handleToggleActive}
                    />
                </div>
            </div>

            {/* Modal para Agregar/Editar Productos */}
            <ProductForm 
                isOpen={modalAbierto} 
                onClose={() => { 
                    setModalAbierto(false);
                    setProductoSeleccionado(null);
                }}
                title={productoSeleccionado ? "Editar Producto" : "Agregar Nuevo Producto"}
                productoSeleccionado={productoSeleccionado}
                onGuardar={handleGuardarProducto}
            />
        </div>
    );
}

export default Productos;
