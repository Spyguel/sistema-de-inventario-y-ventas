import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/solid';
import SelectInput from './common/Forms/Imputs/SelectInput';

const BarraBusqueda = ({ 
    onSearch, 
    placeholder = "Buscar...", 
    options = [],
    initialFilters = {} 
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState(initialFilters);

    useEffect(() => {
        handleSearch();
    }, [activeFilters]);

    const handleSearch = () => {
        onSearch(searchTerm, activeFilters);
    };

    const handleSearchTermChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        onSearch(term, activeFilters);
    };

    const handleFilterChange = (key, value) => {
        setActiveFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const clearFilters = () => {
        setActiveFilters({});
        setSearchTerm('');
        onSearch('', {});
    };

    const getActiveFiltersCount = () => {
        return Object.values(activeFilters).filter(value => value && value !== 'todos').length;
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center gap-2">
                {/* Search Input */}
                <div className="relative flex-grow">
                    <input 
                        type="text"
                        placeholder={placeholder}
                        value={searchTerm}
                        onChange={handleSearchTermChange}
                        className="w-full p-2 pl-10 pr-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <MagnifyingGlassIcon 
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
                    />
                    {(searchTerm || getActiveFiltersCount() > 0) && (
                        <button
                            onClick={clearFilters}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

BarraBusqueda.propTypes = {
    onSearch: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    options: PropTypes.array,
    initialFilters: PropTypes.object
};

export default BarraBusqueda;