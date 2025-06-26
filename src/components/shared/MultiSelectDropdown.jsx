// src/components/shared/MultiSelectDropdown.jsx
import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, X } from 'lucide-react';

const MultiSelectDropdown = ({ options, selectedValues, onChange, placeholder }) => {
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

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-left flex items-center justify-between"
      >
        <span className="truncate">
          {selectedValues.length === 0 
            ? placeholder 
            : selectedValues.length === 1 
              ? selectedValues[0] 
              : `${selectedValues.length} selected`
          }
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
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedValues.includes(option)}
                onChange={() => handleToggleOption(option)}
                className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
          {options.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">No options available</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;