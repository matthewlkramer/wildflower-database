// src/components/shared/MultiSelectDropdown.jsx
// Replace your entire MultiSelectDropdown.jsx file with this:

import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, X } from 'lucide-react';

const MultiSelectDropdown = ({ 
  options, 
  selectedValues, 
  onChange, 
  placeholder,
  containerWidth // New prop for width control
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (value) => {
    const newSelected = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newSelected);
  };

  const handleClearAll = (e) => {
    e.stopPropagation();
    onChange([]);
  };

  // Enhanced options with "empty" option
  const enhancedOptions = React.useMemo(() => {
    const opts = [...options];
    
    // Add "empty" option at the beginning if not already present
    if (!opts.includes('(empty)')) {
      opts.unshift('(empty)');
    }
    
    return opts;
  }, [options]);

  // Container style for width control
  const containerStyle = containerWidth ? { width: `${containerWidth}px` } : {};

  // Display text for selected values
  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    }
    
    if (selectedValues.length === 1) {
      const value = selectedValues[0];
      return value === '(empty)' ? 'Empty/None' : value;
    }
    
    // Handle multiple selections
    const hasEmpty = selectedValues.includes('(empty)');
    const nonEmptyCount = selectedValues.filter(v => v !== '(empty)').length;
    
    if (hasEmpty && nonEmptyCount > 0) {
      return `${selectedValues.length} selected (incl. empty)`;
    } else if (hasEmpty) {
      return 'Empty/None';
    } else {
      return `${selectedValues.length} selected`;
    }
  };

  return (
    <div className="relative" ref={dropdownRef} style={containerStyle}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 bg-white text-left flex items-center justify-between"
        style={containerStyle}
      >
        <span className="truncate">
          {getDisplayText()}
        </span>
        <div className="flex items-center space-x-1">
          {selectedValues.length > 0 && (
            <button
              onClick={handleClearAll}
              className="p-0.5 hover:bg-gray-200 rounded"
              title="Clear all"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div 
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
          style={containerWidth ? { width: `${containerWidth}px` } : {}}
        >
          {enhancedOptions.map((option) => {
            const isEmptyOption = option === '(empty)';
            const isSelected = selectedValues.includes(option);
            
            return (
              <label
                key={option}
                className={`flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors ${
                  isEmptyOption ? 'border-b border-gray-200 bg-gray-25' : ''
                } ${isSelected ? 'bg-cyan-50' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleToggleOption(option)}
                  className="mr-2 rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                />
                <span className={`text-sm ${
                  isEmptyOption ? 'italic text-gray-500 font-medium' : ''
                }`}>
                  {isEmptyOption ? 'Empty/None' : option}
                </span>
                {isEmptyOption && (
                  <span className="ml-auto text-xs text-gray-400">
                    (no value)
                  </span>
                )}
              </label>
            );
          })}
          
          {enhancedOptions.length === 1 && enhancedOptions[0] === '(empty)' && (
            <div className="px-3 py-2 text-sm text-gray-500 italic">
              Only empty values found
            </div>
          )}
          
          {enhancedOptions.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">
              No options available
            </div>
          )}
          
          {/* Summary at bottom if multiple selections */}
          {selectedValues.length > 1 && (
            <div className="border-t border-gray-200 px-3 py-2 bg-gray-50">
              <div className="text-xs text-gray-600">
                {selectedValues.length} of {enhancedOptions.length} selected
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {selectedValues.includes('(empty)') && (
                  <span className="inline-block bg-gray-200 rounded px-1 mr-1">
                    Empty
                  </span>
                )}
                {selectedValues.filter(v => v !== '(empty)').slice(0, 3).map(val => (
                  <span key={val} className="inline-block bg-cyan-100 rounded px-1 mr-1">
                    {val.length > 8 ? val.substring(0, 8) + '...' : val}
                  </span>
                ))}
                {selectedValues.filter(v => v !== '(empty)').length > 3 && (
                  <span className="text-gray-400">+{selectedValues.filter(v => v !== '(empty)').length - 3} more</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;