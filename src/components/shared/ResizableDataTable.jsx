// src/components/shared/ResizableDataTable.jsx
import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import MultiSelectDropdown from './MultiSelectDropdown';
import './ResizableDataTable.css';

const ResizableDataTable = ({ 
  data, 
  columns, 
  onRowClick, 
  searchTerm, 
  showFilters, 
  columnFilters, 
  onColumnFilterChange,
  tableKey, // Used to save different widths for different tables
  loading = false // New prop for loading state
}) => {
  // ResizableDataTable component
  // State for column widths - load from localStorage
  const [columnWidths, setColumnWidths] = useState(() => {
    const saved = localStorage.getItem(`column-widths-${tableKey}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse saved column widths');
      }
    }
    
    // Default widths based on column defaults NOTE: IS THIS PART NEEDED SINCE WE HAVE DEFAULTS BUILT INTO THE INDIVIDUAL TABLE SPECS?
    const defaults = {};
    columns.forEach((col) => {
      defaults[col.key] = col.defaultWidth || 150;
    });
    return defaults;
  });

  // Save to localStorage whenever widths change
  useEffect(() => {
    localStorage.setItem(`column-widths-${tableKey}`, JSON.stringify(columnWidths));
  }, [columnWidths, tableKey]);

  // Update column widths when columns change (handles switching between tables)
  useEffect(() => {
    setColumnWidths(prev => {
      const updated = { ...prev };
      columns.forEach(col => {
        if (!(col.key in updated)) {
          updated[col.key] = col.defaultWidth || 150;
        }
      });
      return updated;
    });
  }, [columns]);

  // Multi-select column configuration
  const multiSelectColumns = {
    'status': true,
    'agesServed': true,
    'governanceModel': true,
    'membershipStatus': true,
    'raceEthnicity': true,
    'role': true,
    'discoveryStatus': true,
    'individualType': true
    };

  // Handle column resize
  const handleColumnResize = useCallback((columnKey, newWidth) => {
    const minWidth = 50; // Minimum column width
    const maxWidth = 500; // Maximum column width
    const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    
    setColumnWidths(prev => ({
      ...prev,
      [columnKey]: clampedWidth
    }));
  }, []);

  // Reset all column widths to defaults NOTE: WHY IS THIS HERE? CAN WE DELETE?
  const resetColumnWidths = () => {
    const defaults = {};
    columns.forEach((col) => {
      defaults[col.key] = col.defaultWidth || 150;
    });
    setColumnWidths(defaults);
  };

  // Auto-fit column to content NOTE: WHY IS THIS HERE? CAN WE DELETE?
  const autoFitColumn = (columnKey) => {
    // This is a simple heuristic - you could make it more sophisticated
    const column = columns.find(col => col.key === columnKey);
    if (!column) return;

    // Calculate based on header length and some sample data
    const headerLength = column.label.length * 8 + 40; // rough estimate
    
    // Check a few sample values to estimate content width
    const sampleValues = data.slice(0, 5).map(item => {
      const value = item[columnKey];
      if (Array.isArray(value)) {
        return value.join(', ');
      }
      return String(value || '');
    });
    
    const maxContentLength = Math.max(...sampleValues.map(v => v.length));
    const contentWidth = maxContentLength * 8 + 40;
    
    const optimalWidth = Math.max(headerLength, contentWidth, 80);
    handleColumnResize(columnKey, Math.min(optimalWidth, 300));
  };

  const getUniqueValues = (columnKey) => { // DOES THIS DO ANYTHING OTHER THAN SEED THE MULTI-SELECT FILTERS? INSTEAD, CAN WE GET THE ITEMS FOR THOSE FILTERS FROM THE AIRTABLECONFIG.JS FILE?
    const values = new Set();
    let hasEmpty = false;

    data.forEach(item => {
        const value = item[columnKey];
        if (Array.isArray(value)) {
        if (value.length === 0) {
            hasEmpty = true;
        } else {
            value.forEach(v => {
            if (v && v !== '') {
                values.add(v);
            } else {
                hasEmpty = true;
            }
            });
        }
        } else if (value && value !== '') {
        values.add(value);
        } else {
        hasEmpty = true;
        }
    });

    const sortedValues = Array.from(values).sort();

    // Don't add (empty) here since MultiSelectDropdown handles it
    return sortedValues;
  };


    // Check if there are active filters
    const hasActiveFilters = useMemo(() => {
        return Object.values(columnFilters).some(filter => 
            filter && (Array.isArray(filter) ? filter.length > 0 : true)
        );
    }, [columnFilters]);

    // Apply filters and search
    const filteredData = useMemo(() => {
    let result = data;

    // Apply search term filter
    if (searchTerm) {
        result = result.filter(item => 
        Object.values(item).some(value => {
            if (Array.isArray(value)) {
            return value.some(v => v && v.toString().toLowerCase().includes(searchTerm.toLowerCase()));
            }
            return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
        );
    }

    // Apply column filters with enhanced empty support
    Object.entries(columnFilters).forEach(([columnKey, filterValue]) => {
        if (filterValue) {
        if (multiSelectColumns[columnKey] && Array.isArray(filterValue) && filterValue.length > 0) {
            // Enhanced multi-select filter logic with empty support
            result = result.filter(item => {
            const itemValue = item[columnKey];
            
            // Check for empty values
            if (filterValue.includes('(empty)')) {
                const isEmpty = !itemValue || 
                            (Array.isArray(itemValue) && itemValue.length === 0) ||
                            itemValue === '' || 
                            itemValue === null || 
                            itemValue === undefined;
                
                if (isEmpty) return true;
            }
            
            // Check for non-empty values
            const nonEmptyFilters = filterValue.filter(f => f !== '(empty)');
            if (nonEmptyFilters.length === 0) return false;
            
            if (Array.isArray(itemValue)) {
                return itemValue.some(val => nonEmptyFilters.includes(val));
            } else {
                return nonEmptyFilters.includes(itemValue);
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
    }, [data, searchTerm, columnFilters]);

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
        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-teal-500 focus:border-teal-500"
      />
    );
  }
};

  return (
    <div className="relative">
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col, index) => {
                const width = columnWidths[col.key] || 150; // WHY ARE WE HARD-CODING DEFAULT WIDTHS HERE?
                const isLastColumn = index === columns.length - 1;
                
                return (
                  <th 
                    key={col.key}
                    style={{ width: `${width}px`, minWidth: `${width}px`, maxWidth: `${width}px` }}
                    className="relative bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none"
                  >
                    <div className="flex items-center justify-between px-6 py-3">
                      <span 
                        className="truncate cursor-pointer"
                        onDoubleClick={() => autoFitColumn(col.key)}
                        title={`Double-click to auto-fit "${col.label}"`}
                      >
                        {col.label}
                      </span>
                    </div>
                    
                    {/* Resize handle */}
                    {!isLastColumn && (
                      <ResizeHandle
                        columnKey={col.key}
                        onResize={handleColumnResize}
                        currentWidth={width}
                      />
                    )}
                  </th>
                );
              })}
            </tr>
            
            {/* Filter Row */}
            {showFilters && (
                <tr className="bg-gray-100">
                    {columns.map((col, index) => {
                    const width = columnWidths[col.key] || 150;
                    const isLastColumn = index === columns.length - 1;
                    
                    return (
                        <th 
                        key={`filter-${col.key}`}
                        style={{ width: `${width}px`, minWidth: `${width}px`, maxWidth: `${width}px` }}
                        className="relative px-2 py-2 bg-gray-100"
                        >
                        <div className="w-full">
                            {renderFilterInput(col)}
                        </div>
                        
                        {/* Resize handle for filter row too */}
                        {!isLastColumn && (
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-transparent" />
                        )}
                        </th>
                    );
                    })}
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
                {columns.map((col) => {
                  const width = columnWidths[col.key] || 150;
                  
                  return (
                    <td 
                      key={col.key}
                      style={{ width: `${width}px`, minWidth: `${width}px`, maxWidth: `${width}px` }}
                      className="px-6 py-4 text-sm text-gray-900"
                    >
                      <div className="truncate">
                        {col.render ? col.render(item[col.key], item) : (item[col.key] || '-')}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        
        {loading && (
          <div className="text-center py-12">
            <div className="inline-flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600 mb-4"></div>
              <p className="text-gray-600">Loading data...</p>
            </div>
          </div>
        )}
        
        {!loading && filteredData.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchTerm || hasActiveFilters ? 
              'No results found. Try adjusting your filters or search term.' : 
              'No data available.'
            }
          </div>
        )}
      </div>
    </div>
  );
};

// Resize handle component
const ResizeHandle = ({ columnKey, onResize, currentWidth }) => {
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startWidth = useRef(0);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setIsDragging(true);
    startX.current = e.clientX;
    startWidth.current = currentWidth;
    
    // Add a class to body to prevent text selection while dragging
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'col-resize';
  }, [currentWidth]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const deltaX = e.clientX - startX.current;
      const newWidth = startWidth.current + deltaX;
      
      onResize(columnKey, newWidth);
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        setIsDragging(false);
        
        // Restore body styles
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
      }
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      // Also handle mouse leave to stop resizing if mouse goes outside window
      document.addEventListener('mouseleave', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [isResizing, columnKey, onResize]);

  return (
    <div
      className={`absolute right-0 top-0 bottom-0 w-2 cursor-col-resize group ${
        isDragging ? 'bg-teal-400' : ''
      }`}
      onMouseDown={handleMouseDown}
      style={{ marginRight: '-4px' }} // Center the handle on the border
    >
      {/* Visual indicator */}
      <div className={`h-full w-1 ml-0.5 transition-colors ${
        isDragging 
          ? 'bg-teal-500' 
          : 'bg-transparent group-hover:bg-teal-300'
      }`} />
    </div>
  );
};

export default ResizableDataTable;