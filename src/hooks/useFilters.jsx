import { useState, useCallback, useMemo } from 'react';

export const useFilters = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [columnFilters, setColumnFilters] = useState({});

    const handleColumnFilterChange = useCallback((columnKey, value) => {
        setColumnFilters(prev => ({
            ...prev,
            [columnKey]: value
        }));
    }, []);

    const clearAllFilters = useCallback(() => {
        setColumnFilters({});
        setSearchTerm('');
    }, []);

    const hasActiveFilters = useMemo(() => {
        return searchTerm.trim() || Object.keys(columnFilters).some(key => {
            const filter = columnFilters[key];
            if (Array.isArray(filter)) return filter.length > 0;
            return filter && filter.trim();
        });
    }, [searchTerm, columnFilters]);

    return {
        searchTerm,
        setSearchTerm,
        showFilters,
        setShowFilters,
        columnFilters,
        setColumnFilters,
        handleColumnFilterChange,
        clearAllFilters,
        hasActiveFilters
    };
};

