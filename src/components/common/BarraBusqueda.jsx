// src/components/common/BarraBusqueda.jsx
import { useState } from 'react';
import PropTypes from 'prop-types';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';

const BarraBusqueda = ({ 
    onSearch, 
    placeholder = "Buscar...", 
    opciones = [] 
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('todos');

    const handleSearch = (term, estado) => {
        onSearch(term, estado);
    };

    const handleSearchTermChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        handleSearch(term, filtroEstado);
    };

    const handleFiltroEstadoChange = (e) => {
        const estado = e.target.value;
        setFiltroEstado(estado);
        handleSearch(searchTerm, estado);
    };

    return (
        <div className="flex mb-4 space-x-4 w-full">
            {/* Buscador */}
            <div className="relative flex-grow">
                <input 
                    type="text"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    className="w-full p-2 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <MagnifyingGlassIcon 
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
                />
            </div>

            {/* Filtro de estado */}
            <select 
                value={filtroEstado}
                onChange={handleFiltroEstadoChange}
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <option value="todos">Todos</option>
                <option value="activos">Activos</option>
                <option value="inactivos">Inactivos</option>
            </select>

            {/* Filtros adicionales opcionales */}
            {opciones.length > 0 && (
                <select 
                    className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {opciones.map((opcion, index) => (
                        <option key={index} value={opcion.value}>
                            {opcion.label}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

BarraBusqueda.propTypes = {
    onSearch: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    opciones: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired
        })
    )
};

export default BarraBusqueda;