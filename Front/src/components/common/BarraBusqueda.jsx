import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { MagnifyingGlassIcon, XMarkIcon, FunnelIcon } from '@heroicons/react/24/solid';
import SelectInput from './common/Forms/Imputs/SelectInput';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const BarraBusqueda = ({ 
    onSearch, 
    placeholder = "Buscar...", 
    options = [], 
    initialFilters = {}, 
    searchButton = true, 
    onDateChange 
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilters, setActiveFilters] = useState(initialFilters);
    const [showFilters, setShowFilters] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const handleSearch = useCallback(() => {
        onSearch(searchTerm, activeFilters, startDate, endDate);
    }, [searchTerm, activeFilters, startDate, endDate, onSearch]);

    useEffect(() => {
        if (!searchButton) handleSearch();
    }, [activeFilters, searchButton, handleSearch]);

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (key, value) => {
        setActiveFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleDateChange = (type, date) => {
        if (type === 'start') setStartDate(date);
        if (type === 'end') setEndDate(date);
        onDateChange(date, startDate, endDate);
    };

    const clearFilters = () => {
        setActiveFilters({});
        setSearchTerm('');
        setStartDate(null);
        setEndDate(null);
        onSearch('', {}, null, null);
    };

    const getActiveFiltersCount = () => {
        return Object.values(activeFilters).filter(value => value && value !== 'todos').length;
    };

    return (
        <div className="w-full space-y-4">
            <div className="flex items-center gap-2">
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
                {searchButton && (
                    <button
                        onClick={handleSearch}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Buscar
                    </button>
                )}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                    <FunnelIcon className="h-5 w-5 text-gray-600" />
                </button>
            </div>

            {showFilters && (
                <div className="flex flex-wrap gap-2">
                    {options.map(({ key, label, options }) => (
                        <SelectInput 
                            key={key} 
                            label={label} 
                            options={options} 
                            value={activeFilters[key] || 'todos'} 
                            onChange={(value) => handleFilterChange(key, value)} 
                        />
                    ))}
                    <div className="flex gap-2">
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700">Desde</label>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => handleDateChange('start', date)}
                                dateFormat="yyyy/MM/dd"
                                className="mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 max-h-8 focus:ring-indigo-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <label className="block text-sm font-medium text-gray-700">Hasta</label>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => handleDateChange('end', date)}
                                dateFormat="yyyy/MM/dd"
                                className="mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 max-h-8 focus:ring-indigo-500"
                                minDate={startDate} 
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

BarraBusqueda.propTypes = {
    onSearch: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    options: PropTypes.array,
    initialFilters: PropTypes.object,
    searchButton: PropTypes.bool,
    onDateChange: PropTypes.func.isRequired,
};

export default BarraBusqueda;