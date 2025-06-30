import React from 'react';

const Pills = ({ values, colorScheme = 'default' }) => {
  if (!values) return '-';
  
  // Ensure values is an array
  const items = Array.isArray(values) ? values : [values];
  
  if (items.length === 0) return '-';
  
  // Define color schemes
  const colorSchemes = {
    default: 'bg-gray-100 text-gray-700 border-gray-300',
    blue: 'bg-blue-50 text-blue-700 border-blue-300',
    green: 'bg-green-50 text-green-700 border-green-300',
    purple: 'bg-purple-50 text-purple-700 border-purple-300',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-300',
    red: 'bg-red-50 text-red-700 border-red-300',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-300',
    pink: 'bg-pink-50 text-pink-700 border-pink-300',
  };
  
  const colors = colorSchemes[colorScheme] || colorSchemes.default;
  
  return (
    <div className="flex flex-wrap gap-1">
      {items.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors}`}
        >
          {item}
        </span>
      ))}
    </div>
  );
};

export default Pills;