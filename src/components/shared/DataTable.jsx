import React, { useMemo, useState, useEffect } from 'react';
import MultiSelectDropdown from './MultiSelectDropdown';

const DataTable = ({
    data,
    columns,
    onRowClick,
    searchTerm,
    showFilters,
    columnFilters,
    onColumnFilterChange
}) => {
    // Add debounced search term
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm || '');

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm || '');
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Define which columns should use multi-select
    const multiSelectColumns = {
        'status': true,
        'agesServed': true,
        'governanceModel': true,
        'membershipStatus': true,
        'discoveryStatus': true,
        'individualType': true,
        'raceEthnicity': true,
        'role': true
    };

    // Get unique values for multi-select columns
    const getUniqueValues = (columnKey) => {
        const values = new Set();
        data.forEach(item => {
            const value = item[columnKey];
            if (Array.isArray(value)) {
                value.forEach(v => v && values.add(v));
            } else if (value) {
                values.add(value);
            }
        });
        return Array.from(values).sort();
    };

    // Apply both search and column filters
    const filteredData = useMemo(() => {
        let result = data;

        // Apply search term filter with debounced value
        if (debouncedSearchTerm) {
            result = result.filter(item =>
                Object.values(item).some(value => {
                    if (Array.isArray(value)) {
                        return value.some(v => v && v.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
                    }
                    return value && value.toString().toLowerCase().includes(debouncedSearchTerm.toLowerCase());
                })
            );
        }

        // Apply column filters
        Object.entries(columnFilters).forEach(([columnKey, filterValue]) => {
            if (filterValue) {
                if (multiSelectColumns[columnKey] && Array.isArray(filterValue) && filterValue.length > 0) {
                    // Multi-select filter logic
                    result = result.filter(item => {
                        const itemValue = item[columnKey];
                        if (Array.isArray(itemValue)) {
                            // Check if any of the item's values match any selected filter values
                            return itemValue.some(val => filterValue.includes(val));
                        } else {
                            // Check if the item's value matches any selected filter values
                            return filterValue.includes(itemValue);
                        }
                    });
                } else if (typeof filterValue === 'string' && filterValue.trim()) {
                    // Text filter logic
                    result = result.filter(item => {
                        const itemValue = item[columnKey];
                        if (itemValue == null) return false;
                        if (Array.isArray(itemValue)) {
                            return itemValue.some(val =>
                                val && val.toString().toLowerCase().includes(filterValue.toLowerCase())
                            );
                        }
                        return itemValue.toString().toLowerCase().includes(filterValue.toLowerCase());
                    });
                }
            }
        });

        return result;
    }, [data, debouncedSearchTerm, columnFilters]); // Now debouncedSearchTerm is properly defined

    const handleColumnFilterChange = (columnKey, value) => {
        if (onColumnFilterChange) {
            onColumnFilterChange(columnKey, value);
        }
    };

    const renderFilterInput = (col) => {
        if (multiSelectColumns[col.key]) {
            const options = getUniqueValues(col.key);
            const selectedValues = columnFilters[col.key] || [];

            return (
                <MultiSelectDropdown
                    options={options}
                    selectedValues={selectedValues}
                    onChange={(values) => handleColumnFilterChange(col.key, values)}
                    placeholder={`Filter ${col.label}...`}
                />
            );
        } else {
            return (
                <input
                    type="text"
                    placeholder={`Filter ${col.label}...`}
                    value={columnFilters[col.key] || ''}
                    onChange={(e) => handleColumnFilterChange(col.key, e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
            );
        }
    };

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {col.label}
                            </th>
                        ))}
                    </tr>

                    {/* Filter Row */}
                    {showFilters && (
                        <tr className="bg-gray-100">
                            {columns.map((col) => (
                                <th key={`filter-${col.key}`} className="px-6 py-2">
                                    {renderFilterInput(col)}
                                </th>
                            ))}
                        </tr>
                    )}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredData.map((item) => (
                        <tr
                            key={item.id}
                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                            onClick={() => onRowClick && onRowClick(item)}
                        >
                            {columns.map((col) => (
                                <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {col.render ? col.render(item[col.key], item) : item[col.key] || '-'}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {filteredData.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No results found. Try adjusting your filters or search term.
                </div>
            )}
        </div>
    );
};

export default DataTable;