import { useState } from 'react';

const useSearch = (initialTerm = '', initialFilters = {}) => {
    const [searchConfig, setSearchConfig] = useState({
        term: initialTerm,
        filters: initialFilters,
    });

    const filterData = (data, searchTerm, filters) => {
        return data.filter(item => {
            // Search term filtering
            const searchMatch = Object.values(item).some(value =>
                value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
            );

            // Filters matching
            const filterMatch = Object.entries(filters).every(([key, value]) => {
                if (!value || value === 'todos') return true;
                return item[key]?.toString() === value;
            });

            return searchMatch && filterMatch;
        });
    };

    const handleSearch = (term, filters) => {
        setSearchConfig({ term, filters });
    };

    return {
        searchConfig,
        handleSearch,
        filterData,
    };
};

export default useSearch;